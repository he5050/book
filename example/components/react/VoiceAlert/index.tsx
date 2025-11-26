import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './index.scss';

interface VoiceAlertProps {
	maxAlerts?: number; // 最大保存消息数量
	autoSpeak?: boolean; // 自动播报新消息
	showControlPanel?: boolean; // 显示控制面板
}

interface AlertMessage {
	id: number;
	message: string;
	type: 'info' | 'warning' | 'error' | 'success';
	timestamp: Date;
	priority: number;
}

// 定义暴露给父组件的方法
export interface VoiceAlertHandles {
	handleNewAlert: (alertData: Omit<AlertMessage, 'id' | 'timestamp'>) => void;
	speakAlert: (alert: AlertMessage) => void;
	stopSpeaking: () => void;
}

const VoiceAlert = forwardRef<VoiceAlertHandles, VoiceAlertProps>(
	({ maxAlerts = 50, autoSpeak = true, showControlPanel = false }, ref) => {
		// 状态管理
		const [isSupported, setIsSupported] = useState(false);
		const [isSpeaking, setIsSpeaking] = useState(false);
		const [showControl, setShowControl] = useState(showControlPanel);
		const [volume, setVolume] = useState(1);
		const [rate, setRate] = useState(1);
		const [pitch, setPitch] = useState(1);
		const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
		const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
		const [recentAlerts, setRecentAlerts] = useState<AlertMessage[]>([]);
		const [alertCounter, setAlertCounter] = useState(0);

		// 引用
		const synthRef = useRef<SpeechSynthesis | null>(null);
		const isSpeakingRef = useRef(false);

		// 暴露方法给父组件
		useImperativeHandle(ref, () => ({
			handleNewAlert,
			speakAlert,
			stopSpeaking
		}));

		// 初始化
		useEffect(() => {
			// 检查浏览器支持
			const isSupported = 'speechSynthesis' in window;
			setIsSupported(isSupported);

			if (isSupported) {
				synthRef.current = window.speechSynthesis;
				const voices = synthRef.current.getVoices();
				setAvailableVoices(voices);
				setSelectedVoice(voices[0] || null);

				// 语音列表可能异步加载
				if (voices.length === 0) {
					const handleVoicesChanged = () => {
						const newVoices = synthRef.current!.getVoices();
						setAvailableVoices(newVoices);
						setSelectedVoice(newVoices[0] || null);
					};

					synthRef.current.addEventListener('voiceschanged', handleVoicesChanged);

					// 清理事件监听器
					return () => {
						synthRef.current!.removeEventListener('voiceschanged', handleVoicesChanged);
					};
				}
			}

			return () => {
				// 组件卸载时停止播报
				if (synthRef.current) {
					synthRef.current.cancel();
				}
			};
		}, []);

		// 语音播报核心函数
		const speakMessage = (message: string, options: any = {}) => {
			if (!isSupported || !synthRef.current) return false;

			// 停止当前播报
			synthRef.current.cancel();

			const utterance = new SpeechSynthesisUtterance(message);
			utterance.volume = options.volume !== undefined ? options.volume : volume;
			utterance.rate = options.rate !== undefined ? options.rate : rate;
			utterance.pitch = options.pitch !== undefined ? options.pitch : pitch;
			utterance.voice = options.voice || selectedVoice || undefined;
			utterance.lang = options.lang || 'zh-CN';

			utterance.onstart = () => {
				isSpeakingRef.current = true;
				setIsSpeaking(true);
				options.onStart && options.onStart();
			};

			utterance.onend = () => {
				isSpeakingRef.current = false;
				setIsSpeaking(false);
				options.onEnd && options.onEnd();
			};

			utterance.onerror = (error: any) => {
				isSpeakingRef.current = false;
				setIsSpeaking(false);
				console.error('语音播报错误:', error);
				options.onError && options.onError(error);
			};

			synthRef.current.speak(utterance);
			return true;
		};

		// 处理新报警消息
		const handleNewAlert = (alertData: Omit<AlertMessage, 'id' | 'timestamp'>) => {
			const alert: AlertMessage = {
				id: alertCounter + 1,
				message: alertData.message,
				type: alertData.type || 'info',
				timestamp: new Date(),
				priority: alertData.priority || 1
			};

			setAlertCounter(prev => prev + 1);

			// 添加到消息列表
			setRecentAlerts(prev => {
				const newAlerts = [alert, ...prev];
				// 限制消息数量
				return newAlerts.slice(0, maxAlerts);
			});

			// 自动播报
			if (autoSpeak && isSupported) {
				speakAlert(alert);
			}
		};

		// 播报警报消息
		const speakAlert = (alert: AlertMessage) => {
			const message = formatAlertMessage(alert);

			speakMessage(message, {
				volume,
				rate,
				pitch,
				voice: selectedVoice,
				onStart: () => {
					setIsSpeaking(true);
				},
				onEnd: () => {
					setIsSpeaking(false);
				},
				onError: (error: any) => {
					setIsSpeaking(false);
					console.error('语音播报失败:', error);
				}
			});
		};

		// 格式化报警消息
		const formatAlertMessage = (alert: AlertMessage) => {
			const prefixes = {
				error: '紧急报警：',
				warning: '警告：',
				info: '通知：',
				success: '正常：'
			};

			const prefix = prefixes[alert.type] || '';
			return prefix + alert.message;
		};

		// 停止播报
		const stopSpeaking = () => {
			if (isSpeakingRef.current && synthRef.current) {
				synthRef.current.cancel();
				isSpeakingRef.current = false;
				setIsSpeaking(false);
			}
		};

		// 移除报警消息
		const removeAlert = (alertId: number) => {
			setRecentAlerts(prev => prev.filter(alert => alert.id !== alertId));
		};

		// 清空所有消息
		const clearAlerts = () => {
			setRecentAlerts([]);
		};

		// 切换控制面板显示
		const toggleControl = () => {
			setShowControl(!showControl);
		};

		// 测试语音
		const testVoice = () => {
			handleNewAlert({
				message: '这是一条测试语音消息，当前语音设置正常。',
				type: 'info',
				priority: 1
			});
		};

		// 格式化时间
		const formatTime = (timestamp: Date) => {
			return timestamp.toLocaleTimeString('zh-CN', {
				hour12: false,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
		};

		return (
			<div className="voice-alert">
				{/* 语音控制面板 */}
				{showControl && (
					<div className="voice-control-panel">
						<div className="control-item">
							<label>音量:</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={volume}
								onChange={e => setVolume(parseFloat(e.target.value))}
							/>
							<span>{(volume * 100).toFixed(0)}%</span>
						</div>

						<div className="control-item">
							<label>语速:</label>
							<input
								type="range"
								min="0.1"
								max="2"
								step="0.1"
								value={rate}
								onChange={e => setRate(parseFloat(e.target.value))}
							/>
							<span>{rate}</span>
						</div>

						<div className="control-item">
							<label>音调:</label>
							<input
								type="range"
								min="0.1"
								max="2"
								step="0.1"
								value={pitch}
								onChange={e => setPitch(parseFloat(e.target.value))}
							/>
							<span>{pitch}</span>
						</div>

						<div className="control-item">
							<label>语音:</label>
							<select
								value={selectedVoice?.name || ''}
								onChange={e => {
									const voice = availableVoices.find(v => v.name === e.target.value);
									setSelectedVoice(voice || null);
								}}
							>
								{availableVoices.map(voice => (
									<option key={voice.name} value={voice.name}>
										{voice.name} ({voice.lang})
									</option>
								))}
							</select>
						</div>
					</div>
				)}

				{/* 报警消息列表 */}
				<div className="alert-list">
					{recentAlerts.map(alert => (
						<div key={alert.id} className={`alert-item ${alert.type}`}>
							<div className="alert-content">
								<span className="alert-time">{formatTime(alert.timestamp)}</span>
								<span className="alert-message">{alert.message}</span>
							</div>
							<div className="alert-actions">
								<button onClick={() => speakAlert(alert)}>🔊</button>
								<button onClick={() => removeAlert(alert.id)}>×</button>
							</div>
						</div>
					))}
				</div>

				{/* 控制按钮 */}
				<div className="control-buttons">
					<button onClick={toggleControl}>{showControl ? '隐藏设置' : '语音设置'}</button>
					<button onClick={stopSpeaking} disabled={!isSpeaking}>
						停止播报
					</button>
					<button onClick={clearAlerts}>清空消息</button>
					<button onClick={testVoice}>测试语音</button>
				</div>

				{/* 浏览器支持提示 */}
				{!isSupported && (
					<div className="browser-warning">
						⚠️ 您的浏览器不支持语音合成功能，请使用Chrome、Edge等现代浏览器
					</div>
				)}
			</div>
		);
	}
);

export default VoiceAlert;
