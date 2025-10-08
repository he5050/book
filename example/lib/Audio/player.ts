/**
 * Player 类提供了一组方法来控制音频播放。
 * 每个实例管理一个独立的音频播放状态。
 */
export default class Player {
	/** @private 音频上下文，用于所有音频操作 */
	private context: AudioContext | null = null;
	/** @private 音频分析节点，用于获取频域和时域数据 */
	private analyser: AnalyserNode | null = null;
	/** @private 音频源节点，代表正在播放的音频 */
	private source: AudioBufferSourceNode | null = null;
	/** @private 存储解码前的原始音频数据 */
	private audioData: ArrayBuffer | null = null;
	/** @private 标记当前是否处于暂停状态 */
	private isPaused: boolean = false;
	/** @private 记录暂停时已经播放的时长，用于恢复播放 */
	private playTime: number = 0;
	/** @private 记录开始或恢复播放时的时间戳，用于计算播放时长 */
	private playStamp: number = 0;
	/** @private 记录音频播放完成时的总时长 */
	private totalTime: number = 0;
	/** @private 播放结束时触发的回调函数 */
	private endPlayFn: () => void = () => {};

	constructor() {
		this.init();
	}

	/**
	 * 初始化音频上下文和分析器。
	 * @private
	 */
	private init(): void {
		if (!this.context) {
			const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
			if (!AudioContext) {
				console.error('浏览器不支持 AudioContext');
				return;
			}
			this.context = new AudioContext();
			this.analyser = this.context.createAnalyser();
			this.analyser.fftSize = 2048; // 设置FFT大小，用于频谱分析
		}
	}

	/**
	 * 销毁当前的音频源。
	 * @private
	 */
	private destroySource(): void {
		if (this.source) {
			this.source.onended = null; // 清理事件监听器
			this.source.stop();
			this.source.disconnect();
			this.source = null;
		}
	}

	/**
	 * 异步播放音频。
	 * @private
	 * @returns {Promise<void>}
	 */
	private playAudio(): Promise<void> {
		if (!this.context) {
			return Promise.reject(new Error('音频上下文未初始化'));
		}

		this.isPaused = false;

		return new Promise((resolve, reject) => {
			if (!this.audioData) {
				return reject(new Error('没有可播放的音频数据'));
			}

			if (!this.context) {
				return reject(new Error('音频上下文不可用'));
			}

			this.context.decodeAudioData(
				this.audioData.slice(0),
				buffer => {
					if (!this.context) {
						return reject(new Error('音频上下文不可用'));
					}

					this.destroySource(); // 销毁当前音频源节点

					this.source = this.context.createBufferSource(); // 创建音频源节点
					this.source.buffer = buffer; // 为音频源节点设置音频数据

					this.source.onended = () => {
						if (!this.isPaused && this.context) {
							this.totalTime = this.context.currentTime - this.playStamp + this.playTime;
							this.endPlayFn();
						}
					};

					if (this.analyser) {
						this.source.connect(this.analyser);
						this.analyser.connect(this.context.destination);
					} else {
						this.source.connect(this.context.destination);
					}

					this.source.start(0, this.playTime);
					this.playStamp = this.context.currentTime;
					resolve();
				},
				err => {
					reject(new Error(`音频解码失败: ${err.message}`));
				}
			);
		});
	}

	/**
	 * 开始播放指定的音频数据。
	 * @param {ArrayBuffer} arraybuffer - 包含音频数据的ArrayBuffer。
	 * @returns {Promise<void>}
	 */
	public play(arraybuffer: ArrayBuffer): Promise<void> {
		this.init();
		this.stopPlay();

		this.audioData = arraybuffer;
		this.totalTime = 0;

		return this.playAudio();
	}

	/**
	 * 暂停当前正在播放的音频。
	 */
	public pausePlay(): void {
		if (this.context && !this.isPaused) {
			this.isPaused = true;
			this.playTime += this.context.currentTime - this.playStamp;
			this.destroySource();
		}
	}

	/**
	 * 恢复播放已暂停的音频。
	 * @returns {Promise<void>}
	 */
	public resumePlay(): Promise<void> {
		if (this.isPaused) {
			return this.playAudio();
		}
		return Promise.resolve();
	}

	/**
	 * 停止播放并重置播放状态。
	 */
	public stopPlay(): void {
		this.playTime = 0;
		this.totalTime = 0;
		this.isPaused = false;
		this.audioData = null;
		this.destroySource();
	}

	/**
	 * 销毁播放器，释放所有资源。
	 */
	public destroyPlay(): void {
		this.stopPlay();
		if (this.context && this.context.state !== 'closed') {
			this.context.close();
		}
		this.context = null;
		this.analyser = null;
	}

	/**
	 * 获取当前播放音频的时域数据（波形数据）。
	 * @returns {Uint8Array} 包含时域数据的Uint8Array。
	 */
	public getTimeDomainData(): Uint8Array {
		if (!this.analyser) {
			return new Uint8Array(0);
		}
		const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteTimeDomainData(dataArray);
		return dataArray;
	}

	/**
	 * 获取当前播放音频的频域数据。
	 * @returns {Uint8Array} 包含频域数据的Uint8Array。
	 */
	public getFrequencyData(): Uint8Array {
		if (!this.analyser) {
			return new Uint8Array(0);
		}
		const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(dataArray);
		return dataArray;
	}

	/**
	 * 设置一个在音频播放自然结束时触发的回调函数。
	 * @param {() => void} [fn=() => {}] - 播放结束时执行的回调。
	 */
	public addPlayEnd(fn: () => void = () => {}): void {
		this.endPlayFn = fn;
	}

	/**
	 * 获取当前已播放的时长（秒）。
	 * @returns {number} 已播放的秒数。
	 */
	public getPlayTime(): number {
		if (!this.context) {
			return 0;
		}
		if (this.totalTime) {
			return this.totalTime;
		}
		return this.isPaused
			? this.playTime
			: this.context.currentTime - this.playStamp + this.playTime;
	}
}
