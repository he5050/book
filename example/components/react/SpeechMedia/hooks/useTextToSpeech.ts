import { useState, useEffect, useRef } from 'react';

// 定义语音类型
export interface Voice {
	name: string;
	lang: string;
	voiceURI: string;
	default: boolean;
}

// 定义TTS配置
export interface TTSConfig {
	rate: number;
	pitch: number;
	volume: number;
	voiceIndex?: number;
}

// 定义Hook返回类型
export interface UseTextToSpeechReturn {
	voices: Voice[];
	isSpeaking: boolean;
	isPaused: boolean;
	speak: (text: string, config?: TTSConfig) => void;
	pause: () => void;
	resume: () => void;
	stop: () => void;
	setVoice: (index: number) => void;
	status: 'idle' | 'speaking' | 'paused' | 'stopped';
}

const useTextToSpeech = (): UseTextToSpeechReturn => {
	const [voices, setVoices] = useState<Voice[]>([]);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [status, setStatus] = useState<'idle' | 'speaking' | 'paused' | 'stopped'>('idle');
	const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);

	const synthesisRef = useRef<SpeechSynthesis | null>(null);
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	// 初始化语音合成
	useEffect(() => {
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			synthesisRef.current = window.speechSynthesis;

			const loadVoices = () => {
				const availableVoices = synthesisRef.current!.getVoices();
				const formattedVoices = availableVoices.map(voice => ({
					name: voice.name,
					lang: voice.lang,
					voiceURI: voice.voiceURI,
					default: voice.default
				}));
				setVoices(formattedVoices);

				// 尝试选择中文语音
				const chineseVoiceIndex = formattedVoices.findIndex(
					voice => voice.lang.includes('zh') || voice.lang.includes('CN')
				);

				if (chineseVoiceIndex !== -1) {
					setSelectedVoiceIndex(chineseVoiceIndex);
				}
			};

			// 语音列表可能异步加载
			if (synthesisRef.current.getVoices().length > 0) {
				loadVoices();
			} else {
				synthesisRef.current.addEventListener('voiceschanged', loadVoices);
			}

			return () => {
				if (synthesisRef.current) {
					synthesisRef.current.cancel();
					synthesisRef.current.removeEventListener('voiceschanged', loadVoices);
				}
			};
		} else {
			console.warn('浏览器不支持语音合成功能');
		}
	}, []);

	// 播放语音
	const speak = (text: string, config?: TTSConfig) => {
		if (!synthesisRef.current || !text) return;

		// 停止当前正在播放的语音
		stop();

		// 创建新的语音实例
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = config?.rate ?? 1;
		utterance.pitch = config?.pitch ?? 1;
		utterance.volume = config?.volume ?? 1;

		if (voices[config?.voiceIndex ?? selectedVoiceIndex]) {
			utterance.voice = synthesisRef.current.getVoices()[config?.voiceIndex ?? selectedVoiceIndex];
		}

		// 设置事件监听
		utterance.onstart = () => {
			setIsSpeaking(true);
			setIsPaused(false);
			setStatus('speaking');
		};

		utterance.onend = () => {
			setIsSpeaking(false);
			setIsPaused(false);
			setStatus('stopped');
		};

		utterance.onerror = event => {
			console.error('语音合成错误:', event);
			setIsSpeaking(false);
			setIsPaused(false);
			setStatus('stopped');
		};

		utteranceRef.current = utterance;
		synthesisRef.current.speak(utterance);
	};

	// 暂停语音
	const pause = () => {
		if (synthesisRef.current && isSpeaking) {
			synthesisRef.current.pause();
			setIsPaused(true);
			setStatus('paused');
		}
	};

	// 继续播放
	const resume = () => {
		if (synthesisRef.current && isPaused) {
			synthesisRef.current.resume();
			setIsPaused(false);
			setStatus('speaking');
		}
	};

	// 停止播放
	const stop = () => {
		if (synthesisRef.current) {
			synthesisRef.current.cancel();
			setIsSpeaking(false);
			setIsPaused(false);
			setStatus('stopped');
		}
	};

	// 设置语音
	const setVoice = (index: number) => {
		if (index >= 0 && index < voices.length) {
			setSelectedVoiceIndex(index);
		}
	};

	return {
		voices,
		isSpeaking,
		isPaused,
		speak,
		pause,
		resume,
		stop,
		setVoice,
		status
	};
};

export default useTextToSpeech;
