// 定义录音器配置接口
interface RecorderConfig {
	/**
	 * @description 采样位数 (8 或 16)
	 * @default 16
	 */
	sampleBits?: number;
	/**
	 * @description 采样率 (Hz)
	 * @default 浏览器默认采样率
	 */
	sampleRate?: number;
	/**
	 * @description 声道数 (1 或 2)
	 * @default 1
	 */
	numChannels?: number;
}

// 定义 onProgress 事件的回调数据结构
interface ProgressPayload {
	/**
	 * @description 当前录音时长（秒）
	 */
	duration: number;
	/**
	 * @description 当前录音文件大小（字节）
	 */
	fileSize: number;
	/**
	 * @description 当前音量（0-100）
	 */
	vol: number;
}

/**
 * Recorder 类是音频录制的核心，提供了开始、暂停、恢复、停止录音等功能。
 * 它处理音频流的获取、处理和编码。
 */
export default class Recorder {
	// --------------- 公共属性 ---------------
	/**
	 * @description 录音过程回调，兼容旧版
	 * @deprecated 建议使用 onProgress 代替
	 */
	public onProcess: (duration: number) => void = () => {};
	/**
	 * @description 录音进度回调
	 */
	public onProgress: (payload: ProgressPayload) => void = () => {};

	// --------------- 受保护的属性 ---------------
	/**
	 * @description 录音器配置
	 */
	protected config: Required<RecorderConfig>;
	/**
	 * @description 输入采样率
	 */
	protected inputSampleRate: number;
	/**
	 * @description 输出采样率
	 */
	protected outputSampleRate!: number;
	/**
	 * @description 输出采样位数
	 */
	protected outputSampleBits!: number;
	/**
	 * @description 是否为小端字节序
	 */
	protected littleEndian: boolean;
	/**
	 * @description 录音时长
	 */
	protected duration: number = 0;
	/**
	 * @description 文件大小
	 */
	protected fileSize: number = 0;

	// --------------- 私有的属性 ---------------
	/**
	 * @description 音频上下文
	 */
	private context: AudioContext | null = null;
	/**
	 * @description 音频分析器
	 */
	private analyser: AnalyserNode | null = null;
	/**
	 * @description 媒体流
	 */
	private stream: MediaStream | null = null;
	/**
	 * @description 音频输入
	 */
	private audioInput: MediaStreamAudioSourceNode | null = null;
	/**
	 * @description 音频处理器
	 */
	private recorder: ScriptProcessorNode | null = null;
	/**
	 * @description 左声道数据缓冲区
	 */
	private leftBuffer: Float32Array[] = [];
	/**
	 * @description 右声道数据缓冲区
	 */
	private rightBuffer: Float32Array[] = [];
	/**
	 * @description 缓冲区大小
	 */
	private bufferSize: number = 0;
	/**
	 * @description 是否正在录音
	 */
	protected isRecording: boolean = false;

