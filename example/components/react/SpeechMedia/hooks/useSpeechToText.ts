import { useState, useEffect, useRef } from 'react';

// 定义识别结果类型
export interface SpeechRecognitionResult {
	transcript: string;
	confidence: number;
}

// 定义Hook返回类型
export interface UseSpeechToTextReturn {
	isListening: boolean;
	transcript: string;
	interimTranscript: string;
	isSupported: boolean;
	startListening: () => void;
	stopListening: () => void;
	resetTranscript: () => void;
	error: string | null;
}

const useSpeechToText = (): UseSpeechToTextReturn => {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState('');
	const [interimTranscript, setInterimTranscript] = useState('');
	const [isSupported, setIsSupported] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const recognitionRef = useRef<any>(null);

	// 初始化语音识别
	useEffect(() => {
		// 检查浏览器支持
		const SpeechRecognition =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

		if (SpeechRecognition) {
			setIsSupported(true);
			recognitionRef.current = new SpeechRecognition();
			recognitionRef.current.continuous = true;
			recognitionRef.current.interimResults = true;
			recognitionRef.current.lang = 'zh-CN';

			recognitionRef.current.onresult = (event: any) => {
				let interim = '';
				let final = '';

				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						final += transcript + ' ';
					} else {
						interim += transcript;
					}
				}

				if (final) {
					setTranscript(prev => prev + final);
				}

				setInterimTranscript(interim);
			};

			recognitionRef.current.onerror = (event: any) => {
				setError(event.error);
				setIsListening(false);
			};

			recognitionRef.current.onend = () => {
				setIsListening(false);
			};
		} else {
			setIsSupported(false);
			setError('浏览器不支持语音识别功能');
		}

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		};
	}, []);

	// 开始监听
	const startListening = () => {
		if (recognitionRef.current && !isListening) {
			try {
				setInterimTranscript('');
				recognitionRef.current.start();
				setIsListening(true);
				setError(null);
			} catch (err) {
				setError('启动语音识别失败');
			}
		}
	};

	// 停止监听
	const stopListening = () => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop();
			setIsListening(false);
		}
	};

	// 重置转录内容
	const resetTranscript = () => {
		setTranscript('');
		setInterimTranscript('');
	};

	return {
		isListening,
		transcript,
		interimTranscript,
		isSupported,
		startListening,
		stopListening,
		resetTranscript,
		error
	};
};

export default useSpeechToText;
