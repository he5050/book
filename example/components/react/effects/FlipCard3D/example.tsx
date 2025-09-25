import React from 'react';
import FlipCard3D from './index';

const FlipCard3DExample: React.FC = () => {
	return (
		<div className="flip-card-3d-example" style={{ padding: '20px', textAlign: 'center' }}>
			<h1 style={{ color: '#333', marginBottom: '30px' }}>3D翻转卡片效果演示</h1>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '20px',
					marginBottom: '30px'
				}}
			>
				<FlipCard3D />
				<FlipCard3D
					frontTitle="正面"
					frontContent="Hover Me"
					backTitle="背面"
					backContent="Thanks!"
				/>
				<FlipCard3D
					frontTitle="Front"
					frontContent="Move Mouse"
					backTitle="Back"
					backContent="Great!"
				/>
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
				<h2 style={{ color: '#333', marginBottom: '15px' }}>3D翻转卡片特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>使用CSS 3D变换创建翻转效果</li>
					<li style={{ margin: '10px 0' }}>鼠标悬停时卡片会翻转显示背面内容</li>
					<li style={{ margin: '10px 0' }}>正面和背面都有独特的渐变背景</li>
					<li style={{ margin: '10px 0' }}>带有模糊光晕效果的动画</li>
					<li style={{ margin: '10px 0' }}>支持自定义正面和背面的标题与内容</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>将鼠标悬停在卡片上，卡片会翻转显示背面内容。移开鼠标后，卡片会翻转回正面。</p>
			</div>
		</div>
	);
};

export default FlipCard3DExample;
