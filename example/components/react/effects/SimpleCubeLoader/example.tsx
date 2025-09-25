import React from 'react';
import SimpleCubeLoader from './index';

const SimpleCubeLoaderExample: React.FC = () => {
	return (
		<div className="simple-cube-loader-example" style={{ padding: '20px', textAlign: 'center' }}>
			<h1 style={{ color: '#333', marginBottom: '30px' }}>简单立方体加载动画演示</h1>

			<div
				style={{
					height: '200px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: '30px'
				}}
			>
				<SimpleCubeLoader />
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
				<h2 style={{ color: '#333', marginBottom: '15px' }}>简单立方体加载动画特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>使用CSS 3D变换创建立方体结构</li>
					<li style={{ margin: '10px 0' }}>六个面使用渐变色背景</li>
					<li style={{ margin: '10px 0' }}>自动旋转动画，展示3D效果</li>
					<li style={{ margin: '10px 0' }}>适合作为加载动画使用</li>
					<li style={{ margin: '10px 0' }}>尺寸较小(100px x 100px)，不占用过多空间</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					简单立方体加载动画适合作为页面或组件的加载状态指示器，通过CSS
					3D变换和动画实现流畅的旋转效果。
				</p>
			</div>
		</div>
	);
};

export default SimpleCubeLoaderExample;
