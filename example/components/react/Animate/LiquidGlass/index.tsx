import React, { useRef } from 'react';
import LiquidGlass from 'liquid-glass-react';
import './liquid-glass.scss';

const LiquidGlassDemo: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="liquid-glass-demo-container" ref={containerRef}>
			<h1>Liquid Glass React 示例</h1>

			<div className="demo-section">
				<h2>基础玻璃卡片</h2>
				<div className="card-demo safe-container">
					<LiquidGlass
						displacementScale={80}
						blurAmount={0.05}
						saturation={100}
						aberrationIntensity={0.5}
						elasticity={0.05}
						cornerRadius={20}
						className="glass-card"
						style={{
							background: 'rgba(255, 255, 255, 0.15)',
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(255, 255, 255, 0.2)',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
						}}
					>
						<div className="card-content">
							<h3>基础玻璃卡片</h3>
							<p>这是一个具有液态玻璃效果的基础卡片组件。</p>
						</div>
					</LiquidGlass>
				</div>
			</div>

			<div className="demo-section">
				<h2>交互式玻璃卡片</h2>
				<div
					className="card-demo interactive safe-container"
					style={{
						backgroundImage: 'url(/blog/bg1.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center'
					}}
				>
					<LiquidGlass
						displacementScale={100}
						blurAmount={0.1}
						saturation={120}
						aberrationIntensity={1.5}
						elasticity={0.3}
						cornerRadius={25}
						className="glass-card interactive"
						mouseContainer={containerRef}
						style={{
							background: 'rgba(255, 255, 255, 0.2)',
							backdropFilter: 'blur(12px)',
							border: '1px solid rgba(255, 255, 255, 0.3)',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
						}}
					>
						<div className="card-content">
							<h3>交互式玻璃卡片</h3>
							<p>这个卡片会响应鼠标移动，创造出更生动的玻璃效果。</p>
						</div>
					</LiquidGlass>
				</div>
			</div>

			<div className="demo-section">
				<h2>玻璃按钮</h2>
				<div
					className="button-demo safe-container"
					style={{
						backgroundImage: 'url(/blog/bg3.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center'
					}}
				>
					<LiquidGlass
						displacementScale={70}
						blurAmount={0.08}
						saturation={110}
						aberrationIntensity={1.0}
						elasticity={0.2}
						cornerRadius={100}
						padding="12px 24px"
						onClick={() => alert('按钮被点击了！')}
						className="glass-button"
						style={{
							background: 'rgba(255, 255, 255, 0.25)',
							backdropFilter: 'blur(8px)',
							border: '1px solid rgba(255, 255, 255, 0.3)',
							boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
						}}
					>
						<span className="button-text">点击我</span>
					</LiquidGlass>
				</div>
			</div>

			<div className="demo-section">
				<h2>不同强度的玻璃效果</h2>
				<div
					className="intensity-demo safe-container"
					style={{
						backgroundImage: 'url(/blog/bg4.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center'
					}}
				>
					<div className="glass-row">
						<LiquidGlass
							displacementScale={40}
							blurAmount={0.02}
							className="glass-card subtle"
							style={{
								background: 'rgba(255, 255, 255, 0.1)',
								backdropFilter: 'blur(4px)',
								border: '1px solid rgba(255, 255, 255, 0.15)'
							}}
						>
							<div className="card-content">
								<h4>轻微效果</h4>
							</div>
						</LiquidGlass>

						<LiquidGlass
							displacementScale={70}
							blurAmount={0.05}
							className="glass-card medium"
							style={{
								background: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(8px)',
								border: '1px solid rgba(255, 255, 255, 0.2)'
							}}
						>
							<div className="card-content">
								<h4>中等效果</h4>
							</div>
						</LiquidGlass>

						<LiquidGlass
							displacementScale={100}
							blurAmount={0.1}
							className="glass-card strong"
							style={{
								background: 'rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(12px)',
								border: '1px solid rgba(255, 255, 255, 0.25)'
							}}
						>
							<div className="card-content">
								<h4>强烈效果</h4>
							</div>
						</LiquidGlass>
					</div>
				</div>
			</div>

			<div className="info-section safe-container">
				<h2>关于 Liquid Glass React</h2>
				<p>
					Liquid Glass React 是一个用于 React 的库，可以创建类似 Apple Liquid Glass 效果的组件。
					它使用先进的 CSS 技术和 GPU 加速动画来创建沉浸式的玻璃效果，具有实时渲染和镜面高光等功能。
				</p>
				<p>
					<a href="https://liquidglassui.org/" target="_blank" rel="noopener noreferrer">
						访问官方文档
					</a>
				</p>
			</div>
		</div>
	);
};

export default LiquidGlassDemo;
