import React, { useState, useEffect, useCallback } from 'react';
import './index.scss';

interface CircularImageRotationProps {
	imageCount?: number;
	containerSize?: number;
	imageSize?: number;
	rotationRadius?: number;
	animationDuration?: number;
	borderWidth?: number;
	borderColor?: string;
	backgroundColor?: string;
	enableHoverPause?: boolean;
	clockwise?: boolean;
	imageUrls?: string[];
	autoGenerate?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

const CircularImageRotation: React.FC<CircularImageRotationProps> = ({
	imageCount = 8,
	containerSize = 300,
	imageSize = 80,
	rotationRadius = 190,
	animationDuration = 15,
	borderWidth = 2,
	borderColor = '#ffffff',
	backgroundColor = '#222222',
	enableHoverPause = true,
	clockwise = true,
	imageUrls = [],
	autoGenerate = true,
	className = '',
	style = {}
}) => {
	const [images, setImages] = useState<string[]>([]);
	const [isHovered, setIsHovered] = useState(false);

	// 生成随机图片
	const generateRandomImages = () => {
		if (autoGenerate) {
			// 使用固定的图片ID确保图片质量和稳定性
			const imageIds = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
			const newImages = Array.from({ length: imageCount }, (_, index) => {
				const imageId = imageIds[index % imageIds.length];
				return `https://picsum.photos/id/${imageId}/200/200`;
			});
			setImages(newImages);
		} else {
			setImages(imageUrls.slice(0, imageCount));
		}
	};

	useEffect(() => {
		generateRandomImages();
	}, [imageCount, autoGenerate]);

	// 计算每张图片的位置角度
	const calculateImageAngle = (index: number) => {
		return (360 / imageCount) * index;
	};

	// 容器样式
	const containerStyle: React.CSSProperties = {
		width: `${containerSize}px`,
		height: `${containerSize}px`,
		backgroundColor,
		animationDuration: `${animationDuration}s`,
		animationDirection: clockwise ? 'normal' : 'reverse',
		animationPlayState: enableHoverPause && isHovered ? 'paused' : 'running',
		...style
	};

	// 图片容器样式
	const imageContainerStyle: React.CSSProperties = {
		left: `-${containerSize / 2}px`,
		width: `${containerSize}px`,
		height: `${containerSize}px`
	};

	// 单张图片样式
	const getImageBoxStyle = (index: number): React.CSSProperties => {
		const angle = calculateImageAngle(index);
		return {
			width: `${imageSize}px`,
			height: `${imageSize}px`,
			border: `${borderWidth}px solid ${borderColor}`,
			transform: `rotate(${angle}deg)`,
			transformOrigin: `${rotationRadius}px`
		};
	};

	// 图片本身的样式（保持正立）
	const getImageStyle = (index: number): React.CSSProperties => {
		const angle = -calculateImageAngle(index);
		return {
			transform: `rotate(${angle}deg)`,
			animationDuration: `${animationDuration}s`,
			animationDirection: clockwise ? 'normal' : 'reverse',
			animationPlayState: enableHoverPause && isHovered ? 'paused' : 'running'
		};
	};

	return (
		<div className={`circular-image-rotation-container ${className}`}>
			<div
				className={`rotation-box ${enableHoverPause ? 'hover-pausable' : ''}`}
				style={containerStyle}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="image-container" style={imageContainerStyle}>
					{images.map((imageUrl, index) => (
						<div key={index} className="image-box" style={getImageBoxStyle(index)}>
							<img
								src={imageUrl}
								alt={`Rotating image ${index + 1}`}
								className="rotating-image"
								style={getImageStyle(index)}
								onError={e => {
									return;
								}}
							/>
						</div>
					))}
				</div>
			</div>

			{/* 控制面板 */}
			<div className="control-panel">
				<button onClick={generateRandomImages} className="control-button refresh-button">
					刷新图片
				</button>
				<div className="status-info">
					<span>图片数量: {imageCount}</span>
					<span>动画时长: {animationDuration}s</span>
					<span>状态: {isHovered && enableHoverPause ? '已暂停' : '播放中'}</span>
				</div>
			</div>
		</div>
	);
};

export default CircularImageRotation;
