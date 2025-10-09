/**
 * 语音识别和语音合成功能
 * 基于浏览器原生 Web Speech API
 */

// 类型声明
declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}

interface SpeechRecognition extends EventTarget {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	maxAlternatives: number;
	start(): void;
	stop(): void;
	abort(): void;
	onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
	onend: ((this: SpeechRecognition, ev: Event) => any) | null;
	onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
	onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
	error: string;
}

interface SpeechRecognitionResultList {
	readonly length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	readonly length: number;
	item(index: number): SpeechRecognitionAlternative;
	[index: number]: SpeechRecognitionAlternative;
	isFinal: boolean;
}

interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
}

declare var SpeechRecognition: {
	prototype: SpeechRecognition;
	new (): SpeechRecognition;
};

// 语音识别配置接口
interface SpeechRecognitionConfig {
	/**
	 * @description 识别语言，默认 'zh-CN'
	 */
	lang?: string;
	/**
	 * @description 是否连续识别，默认 false
	 */
	continuous?: boolean;
	/**
	 * @description 是否返回中间结果，默认 true
	 */
	interimResults?: boolean;
	/**
	 * @description 最大备选结果数，默认 1
	 */
	maxAlternatives?: number;
}

// 语音合成配置接口
interface SpeechSynthesisConfig {
	/**
	 * @description 语音语言，默认 'zh-CN'
	 */
	lang?: string;
	/**
	 * @description 音调 (0.1-2)，默认 1
	 */
	pitch?: number;
	/**
	 * @description 语速 (0.1-10)，默认 1
	 */
	rate?: number;
	/**
	 * @description 音量 (0-1)，默认 1
	 */
	volume?: number;
	/**
	 * @description 声音名称，可选
	 */
	voiceName?: string;
}

// 识别结果接口（重命名避免冲突）
interface RecognitionResult {
	/**
	 * @description 识别的文本
	 */
	transcript: string;
	/**
	 * @description 置信度 (0-1)
	 */
	confidence: number;
	/**
	 * @description 是否为最终结果
	 */
	isFinal: boolean;
}

/**
 * 语音识别类
 * 封装浏览器的 SpeechRecognition API
 */
export class SpeechRecognizer {
	private recognition: SpeechRecognition | null = null;
	private isListening: boolean = false;
	private config: Required<SpeechRecognitionConfig>;

	// 事件回调
	public onResult?: (result: RecognitionResult) => void;
	public onError?: (error: string) => void;
	public onStart?: () => void;
	public onEnd?: () => void;

	constructor(config: SpeechRecognitionConfig = {}) {
		// 检查浏览器支持
		const SpeechRecognition =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		if (!SpeechRecognition) {
			throw new Error('浏览器不支持语音识别功能');
		}

		// 设置默认配置
		this.config = {
			lang: config.lang || 'zh-CN',
			continuous: config.continuous ?? false,
			interimResults: config.interimResults ?? true,
			maxAlternatives: config.maxAlternatives || 1
		};

		this.initRecognition();
	}

	/**
	 * 初始化语音识别
	 */
	private initRecognition(): void {
		const SpeechRecognition =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		this.recognition = new SpeechRecognition();

		if (this.recognition) {
			// 配置识别器
			this.recognition.lang = this.config.lang;
			this.recognition.continuous = this.config.continuous;
			this.recognition.interimResults = this.config.interimResults;
			this.recognition.maxAlternatives = this.config.maxAlternatives;

			// 绑定事件
			this.recognition.onstart = () => {
				this.isListening = true;
				this.onStart?.();
			};

			this.recognition.onend = () => {
				this.isListening = false;
				this.onEnd?.();
			};

			this.recognition.onresult = (event: SpeechRecognitionEvent) => {
				const result = event.results[event.results.length - 1];
				const transcript = result[0].transcript;
				const confidence = result[0].confidence;
				const isFinal = result.isFinal;

				this.onResult?.({
					transcript,
					confidence,
					isFinal
				});
			};

			this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
				this.onError?.(event.error);
			};
		}
	}

	/**
	 * 开始语音识别
	 */
	public start(): void {
		if (!this.recognition) {
			throw new Error('语音识别未初始化');
		}
		if (this.isListening) {
			console.warn('语音识别已在进行中');
			return;
		}
		this.recognition.start();
	}

	/**
	 * 停止语音识别
	 */
	public stop(): void {
		if (!this.recognition) return;
		this.recognition.stop();
	}

	/**
	 * 中止语音识别
	 */
	public abort(): void {
		if (!this.recognition) return;
		this.recognition.abort();
	}

	/**
	 * 获取当前状态
	 */
	public getIsListening(): boolean {
		return this.isListening;
	}

	/**
	 * 更新配置
	 */
	public updateConfig(config: Partial<SpeechRecognitionConfig>): void {
		this.config = { ...this.config, ...config };
		if (this.recognition) {
			this.recognition.lang = this.config.lang;
			this.recognition.continuous = this.config.continuous;
			this.recognition.interimResults = this.config.interimResults;
			this.recognition.maxAlternatives = this.config.maxAlternatives;
		}
	}

	/**
	 * 检查浏览器支持
	 */
	public static isSupported(): boolean {
		return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
	}
}

/**
 * 语音合成类
 * 封装浏览器的 SpeechSynthesis API
 */
export class SpeechSynthesizer {
	private synth: SpeechSynthesis;
	private config: Required<SpeechSynthesisConfig>;
	private voices: SpeechSynthesisVoice[] = [];

	// 事件回调
	public onStart?: () => void;
	public onEnd?: () => void;
	public onError?: (error: string) => void;
	public onPause?: () => void;
	public onResume?: () => void;

