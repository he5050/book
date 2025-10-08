import { downloadPCM, downloadWAV, download } from './download';
import { compress, encodePCM, encodeWAV } from './transform';
import Player from './player';
import Recorder from './recorder';

/**
 * 录音器配置接口
 */
interface RecorderConfig {
	sampleBits?: number; // 采样位数 (8 或 16)
	sampleRate?: number; // 采样率 (Hz)
	numChannels?: number; // 声道数 (1 或 2)
}

/**
 * 音频分析数据接口
 */
interface AnalysisData {
	frequencyData: Uint8Array; // 频域数据
	timeDomainData: Uint8Array; // 时域数据
}

/**
 * 声道数据接口
 */
interface ChannelData {
	left: DataView | null;
	right: DataView | null;
}

/**
 * AudioProcessor 类提供了音频录制、播放和处理的功能。
 * @extends Recorder
 */
class AudioProcessor extends Recorder {
	private player: Player;
	private isRecording: boolean = false;
	private isPaused: boolean = false;
	private isPlaying: boolean = false;
	private wasPaused: boolean = false;

	public onPlay: (() => void) | undefined;
	public onPausePlay: (() => void) | undefined;
	public onResumePlay: (() => void) | undefined;
	public onStopPlay: (() => void) | undefined;
	public onPlayEnd: (() => void) | undefined;

	/**
	 * 构造函数
	 * @param options 录音器配置选项
	 */
	constructor(options: RecorderConfig = {}) {
		super(options);
		this.player = new Player();
	}

	/**
	 * 重新设置录音配置
	 * @param options 录音器配置选项
	 */
	public setOption(options: RecorderConfig = {}): void {
		this.setNewOption(options);
	}

	/**
	 * 开始录音
	 * @returns Promise<void> 录音开始的Promise
	 */
	public start(): Promise<void> {
		if (this.isRecording) {
			return Promise.reject(new Error('录音已在进行中'));
		}
		this.isRecording = true;
		this.isPaused = false;
		return this.startRecord();
	}

	/**
	 * 暂停录音
	 */
	public pause(): void {
		if (this.isRecording && !this.isPaused) {
			this.isPaused = true;
			this.pauseRecord();
		}
	}

	/**
	 * 继续录音
	 */
	public resume(): void {
		if (this.isRecording && this.isPaused) {
			this.isPaused = false;
			this.resumeRecord();
		}
	}

	/**
	 * 停止录音。
	 * 注意：此操作会重置录音状态。
	 */
	public stop(): void {
		if (this.isRecording) {
			this.isRecording = false;
			this.isPaused = false;
			this.stopRecord();
		}
	}

	/**
	 * 播放录音。
	 * 注意：调用此方法会先停止正在进行的录音。
	 */
	public play(): void {
		this.stop();
		if (this.isPlaying) {
			this.player.stopPlay();
		}

		this.isPlaying = true;
		this.wasPaused = false;

		this.onPlay?.();
		if (this.onPlayEnd) {
			this.player.addPlayEnd(this.onPlayEnd);
		}

		const wavData = this.getWAV();

		if (wavData.byteLength > 44) {
			this.player.play(wavData.buffer);
		}
	}

	/**
	 * 获取已播放的时长（秒）
	 * @returns 已播放的秒数
	 */
	public getPlayTime(): number {
		return this.player.getPlayTime();
	}

	/**
	 * 暂停播放
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
	 * 恢复播放
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
	 * 停止播放
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
	 * 销毁实例，释放资源
	 * @returns Promise<void> 销毁完成的Promise
	 */
	public destroy(): Promise<void> {
		this.player.destroyPlay();
		return this.destroyRecord();
	}

	/**
	 * 获取录音时的音频分析数据
	 * @returns 包含频域和时域数据的对象
	 */
	public getRecordingAnalysisData(): AnalysisData {
		return {
			frequencyData: this.getFrequencyData(),
			timeDomainData: this.getTimeDomainData(),
		};
	}

	/**
	 * 获取播放时的音频分析数据
	 * @returns 包含频域和时域数据的对象
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
	 * @returns PCM格式的DataView数据
	 */
	public getPCM(): DataView {
		this.stop();
		const data = this.getData();
		const compressedData = compress(data, this.inputSampleRate, this.outputSampleRate);
		return encodePCM(compressedData, this.outputSampleBits, this.littleEndian);
	}

	/**
	 * 获取PCM格式的Blob数据
	 * @returns PCM格式的Blob数据
	 */
	public getPCMBlob(): Blob {
		return new Blob([this.getPCM()]);
	}

	/**
	 * 下载PCM格式的录音文件
	 * @param name 文件名，默认为'recorder'
	 */
	public downloadPCM(name: string = 'recorder'): void {
		const pcmBlob = this.getPCMBlob();
		downloadPCM(pcmBlob, name);
	}

	/**
	 * 获取WAV编码的音频数据
	 * @returns WAV编码的DataView数据
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
	 * 获取WAV音频的Blob数据
	 * @returns WAV格式的Blob数据
	 */
	public getWAVBlob(): Blob {
		return new Blob([this.getWAV()], { type: 'audio/wav' });
	}

	/**
	 * 下载WAV格式的录音文件
	 * @param name 文件名，默认为'recorder'
	 */
	public downloadWAV(name: string = 'recorder'): void {
		const wavBlob = this.getWAVBlob();
		downloadWAV(wavBlob, name);
	}

	/**
	 * 通用下载接口
	 * @param blob 要下载的Blob数据
	 * @param name 文件名
	 * @param type 文件类型
	 */
	public downloadBlob(blob: Blob, name: string, type: string): void {
		download(blob, name, type);
	}

	/**
	 * 获取左右声道的数据。
	 * 如果是单声道，左右声道数据相同。
	 * @returns 包含左右声道数据的对象
	 */
	public getChannelData(): ChannelData {
		const pcmDataView = this.getPCM();
		const length = pcmDataView.byteLength;
		const littleEndian = this.littleEndian;
		const result: ChannelData = { left: null, right: null };

		if (this.config.numChannels === 2) {
			const leftChannelData = new DataView(new ArrayBuffer(length / 2));
			const rightChannelData = new DataView(new ArrayBuffer(length / 2));

			if (this.config.sampleBits === 16) {
				for (let i = 0; i < length / 4; i++) {
					const leftIndex = i * 2;
					leftChannelData.setInt16(leftIndex, pcmDataView.getInt16(i * 4, littleEndian), littleEndian);
					rightChannelData.setInt16(leftIndex, pcmDataView.getInt16(i * 4 + 2, littleEndian), littleEndian);
				}
			} else {
				for (let i = 0; i < length / 2; i++) {
					leftChannelData.setInt8(i, pcmDataView.getInt8(i * 2));
					rightChannelData.setInt8(i, pcmDataView.getInt8(i * 2 + 1));
				}
			}

			result.left = leftChannelData;
			result.right = rightChannelData;
		} else {
			result.left = pcmDataView;
			result.right = pcmDataView; // 单声道时，左右声道数据相同
		}

		return result;
	}
}

export default AudioProcessor;