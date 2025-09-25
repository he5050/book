import React from 'react';
import Cube3DAlbum from './index';

const Cube3DAlbumExample: React.FC = () => {
	const sampleImages = [
		'https://picsum.photos/300/300?random=1',
		'https://picsum.photos/300/300?random=2',
		'https://picsum.photos/300/300?random=3',
		'https://picsum.photos/300/300?random=4',
		'https://picsum.photos/300/300?random=5',
		'https://picsum.photos/300/300?random=6'
	];

	return (
		<div className="cube-3d-album-example" style={{ padding: '20px', textAlign: 'center' }}>
			<h1 style={{ color: '#333', marginBottom: '30px' }}>3D立方体相册效果演示</h1>

			<div
				style={{
					height: '300px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: '30px'
				}}
			>
				<Cube3DAlbum images={sampleImages} />
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#f8f9fa',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
					textAlign: 'left',
					maxWidth: '800px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>3D立方体相册特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>使用CSS 3D变换创建立方体结构</li>
					<li style={{ margin: '10px 0' }}>六个面分别显示不同的图片</li>
					<li style={{ margin: '10px 0' }}>自动旋转动画，展示所有面的内容</li>
					<li style={{ margin: '10px 0' }}>响应式设计，适配不同屏幕尺寸</li>
					<li style={{ margin: '10px 0' }}>支持自定义图片数组</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>立方体相册会自动旋转展示六个面的图片内容，每个面都可以显示不同的图片。</p>
			</div>
		</div>
	);
};

export default Cube3DAlbumExample;
