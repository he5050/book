import React, { useState, useEffect } from 'react';
import LyricPlayer from './index';

// 示例歌词数据
const sampleLyrics = [
	{ id: 1, text: '如今我眼中的世界色彩斑斓', time: 0 },
	{ id: 2, text: '天空呈现出从未见过的色调', time: 5 },
	{ id: 3, text: '城市灯火被染成金黄与绯红', time: 10 },
	{ id: 4, text: '每条街道都像是不同的家园', time: 15 },
	{ id: 5, text: '噢，这种感觉如同一曲交响乐', time: 20 },
	{ id: 6, text: '光与声的和谐旋律', time: 25 },
	{ id: 7, text: '我漂浮在寂静梦想的云端', time: 30 },
	{ id: 8, text: '方圆数里空无一人', time: 35 },
	{ id: 9, text: '这是新的一天，新的开始', time: 40 },
	{ id: 10, text: '等待画笔的空白画布', time: 45 },
	{ id: 11, text: '我自由奔跑，如同艺术品', time: 50 },
	{ id: 12, text: '在这美丽而混乱的洪流中', time: 55 },
	{ id: 13, text: '让我们找到节奏，稳定的节拍', time: 60 },
	{ id: 14, text: '引导我们穿越错综复杂的道路', time: 65 },
	{ id: 15, text: '让这些时刻变得苦乐参半', time: 70 },
	{ id: 16, text: '成为我们短暂日子里最美好的时光', time: 75 },
	{ id: 17, text: '如今我眼中的世界色彩斑斓', time: 80 },
	{ id: 18, text: '天空呈现出从未见过的色调', time: 85 },
	{ id: 19, text: '城市灯火被染成金黄与绯红', time: 90 },
	{ id: 20, text: '每条街道都像是不同的家园', time: 95 },
	{ id: 21, text: '噢，这种感觉如同一曲交响乐', time: 100 },
	{ id: 22, text: '光与声的和谐旋律', time: 105 },
	{ id: 23, text: '我漂浮在寂静梦想的云端', time: 110 },
	{ id: 24, text: '方圆数里空无一人', time: 115 },
	{ id: 25, text: '这是新的一天，新的开始', time: 120 },
	{ id: 26, text: '等待画笔的空白画布', time: 125 },
	{ id: 27, text: '我自由奔跑，如同艺术品', time: 130 },
	{ id: 28, text: '在这美丽而混乱的洪流中', time: 135 },
	{ id: 29, text: '让我们找到节奏，稳定的节拍', time: 140 },
	{ id: 30, text: '引导我们穿越错综复杂的道路', time: 145 },
	{ id: 31, text: '让这些时刻变得苦乐参半', time: 150 },
	{ id: 32, text: '成为我们短暂日子里最美好的时光', time: 155 }
];

const LyricPlayerDemo: React.FC = () => {
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [duration] = useState<number>(160); // 歌曲总时长

	// 模拟播放进度
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isPlaying) {
			interval = setInterval(() => {
				setCurrentTime(prevTime => {
					const newTime = prevTime + 1;
					// 如果播放到末尾，重置到开头
					if (newTime >= duration) {
						return 0;
					}
					return newTime;
				});
			}, 1000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isPlaying, duration]);

	const handleTimeChange = (time: number) => {
		setCurrentTime(time);
	};

	const handlePlayToggle = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
				position: 'relative'
			}}
		>
			{/* 背景图片 */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundImage: 'url(https://picsum.photos/id/33/1920/1080)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					opacity: 0.3,
					zIndex: -1
				}}
			/>

			<LyricPlayer
				title="色彩世界"
				artist="幻想乐队"
				lyrics={sampleLyrics}
				currentTime={currentTime}
				onTimeChange={handleTimeChange}
				isPlaying={isPlaying}
				onPlayToggle={handlePlayToggle}
			/>
		</div>
	);
};

export default LyricPlayerDemo;
