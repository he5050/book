import React, { useState } from 'react';
import './WaveAnimation.scss';

interface WaveAnimationProps {
	/** 容器宽度，默认 200px */
	width?: number;
	/** 容器高度，默认 200px */
	height?: number;
	/** 是否播放快速动画，默认 false */
	playing?: boolean;
	/** 中心显示的文本 */
	text?: string;
	/** 波浪透明度，默认 0.6 */
	opacity?: number;
	/** 波浪数量，默认 3 */
	waveCount?: number;
	/** 自定义渐变色数组，默认使用原始配色 */
	colors?: string[];
	/** 波浪动画速度数组（秒），默认 [55, 50, 45] */
	animationSpeeds?: number[];
	/** 快速模式动画速度数组（秒），默认 [3, 4, 5] */
	fastAnimationSpeeds?: number[];
	/** 波浪幅度系数，默认 1.0 */
	amplitude?: number;
	/** 波浪边框圆角，默认 40% */
	borderRadius?: number;
	/** 是否显示控制按钮，默认 true */
	showControls?: boolean;
}

/**
 * 水波纹动画组件
 * 模拟 abc.html 页面的水波纹效果
 */
const WaveAnimation: React.FC<WaveAnimationProps> = ({
	width = 200,
	height = 200,
	playing = false,
	text = "这里测试文本",
	opacity = 0.6,
	waveCount = 3,
	colors = ['#af40ff', '#5b42f3', '#00ddeb'],
	animationSpeeds = [55, 50, 45],
	fastAnimationSpeeds = [3, 4, 5],
	amplitude = 1.0,
	borderRadius = 40,
	showControls = true
}) => {
	const [isPlaying, setIsPlaying] = useState(playing);

	const togglePlaying = () => {
		setIsPlaying(!isPlaying);
	};

	// 生成渐变色
	const generateGradient = () => {
		if (colors.length === 1) {
			return colors[0];
		} else if (colors.length === 2) {
			return `linear-gradient(744deg, ${colors[0]}, ${colors[1]})`;
		} else {
			return `linear-gradient(744deg, ${colors[0]}, ${colors[1]} 60%, ${colors[2]})`;
		}
	};

	// 生成波浪元素
	const renderWaves = () => {
		return Array.from({ length: waveCount }).map((_, index) => {
			const currentSpeed = isPlaying
				? (fastAnimationSpeeds[index] || fastAnimationSpeeds[0] || 3)
				: (animationSpeeds[index] || animationSpeeds[0] || 55);

			return (
				<div
					key={index}
					className={`wave wave-${index + 1}`}
					style={{
						opacity,
						background: generateGradient(),
						borderRadius: `${borderRadius}%`,
						width: `${540 * amplitude}px`,
						height: `${700 * amplitude}px`,
						animationDuration: `${currentSpeed}s`,
						// 为额外的波浪设置不同的位置
						top: index >= 2 ? '210px' : '0'
					}}
				></div>
			);
		});
	};

	return (
		<div className="wave-container">
			<div
				className={`e-card ${isPlaying ? 'playing' : ''}`}
				style={{ width: `${width}px`, height: `${height}px` }}
				onClick={togglePlaying}
			>
				{renderWaves()}
				<div className="info">
					<div className="text">{text}</div>
				</div>
			</div>
			{showControls && (
				<div className="controls">
					<button onClick={togglePlaying} className="control-btn">
						{isPlaying ? '暂停动画' : '播放动画'}
					</button>
				</div>
			)}
		</div>
	);
};

export default WaveAnimation;