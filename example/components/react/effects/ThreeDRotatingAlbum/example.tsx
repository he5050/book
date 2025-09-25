import React from 'react';
import ThreeDRotatingAlbum from './index';

const ThreeDRotatingAlbumExample: React.FC = () => {
	return (
		<div className="three-d-rotating-album-example" style={{ padding: '20px' }}>
			<h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>3D旋转相册效果</h1>
			<div
				style={{
					height: '600px',
					backgroundColor: '#1a1a1a',
					borderRadius: '8px',
					overflow: 'hidden'
				}}
			>
				<ThreeDRotatingAlbum />
			</div>
			<div style={{ marginTop: '20px', color: '#fff', textAlign: 'center' }}>
				<h2>3D旋转相册效果演示</h2>
				<p>这是一个使用HTML和CSS实现的3D旋转相册效果，通过CSS的3D变换和动画实现动态旋转展示。</p>
				<ul style={{ textAlign: 'left', display: 'inline-block' }}>
					<li>使用CSS 3D变换实现立体效果</li>
					<li>通过关键帧动画实现自动旋转</li>
					<li>每张卡片都有独特的边框颜色</li>
					<li>响应式设计，适配不同屏幕尺寸</li>
				</ul>
			</div>
		</div>
	);
};

export default ThreeDRotatingAlbumExample;
