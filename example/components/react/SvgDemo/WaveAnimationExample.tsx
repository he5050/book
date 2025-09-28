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

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', justifyItems: 'center' }}>
				{/* 默认效果 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>默认效果</h3>
					<WaveAnimation />
				</div>

				{/* 自定义颜色 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>自定义颜色</h3>
					<WaveAnimation
						text="彩虹波浪"
						colors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
					/>
				</div>

				{/* 单色波浪 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>单色波浪</h3>
					<WaveAnimation
						text="蓝色海洋"
						colors={['#0066cc']}
						opacity={0.8}
					/>
				</div>

				{/* 更多波浪 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>5层波浪</h3>
					<WaveAnimation
						text="多层波浪"
						waveCount={5}
						colors={['#ff9a9e', '#fecfef', '#fecfef']}
						animationSpeeds={[60, 55, 50, 45, 40]}
						fastAnimationSpeeds={[6, 5, 4, 3, 2]}
					/>
				</div>

				{/* 高速波浪 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>高速波浪</h3>
					<WaveAnimation
						text="快速旋转"
						colors={['#667eea', '#764ba2']}
						animationSpeeds={[20, 15, 10]}
						fastAnimationSpeeds={[2, 1.5, 1]}
						playing={true}
					/>
				</div>

				{/* 大幅度波浪 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>大幅度波浪</h3>
					<WaveAnimation
						text="巨浪"
						width={250}
						height={250}
						amplitude={1.3}
						colors={['#f093fb', '#f5576c']}
						opacity={0.7}
					/>
				</div>

				{/* 方形波浪 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>方形波浪</h3>
					<WaveAnimation
						text="方形设计"
						borderRadius={10}
						colors={['#4facfe', '#00f2fe']}
						showControls={false}
					/>
				</div>

				{/* 小尺寸波浪 */}
				<div>
					<h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px' }}>小尺寸</h3>
					<WaveAnimation
						width={150}
						height={150}
						text="迷你波浪"
						amplitude={0.8}
						colors={['#a8edea', '#fed6e3']}
					/>
				</div>
			</div>

			<div style={{
				marginTop: '40px',
				padding: '20px',
				background: 'white',
				borderRadius: '8px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
			}}>
				<h3 style={{ color: '#333', marginBottom: '15px' }}>配置参数说明：</h3>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', color: '#666', lineHeight: '1.6' }}>
					<div>
						<h4 style={{ color: '#333', marginBottom: '10px' }}>基础配置</h4>
						<ul style={{ margin: 0, paddingLeft: '20px' }}>
							<li><code>width/height</code>: 容器尺寸</li>
							<li><code>text</code>: 中心显示文本</li>
							<li><code>opacity</code>: 波浪透明度 (0-1)</li>
							<li><code>showControls</code>: 是否显示控制按钮</li>
						</ul>
					</div>
					<div>
						<h4 style={{ color: '#333', marginBottom: '10px' }}>波浪配置</h4>
						<ul style={{ margin: 0, paddingLeft: '20px' }}>
							<li><code>waveCount</code>: 波浪层数 (1-5)</li>
							<li><code>colors</code>: 渐变色数组</li>
							<li><code>amplitude</code>: 波浪幅度系数</li>
							<li><code>borderRadius</code>: 波浪圆角 (%)</li>
						</ul>
					</div>
					<div>
						<h4 style={{ color: '#333', marginBottom: '10px' }}>动画配置</h4>
						<ul style={{ margin: 0, paddingLeft: '20px' }}>
							<li><code>playing</code>: 初始播放状态</li>
							<li><code>animationSpeeds</code>: 慢速模式速度数组</li>
							<li><code>fastAnimationSpeeds</code>: 快速模式速度数组</li>
							<li>点击卡片可切换动画速度</li>
						</ul>
					</div>
				</div>

				<div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #007bff' }}>
					<h4 style={{ color: '#333', margin: '0 0 10px 0' }}>使用示例：</h4>
					<pre style={{ margin: 0, fontSize: '14px', color: '#666', overflow: 'auto' }}>
						{`<WaveAnimation
  text="自定义文本"
  waveCount={5}
  colors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
  animationSpeeds={[60, 55, 50, 45, 40]}
  amplitude={1.2}
  opacity={0.8}
/>`}
					</pre>
				</div>
			</div>
		</div>
	);
};

export default WaveAnimationExample;
