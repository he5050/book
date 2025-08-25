import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import {
	PlayCircleOutlined,
	PauseCircleOutlined,
	StopOutlined,
	StepBackwardOutlined,
	StepForwardOutlined,
	SoundOutlined,
	ReloadOutlined,
	CustomerServiceOutlined,
	MutedOutlined,
	LoadingOutlined,
	UnorderedListOutlined,
	SettingOutlined
} from '@ant-design/icons';
import './index.scss';

/**
 * 音频文件接口定义
 */
interface AudioTrack {
	id: number;
	title: string;
	artist: string;
	src: string;
	duration?: number;
}

/**
 * 播放状态枚举
 */
enum PlayState {
	STOPPED = 'stopped',
	PLAYING = 'playing',
	PAUSED = 'paused',
	LOADING = 'loading'
}

/**
 * 音效按钮组件
 */
const SoundEffectButton: React.FC<{
	label: string;
	src: string;
	volume?: number;
}> = ({ label, src, volume = 0.5 }) => {
	const soundRef = useRef<Howl | null>(null);

	useEffect(() => {
		soundRef.current = new Howl({
			src: [src],
			volume: volume,
			preload: true
		});

		return () => {
			soundRef.current?.unload();
		};
	}, [src, volume]);

	const playSound = () => {
		soundRef.current?.play();
	};

	return (
		<button className="sound-effect-btn" onClick={playSound}>
			<SoundOutlined /> {label}
		</button>
	);
};

/**
 * 基础音频播放器组件
 */
const BasicPlayer: React.FC<{ track: AudioTrack }> = ({ track }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.8);
	const howlRef = useRef<Howl | null>(null);

	useEffect(() => {
		howlRef.current = new Howl({
			src: [track.src],
			volume: volume,
			onplay: () => setIsPlaying(true),
			onpause: () => setIsPlaying(false),
			onend: () => setIsPlaying(false)
		});

		return () => {
			howlRef.current?.unload();
		};
	}, [track.src, volume]);

	const togglePlay = () => {
		if (isPlaying) {
			howlRef.current?.pause();
		} else {
			howlRef.current?.play();
		}
	};

	return (
		<div className="basic-player">
			<h4>{track.title}</h4>
			<div className="basic-controls">
				<button className="control-btn" onClick={togglePlay}>
					{isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
				</button>
				<div className="volume-control">
					<SoundOutlined />
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={volume}
						onChange={e => setVolume(Number(e.target.value))}
					/>
				</div>
			</div>
		</div>
	);
};

/**
 * Howler.js React 综合示例组件
 */
