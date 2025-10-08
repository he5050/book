import { compress, encodePCM } from './transform';

// 定义录音器配置接口
interface RecorderConfig {
	sampleBits?: number; // 采样位数 (8 或 16)
	sampleRate?: number; // 采样率 (Hz)
	numChannels?: number; // 声道数 (1 或 2)
}

// 定义 onprogress 事件的回调数据结构
interface ProgressPayload {
	duration: number; // 当前录音时长（秒）
	fileSize: number; // 当前录音文件大小（字节）
	vol: number; // 当前音量（0-100）
}

/**
 * Recorder 类是音频录制的核心，提供了开始、暂停、恢复、停止录音等功能。
 * 它处理音频流的获取、处理和编码。
 */
export default class Recorder {
	// --------------- 公共属性 --------------- 
	public onprocess: (duration: number) => void = () => {}; // 兼容旧版的进度回调
	public onprogress: (payload: ProgressPayload) => void = () => {}; // 录音进度回调

	// --------------- 私有/受保护属性 --------------- 
	protected config: Required<RecorderConfig>; // 录音配置
	protected inputSampleRate: number; // 输入采样率
	protected outputSampleRate: number; // 输出采样率
	protected outputSampleBits: number; // 输出采样位数
	protected littleEndian: boolean; // 是否为小端字节序
	protected duration: number = 0; // 录音时长
	protected fileSize: number = 0; // 录音文件大小

	private context: AudioContext | null = null; // 音频上下文
	private analyser: AnalyserNode | null = null; // 音频分析节点
	private stream: MediaStream | null = null; // 音频流
	private audioInput: MediaStreamAudioSourceNode | null = null; // 音频输入节点
	private recorder: ScriptProcessorNode | null = null; // 音频处理节点

	private lBuffer: Float32Array[] = []; // 左声道数据缓冲区
	private rBuffer: Float32Array[] = []; // 右声道数据缓冲区
	private pcm: DataView | null = null; // 缓存最终的PCM数据
	private size: number = 0; // 录音数据总长度
	private isRecording: boolean = true; // 是否正在录音的标志

	/**
	 * @param {RecorderConfig} options - 录音配置项。
	 */
	constructor(options: RecorderConfig = {}) {
		const context = new (window.AudioContext || (window as any).webkitAudioContext)();
		this.inputSampleRate = context.sampleRate; // 获取设备的输入采样率
		context.close();

		// 初始化配置
		this.config = this.setNewOption(options);

		// 判断系统字节序
		this.littleEndian = (() => {
			const buffer = new ArrayBuffer(2);
			new DataView(buffer).setInt16(0, 256, true);
			return new Int16Array(buffer)[0] === 256;
		})();

		Recorder.initUserMedia(); // 兼容旧版浏览器API
	}

	/**
	 * 更新录音配置。
	 * @param {RecorderConfig} options - 新的录音配置。
	 * @returns {Required<RecorderConfig>} - 返回合并后的完整配置。
	 */
	protected setNewOption(options: RecorderConfig = {}): Required<RecorderConfig> {
		this.config = {
			sampleBits: [8, 16].includes(options.sampleBits || 0) ? options.sampleBits! : 16,
			sampleRate: [8000, 11025, 16000, 22050, 24000, 44100, 48000].includes(options.sampleRate || 0)
				? options.sampleRate!
				: this.inputSampleRate,
			numChannels: [1, 2].includes(options.numChannels || 0) ? options.numChannels! : 1,
		};
		this.outputSampleRate = this.config.sampleRate;
		this.outputSampleBits = this.config.sampleBits;
		return this.config;
	}

