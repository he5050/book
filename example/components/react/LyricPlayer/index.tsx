import React, { useState, useEffect, useRef } from 'react';
import './lyric-player.scss';

// 歌词行接口
interface LyricLine {
	id: number;
	text: string;
	time?: number; // 时间戳（秒）
}

// 歌词播放器属性
interface LyricPlayerProps {
	title?: string;
	artist?: string;
	lyrics: LyricLine[];
	currentTime?: number;
	onTimeChange?: (time: number) => void;
	isPlaying?: boolean;
	onPlayToggle?: () => void;
}

const LyricPlayer: React.FC<LyricPlayerProps> = ({
	title = '歌曲标题',
	artist = '艺术家',
	lyrics = [],
	currentTime = 0,
	onTimeChange,
	isPlaying = false,
	onPlayToggle
}) => {
	const [currentActiveIndex, setCurrentActiveIndex] = useState<number>(-1);
	const lyricContainerRef = useRef<HTMLDivElement>(null);
	const lyricLineRefs = useRef<(HTMLDivElement | null)[]>([]);

	// 找到当前应该高亮的歌词行
	useEffect(() => {
		if (lyrics.length === 0) return;

		// 根据时间找到当前行
		let activeIndex = -1;
		for (let i = 0; i < lyrics.length; i++) {
			const lyricTime = lyrics[i].time;
			if (lyricTime !== undefined && lyricTime !== null && lyricTime <= currentTime) {
				activeIndex = i;
			} else {
				break;
			}
		}

		if (activeIndex !== currentActiveIndex) {
			setCurrentActiveIndex(activeIndex);

			// 滚动到高亮行
			if (activeIndex >= 0 && lyricLineRefs.current[activeIndex] && lyricContainerRef.current) {
				const container = lyricContainerRef.current;
				const line = lyricLineRefs.current[activeIndex];
				if (line) {
					// 使用scrollIntoView确保正确滚动
					line.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}
			}
		}
	}, [currentTime, lyrics, currentActiveIndex]);

	// 处理歌词行点击
	const handleLyricClick = (index: number) => {
		const lyricTime = lyrics[index].time;
		if (lyricTime !== undefined && lyricTime !== null && onTimeChange) {
			onTimeChange(lyricTime);
		}
	};

	// 切换播放状态
	const handlePlayToggle = () => {
		if (onPlayToggle) {
			onPlayToggle();
		}
	};

	// 上一首
	const handlePrev = () => {
		// 这里可以添加上一首的逻辑
		console.log('上一首');
	};

	// 下一首
	const handleNext = () => {
		// 这里可以添加下一首的逻辑
		console.log('下一首');
	};

	// 设置歌词行引用的辅助函数
	const setLyricLineRef = (index: number) => (el: HTMLDivElement | null) => {
		lyricLineRefs.current[index] = el;
	};

	// 计算进度条宽度
	const getProgressWidth = () => {
		if (lyrics.length === 0) return 0;
		const lastLyric = lyrics[lyrics.length - 1];
		const lastLyricTime = lastLyric.time;
		if (lastLyricTime === undefined || lastLyricTime === null) return 0;
		return Math.min((currentTime / lastLyricTime) * 100, 100); // 限制最大值为100%
	};

	return (
		<div className="lyric-player">
			{/* 头部信息 */}
			<div className="lyric-header">
				<div className="song-info">
					<h1 className="song-title">{title}</h1>
					<p className="song-artist">{artist}</p>
				</div>

				{/* 进度条 */}
				<div className="progress-container">
					<div className="progress-bar">
						<div className="progress" style={{ width: `${getProgressWidth()}%` }} />
					</div>
				</div>
			</div>

			{/* 歌词容器 */}
			<div className="lyric-container" ref={lyricContainerRef}>
				<div className="lyric-content">
					{lyrics.map((line, index) => (
						<div
							key={line.id}
							ref={setLyricLineRef(index)}
							className={`lyric-line ${index === currentActiveIndex ? 'active' : ''}`}
							onClick={() => handleLyricClick(index)}
						>
							{line.text}
						</div>
					))}
				</div>
			</div>

			{/* 控制器 */}
			<div className="lyric-footer">
				<div className="controls">
					<button className="control-btn" onClick={handlePrev}>
						⏮
					</button>
					<button className="control-btn play-btn" onClick={handlePlayToggle}>
						{isPlaying ? '⏸' : '▶'}
					</button>
					<button className="control-btn" onClick={handleNext}>
						⏭
					</button>
				</div>
			</div>
		</div>
	);
};

export default LyricPlayer;