const HowlerDemo: React.FC = () => {
	// 主播放器状态
	const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
	const [playState, setPlayState] = useState<PlayState>(PlayState.STOPPED);
	const [volume, setVolume] = useState<number>(0.8);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [isLooping, setIsLooping] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [playbackRate, setPlaybackRate] = useState<number>(1);

	// 引用
	const howlRef = useRef<Howl | null>(null);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | null>(null);

	// 示例音频列表
	const playlist: AudioTrack[] = [
		{
			id: 1,
			title: '示例音频 1',
			artist: '演示艺术家',
			src: 'https://www.w3schools.com/html/horse.ogg'
		},
		{
			id: 2,
			title: '示例音频 2',
			artist: '演示艺术家',
			src: 'https://www.w3schools.com/html/horse.mp3'
		}
	];

	// 音效列表
	const soundEffects = [
		{ id: 1, name: '按钮点击', src: 'https://www.w3schools.com/html/horse.ogg' },
		{ id: 2, name: '错误提示', src: 'https://www.w3schools.com/html/horse.mp3' },
		{ id: 3, name: '成功提示', src: 'https://www.w3schools.com/html/horse.ogg' }
	];

	/**
	 * 创建新的 Howl 实例
	 */
	const createHowl = useCallback(
		(track: AudioTrack): Howl => {
			return new Howl({
				src: [track.src],
				html5: true,
				volume: volume,
				loop: isLooping,
				rate: playbackRate,
				onload: () => {
					setPlayState(PlayState.STOPPED);
					setDuration(howlRef.current?.duration() || 0);
				},
				onplay: () => {
					setPlayState(PlayState.PLAYING);
					startProgressTracking();
					startVisualization();
				},
				onpause: () => {
					setPlayState(PlayState.PAUSED);
					stopProgressTracking();
					stopVisualization();
				},
				onend: () => {
					setPlayState(PlayState.STOPPED);
					setCurrentTime(0);
					stopProgressTracking();
					stopVisualization();
				},
				onloaderror: () => {
					console.error('音频加载失败');
					setPlayState(PlayState.STOPPED);
				},
				onplayerror: () => {
					console.error('音频播放失败');
					setPlayState(PlayState.STOPPED);
				}
			});
		},
		[volume, isLooping, playbackRate]
	);

	/**
	 * 开始进度跟踪
	 */
	const startProgressTracking = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
		}

		progressIntervalRef.current = setInterval(() => {
			if (howlRef.current && playState === PlayState.PLAYING) {
				setCurrentTime(howlRef.current.seek() as number);
			}
		}, 100);
	}, [playState]);

	/**
	 * 停止进度跟踪
	 */
	const stopProgressTracking = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
			progressIntervalRef.current = null;
		}
	}, []);

	/**
	 * 开始可视化动画
	 */
	const startVisualization = useCallback(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const draw = () => {
			if (playState !== PlayState.PLAYING) return;

			ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// 模拟音频波形
			const time = Date.now() * 0.002;
			const barCount = 32;
			const barWidth = canvas.width / barCount;

			for (let i = 0; i < barCount; i++) {
				const barHeight = Math.sin(time + i * 0.5) * 50 + 60;
				const x = i * barWidth;

				ctx.fillStyle = `hsl(${200 + i * 5}, 70%, 60%)`;
				ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
			}

			animationRef.current = requestAnimationFrame(draw);
		};

		draw();
	}, [playState]);

	/**
	 * 停止可视化动画
	 */
	const stopVisualization = useCallback(() => {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
	}, []);

	/**
	 * 加载音频轨道
	 */
	const loadTrack = useCallback(
		(track: AudioTrack) => {
			// 停止当前播放
			if (howlRef.current) {
				howlRef.current.stop();
				howlRef.current.unload();
			}

			setPlayState(PlayState.LOADING);
			setCurrentTrack(track);
			setCurrentTime(0);
			setDuration(0);

			// 创建新的 Howl 实例
			howlRef.current = createHowl(track);
		},
		[createHowl]
	);

	/**
	 * 播放/暂停切换
	 */
	const togglePlay = useCallback(() => {
		if (!howlRef.current || !currentTrack) return;

		if (playState === PlayState.PLAYING) {
			howlRef.current.pause();
		} else {
			howlRef.current.play();
		}
	}, [playState, currentTrack]);

	/**
	 * 停止播放
	 */
	const stop = useCallback(() => {
		if (!howlRef.current) return;

		howlRef.current.stop();
		setCurrentTime(0);
	}, []);

	/**
	 * 播放下一首
	 */
	const playNext = useCallback(() => {
		if (!currentTrack) return;

		const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
		const nextIndex = (currentIndex + 1) % playlist.length;
		loadTrack(playlist[nextIndex]);
	}, [currentTrack, loadTrack, playlist]);

	/**
	 * 播放上一首
	 */
	const playPrevious = useCallback(() => {
		if (!currentTrack) return;

		const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
		const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
		loadTrack(playlist[prevIndex]);
	}, [currentTrack, loadTrack, playlist]);

	/**
	 * 设置播放位置
	 */
	const seek = useCallback((time: number) => {
		if (!howlRef.current) return;

		howlRef.current.seek(time);
		setCurrentTime(time);
	}, []);

	/**
	 * 音量控制
	 */
	const handleVolumeChange = useCallback((newVolume: number) => {
		setVolume(newVolume);
		if (howlRef.current) {
			howlRef.current.volume(newVolume);
		}
		Howler.volume(newVolume);
	}, []);

	/**
	 * 静音切换
	 */
	const toggleMute = useCallback(() => {
		const newMutedState = !isMuted;
		setIsMuted(newMutedState);
		if (howlRef.current) {
			howlRef.current.mute(newMutedState);
		}
	}, [isMuted]);

	/**
	 * 播放速度控制
	 */
	const handleRateChange = useCallback((rate: number) => {
		setPlaybackRate(rate);
		if (howlRef.current) {
			howlRef.current.rate(rate);
		}
	}, []);

	/**
	 * 循环模式切换
	 */
	const toggleLoop = useCallback(() => {
		const newLoopState = !isLooping;
		setIsLooping(newLoopState);
		if (howlRef.current) {
			howlRef.current.loop(newLoopState);
		}
	}, [isLooping]);

	/**
	 * 淡入淡出效果
	 */
	const fadeIn = useCallback(
		(duration: number = 1000) => {
			if (!howlRef.current) return;

			howlRef.current.fade(0, volume, duration);
		},
		[volume]
	);

	const fadeOut = useCallback(
		(duration: number = 1000) => {
			if (!howlRef.current) return;

			howlRef.current.fade(volume, 0, duration);
		},
		[volume]
	);

	/**
	 * 格式化时间显示
	 */
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	// 组件挂载时加载第一首歌
	useEffect(() => {
		if (playlist.length > 0) {
			loadTrack(playlist[0]);
		}

		// 清理函数
		return () => {
			if (howlRef.current) {
				howlRef.current.unload();
			}
			stopProgressTracking();
			stopVisualization();
		};
	}, [loadTrack, stopProgressTracking, stopVisualization, playlist]);

	return (
		<div className="howler-demo">
			<h1>
				<CustomerServiceOutlined /> Howler.js React 综合示例
			</h1>

			{/* 基础播放器示例 */}
			<section className="demo-section">
				<h2>
					<PlayCircleOutlined /> 基础音频播放器
				</h2>
				<div className="basic-players">
					{playlist.map(track => (
						<BasicPlayer key={track.id} track={track} />
					))}
				</div>
			</section>

			{/* 音效播放器 */}
			<section className="demo-section">
				<h2>
					<SoundOutlined /> 音效播放器
				</h2>
				<div className="sound-effects">
					{soundEffects.map(effect => (
						<SoundEffectButton key={effect.id} label={effect.name} src={effect.src} />
					))}
				</div>
			</section>

			{/* 高级播放器 */}
			<section className="demo-section">
				<h2>
					<SettingOutlined /> 高级音频播放器
				</h2>
				<div className="advanced-player">
					{/* 当前播放信息 */}
					<div className="track-info">
						<div className="track-title">{currentTrack?.title || '未选择音频'}</div>
						<div className="track-artist">{currentTrack?.artist || ''}</div>
					</div>

					{/* 音频可视化 */}
					<div className="visualization-container">
						<canvas ref={canvasRef} width="400" height="150" className="audio-visualizer" />
					</div>

					{/* 进度条 */}
					<div className="progress-container">
						<span className="time-display">{formatTime(currentTime)}</span>
						<div className="progress-bar">
							<input
								type="range"
								min="0"
								max={duration || 100}
								value={currentTime}
								onChange={e => seek(Number(e.target.value))}
								className="progress-slider"
							/>
						</div>
						<span className="time-display">{formatTime(duration)}</span>
					</div>

					{/* 播放控制 */}
					<div className="controls">
						<button onClick={playPrevious} className="control-btn">
							<StepBackwardOutlined />
						</button>
						<button
							onClick={togglePlay}
							className="control-btn play-btn"
							disabled={playState === PlayState.LOADING}
						>
							{playState === PlayState.LOADING ? (
								<LoadingOutlined spin />
							) : playState === PlayState.PLAYING ? (
								<PauseCircleOutlined />
							) : (
								<PlayCircleOutlined />
							)}
						</button>
						<button onClick={stop} className="control-btn">
							<StopOutlined />
						</button>
						<button onClick={playNext} className="control-btn">
							<StepForwardOutlined />
						</button>
						<button onClick={toggleLoop} className={`control-btn ${isLooping ? 'active' : ''}`}>
							<ReloadOutlined />
						</button>
					</div>

					{/* 高级控制 */}
					<div className="advanced-controls">
						{/* 音量控制 */}
						<div className="control-group">
							<label>音量控制</label>
							<div className="volume-container">
								<button onClick={toggleMute} className="control-btn">
									{isMuted ? <MutedOutlined /> : <SoundOutlined />}
								</button>
								<input
									type="range"
									min="0"
									max="1"
									step="0.1"
									value={volume}
									onChange={e => handleVolumeChange(Number(e.target.value))}
									className="volume-slider"
								/>
							</div>
						</div>

						{/* 播放速度控制 */}
						<div className="control-group">
							<label>播放速度: {playbackRate}x</label>
							<input
								type="range"
								min="0.5"
								max="2"
								step="0.1"
								value={playbackRate}
								onChange={e => handleRateChange(Number(e.target.value))}
								className="rate-slider"
							/>
						</div>

						{/* 淡入淡出控制 */}
						<div className="control-group">
							<label>淡入淡出效果</label>
							<div className="fade-controls">
								<button onClick={() => fadeIn(2000)} className="control-btn">
									淡入
								</button>
								<button onClick={() => fadeOut(2000)} className="control-btn">
									淡出
								</button>
							</div>
						</div>
					</div>

					{/* 播放状态指示 */}
					<div className="status-indicator">
						状态: <span className={`status ${playState}`}>{playState}</span>
					</div>
				</div>
			</section>

			{/* 播放列表 */}
			<section className="demo-section">
				<h2>
					<UnorderedListOutlined /> 播放列表
				</h2>
				<div className="playlist">
					{playlist.map(track => (
						<div
							key={track.id}
							className={`playlist-item ${currentTrack?.id === track.id ? 'active' : ''}`}
							onClick={() => loadTrack(track)}
						>
							<div className="track-info">
								<div className="track-title">{track.title}</div>
								<div className="track-artist">{track.artist}</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default HowlerDemo;
