import React from 'react';
import WaveAnimation from './components/WaveAnimation';

const WaveAnimationExample = () => {
	return (
		<div style={{
			padding: '20px',
			background: '#f5f5f5',
			minHeight: '100vh',
			fontFamily: 'Arial, sans-serif'
		}}>
			<h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
				水波动画示例
			</h1>
			<p style={{
				textAlign: 'center',
				color: '#666',
				marginBottom: '30px',
				maxWidth: '600px',
				margin: '0 auto 30px'
			}}>
				这是一个完全还原 abc.html 页面效果的水波动画组件，支持点击切换动画速度。
			</p>

			<div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
				{/* 默认效果 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333' }}>默认效果</h3>
					<WaveAnimation />
				</div>

				{/* 自定义文本 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333' }}>自定义文本</h3>
					<WaveAnimation text="前端Hardy" />
				</div>

				{/* 不同尺寸 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333' }}>小尺寸</h3>
					<WaveAnimation width={150} height={150} text="小波浪" />
				</div>
			</div>

			<div style={{
				marginTop: '40px',
				padding: '20px',
				background: 'white',
				borderRadius: '8px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
			}}>
				<h3 style={{ color: '#333', marginBottom: '15px' }}>使用说明：</h3>
				<ul style={{ color: '#666', lineHeight: '1.6' }}>
					<li>点击水波纹卡片可以切换动画速度（慢速/快速）</li>
					<li>支持自定义文本、尺寸、透明度等参数</li>
					<li>完全还原原始 HTML 页面的视觉效果和动画</li>
					<li>响应式设计，支持不同屏幕尺寸</li>
				</ul>
			</div>
		</div>
	);
};

export default WaveAnimationExample;