	constructor(config: SpeechSynthesisConfig = {}) {
		// 检查浏览器支持
		if (!window.speechSynthesis) {
			throw new Error('浏览器不支持语音合成功能');
		}

		this.synth = window.speechSynthesis;

		// 设置默认配置
		this.config = {
			lang: config.lang || 'zh-CN',
			pitch: config.pitch || 1,
			rate: config.rate || 1,
			volume: config.volume || 1,
			voiceName: config.voiceName || ''
		};

		this.loadVoices();
	}

	/**
	 * 加载可用声音
	 */
	private loadVoices(): void {
		this.voices = this.synth.getVoices();

		// 如果声音列表为空，监听 voiceschanged 事件
		if (this.voices.length === 0) {
			this.synth.onvoiceschanged = () => {
				this.voices = this.synth.getVoices();
			};
		}
	}

	/**
	 * 语音合成
	 * @param text 要合成的文本
	 */
	public speak(text: string): void {
		if (!text.trim()) {
			console.warn('文本内容为空');
			return;
		}

		// 停止当前播放
		this.stop();

		const utterance = new SpeechSynthesisUtterance(text);

		// 应用配置
		utterance.lang = this.config.lang;
		utterance.pitch = this.config.pitch;
		utterance.rate = this.config.rate;
		utterance.volume = this.config.volume;

		// 设置声音
		if (this.config.voiceName) {
			const voice = this.voices.find(v => v.name === this.config.voiceName);
			if (voice) {
				utterance.voice = voice;
			}
		} else {
			// 自动选择合适的声音
			const voice = this.voices.find(v => v.lang === this.config.lang);
			if (voice) {
				utterance.voice = voice;
			}
		}

		// 绑定事件
		utterance.onstart = () => this.onStart?.();
		utterance.onend = () => this.onEnd?.();
		utterance.onerror = event => this.onError?.(event.error);
		utterance.onpause = () => this.onPause?.();
		utterance.onresume = () => this.onResume?.();

		// 开始合成
		this.synth.speak(utterance);
	}

	/**
	 * 暂停语音合成
	 */
	public pause(): void {
		this.synth.pause();
	}

	/**
	 * 恢复语音合成
	 */
	public resume(): void {
		this.synth.resume();
	}

	/**
	 * 停止语音合成
	 */
	public stop(): void {
		this.synth.cancel();
	}

	/**
	 * 获取当前状态
	 */
	public getStatus(): {
		speaking: boolean;
		pending: boolean;
		paused: boolean;
	} {
		return {
			speaking: this.synth.speaking,
			pending: this.synth.pending,
			paused: this.synth.paused
		};
	}

	/**
	 * 获取可用声音列表
	 */
	public getVoices(): SpeechSynthesisVoice[] {
		return this.voices;
	}

	/**
	 * 获取指定语言的声音
	 */
	public getVoicesByLang(lang: string): SpeechSynthesisVoice[] {
		return this.voices.filter(voice => voice.lang.startsWith(lang));
	}

	/**
	 * 更新配置
	 */
	public updateConfig(config: Partial<SpeechSynthesisConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * 检查浏览器支持
	 */
	public static isSupported(): boolean {
		return !!window.speechSynthesis;
	}
}

/**
 * 语音处理工具类
 * 提供便捷的语音识别和合成功能
 */
export class SpeechProcessor {
	private recognizer: SpeechRecognizer | null = null;
	private synthesizer: SpeechSynthesizer | null = null;

	constructor() {
		// 初始化识别器（如果支持）
		if (SpeechRecognizer.isSupported()) {
			this.recognizer = new SpeechRecognizer();
		}

		// 初始化合成器（如果支持）
		if (SpeechSynthesizer.isSupported()) {
			this.synthesizer = new SpeechSynthesizer();
		}
	}

	/**
	 * 获取语音识别器
	 */
	public getRecognizer(): SpeechRecognizer | null {
		return this.recognizer;
	}

	/**
	 * 获取语音合成器
	 */
	public getSynthesizer(): SpeechSynthesizer | null {
		return this.synthesizer;
	}

	/**
	 * 快速语音识别
	 */
	public async recognizeOnce(config?: SpeechRecognitionConfig): Promise<string> {
		if (!this.recognizer) {
			throw new Error('浏览器不支持语音识别');
		}

		return new Promise((resolve, reject) => {
			const tempRecognizer = new SpeechRecognizer({
				...config,
				continuous: false,
				interimResults: false
			});

			tempRecognizer.onResult = result => {
				if (result.isFinal) {
					resolve(result.transcript);
				}
			};

			tempRecognizer.onError = error => {
				reject(new Error(error));
			};

			tempRecognizer.start();
		});
	}

	/**
	 * 快速语音合成
	 */
	public async speakText(text: string, config?: SpeechSynthesisConfig): Promise<void> {
		if (!this.synthesizer) {
			throw new Error('浏览器不支持语音合成');
		}

		return new Promise((resolve, reject) => {
			const tempSynthesizer = new SpeechSynthesizer(config);

			tempSynthesizer.onEnd = () => resolve();
			tempSynthesizer.onError = error => reject(new Error(error));

			tempSynthesizer.speak(text);
		});
	}

	/**
	 * 检查功能支持情况
	 */
	public static getSupport(): {
		recognition: boolean;
		synthesis: boolean;
	} {
		return {
			recognition: SpeechRecognizer.isSupported(),
			synthesis: SpeechSynthesizer.isSupported()
		};
	}
}

// 导出类型
export type { SpeechRecognitionConfig, SpeechSynthesisConfig, RecognitionResult };
