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
	/** 自定义渐变色，默认使用原始配色 */
	gradient?: string;
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
	gradient = "linear-gradient(744deg, #af40ff, #5b42f3 60%, #00ddeb)"
}) => {
	const [isPlaying, setIsPlaying] = useState(playing);

	const togglePlaying = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		<div className="wave-container">
			<div
				className={`e-card ${isPlaying ? 'playing' : ''}`}
				style={{ width: `${width}px`, height: `${height}px` }}
				onClick={togglePlaying}
			>
				<div
					className="wave wave-1"
					style={{
						opacity,
						background: gradient
					}}
				></div>
				<div
					className="wave wave-2"
					style={{
						opacity,
						background: gradient
					}}
				></div>
				<div
					className="wave wave-3"
					style={{
						opacity,
						background: gradient
					}}
				></div>
				<div className="info">
					<div className="text">{text}</div>
				</div>
			</div>
			<div className="controls">
				<button onClick={togglePlaying} className="control-btn">
					{isPlaying ? '暂停动画' : '播放动画'}
				</button>
			</div>
		</div>
	);
};

export default WaveAnimation;