import { downloadPCM, downloadWAV, download } from './download';
import { compress, encodePCM, encodeWAV } from './transform';
import Player from './player';
import Recorder from './recorder';

/**
 * 录音器配置接口
 */
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

/**
 * 音频分析数据接口
 */
interface AnalysisData {
	/**
	 * @description 频域数据
	 */
	frequencyData: Uint8Array;
	/**
	 * @description 时域数据
	 */
	timeDomainData: Uint8Array;
}

/**
 * 声道数据接口
 */
interface ChannelData {
	/**
	 * @description 左声道数据
	 */
	left: DataView;
	/**
	 * @description 右声道数据
	 */
	right: DataView;
}

/**
 * AudioProcessor 类在 Recorder 的基础上，集成了 Player 功能，
 * 提供了完整的音频录制、处理、播放和下载的功能。
 * @extends Recorder
 */
class AudioProcessor extends Recorder {
	/**
	 * @description 播放器实例
	 * @private
	 */
	private player: Player;
	/**
	 * @description 是否正在播放
	 * @private
	 */
	private isPlaying: boolean = false;
	/**
	 * @description 播放是否曾被暂停
	 * @private
	 */
	private wasPaused: boolean = false;

	// --- 播放相关的事件回调 ---
	/**
	 * @description 开始播放时触发
	 */
	public onPlay?: () => void;
	/**
	 * @description 暂停播放时触发
	 */
	public onPausePlay?: () => void;
	/**
	 * @description 恢复播放时触发
	 */
	public onResumePlay?: () => void;
	/**
	 * @description 停止播放时触发
	 */
	public onStopPlay?: () => void;
	/**
	 * @description 播放结束时触发
	 */
	public onPlayEnd?: () => void;

	/**
	 * 构造函数
	 * @param {RecorderConfig} options - 录音器配置选项
	 */
	constructor(options: RecorderConfig = {}) {
		super(options);
		this.player = new Player();

		// 将播放结束的回调绑定到播放器
		this.player.addPlayEnd(() => {
			this.isPlaying = false;
			this.wasPaused = false;
			this.onPlayEnd?.();
		});
	}

	/**
	 * 重新设置录音配置。
	 * 此方法会覆盖现有的录音配置。
	 * @param {RecorderConfig} options - 新的录音器配置选项
	 */
	public setOption(options: RecorderConfig = {}): void {
		this.setNewOption(options);
	}

	/**
	 * 开始录音。如果已在录音，则会返回一个 rejected Promise。
	 * @returns {Promise<void>} - 录音开始的Promise
	 */
	public start(): Promise<void> {
		if (this.isRecording) {
			return Promise.reject(new Error('录音已在进行中'));
		}
		// isRecording 状态由父类 Recorder 管理
		return this.startRecord();
	}

	/**
	 * 暂停录音。
	 */
	public pause(): void {
		// isRecording 状态检查在父类中进行
		this.pauseRecord();
	}

	/**
	 * 继续录音。
	 */
	public resume(): void {
		this.resumeRecord();
	}

	/**
	 * 停止录音。
	 * 注意：此操作会重置录音状态。
	 */
	public stop(): void {
		this.stopRecord();
	}

	/**
	 * 播放录音。
	 * 如果正在录音，会先停止录音。
	 * 如果正在播放，会先停止当前播放。
	 */
	public play(): void {
		// getWAV -> getPCM -> stop -> stopRecord 会处理录音停止的逻辑
		const wavData = this.getWAV();

		if (wavData.byteLength <= 44) {
			console.warn('没有有效的录音数据可供播放。');
			return;
		}

		// 停止当前可能正在播放的音频
		if (this.isPlaying || this.wasPaused) {
			this.player.stopPlay();
		}

		this.isPlaying = true;
		this.wasPaused = false;

		this.onPlay?.();
		// 注意：onPlayEnd 回调已在构造函数中统一处理
		this.player.play(wavData.buffer);
	}

	/**
	 * 获取已播放的时长（秒）
	 * @returns {number} - 已播放的秒数
	 */
	public getPlayTime(): number {
		return this.player.getPlayTime();
	}

	/**
	 * 暂停播放。
	 */
	public pausePlay(): void {
		if (this.isPlaying) {
			this.isPlaying = false;
			this.wasPaused = true;
			this.onPausePlay?.();
			this.player.pausePlay();
		}
	}

	/**
	 * 恢复播放。
	 */
	public resumePlay(): void {
		if (this.wasPaused && !this.isPlaying) {
			this.isPlaying = true;
			this.wasPaused = false;
			this.onResumePlay?.();
			this.player.resumePlay();
		}
	}

	/**
	 * 停止播放。
	 */
	public stopPlay(): void {
		if (this.isPlaying || this.wasPaused) {
			this.isPlaying = false;
			this.wasPaused = false;
			this.onStopPlay?.();
			this.player.stopPlay();
		}
	}

