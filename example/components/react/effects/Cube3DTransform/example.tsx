import React from 'react';
import Cube3DTransform from './index';

const Cube3DTransformExample: React.FC = () => {
	return (
		<div className="cube-3d-transform-example" style={{ padding: '20px' }}>
			<h1 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>
				3D立方体变形动画效果演示
			</h1>

			<div style={{ height: '300px', marginBottom: '30px' }}>
				<Cube3DTransform />
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
				<h2 style={{ color: '#333', marginBottom: '15px' }}>3D立方体变形动画特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>使用CSS 3D变换创建立方体结构</li>
					<li style={{ margin: '10px 0' }}>通过关键帧动画实现立方体的变形效果</li>
					<li style={{ margin: '10px 0' }}>支持自定义立方体大小、动画时长和颜色</li>
					<li style={{ margin: '10px 0' }}>响应式设计，适配不同容器宽度</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					该组件通过CSS
					3D变换和关键帧动画实现立方体的变形效果，每个立方体面都有不同的颜色，通过动画实现立方体在3D空间中的变形和移动。
				</p>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>参数配置</h3>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>
						<strong>cubeSize</strong>: 立方体大小，默认为3em
					</li>
					<li style={{ margin: '10px 0' }}>
						<strong>animationDuration</strong>: 动画持续时间，默认为4秒
					</li>
					<li style={{ margin: '10px 0' }}>
						<strong>colors</strong>: 立方体各面的颜色数组，默认为['#3498db', '#2ecc71', '#e74c3c']
					</li>
					<li style={{ margin: '10px 0' }}>
						<strong>containerWidth</strong>: 容器宽度，默认为500px
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Cube3DTransformExample;
