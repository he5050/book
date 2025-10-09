import { downloadPCM, downloadWAV, download } from './download';
import { compress, encodePCM, encodeWAV, encodeMP3 } from './transform';
import { SpeechProcessor, SpeechRecognizer, SpeechSynthesizer } from './speech';
import Player from './player';
import Recorder from './recorder';
// https://github.com/2fps
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
	/**
	 * @description 语音处理器
	 * @private
	 */
	private speechProcessor: SpeechProcessor;

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

	// --- 录音相关的事件回调 ---
	public onStart?: () => void;
	public onPause?: () => void;
	public onResume?: () => void;
	public onStop?: () => void;

	/**
	 * 构造函数
	 * @param {RecorderConfig} options - 录音器配置选项
	 */
	constructor(options: RecorderConfig = {}) {
		super(options);
		this.player = new Player();
		this.speechProcessor = new SpeechProcessor();

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
		return this.startRecord().then(() => {
			// 录音开始回调
			this.onStart?.();
		});
	}

	/**
	 * 暂停录音。
	 */
	public pause(): void {
		// isRecording 状态检查在父类中进行
		this.pauseRecord();
		// 录音暂停回调
		this.onPause?.();
	}

	/**
	 * 继续录音。
	 */
	public resume(): void {
		this.resumeRecord();
		// 录音恢复回调
		this.onResume?.();
	}

	/**
	 * 停止录音。
	 * 注意：此操作会重置录音状态。
	 */
	public stop(): void {
		this.stopRecord();
		// 录音结束回调
		this.onStop?.();
	}

	/**
	 * 播放音频。
	 * - 无参数：播放当前录音（WAV）
	 * - 传入 ArrayBuffer：播放外部音频数据
	 */
	public play(buffer?: ArrayBuffer): void {
		// 停止当前可能正在播放的音频
		if (this.isPlaying || this.wasPaused) {
			this.player.stopPlay();
		}

		this.isPlaying = true;
		this.wasPaused = false;
		this.onPlay?.();

		// 播放外部音频
		if (buffer) {
			this.player.play(buffer);
			return;
		}

		// 播放当前录音
		const wavData = this.getWAV();
		if (wavData.byteLength <= 44) {
			console.warn('没有有效的录音数据可供播放。');
			// 回滚播放状态
			this.isPlaying = false;
			this.wasPaused = false;
			return;
		}
		this.player.play(wavData.buffer as ArrayBuffer);
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
		return new Blob([this.getPCM().buffer as ArrayBuffer]);
	}

	/**
	 * 下载PCM格式的录音文件。
	 * @param {string} name - 文件名，默认为'recorder'。
	 */
	public downloadPCM(name: string = 'recorder'): void {
		const pcmBlob = this.getPCMBlob();
		const clean = this.sanitizeName(name, '.pcm');
		downloadPCM(pcmBlob, clean);
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
		return new Blob([this.getWAV().buffer as ArrayBuffer], { type: 'audio/wav' });
	}

	/**
	 * 下载WAV格式的录音文件。
	 * @param {string} name - 文件名，默认为'recorder'。
	 */
	public downloadWAV(name: string = 'recorder'): void {
		const wavBlob = this.getWAVBlob();
		const clean = this.sanitizeName(name, '.wav');
		downloadWAV(wavBlob, clean);
	}

	/**
	 * 通用下载接口。
	 * @param {Blob} blob - 要下载的Blob数据。
	 * @param {string} name - 文件名。
	 * @param {string} type - 文件类型。
	 */
	public downloadBlob(blob: Blob, name: string, type: string): void {
		let extension: '.wav' | '.pcm' | '.mp3';
		if (type.startsWith('audio/wav')) {
			extension = '.wav';
		} else if (type.startsWith('audio/mpeg') || type.startsWith('audio/mp3')) {
			extension = '.mp3';
		} else {
			extension = '.pcm'; // 默认
		}
		const clean = this.sanitizeName(name, extension);
		download(blob, clean, type);
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

	/**
	 * 获取当前录音时长（秒）。
	 * 录音进行中该值持续增长；停止后为最终时长。
	 * @returns {number} 录音时长（秒）
	 */
	public getDuration(): number {
		return this.duration;
	}

	/**
	 * 获取当前录音的累计大小（字节）。
	 * 注意：该值在录音进行中实时增长；停止录音后为最终大小。
	 * @returns {number} 录音字节数
	 */
	public getRecordingSize(): number {
		return this.fileSize;
	}

	/**
	 * 获取当前录音音量的百分比（0-100）。
	 * 通过时域数据的 RMS 计算，未在录音时返回 0。
	 * @returns {number} 音量百分比
	 */
	public getVolumePercentage(): number {
		// 仅在录音过程中计算（保持与 Demo 预期一致）
		if (!this.isRecording) return 0;

		const data = this.getTimeDomainData();
		const len = data?.length ?? 0;
		if (!len) return 0;

		let sumSquares = 0;
		for (let i = 0; i < len; i++) {
			const v = (data[i] - 128) / 128; // 转为 -1..1
			sumSquares += v * v;
		}
		const rms = Math.sqrt(sumSquares / len);
		const percent = Math.round(rms * 100);
		// 保护边界
		return Math.max(0, Math.min(100, percent));
	}
	/**
	 * 边录边转/播：当前基础类无对应实现，先降级为普通 start()
	 * 后续如需真实“边录边转”，可在 Recorder 层添加具体逻辑并在此委托调用。
	 */
	public startWithConvert(): Promise<void> {
		if (this.isRecording) {
			return Promise.reject(new Error('录音已在进行中'));
		}
		return this.start().then(() => {
			console.warn('startWithConvert 暂未实现，已降级为普通录音 start()');
		});
	}

	/**
	 * 语义化的 MP3 播放封装：
	 * - 无参数：不支持（需外部文件或已编码数据）
	 * - 传入 ArrayBuffer：播放外部 MP3 数据
	 */
	public playMP3(buffer?: ArrayBuffer): void {
		if (!buffer) {
			console.warn('playMP3 需要传入外部 MP3 的 ArrayBuffer');
			return;
		}
		this.play(buffer);
	}

	/**
	 * 将当前录音编码为 MP3 的 Blob
	 * @param {number} bitrateKbps - MP3 比特率，默认 128
	 * @returns {Blob}
	 */
	public getMP3Blob(bitrateKbps: number = 128): Blob {
		// 使用 16bit PCM 作为编码输入，避免 8bit 造成失真
		const raw = this.getData();
		const compressed = compress(raw, this.inputSampleRate, this.outputSampleRate);
		const pcm16 = encodePCM(compressed, 16, this.littleEndian);
		const chunks = encodeMP3(pcm16, this.outputSampleRate, this.config.numChannels ?? 1, bitrateKbps, this.littleEndian);
		return new Blob(chunks, { type: 'audio/mpeg' });
	}

	/**
	 * 下载 MP3 文件
	 */
	public downloadMP3(name: string = 'recorder', bitrateKbps: number = 128): void {
		const mp3Blob = this.getMP3Blob(bitrateKbps);
		const clean = this.sanitizeName(name, '.mp3');
		download(mp3Blob, clean, 'mp3');
	}

	/**
	 * 规范化文件名：移除已存在的目标后缀，避免重复，如 "a.wav" → "a"
	 */
	private sanitizeName(name: string, ext: '.wav' | '.pcm' | '.mp3'): string {
		const lower = name.trim().toLowerCase();
		const target = ext.toLowerCase();
		let base = name.trim();
		if (lower.endsWith(target)) {
			base = base.slice(0, base.length - target.length);
		}
		// 移除可能的重复点号，如 "a." → "a"
		if (base.endsWith('.')) base = base.slice(0, -1);
		return base;
	}

	// ==================== 语音功能 ====================

	/**
	 * 获取语音识别器
	 * @returns {SpeechRecognizer | null} 语音识别器实例
	 */
	public getSpeechRecognizer(): SpeechRecognizer | null {
		return this.speechProcessor.getRecognizer();
	}

	/**
	 * 获取语音合成器
	 * @returns {SpeechSynthesizer | null} 语音合成器实例
	 */
	public getSpeechSynthesizer(): SpeechSynthesizer | null {
		return this.speechProcessor.getSynthesizer();
	}

	/**
	 * 快速语音识别（一次性）
	 * @param {string} lang - 识别语言，默认 'zh-CN'
	 * @returns {Promise<string>} 识别结果
	 */
	public async recognizeOnce(lang: string = 'zh-CN'): Promise<string> {
		return this.speechProcessor.recognizeOnce({ lang });
	}

	/**
	 * 文字转语音
	 * @param {string} text - 要合成的文本
	 * @param {object} options - 合成选项
	 * @returns {Promise<void>} 合成完成的Promise
	 */
	public async speakText(
		text: string,
		options: {
			lang?: string;
			rate?: number;
			pitch?: number;
			volume?: number;
		} = {}
	): Promise<void> {
		const config = {
			lang: options.lang || 'zh-CN',
			rate: options.rate || 1,
			pitch: options.pitch || 1,
			volume: options.volume || 1
		};
		return this.speechProcessor.speakText(text, config);
	}

	/**
	 * 检查语音功能支持情况
	 * @returns {object} 支持情况
	 */
	public static getSpeechSupport(): {
		recognition: boolean;
		synthesis: boolean;
	} {
		return SpeechProcessor.getSupport();
	}

	/**
	 * 停止语音合成
	 */
	public stopSpeech(): void {
		const synthesizer = this.getSpeechSynthesizer();
		if (synthesizer) {
			synthesizer.stop();
		}
	}

	/**
	 * 暂停语音合成
	 */
	public pauseSpeech(): void {
		const synthesizer = this.getSpeechSynthesizer();
		if (synthesizer) {
			synthesizer.pause();
		}
	}

	/**
	 * 恢复语音合成
	 */
	public resumeSpeech(): void {
		const synthesizer = this.getSpeechSynthesizer();
		if (synthesizer) {
			synthesizer.resume();
		}
	}

	/**
	 * 获取可用的语音列表
	 * @returns {SpeechSynthesisVoice[]} 语音列表
	 */
	public getAvailableVoices(): SpeechSynthesisVoice[] {
		const synthesizer = this.getSpeechSynthesizer();
		return synthesizer ? synthesizer.getVoices() : [];
	}

	/**
	 * 获取指定语言的语音列表
	 * @param {string} lang - 语言代码
	 * @returns {SpeechSynthesisVoice[]} 语音列表
	 */
	public getVoicesByLanguage(lang: string): SpeechSynthesisVoice[] {
		const synthesizer = this.getSpeechSynthesizer();
		return synthesizer ? synthesizer.getVoicesByLang(lang) : [];
	}
}



export default AudioProcessor;