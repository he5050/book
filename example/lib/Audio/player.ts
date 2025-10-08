import { throwError } from './exception';

declare let window: any;

let source: AudioBufferSourceNode | null = null;
let playTime: number = 0; // 相对时间，记录暂停位置
let playStamp: number = 0; // 开始或暂停后开始的时间戳(绝对)
let context: AudioContext | null = null;
let analyser: AnalyserNode | null = null;

let audioData: ArrayBuffer | null = null;
let isPaused: boolean = false;
let totalTime: number = 0;
let endplayFn: () => void = function () {};

/**
 * 初始化音频上下文
 */
function init(): void {
	context = new (window.AudioContext || window.webkitAudioContext)();
	analyser = context.createAnalyser();
	analyser.fftSize = 2048; // 表示存储频域的大小
}

/**
 * 播放音频
 * @returns {Promise<void>} 返回一个Promise，播放成功时resolve，失败时reject
 */
function playAudio(): Promise<void> {
	isPaused = false;

	if (!context) {
		return Promise.reject(new Error('Audio context not initialized'));
	}

	return new Promise((resolve, reject) => {
		if (!audioData) {
			reject(new Error('No audio data to play'));
			return;
		}

		context.decodeAudioData(
			audioData.slice(0),
			buffer => {
				if (!context) {
					reject(new Error('Audio context not available'));
					return;
				}

				source = context.createBufferSource();

				// 播放结束的事件绑定
				source.onended = () => {
					if (!isPaused) {
						// 暂停的时候也会触发该事件
						// 计算音频总时长
						totalTime = context!.currentTime - playStamp + playTime;
						endplayFn();
					}
				};

				// 设置数据
				source.buffer = buffer;
				// connect到分析器
				if (analyser) {
					source.connect(analyser);
					analyser.connect(context.destination);
				}
				source.start(0, playTime);

				// 记录当前的时间戳，以备暂停时使用
				playStamp = context.currentTime;
				resolve();
			},
			function (e) {
				reject(e);
			}
		);
	});
}

// 销毁source, 由于 decodeAudioData 产生的source每次停止后就不能使用，所以暂停也意味着销毁，下次需重新启动。
function destroySource() {
	if (source) {
		source.stop();
		source = null;
	}
}

export default class Player {
	/**
	 * 播放录音
	 * @static
	 * @param {ArrayBuffer} arraybuffer 音频数据
	 * @returns {Promise<void>} 返回一个Promise
	 * @memberof Player
	 */
	static play(arraybuffer: ArrayBuffer): Promise<void> {
		if (!context) {
			// 第一次播放要初始化
			init();
		}
		this.stopPlay();
		// 缓存播放数据
		audioData = arraybuffer;
		totalTime = 0;

		return playAudio();
	}

	/**
	 * 暂停播放录音
	 * @memberof Player
	 */
	static pausePlay(): void {
		destroySource();
		if (context) {
			// 多次暂停需要累加
			playTime += context.currentTime - playStamp;
		}
		isPaused = true;
	}

	/**
	 * 恢复播放录音
	 * @memberof Player
	 * @returns {Promise<void>} 返回一个Promise
	 */
	static resumePlay(): Promise<void> {
		return playAudio();
	}

	/**
	 * 停止播放
	 * @memberof Player
	 */
	static stopPlay() {
		playTime = 0;
		audioData = null;

		destroySource();
	}

	/**
	 * 销毁播放器
	 * @memberof Player
	 */
	static destroyPlay() {
		this.stopPlay();
	}

	/**
	 * 获取音频分析数据
	 * @returns {Uint8Array} 返回频域数据数组
	 * @memberof Player
	 */
	static getAnalyseData(): Uint8Array {
		if (!analyser) {
			// 如果analyser未初始化，返回空数组
			return new Uint8Array(0);
		}
		
		let dataArray = new Uint8Array(analyser.frequencyBinCount);
		// 将数据拷贝到dataArray中。
		analyser.getByteTimeDomainData(dataArray);

		return dataArray;
	}

	/**
	 * 增加录音播放完成的事件绑定
	 * @static
	 * @param {() => void} fn 播放完成后的回调函数
	 * @memberof Player
	 */
	static addPlayEnd(fn: () => void = function () {}) {
		endplayFn = fn;
	}

	/**
	 * 获取已经播放的时长
	 * @returns {number} 已播放的时间（秒）
	 * @memberof Player
	 */
	static getPlayTime(): number {
		if (!context) {
			return 0;
		}
		
		let pTime = isPaused ? playTime : context.currentTime - playStamp + playTime;

		return totalTime || pTime;
	}
}
