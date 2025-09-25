import React, { useState } from 'react';
import './index.scss';

interface LikeButtonProps {
	initialLiked?: boolean;
	onToggle?: (liked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ initialLiked = false, onToggle }) => {
	const [liked, setLiked] = useState(initialLiked);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleToggle = () => {
		const newLiked = !liked;
		setLiked(newLiked);

		// 触发动画
		if (newLiked) {
			setIsAnimating(true);
			// 动画结束后重置状态
			setTimeout(() => {
				setIsAnimating(false);
			}, 1000);
		}

		onToggle?.(newLiked);
	};

	// 生成庆祝粒子
	const renderCelebrateParticles = () => {
		if (!isAnimating) return null;

		const particles = [];
		for (let i = 0; i < 12; i++) {
			const angle = i * 30 * (Math.PI / 180);
			const distance = 30 + Math.random() * 20;
			const x = 50 + Math.cos(angle) * distance;
			const y = 50 + Math.sin(angle) * distance;

			particles.push(
				<circle
					key={i}
					cx={x}
					cy={y}
					r={2 + Math.random() * 3}
					fill="var(--heart-color)"
					style={{
						animation: `particle-pulse ${0.8 + Math.random() * 0.4}s ease-out forwards`
					}}
				/>
			);
		}

		return particles;
	};

	return (
		<div className="like-button-container">
			<div className="heart-container" title="Like">
				<input
					type="checkbox"
					className="checkbox"
					id="like-checkbox"
					checked={liked}
					onChange={handleToggle}
				/>
				<div className="svg-container">
					{/* 心形轮廓 */}
					<svg
						viewBox="0 0 24 24"
						className="svg-outline"
						xmlns="http://www.w3.org/2000/svg"
						style={{
							transform: liked ? 'scale(0.9)' : 'scale(1)',
							transition: 'transform 0.2s ease'
						}}
					>
						<path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
					</svg>

					{/* 填充的心形 */}
					<svg
						viewBox="0 0 24 24"
						className={`svg-filled ${isAnimating ? 'animate' : ''}`}
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
					</svg>

					{/* 庆祝动画 */}
					<svg
						className={`svg-celebrate ${isAnimating ? 'animate' : ''}`}
						width="100"
						height="100"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 100 100"
					>
						{/* 原有的多边形粒子 */}
						<polygon points="10,10 20,20" fill="var(--heart-color)" />
						<polygon points="10,50 20,50" fill="var(--heart-color)" />
						<polygon points="20,80 30,70" fill="var(--heart-color)" />
						<polygon points="90,10 80,20" fill="var(--heart-color)" />
						<polygon points="90,50 80,50" fill="var(--heart-color)" />
						<polygon points="80,80 70,70" fill="var(--heart-color)" />

						{/* 额外的圆形粒子 */}
						{renderCelebrateParticles()}
					</svg>
				</div>
			</div>
		</div>
	);
};

export default LikeButton;