	/**
	 * 异步开始录音。
	 * @returns {Promise<void>}
	 */
	async startRecord(): Promise<void> {
		if (this.context) {
			await this.destroyRecord();
		}
		this.initRecorder();

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			this.stream = stream;
			this.audioInput = this.context!.createMediaStreamSource(stream);
			// 连接音频节点
			this.audioInput.connect(this.analyser!);
			this.analyser!.connect(this.recorder!);
			this.recorder!.connect(this.context!.destination);
		} catch (error) {
			throw new Error(`获取麦克风权限失败: ${(error as Error).message}`);
		}
	}

	/** 暂停录音 */
	pauseRecord(): void {
		if (this.isRecording) {
			this.isRecording = false;
		}
	}

	/** 恢复录音 */
	resumeRecord(): void {
		if (!this.isRecording) {
			this.isRecording = true;
		}
	}

	/** 停止录音 */
	stopRecord(): void {
		this.audioInput?.disconnect();
		this.recorder?.disconnect();
		this.analyser?.disconnect();
		this.isRecording = true; // 重置为可录音状态
	}

	/**
	 * 销毁录音实例，释放资源。
	 * @returns {Promise<void>}
	 */
	async destroyRecord(): Promise<void> {
		this.clearRecordStatus();
		this.stopStream();
		if (this.context && this.context.state !== 'closed') {
			await this.context.close();
			this.context = null;
		}
	}

	/**
	 * 获取时域数据（波形数据）。
	 * @returns {Uint8Array}
	 */
	getTimeDomainData(): Uint8Array {
		if (!this.analyser) {
			return new Uint8Array(0);
		}
		const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteTimeDomainData(dataArray);
		return dataArray;
	}

	/**
	 * 获取频域数据。
	 * @returns {Uint8Array}
	 */
	getFrequencyData(): Uint8Array {
		if (!this.analyser) {
			return new Uint8Array(0);
		}
		const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(dataArray);
		return dataArray;
	}

	/**
	 * 获取完整的录音数据。
	 * @returns {{ left: Float32Array; right: Float32Array }}
	 */
	getData(): { left: Float32Array; right: Float32Array } {
		return this.flat();
	}

	/** 清理录音状态 */
	private clearRecordStatus(): void {
		this.lBuffer = [];
		this.rBuffer = [];
		this.size = 0;
		this.fileSize = 0;
		this.pcm = null;
		this.audioInput = null;
		this.duration = 0;
	}

	/**
	 * 将存储的声道数据合并为一维数组。
	 * @private
	 * @returns {{ left: Float32Array; right: Float32Array }}
	 */
	private flat(): { left: Float32Array; right: Float32Array } {
		const numChannels = this.config.numChannels;
		const lData = new Float32Array(numChannels === 1 ? this.size : this.size / 2);
		const rData = numChannels === 2 ? new Float32Array(this.size / 2) : new Float32Array(0);

		let offset = 0;
		for (const buffer of this.lBuffer) {
			lData.set(buffer, offset);
			offset += buffer.length;
		}

		if (numChannels === 2) {
			offset = 0;
			for (const buffer of this.rBuffer) {
				rData.set(buffer, offset);
				offset += buffer.length;
			}
		}

		return { left: lData, right: rData };
	}

	/**
	 * 初始化录音器核心组件。
	 * @private
	 */
	private initRecorder(): void {
		this.clearRecordStatus();

		this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 2048;

		// createScriptProcessor 已被废弃，推荐使用 AudioWorklet
		// 但为保持兼容性，此处仍使用此方法
		const bufferSize = 4096;
		const scriptProcessor = this.context.createScriptProcessor || (this.context as any).createJavaScriptNode;
		this.recorder = scriptProcessor.call(
			this.context,
			bufferSize,
			this.config.numChannels,
			this.config.numChannels
		);

		this.recorder.onaudioprocess = (e: AudioProcessingEvent) => {
			if (!this.isRecording) return;

			const lData = e.inputBuffer.getChannelData(0);
			this.lBuffer.push(new Float32Array(lData));
			this.size += lData.length;

			if (this.config.numChannels === 2) {
				const rData = e.inputBuffer.getChannelData(1);
				this.rBuffer.push(new Float32Array(rData));
				this.size += rData.length;
			}

			this.fileSize = Math.floor(this.size / (this.inputSampleRate / this.outputSampleRate)) * (this.outputSampleBits / 8);
			this.duration += bufferSize / this.inputSampleRate;

			const vol = Math.max(...lData) * 100;

			this.onprocess(this.duration); // 兼容旧版
			this.onprogress({ duration: this.duration, fileSize: this.fileSize, vol });
		};
	}

	/**
	 * 停止媒体流。
	 * @private
	 */
	private stopStream(): void {
		if (this.stream?.getTracks) {
			this.stream.getTracks().forEach((track) => track.stop());
			this.stream = null;
		}
	}

	/**
	 * 兼容旧版浏览器的 getUserMedia API。
	 * @static
	 * @private
	 */
	static initUserMedia(): void {
		if (!navigator.mediaDevices) {
			(navigator as any).mediaDevices = {};
		}
		if (!navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia = (constraints) => {
				const getUserMedia = (navigator as any).getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia;
				if (!getUserMedia) {
					return Promise.reject(new Error('浏览器不支持 getUserMedia'));
				}
				return new Promise((resolve, reject) => {
					getUserMedia.call(navigator, constraints, resolve, reject);
				});
			};
		}
	}

	/**
	 * 请求麦克风权限。
	 * @static
	 * @returns {Promise<void>}
	 */
	static async getPermission(): Promise<void> {
		this.initUserMedia();
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream.getTracks().forEach((track) => track.stop());
		} catch (error) {
			throw new Error(`获取麦克风权限失败: ${(error as Error).message}`);
		}
	}
}