	/**
	 * 销毁实例，释放所有资源。
	 * @returns {Promise<void>} - 销毁完成的Promise
	 */
	public destroy(): Promise<void> {
		this.player.destroyPlay();
		return this.destroyRecord();
	}

	/**
	 * 获取录音时的音频分析数据。
	 * @returns {AnalysisData} - 包含频域和时域数据的对象。
	 */
	public getRecordingAnalysisData(): AnalysisData {
		return {
			frequencyData: this.getFrequencyData(),
			timeDomainData: this.getTimeDomainData(),
		};
	}

	/**
	 * 获取播放时的音频分析数据。
	 * @returns {AnalysisData} - 包含频域和时域数据的对象。
	 */
	public getPlaybackAnalysisData(): AnalysisData {
		return {
			frequencyData: this.player.getFrequencyData(),
			timeDomainData: this.player.getTimeDomainData(),
		};
	}

	/**
	 * 获取PCM格式的音频数据。
	 * 注意：此操作会先停止当前录音。
	 * @returns {DataView} - PCM格式的DataView数据。
	 */
	public getPCM(): DataView {
		this.stop();
		const data = this.getData();
		const compressedData = compress(data, this.inputSampleRate, this.outputSampleRate);
		return encodePCM(compressedData, this.outputSampleBits, this.littleEndian);
	}

	/**
	 * 获取PCM格式的Blob数据。
	 * @returns {Blob} - PCM格式的Blob数据。
	 */
	public getPCMBlob(): Blob {
		return new Blob([this.getPCM()]);
	}

	/**
	 * 下载PCM格式的录音文件。
	 * @param {string} name - 文件名，默认为'recorder'。
	 */
	public downloadPCM(name: string = 'recorder'): void {
		const pcmBlob = this.getPCMBlob();
		downloadPCM(pcmBlob, name);
	}

	/**
	 * 获取WAV编码的音频数据。
	 * @returns {DataView} - WAV编码的DataView数据。
	 */
	public getWAV(): DataView {
		const pcmData = this.getPCM();
		return encodeWAV(
			pcmData,
			this.inputSampleRate,
			this.outputSampleRate,
			this.config.numChannels,
			this.outputSampleBits,
			this.littleEndian
		);
	}

	/**
	 * 获取WAV音频的Blob数据。
	 * @returns {Blob} - WAV格式的Blob数据。
	 */
	public getWAVBlob(): Blob {
		return new Blob([this.getWAV()], { type: 'audio/wav' });
	}

	/**
	 * 下载WAV格式的录音文件。
	 * @param {string} name - 文件名，默认为'recorder'。
	 */
	public downloadWAV(name: string = 'recorder'): void {
		const wavBlob = this.getWAVBlob();
		downloadWAV(wavBlob, name);
	}

	/**
	 * 通用下载接口。
	 * @param {Blob} blob - 要下载的Blob数据。
	 * @param {string} name - 文件名。
	 * @param {string} type - 文件类型。
	 */
	public downloadBlob(blob: Blob, name: string, type: string): void {
		download(blob, name, type);
	}

	/**
	 * 获取左右声道的数据。
	 * 如果是单声道，左右声道数据相同。
	 * @returns {ChannelData} - 包含左右声道数据的对象。
	 */
	public getChannelData(): ChannelData {
		const pcmDataView = this.getPCM();
		const length = pcmDataView.byteLength;
		const littleEndian = this.littleEndian;
		const { numChannels, sampleBits } = this.config;
		const result: ChannelData = { left: pcmDataView, right: pcmDataView };

		if (numChannels === 2) {
			const leftChannelData = new DataView(new ArrayBuffer(length / 2));
			const rightChannelData = new DataView(new ArrayBuffer(length / 2));
			const bytesPerSample = sampleBits / 8;

			for (let i = 0; i < length / (bytesPerSample * 2); i++) {
				const leftIndex = i * bytesPerSample;
				const pcmIndex = i * bytesPerSample * 2;

				if (bytesPerSample === 2) {
					// 16-bit
					leftChannelData.setInt16(leftIndex, pcmDataView.getInt16(pcmIndex, littleEndian), littleEndian);
					rightChannelData.setInt16(leftIndex, pcmDataView.getInt16(pcmIndex + 2, littleEndian), littleEndian);
				} else {
					// 8-bit
					leftChannelData.setInt8(leftIndex, pcmDataView.getInt8(pcmIndex));
					rightChannelData.setInt8(leftIndex, pcmDataView.getInt8(pcmIndex + 1));
				}
			}

			result.left = leftChannelData;
			result.right = rightChannelData;
		}

		return result;
	}
}

export default AudioProcessor;