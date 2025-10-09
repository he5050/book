import React, { useState, useEffect, useRef } from 'react';
import AudioProcessor from '../../../lib/Audio';
import './index.scss';

// Helper to format time
const formatTime = (time: number): string => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Helper to format bytes with dynamic units
const formatBytes = (bytes: number): string => {
	if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;
	let val = bytes;
	while (val >= 1024 && i < units.length - 1) {
		val = val / 1024;
		i++;
	}
	const fixed = i === 0 ? 0 : 2; // 字节不保留小数，其他保留两位
	return `${val.toFixed(fixed)} ${units[i]}`;
};

const AudioProcessorDemo: React.FC = () => {
	const audioProcessorRef = useRef<AudioProcessor | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number>(0);

	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPlayPaused, setIsPlayPaused] = useState(false);
	const [recordTime, setRecordTime] = useState(0);
	const [playTime, setPlayTime] = useState(0);
	const [sampleRate, setSampleRate] = useState(16000);
	const [sampleBits, setSampleBits] = useState(16);
	const [numChannels, setNumChannels] = useState('单');
	const [recordSize, setRecordSize] = useState(0);
	const [volumePercentage, setVolumePercentage] = useState(0);
	const [isEdgeConvert, setIsEdgeConvert] = useState(false); // 新增：边录边转开关

	// Initialize AudioProcessor with new state values
	useEffect(() => {
		audioProcessorRef.current = new AudioProcessor({
			sampleBits,
			sampleRate,
			numChannels: numChannels === '单' ? 1 : 2
		});

		const processor = audioProcessorRef.current;

		// --- Event Listeners ---
		processor.onStart = () => {
			setIsRecording(true);
			setIsPaused(false);
			console.log('录音开始');
			drawWave();
		};
		processor.onStop = () => {
			setIsRecording(false);
			setIsPaused(false);
			cancelAnimationFrame(animationFrameRef.current);
			console.log('录音结束');
		};
		processor.onPause = () => {
			setIsPaused(true);
			cancelAnimationFrame(animationFrameRef.current);
			console.log('录音暂停');
		};
		processor.onResume = () => {
			setIsPaused(false);
			drawWave();
			console.log('录音恢复');
		};
		processor.onPlay = () => {
			setIsPlaying(true);
			setIsPlayPaused(false);
			drawWave();
			console.log('播放开始');
		};
		processor.onPlayEnd = () => {
			setIsPlaying(false);
			setIsPlayPaused(false);
			cancelAnimationFrame(animationFrameRef.current);
			console.log('播放结束');
		};
		processor.onPausePlay = () => {
			setIsPlayPaused(true);
			cancelAnimationFrame(animationFrameRef.current);
			console.log('播放暂停');
		};
		processor.onResumePlay = () => {
			setIsPlayPaused(false);
			drawWave();
			console.log('播放恢复');
		};
		processor.onStopPlay = () => {
			setIsPlaying(false);
			setIsPlayPaused(false);
			cancelAnimationFrame(animationFrameRef.current);
			console.log('播放停止');
		};

		// --- Time Updaters ---
		const recordTimer = setInterval(() => {
			if (processor.isRecording) {
				setRecordTime(processor.getDuration());
			}
		}, 1000);

		const playTimer = setInterval(() => {
			if (isPlaying) {
				setPlayTime(processor.getPlayTime());
			}
		}, 1000);

		return () => {
			clearInterval(recordTimer);
			clearInterval(playTimer);
			processor.destroy();
			cancelAnimationFrame(animationFrameRef.current);
		};
	}, [sampleBits, sampleRate, numChannels]);

	// Update record size and volume percentage
	useEffect(() => {
		const updateStats = () => {
			if (audioProcessorRef.current) {
				setRecordSize(audioProcessorRef.current.getRecordingSize());
				setVolumePercentage(audioProcessorRef.current.getVolumePercentage());
			}
		};
		const intervalId = setInterval(updateStats, 1000);
		return () => clearInterval(intervalId);
	}, []);

	// Reset configuration handler
	const handleResetConfig = () => {
		setSampleRate(16000);
		setSampleBits(16);
		setNumChannels('单');
		setIsRecording(false);
		setIsPaused(false);
		setIsPlaying(false);
		setIsPlayPaused(false);
		setRecordTime(0);
		setPlayTime(0);
		setRecordSize(0);
		setVolumePercentage(0);
		setIsEdgeConvert(false); // 重置边录边转状态
		audioProcessorRef.current?.reset();
	};

	const drawWave = () => {
		const processor = audioProcessorRef.current;
		const canvas = canvasRef.current;
		if (!processor || !canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const draw = () => {
			let dataArray: Uint8Array;
			if (isRecording || isPaused) {
				dataArray = processor.getRecordingAnalysisData().timeDomainData;
			} else if (isPlaying || isPlayPaused) {
				dataArray = processor.getPlaybackAnalysisData().timeDomainData;
			} else {
				// Clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				return;
			}

			const bufferLength = dataArray.length;
			ctx.fillStyle = '#1a1a1a';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#4a90e2';
			ctx.beginPath();

			const sliceWidth = (canvas.width * 1.0) / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;
				const y = (v * canvas.height) / 2;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
				x += sliceWidth;
			}

			ctx.lineTo(canvas.width, canvas.height / 2);
			ctx.stroke();

			animationFrameRef.current = requestAnimationFrame(draw);
		};

		draw();
	};

	// --- Handlers ---
	const handleStart = () => {
		if (isEdgeConvert) {
			audioProcessorRef.current?.startWithConvert().catch(err => console.error(err));
		} else {
			audioProcessorRef.current?.start().catch(err => console.error(err));
		}
	};
	const handlePause = () => audioProcessorRef.current?.pause();
	const handleResume = () => audioProcessorRef.current?.resume();
	const handleStop = () => audioProcessorRef.current?.stop();

	const handlePlay = () => {
		setPlayTime(0);
		audioProcessorRef.current?.play();
	};
	const handlePausePlay = () => audioProcessorRef.current?.pausePlay();
	const handleResumePlay = () => audioProcessorRef.current?.resumePlay();
	const handleStopPlay = () => audioProcessorRef.current?.stopPlay();

	const handleDownloadWAV = () => audioProcessorRef.current?.downloadWAV('recording.wav');
	const handleDownloadPCM = () => audioProcessorRef.current?.downloadPCM('recording.pcm');

	// 新增：处理外部音频上传
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const arrayBuffer = event.target?.result as ArrayBuffer;
			audioProcessorRef.current?.play(arrayBuffer).catch(err => console.error(err));
		};
		reader.readAsArrayBuffer(file);
	};

	const hasRecording = recordTime > 0;

	return (
		<div className="audio-processor-demo">
			<h2>AudioProcessor 示例</h2>
			<div className="card">
				{/* Configuration */}
				<div className="configuration">
					<label htmlFor="sample-rate">采样率:</label>
					<select id="sample-rate" value={sampleRate} onChange={(e) => setSampleRate(Number(e.target.value))}>
						<option value="8000">8000</option>
						<option value="16000">16000</option>
						<option value="44100">44100</option>
					</select>
					<label htmlFor="sample-bits">采样位数:</label>
					<select id="sample-bits" value={sampleBits} onChange={(e) => setSampleBits(Number(e.target.value))}>
						<option value="8">8</option>
						<option value="16">16</option>
					</select>
					<label htmlFor="channels">声道数:</label>
					<select id="channels" value={numChannels} onChange={(e) => setNumChannels(e.target.value)}>
						<option value="单">单</option>
						<option value="双">双</option>
					</select>
					<div className="edge-convert-toggle">
						<input
							type="checkbox"
							id="edge-convert"
							checked={isEdgeConvert}
							onChange={() => setIsEdgeConvert(!isEdgeConvert)}
						/>
						<label htmlFor="edge-convert">边录边转(播)</label>
					</div>
					<button onClick={handleResetConfig}>重置配置</button>
				</div>

				{/* Controls */}
				<div className="controls">
					<div className="control-group">
						<h4>录音控制</h4>
						{!isRecording && !isPaused && <button onClick={handleStart}>录音开启</button>}
						{isRecording && !isPaused && <button onClick={handlePause}>暂停</button>}
						{isPaused && <button onClick={handleResume}>恢复</button>}
						{(isRecording || isPaused) && (
							<button onClick={handleStop} className="stop">
								录音停止
							</button>
						)}
					</div>
					<div className="control-group">
						<h4>播放控制</h4>
						{hasRecording && !isPlaying && !isPlayPaused && (
							<button onClick={handlePlay}>播放</button>
						)}
						{isPlaying && !isPlayPaused && <button onClick={handlePausePlay}>暂停播放</button>}
						{isPlayPaused && <button onClick={handleResumePlay}>恢复播放</button>}
						{(isPlaying || isPlayPaused) && (
							<button onClick={handleStopPlay} className="stop">
								停止播放
							</button>
						)}
					</div>
				</div>

				{/* Display Information */}
				<div className="display-info">
					<div>
						<span>{Number.isFinite(recordTime) ? recordTime.toFixed(2) : "0.00"}</span>
						<p>录音时长(秒)</p>
					</div>
					<div>
						<span>{Number.isFinite(playTime) ? playTime.toFixed(2) : "0.00"}</span>
						<p>播放时长(秒)</p>
					</div>
					<div>
						<span>{formatBytes(recordSize)}</span>
						<p>录音大小</p>
					</div>
					<div>
						<span>{`${Number.isFinite(volumePercentage) ? volumePercentage.toFixed(2) : "0.00"}%`}</span>
						<p>当前录音音量百分比(%)</p>
					</div>
				</div>

				{/* Downloads */}
				<div className="downloads">
					<h4>下载</h4>
					<button onClick={handleDownloadPCM}>下载PCM</button>
					<button onClick={handleDownloadWAV}>下载WAV</button>
				</div>

				{/* Other Audio Formats */}
				<div className="other-formats">
					<h4>其他音频格式</h4>
					<button onClick={() => console.log('播放MP3')}>播放MP3</button>
					<button onClick={() => console.log('下载MP3')}>下载MP3</button>
				</div>

				{/* Play External Audio */}
				<div className="external-audio">
					<h4>播放外部音频</h4>
					<input type="file" accept="audio/*" onChange={handleFileChange} />
				</div>
			</div>
		</div>
	);
};

export default AudioProcessorDemo;
