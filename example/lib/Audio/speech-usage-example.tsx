/**
 * 语音功能使用示例
 * 展示如何在 React 组件中使用语音识别和语音合成功能
 */

import React, { useState, useRef, useEffect } from 'react';
import AudioProcessor from './index';

const SpeechExample: React.FC = () => {
	const audioProcessorRef = useRef<AudioProcessor | null>(null);
	const [recognizedText, setRecognizedText] = useState('');
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [textToSpeak, setTextToSpeak] = useState('你好，这是语音合成测试');
	const [speechSupport, setSpeechSupport] = useState({ recognition: false, synthesis: false });

	useEffect(() => {
		// 初始化 AudioProcessor
		audioProcessorRef.current = new AudioProcessor();
		
		// 检查语音功能支持
		const support = AudioProcessor.getSpeechSupport();
		setSpeechSupport(support);
	}, []);

	// 开始语音识别
	const handleStartRecognition = () => {
		const recognizer = audioProcessorRef.current?.getSpeechRecognizer();
		if (!recognizer) {
			alert('浏览器不支持语音识别功能');
			return;
		}

		// 设置事件回调
		recognizer.onStart = () => {
			setIsListening(true);
			console.log('开始语音识别');
		};

		recognizer.onEnd = () => {
			setIsListening(false);
			console.log('语音识别结束');
		};

		recognizer.onResult = (result) => {
			console.log('识别结果:', result);
			if (result.isFinal) {
				setRecognizedText(prev => prev + result.transcript + ' ');
			}
		};

		recognizer.onError = (error) => {
			console.error('识别错误:', error);
			setIsListening(false);
			alert(`识别错误: ${error}`);
		};

		// 开始识别
		recognizer.start();
	};

	// 停止语音识别
	const handleStopRecognition = () => {
		const recognizer = audioProcessorRef.current?.getSpeechRecognizer();
		if (recognizer) {
			recognizer.stop();
		}
	};

	// 一次性语音识别
	const handleRecognizeOnce = async () => {
		try {
			const result = await audioProcessorRef.current?.recognizeOnce('zh-CN');
			if (result) {
				setRecognizedText(prev => prev + result + ' ');
			}
		} catch (error) {
			console.error('识别失败:', error);
			alert(`识别失败: ${error}`);
		}
	};

	// 语音合成
	const handleSpeak = async () => {
		if (!textToSpeak.trim()) {
			alert('请输入要合成的文本');
			return;
		}

		try {
			setIsSpeaking(true);
			await audioProcessorRef.current?.speakText(textToSpeak, {
				lang: 'zh-CN',
				rate: 1,
				pitch: 1,
				volume: 1
			});
			setIsSpeaking(false);
		} catch (error) {
			console.error('语音合成失败:', error);
			setIsSpeaking(false);
			alert(`语音合成失败: ${error}`);
		}
	};

	// 停止语音合成
	const handleStopSpeech = () => {
		audioProcessorRef.current?.stopSpeech();
		setIsSpeaking(false);
	};

	// 清空识别文本
	const handleClearText = () => {
		setRecognizedText('');
	};

	return (
		<div style={{ padding: '20px', maxWidth: '600px' }}>
			<h2>语音功能示例</h2>
			
			{/* 功能支持状态 */}
			<div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
				<h3>浏览器支持情况</h3>
				<p>语音识别: {speechSupport.recognition ? '✅ 支持' : '❌ 不支持'}</p>
				<p>语音合成: {speechSupport.synthesis ? '✅ 支持' : '❌ 不支持'}</p>
			</div>

			{/* 语音识别区域 */}
			<div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
				<h3>语音识别 (Speech Recognition)</h3>
				
				<div style={{ marginBottom: '10px' }}>
					<button 
						onClick={handleStartRecognition} 
						disabled={!speechSupport.recognition || isListening}
						style={{ marginRight: '10px' }}
					>
						{isListening ? '正在识别...' : '开始连续识别'}
					</button>
					
					<button 
						onClick={handleStopRecognition} 
						disabled={!speechSupport.recognition || !isListening}
						style={{ marginRight: '10px' }}
					>
						停止识别
					</button>
					
					<button 
						onClick={handleRecognizeOnce} 
						disabled={!speechSupport.recognition || isListening}
						style={{ marginRight: '10px' }}
					>
						一次性识别
					</button>
					
					<button onClick={handleClearText}>
						清空文本
					</button>
				</div>

				<div>
					<label>识别结果:</label>
					<textarea
						value={recognizedText}
						onChange={(e) => setRecognizedText(e.target.value)}
						style={{ 
							width: '100%', 
							height: '100px', 
							marginTop: '5px',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '3px'
						}}
						placeholder="语音识别的文本将显示在这里..."
					/>
				</div>
			</div>

			{/* 语音合成区域 */}
			<div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
				<h3>语音合成 (Text-to-Speech)</h3>
				
				<div style={{ marginBottom: '10px' }}>
					<label>要合成的文本:</label>
					<textarea
						value={textToSpeak}
						onChange={(e) => setTextToSpeak(e.target.value)}
						style={{ 
							width: '100%', 
							height: '80px', 
							marginTop: '5px',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '3px'
						}}
						placeholder="输入要转换为语音的文本..."
					/>
				</div>

				<div>
					<button 
						onClick={handleSpeak} 
						disabled={!speechSupport.synthesis || isSpeaking}
						style={{ marginRight: '10px' }}
					>
						{isSpeaking ? '正在播放...' : '开始语音合成'}
					</button>
					
					<button 
						onClick={handleStopSpeech} 
						disabled={!speechSupport.synthesis || !isSpeaking}
					>
						停止播放
					</button>
				</div>
			</div>

			{/* 使用说明 */}
			<div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f4fd', borderRadius: '5px' }}>
				<h4>使用说明:</h4>
				<ul style={{ margin: 0, paddingLeft: '20px' }}>
					<li>语音识别需要麦克风权限，首次使用时浏览器会询问权限</li>
					<li>语音合成不需要特殊权限，但需要浏览器支持</li>
					<li>Chrome、Edge、Safari 等现代浏览器都支持这些功能</li>
					<li>语音识别支持中文、英文等多种语言</li>
					<li>可以通过 AudioProcessor 的方法获取更多语音选项</li>
				</ul>
			</div>
		</div>
	);
};

export default SpeechExample;