import { downloadPCM, downloadWAV, download } from './download';
import { compress, encodePCM, encodeWAV } from './transform';
import Player from './player';
import Recorder from './recorder';

declare let window: any;
declare let Math: any;
declare let navigator: any;
declare let Promise: any;

/**
 * 录音器配置接口
 */
interface RecorderConfig {
	sampleBits?: number; // 采样位数 (8 或 16)
	sampleRate?: number; // 采样率 (Hz)
	numChannels?: number; // 声道数 (1 或 2)
	compiling?: boolean; // 是否边录边播 (实验性功能)
}

/**
 * 音频分析数据接口
 */
interface AnalyseData {
	frequencyData: Uint8Array;
	timeDomainData: Uint8Array;
}

/**
 * 声道数据接口
 */
interface ChannelData {
	left: DataView | null;
	right: DataView | null;
}

class Index extends Recorder {
	private isRecording: boolean = false; // 是否正在录音
	private isPause: boolean = false; // 是否是暂停
	private isPlaying: boolean = false; // 是否正在播放

	public onPlay: (() => void) | undefined; // 音频播放回调
	public onPausePlay: (() => void) | undefined; // 音频暂停回调
	public onResumePlay: (() => void) | undefined; // 音频恢复播放回调
	public onStopPlay: (() => void) | undefined; // 音频停止播放回调
	public onPlayEnd: (() => void) | undefined; // 音频正常播放结束
	
	/**
	 * 构造函数
	 * @param options 录音器配置选项
	 * @param options.sampleBits 采样位数，一般8,16，默认16
	 * @param options.sampleRate 采样率，一般 11025、16000、22050、24000、44100、48000，默认为浏览器自带的采样率
	 * @param options.numChannels 声道数，1或2，默认1
	 * @param options.compiling 是否边录边播 (实验性功能)，默认false
	 */
	constructor(options: RecorderConfig = {}) {
		super(options);
	}

	/**
	 * 重新修改配置
	 * @param options 录音器配置选项
	 */
	public setOption(options: RecorderConfig = {}): void {
		this.setNewOption(options);
	}

	/**
	 * 开始录音
	 * @returns Promise 录音开始的Promise
	 */
	start(): Promise<void> {
		if (this.isRecording) {
			// 正在录音，则不允许
			return Promise.reject(new Error('录音已在进行中'));
		}

		this.isRecording = true;

		return this.startRecord();
	}

	/**
	 * 暂停录音
	 */
	pause(): void {
		if (this.isRecording && !this.isPause) {
			this.isPause = true;
			// 当前不暂停的时候才可以暂停
			this.pauseRecord();
		}
	}

	/**
	 * 继续录音
	 */
	resume(): void {
		if (this.isRecording && this.isPause) {
			this.isPause = false;
			this.resumeRecord();
		}
	}

	/**
	 * 停止录音
	 */
	stop(): void {
		if (this.isRecording) {
			this.isRecording = false;
			this.isPause = false;
			this.stopRecord();
		}
	}

	/**
	 * 播放录音
	 */
	play(): void {
		this.stop();
		// 关闭前一次音频播放
		this.isPlaying = true;

		this.onPlay && this.onPlay();
		this.onPlayEnd && Player.addPlayEnd(this.onPlayEnd); // 注册播放完成后的回调事件

		const dataV = this.getWAV();

		if (dataV.byteLength > 44) {
			Player.play(dataV.buffer); // 播放
		}
	}

	/**
	 * 获取已经播放了多长时间
	 * @returns 已播放的秒数
	 */
	getPlayTime(): number {
		return Player.getPlayTime();
	}

	/**
	 * 暂停播放录音
	 */
	pausePlay(): void {
		if (this.isRecording || !this.isPlaying) {
			// 正在录音或没有播放，暂停无效
			return;
		}

		this.isPlaying = false;
		this.onPausePlay && this.onPausePlay();
		Player.pausePlay();
	}

	/**
	 * 恢复播放录音
	 */
	resumePlay(): void {
		if (this.isRecording || this.isPlaying) {
			// 正在录音或已经播放或没开始播放，恢复无效
			return;
		}

		this.isPlaying = true;
		this.onResumePlay && this.onResumePlay();
		Player.resumePlay();
	}

	/**
	 * 停止播放
	 */
	stopPlay(): void {
		if (this.isRecording) {
			// 正在录音，停止录音播放无效
			return;
		}

		this.isPlaying = false;
		this.onStopPlay && this.onStopPlay();
		Player.stopPlay();
	}

	/**
	 * 销毁录音器实例，释放资源
	 * @returns Promise 销毁完成的Promise
	 */
	destroy(): Promise<void> {
		Player.destroyPlay();

		return this.destroyRecord();
	}