	/**
	 * @param {RecorderConfig} options - 录音配置项。
	 */
	constructor(options: RecorderConfig = {}) {
		// 兼容不同浏览器的 AudioContext
		const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
		if (!AudioContext) {
			throw new Error('浏览器不支持 AudioContext');
		}
		// 创建一个临时的 AudioContext 以获取输入采样率
		const context = new AudioContext();
		this.inputSampleRate = context.sampleRate;
		context.close();

		// 设置录音配置
		this.config = this.setNewOption(options);

		// 判断系统字节序
		this.littleEndian = (() => {
			const buffer = new ArrayBuffer(2);
			new DataView(buffer).setInt16(0, 256, true);
			return new Int16Array(buffer)[0] === 256;
		})();

		// 初始化用户媒体API
		Recorder.initUserMedia();
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
			numChannels: [1, 2].includes(options.numChannels || 0) ? options.numChannels! : 1
		};
		// 设置输出采样率和采样位数
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
			// 如果已存在录音实例，先销毁
			await this.destroyRecord();
		}
		// 初始化录音器
		this.initRecorder();

		try {
			// 获取用户媒体设备
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			this.stream = stream;
			// 创建音频输入源
			this.audioInput = this.context!.createMediaStreamSource(stream);
			// 连接音频节点
			this.audioInput.connect(this.analyser!);
			this.analyser!.connect(this.recorder!);
			this.recorder!.connect(this.context!.destination);
			// 设置为正在录音状态
			this.isRecording = true;
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
		// 断开音频节点连接
		this.audioInput?.disconnect();
		this.recorder?.disconnect();
		this.analyser?.disconnect();
		// 设置为非录音状态
		this.isRecording = false;
	}

	/**
	 * 销毁录音实例，释放资源。
	 * @returns {Promise<void>}
	 */
	async destroyRecord(): Promise<void> {
		// 清理录音状态
		this.clearRecordStatus();
		// 停止媒体流
		this.stopStream();
		// 关闭并清空 AudioContext
		if (this.context && this.context.state !== 'closed') {
			await this.context.close();
			this.context = null;
		}
	}

	/**
	 * 获取时域数据（波形数据）。
	 * @returns {Uint8Array} - 时域数据数组。
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
	 * @returns {Uint8Array} - 频域数据数组。
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
	 * @returns {{ left: Float32Array; right: Float32Array }} - 左右声道的数据。
	 */
	getData(): { left: Float32Array; right: Float32Array } {
		return this.mergeBuffers();
	}

	/**
	 * 清理录音状态，重置相关属性。
	 * @private
	 */
	private clearRecordStatus(): void {
		this.leftBuffer = [];
		this.rightBuffer = [];
		this.bufferSize = 0;
		this.fileSize = 0;
		this.audioInput = null;
		this.duration = 0;
	}

	/**
	 * 将存储的声道数据合并为一维数组。
	 * @private
	 * @returns {{ left: Float32Array; right: Float32Array }} - 合并后的左右声道数据。
	 */
	private mergeBuffers(): { left: Float32Array; right: Float32Array } {
		const { numChannels } = this.config;
		const leftData = new Float32Array(numChannels === 1 ? this.bufferSize : this.bufferSize / 2);
		const rightData =
			numChannels === 2 ? new Float32Array(this.bufferSize / 2) : new Float32Array(0);

		let offset = 0;
		for (const buffer of this.leftBuffer) {
			leftData.set(buffer, offset);
			offset += buffer.length;
		}

		if (numChannels === 2) {
			offset = 0;
			for (const buffer of this.rightBuffer) {
				rightData.set(buffer, offset);
				offset += buffer.length;
			}
		}

		return { left: leftData, right: rightData };
	}

	/**
	 * 初始化录音器核心组件。
	 * @private
	 */
	private initRecorder(): void {
		this.clearRecordStatus();

		// 兼容不同浏览器的 AudioContext
		const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
		this.context = new AudioContext();
		// 创建音频分析器
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 2048;

		// 设置缓冲区大小
		const bufferSize = 4096;
		// 兼容 createScriptProcessor
		const scriptProcessor =
			this.context.createScriptProcessor || (this.context as any).createJavaScriptNode;
		this.recorder = scriptProcessor.call(
			this.context,
			bufferSize,
			this.config.numChannels,
			this.config.numChannels
		);

		// 音频处理事件
		this.recorder.onaudioprocess = (e: AudioProcessingEvent) => {
			if (!this.isRecording) return;

			// 获取左声道数据
			const leftData = e.inputBuffer.getChannelData(0);
			this.leftBuffer.push(new Float32Array(leftData));
			this.bufferSize += leftData.length;

			// 如果是双声道，获取右声道数据
			if (this.config.numChannels === 2) {
				const rightData = e.inputBuffer.getChannelData(1);
				this.rightBuffer.push(new Float32Array(rightData));
				this.bufferSize += rightData.length;
			}

			// 计算文件大小和时长
			this.fileSize =
				Math.floor(this.bufferSize / (this.inputSampleRate / this.outputSampleRate)) *
				(this.outputSampleBits / 8);
			this.duration += bufferSize / this.inputSampleRate;

			// 计算当前音量
			const vol = Math.max(...leftData) * 100;

			// 触发进度回调
			this.onProcess(this.duration);
			this.onProgress({ duration: this.duration, fileSize: this.fileSize, vol });
		};
	}

	/**
	 * 停止媒体流。
	 * @private
	 */
	private stopStream(): void {
		if (this.stream?.getTracks) {
			this.stream.getTracks().forEach(track => track.stop());
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
			(navigator.mediaDevices as any).getUserMedia = (constraints: MediaStreamConstraints) => {
				const getUserMedia =
					(navigator as any).getUserMedia ||
					(navigator as any).webkitGetUserMedia ||
					(navigator as any).mozGetUserMedia;
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
			// 获取权限后立即停止流，避免资源占用
			stream.getTracks().forEach(track => track.stop());
		} catch (error) {
			throw new Error(`获取麦克风权限失败: ${(error as Error).message}`);
		}
	}
}
