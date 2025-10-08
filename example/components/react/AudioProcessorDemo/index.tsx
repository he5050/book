import React, { useState, useEffect, useRef } from 'react';
import AudioProcessor from '../../../lib/Audio';
import './index.scss';

// Helper to format time
const formatTime = (time: number): string => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

	// Initialize AudioProcessor
	useEffect(() => {
		audioProcessorRef.current = new AudioProcessor({
			sampleBits: 16,
			sampleRate: 16000,
			numChannels: 1
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
	}, [isPlaying]);

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
	const handleStart = () => audioProcessorRef.current?.start().catch(err => console.error(err));
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

	const hasRecording = recordTime > 0;

	return (
		<div className="audio-processor-demo">
			<h2>AudioProcessor 示例</h2>
			<div className="card">
				<canvas ref={canvasRef} width="500" height="100"></canvas>
				<div className="time-display">
					<span>录制时长: {formatTime(recordTime)}</span>
					<span>播放时长: {formatTime(playTime)}</span>
				</div>
				<div className="controls">
					<div className="control-group">
						<h4>录音控制</h4>
						{!isRecording && !isPaused && <button onClick={handleStart}>录音</button>}
						{isRecording && !isPaused && <button onClick={handlePause}>暂停</button>}
						{isPaused && <button onClick={handleResume}>恢复</button>}
						{(isRecording || isPaused) && (
							<button onClick={handleStop} className="stop">
								停止
							</button>
						)}
					</div>
					<div className="control-group">
						<h4>播放控制</h4>
						{hasRecording && !isPlaying && !isPlayPaused && (
							<button onClick={handlePlay}>播放</button>
						)}
						{isPlaying && !isPlayPaused && <button onClick={handlePausePlay}>暂停</button>}
						{isPlayPaused && <button onClick={handleResumePlay}>恢复</button>}
						{(isPlaying || isPlayPaused) && (
							<button onClick={handleStopPlay} className="stop">
								停止
							</button>
						)}
					</div>
				</div>
				{hasRecording && !isRecording && (
					<div className="downloads">
						<h4>下载</h4>
						<button onClick={handleDownloadWAV}>下载 WAV</button>
						<button onClick={handleDownloadPCM}>下载 PCM</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AudioProcessorDemo;