	/**
	 * 获取当前已经录音的PCM音频数据
	 *
	 * @returns[DataView]
	 * @memberof Recorder
	 */
	// getWholeData() {
	//     return this.tempPCM;
	// }

	/**
	 * 获取余下的新数据，不包括 getNextData 前一次获取的数据
	 *
	 * @returns [DataView]
	 * @memberof Recorder
	 */
	// getNextData() {
	//     let length = this.tempPCM.length,
	//         data = this.tempPCM.slice(this.offset);

	//     this.offset = length;

	//     return data;
	// }

	/**
	 * 获取当前录音的波形数据
	 * 调取频率由外部控制
	 * @returns 分析数据对象，包含频域和时域数据
	 */
	getRecordAnalyseData(): AnalyseData {
		const data = this.getAnalyseData();
		return {
			frequencyData: data,
			timeDomainData: data
		};
	}

	/**
	 * 获取录音播放时的波形数据
	 * @returns 分析数据对象，包含频域和时域数据
	 */
	getPlayAnalyseData(): AnalyseData {
		// 现在录音和播放不允许同时进行，所以复用录音的analyser节点
		const data = Player.getAnalyseData();
		return {
			frequencyData: data,
			timeDomainData: data
		};
	}

	/**
	 * 获取PCM格式的音频数据
	 * @returns PCM格式的DataView数据
	 */
	getPCM(): DataView {
		// 先停止
		this.stop();
		// 获取pcm数据
		let data: any = this.getData();
		// 根据输入输出比例 压缩或扩展
		const compressedData = compress(data, this.inputSampleRate, this.outputSampleRate);
		// 按采样位数重新编码
		return encodePCM(compressedData, this.outputSampleBits, this.littleEdian);
	}

	/**
	 * 获取PCM格式的blob数据
	 * @returns PCM格式的Blob数据
	 */
	getPCMBlob(): Blob {
		return new Blob([this.getPCM()]);
	}

	/**
	 * 下载录音PCM数据
	 * @param name 文件名，默认为'recorder'
	 */
	downloadPCM(name: string = 'recorder'): void {
		const pcmBlob = this.getPCMBlob();
		downloadPCM(pcmBlob, name);
	}

	/**
	 * 获取WAV编码的二进制数据
	 * @returns WAV编码的DataView数据
	 */
	getWAV(): DataView {
		const pcmTemp = this.getPCM();

		// PCM增加44字节的头就是WAV格式了
		return encodeWAV(
			pcmTemp,
			this.inputSampleRate,
			this.outputSampleRate,
			this.config.numChannels || 1,
			this.outputSampleBits,
			this.littleEdian
		);
	}

	/**
	 * 获取WAV音频的Blob数据
	 * @returns WAV格式的Blob数据
	 */
	getWAVBlob(): Blob {
		return new Blob([this.getWAV()], { type: 'audio/wav' });
	}

	/**
	 * 下载录音的WAV数据
	 * @param name 文件名，默认为'recorder'
	 */
	downloadWAV(name: string = 'recorder'): void {
		const wavBlob = this.getWAVBlob();
		downloadWAV(wavBlob, name);
	}

	/**
	 * 通用的下载接口
	 * @param blob 要下载的Blob数据
	 * @param name 文件名
	 * @param type 文件类型
	 */
	download(blob: Blob, name: string, type: string): void {
		download(blob, name, type);
	}

	/**
	 * 获取左右声道的数据
	 * @returns 包含左右声道数据的对象
	 */
	getChannelData(): ChannelData {
		const all = this.getPCM();
		const length = all.byteLength;
		const littleEdian = this.littleEdian;
		const res: ChannelData = { left: null, right: null };

		if (this.config.numChannels === 2) {
			// 双通道，拆分数据
			const lD = new DataView(new ArrayBuffer(length / 2));
			const rD = new DataView(new ArrayBuffer(length / 2));

			if (this.config.sampleBits === 16) {
				// 16位采样，每个样本2字节
				for (let i = 0; i < length / 4; i++) {
					const leftIndex = i * 2;
					const rightIndex = leftIndex + 2;
					lD.setInt16(leftIndex, all.getInt16(i * 4, littleEdian), littleEdian);
					rD.setInt16(leftIndex, all.getInt16(i * 4 + 2, littleEdian), littleEdian);
				}
			} else {
				// 8位采样，每个样本1字节
				for (let i = 0; i < length / 2; i++) {
					const leftIndex = i;
					const rightIndex = i;
					lD.setInt8(leftIndex, all.getInt8(i * 2));
					rD.setInt8(rightIndex, all.getInt8(i * 2 + 1));
				}
			}

			res.left = lD;
			res.right = rD;
		} else {
			// 单通道
			res.left = all;
		}

		return res;
	}
}

export default Index;