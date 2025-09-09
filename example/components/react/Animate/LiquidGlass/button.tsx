import React from 'react';
import LiquidGlass from 'liquid-glass-react';
import './liquid-glass.scss';

const LiquidGlassButtons: React.FC = () => {
	return (
		<div className="liquid-glass-buttons-container">
			<h1>Liquid Glass 按钮示例</h1>

			<div className="demo-section">
				<h2>不同样式的按钮</h2>
				<div
					className="buttons-demo safe-container"
					style={{
						backgroundImage: 'url(/blog/bg1.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						minHeight: '300px'
					}}
				>
					<div className="button-row">
						<LiquidGlass
							displacementScale={70}
							blurAmount={0.08}
							saturation={110}
							aberrationIntensity={1.0}
							elasticity={0.2}
							cornerRadius={100}
							padding="12px 24px"
							className="glass-button primary"
							onClick={() => alert('主要按钮被点击了！')}
							style={{
								background: 'rgba(255, 255, 255, 0.25)',
								backdropFilter: 'blur(8px)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
							}}
						>
							<span className="button-text">主要按钮</span>
						</LiquidGlass>

						<LiquidGlass
							displacementScale={60}
							blurAmount={0.06}
							saturation={105}
							aberrationIntensity={0.8}
							elasticity={0.15}
							cornerRadius={80}
							padding="10px 20px"
							className="glass-button secondary"
							onClick={() => alert('次要按钮被点击了！')}
							style={{
								background: 'rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(6px)',
								border: '1px solid rgba(255, 255, 255, 0.25)',
								boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
							}}
						>
							<span className="button-text">次要按钮</span>
						</LiquidGlass>

						<LiquidGlass
							displacementScale={50}
							blurAmount={0.04}
							saturation={100}
							aberrationIntensity={0.6}
							elasticity={0.1}
							cornerRadius={60}
							padding="8px 16px"
							className="glass-button subtle"
							onClick={() => alert('微妙按钮被点击了！')}
							style={{
								background: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(4px)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
								boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
							}}
						>
							<span className="button-text">微妙按钮</span>
						</LiquidGlass>
					</div>
				</div>
			</div>

			<div className="demo-section">
				<h2>不同尺寸的按钮</h2>
				<div
					className="buttons-demo safe-container"
					style={{
						backgroundImage: 'url(/blog/bg3.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						minHeight: '300px'
					}}
				>
					<div className="button-row size-demo">
						<LiquidGlass
							displacementScale={70}
							blurAmount={0.08}
							saturation={110}
							aberrationIntensity={1.0}
							elasticity={0.2}
							cornerRadius={100}
							padding="8px 16px"
							className="glass-button small"
							style={{
								background: 'rgba(255, 255, 255, 0.25)',
								backdropFilter: 'blur(8px)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
							}}
						>
							<span className="button-text">小按钮</span>
						</LiquidGlass>

						<LiquidGlass
							displacementScale={70}
							blurAmount={0.08}
							saturation={110}
							aberrationIntensity={1.0}
							elasticity={0.2}
							cornerRadius={100}
							padding="12px 24px"
							className="glass-button medium"
							style={{
								background: 'rgba(255, 255, 255, 0.25)',
								backdropFilter: 'blur(8px)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
							}}
						>
							<span className="button-text">中等按钮</span>
						</LiquidGlass>

						<LiquidGlass
							displacementScale={70}
							blurAmount={0.08}
							saturation={110}
							aberrationIntensity={1.0}
							elasticity={0.2}
							cornerRadius={100}
							padding="16px 32px"
							className="glass-button large"
							style={{
								background: 'rgba(255, 255, 255, 0.25)',
								backdropFilter: 'blur(8px)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
							}}
						>
							<span className="button-text">大按钮</span>
						</LiquidGlass>
					</div>
				</div>
			</div>

			<div className="demo-section">
				<h2>交互效果</h2>
				<div
					className="buttons-demo safe-container"
					style={{
						backgroundImage: 'url(/blog/bg4.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						minHeight: '300px'
					}}
				>
					<div className="button-row interactive-demo">
						<LiquidGlass
							displacementScale={80}
							blurAmount={0.1}
							saturation={115}
							aberrationIntensity={1.2}
							elasticity={0.25}
							cornerRadius={100}
							padding="12px 24px"
							className="glass-button hover-effect"
							onClick={() => alert('悬停效果按钮被点击了！')}
							style={{
								background: 'rgba(255, 255, 255, 0.3)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(255, 255, 255, 0.35)',
								boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
							}}
						>
							<span className="button-text">悬停效果</span>
						</LiquidGlass>

						<LiquidGlass
							displacementScale={90}
							blurAmount={0.12}
							saturation={120}
							aberrationIntensity={1.5}
							elasticity={0.3}
							cornerRadius={100}
							padding="12px 24px"
							className="glass-button click-effect"
							onClick={() => alert('点击效果按钮被点击了！')}
							style={{
								background: 'rgba(255, 255, 255, 0.35)',
								backdropFilter: 'blur(12px)',
								border: '1px solid rgba(255, 255, 255, 0.4)',
								boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
							}}
						>
							<span className="button-text">点击效果</span>
						</LiquidGlass>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LiquidGlassButtons;
