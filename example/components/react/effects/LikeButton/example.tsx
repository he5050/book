import React, { useState } from 'react';
import LikeButton from './index';

const LikeButtonExample: React.FC = () => {
	const [likeCount, setLikeCount] = useState(0);
	const [isLiked, setIsLiked] = useState(false);

	const handleLikeToggle = (liked: boolean) => {
		setIsLiked(liked);
		setLikeCount(liked ? likeCount + 1 : likeCount - 1);
	};

	return (
		<div className="like-button-example" style={{ padding: '20px', textAlign: 'center' }}>
			<h1 style={{ color: '#333', marginBottom: '30px' }}>3D立体点赞效果演示</h1>

			<div style={{ marginBottom: '30px' }}>
				<LikeButton initialLiked={isLiked} onToggle={handleLikeToggle} />
			</div>

			<div
				style={{
					backgroundColor: '#f5f5f5',
					padding: '20px',
					borderRadius: '8px',
					display: 'inline-block',
					minWidth: '200px'
				}}
			>
				<p
					style={{
						fontSize: '18px',
						fontWeight: 'bold',
						color: isLiked ? '#ff5b89' : '#666',
						margin: '0 0 10px 0'
					}}
				>
					{isLiked ? '已点赞' : '未点赞'}
				</p>
				<p
					style={{
						fontSize: '16px',
						color: '#666',
						margin: '0'
					}}
				>
					点赞数: {likeCount}
				</p>
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#fff',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
					textAlign: 'left',
					maxWidth: '600px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>3D立体点赞效果特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>增强的3D立体效果，心形图标具有深度感</li>
					<li style={{ margin: '10px 0' }}>丰富的粒子动画效果，包含多层粒子爆炸</li>
					<li style={{ margin: '10px 0' }}>流畅的动画过渡，使用贝塞尔曲线优化动画效果</li>
					<li style={{ margin: '10px 0' }}>光影效果，通过drop-shadow增强立体感</li>
					<li style={{ margin: '10px 0' }}>支持自定义初始状态和回调函数</li>
				</ul>
			</div>
		</div>
	);
};

export default LikeButtonExample;
