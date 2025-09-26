import React, { useState, useRef, useEffect } from 'react';
import useTextToSpeech, { Voice } from './hooks/useTextToSpeech';
import useSpeechToText from './hooks/useSpeechToText';
import useMediaRecorder from './hooks/useMediaRecorder';
import './speech-media.scss';

const SpeechMediaExample: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'tts' | 'stt' | 'recorder'>('tts');

	// TTS相关状态
	const [ttsText, setTtsText] = useState(
		'欢迎使用语音功能集成示例！这个示例展示了文字转语音、语音转文字和媒体录制功能。'
	);
	const [ttsRate, setTtsRate] = useState(1);
	const [ttsPitch, setTtsPitch] = useState(1);
	const [ttsVolume, setTtsVolume] = useState(1);

	const {
		voices,
		isSpeaking,
		isPaused,
		speak: ttsSpeak,
		pause: ttsPause,
		resume: ttsResume,
		stop: ttsStop,
		setVoice: ttsSetVoice,
		status: ttsStatus
	} = useTextToSpeech();

	// STT相关状态
	const {
		isListening,
		transcript: sttTranscript,
		interimTranscript: sttInterimTranscript,
		isSupported: sttIsSupported,
		startListening: sttStartListening,
		stopListening: sttStopListening,
		resetTranscript: sttResetTranscript,
		error: sttError
	} = useSpeechToText();

	// MediaRecorder相关状态 - 分别管理音频和视频
	const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio');
	const {
		isRecording: isAudioRecording,
		mediaBlob: audioBlob,
		mediaStream: audioStream,
		startRecording: startAudioRecording,
		stopRecording: stopAudioRecording,
		resetRecording: resetAudioRecording,
		error: audioError,
		isSupported: audioIsSupported
	} = useMediaRecorder('audio');

	const {
		isRecording: isVideoRecording,
		mediaBlob: videoBlob,
		mediaStream: videoStream,
		startRecording: startVideoRecording,
		stopRecording: stopVideoRecording,
		resetRecording: resetVideoRecording,
		error: videoError,
		isSupported: videoIsSupported
	} = useMediaRecorder('video');

	// 分别管理音频和视频的录制状态
	const isRecording = mediaType === 'audio' ? isAudioRecording : isVideoRecording;
	const mediaBlob = mediaType === 'audio' ? audioBlob : videoBlob;
	const mediaError = mediaType === 'audio' ? audioError : videoError;
	const mediaIsSupported = mediaType === 'audio' ? audioIsSupported : videoIsSupported;

	const handleTtsSpeak = () => {
		ttsSpeak(ttsText, { rate: ttsRate, pitch: ttsPitch, volume: ttsVolume });
	};

	const handleMediaStartRecording = async () => {
		try {
			if (mediaType === 'audio') {
				await startAudioRecording();
			} else {
				await startVideoRecording();
			}
		} catch (err) {
			console.error('开始录制失败:', err);
		}
	};

	const handleMediaStopRecording = () => {
		if (mediaType === 'audio') {
			stopAudioRecording();
		} else {
			stopVideoRecording();
		}
	};

	const handleMediaResetRecording = () => {
		if (mediaType === 'audio') {
			resetAudioRecording();
		} else {
			resetVideoRecording();
		}
	};

	const downloadMedia = () => {
		if (!mediaBlob) return;

		const url = URL.createObjectURL(mediaBlob);
		const a = document.createElement('a');
		a.href = url;
		a.download = mediaType === 'audio' ? 'recording.webm' : 'recording.webm';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// 实时预览引用
	const audioPreviewRef = useRef<HTMLAudioElement>(null);
	const videoPreviewRef = useRef<HTMLVideoElement>(null);

	// 设置实时预览
	useEffect(() => {
		if (audioPreviewRef.current && audioStream) {
			audioPreviewRef.current.srcObject = audioStream;
		}

		return () => {
			if (audioPreviewRef.current) {
				audioPreviewRef.current.srcObject = null;
			}
		};
	}, [audioStream]);

	useEffect(() => {
		if (videoPreviewRef.current && videoStream) {
			videoPreviewRef.current.srcObject = videoStream;
		}

		return () => {
			if (videoPreviewRef.current) {
				videoPreviewRef.current.srcObject = null;
			}
		};
	}, [videoStream]);

	return (
		<div className="speech-media-container">
			<h1>语音功能集成示例</h1>
			<p className="description">集成文字转语音、语音转文字和媒体录制功能</p>

			{/* 标签页导航 */}
			<div className="tab-navigation">
				<button className={activeTab === 'tts' ? 'active' : ''} onClick={() => setActiveTab('tts')}>
					文字转语音
				</button>
				<button
					className={activeTab === 'stt' ? 'active' : ''}
					onClick={() => setActiveTab('stt')}
					disabled={!sttIsSupported}
				>
					语音转文字
				</button>
				<button
					className={activeTab === 'recorder' ? 'active' : ''}
					onClick={() => setActiveTab('recorder')}
					disabled={!mediaIsSupported}
				>
					媒体录制
				</button>
			</div>

			{/* 文字转语音模块 */}
			{activeTab === 'tts' && (
				<div className="tab-content tts-tab">
					<h2>文字转语音 (TTS)</h2>

					<div className="input-section">
						<textarea
							value={ttsText}
							onChange={e => setTtsText(e.target.value)}
							placeholder="请输入要转换为语音的文字..."
						/>
					</div>

					<div className="controls">
						<div className="control-group">
							<label htmlFor="rate">语速: {ttsRate}</label>
							<input
								type="range"
								id="rate"
								min="0.5"
								max="2"
								step="0.1"
								value={ttsRate}
								onChange={e => setTtsRate(parseFloat(e.target.value))}
							/>
							<div className="value-display">慢 ← → 快</div>
						</div>

						<div className="control-group">
							<label htmlFor="pitch">音调: {ttsPitch}</label>
							<input
								type="range"
								id="pitch"
								min="0.5"
								max="2"
								step="0.1"
								value={ttsPitch}
								onChange={e => setTtsPitch(parseFloat(e.target.value))}
							/>
							<div className="value-display">低 ← → 高</div>
						</div>

						<div className="control-group">
							<label htmlFor="volume">音量: {ttsVolume}</label>
							<input
								type="range"
								id="volume"
								min="0"
								max="1"
								step="0.1"
								value={ttsVolume}
								onChange={e => setTtsVolume(parseFloat(e.target.value))}
							/>
							<div className="value-display">小 ← → 大</div>
						</div>

						<div className="control-group">
							<label htmlFor="voice">声音</label>
							<select
								id="voice"
								onChange={e => ttsSetVoice(parseInt(e.target.value))}
								disabled={voices.length === 0}
							>
								{voices.map((voice: Voice, index: number) => (
									<option key={index} value={index}>
										{voice.name} ({voice.lang})
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="button-group">
						<button className="btn-play" onClick={handleTtsSpeak} disabled={isSpeaking || !ttsText}>
							播放
						</button>
						<button className="btn-pause" onClick={ttsPause} disabled={!isSpeaking || isPaused}>
							暂停
						</button>
						<button className="btn-resume" onClick={ttsResume} disabled={!isPaused}>
							继续
						</button>
						<button className="btn-stop" onClick={ttsStop} disabled={!isSpeaking && !isPaused}>
							停止
						</button>
					</div>

					<div className={`status ${ttsStatus}`}>
						{ttsStatus === 'speaking' && '正在播放语音...'}
						{ttsStatus === 'paused' && '语音已暂停'}
						{ttsStatus === 'stopped' && '准备就绪'}
						{ttsStatus === 'idle' && '准备就绪'}
					</div>
				</div>
			)}

			{/* 语音转文字模块 */}
			{activeTab === 'stt' && sttIsSupported && (
				<div className="tab-content stt-tab">
					<h2>语音转文字 (STT)</h2>

					<div className="transcript-section">
						<div className="transcript-display">
							<div className="final-transcript">{sttTranscript}</div>
							<div className="interim-transcript">{sttInterimTranscript}</div>
						</div>
					</div>

					<div className="button-group">
						<button
							className={`btn-${isListening ? 'listening' : 'start'}`}
							onClick={sttStartListening}
							disabled={isListening}
						>
							{isListening ? '正在监听...' : '开始监听'}
						</button>
						<button className="btn-stop" onClick={sttStopListening} disabled={!isListening}>
							停止监听
						</button>
						<button
							className="btn-reset"
							onClick={sttResetTranscript}
							disabled={!sttTranscript && !sttInterimTranscript}
						>
							清空文本
						</button>
					</div>

					{sttError && <div className="error-message">错误: {sttError}</div>}

					<div className="status">状态: {isListening ? '正在监听...' : '已停止'}</div>
				</div>
			)}

			{!sttIsSupported && activeTab === 'stt' && (
				<div className="tab-content stt-tab">
					<h2>语音转文字 (STT)</h2>
					<div className="error-message">
						浏览器不支持语音识别功能，请使用Chrome、Edge等现代浏览器。
					</div>
				</div>
			)}

			{/* 媒体录制模块 */}
			{activeTab === 'recorder' && mediaIsSupported && (
				<div className="tab-content recorder-tab">
					<h2>媒体录制</h2>

					<div className="media-type-selector">
						<label>
							<input
								type="radio"
								value="audio"
								checked={mediaType === 'audio'}
								onChange={() => setMediaType('audio')}
							/>
							录音
						</label>
						<label>
							<input
								type="radio"
								value="video"
								checked={mediaType === 'video'}
								onChange={() => setMediaType('video')}
							/>
							录屏
						</label>
					</div>

					<div className="recording-controls">
						<button
							className={`btn-${isRecording ? 'recording' : 'start'}`}
							onClick={handleMediaStartRecording}
							disabled={isRecording}
						>
							{isRecording ? '录制中...' : '开始录制'}
						</button>
						<button className="btn-stop" onClick={handleMediaStopRecording} disabled={!isRecording}>
							停止录制
						</button>
						<button
							className="btn-reset"
							onClick={handleMediaResetRecording}
							disabled={isRecording}
						>
							重置
						</button>
					</div>

					{/* 实时预览 */}
					{isRecording && (
						<div className="live-preview">
							<h3>实时预览:</h3>
							{mediaType === 'audio' ? (
								<div className="audio-preview">
									<audio ref={audioPreviewRef} controls autoPlay />
									<div className="recording-indicator">正在录音...</div>
								</div>
							) : (
								<div className="video-preview">
									<video ref={videoPreviewRef} controls autoPlay muted width="100%" />
									<div className="recording-indicator">正在录屏...</div>
								</div>
							)}
						</div>
					)}

					{/* 录制结果 */}
					{mediaBlob && (
						<div className="media-preview">
							<h3>录制结果:</h3>
							{mediaType === 'audio' ? (
								<audio controls>
									<source src={URL.createObjectURL(mediaBlob)} type="audio/webm" />
									您的浏览器不支持音频播放。
								</audio>
							) : (
								<video controls width="100%">
									<source src={URL.createObjectURL(mediaBlob)} type="video/webm" />
									您的浏览器不支持视频播放。
								</video>
							)}
							<button className="btn-download" onClick={downloadMedia}>
								下载文件
							</button>
						</div>
					)}

					{mediaError && <div className="error-message">错误: {mediaError}</div>}

					<div className="status">
						状态: {isRecording ? '录制中...' : mediaBlob ? '录制完成' : '未开始'}
					</div>
				</div>
			)}

			{!mediaIsSupported && activeTab === 'recorder' && (
				<div className="tab-content recorder-tab">
					<h2>媒体录制</h2>
					<div className="error-message">
						浏览器不支持媒体录制功能，请使用Chrome、Edge等现代浏览器。
					</div>
				</div>
			)}

			<footer>
				<p>
					基于Web Speech API和MediaRecorder API的语音功能集成 | 浏览器兼容性: Chrome, Edge, Safari
				</p>
			</footer>
		</div>
	);
};

export default SpeechMediaExample;
