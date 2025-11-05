import React, { useState } from 'react';
import './index.scss';

interface BorderAnimationProps {
	width?: number;
	height?: number;
	borderRadius?: number;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

const BorderAnimation: React.FC<BorderAnimationProps> = ({
	width = 300,
	height = 300,
	borderRadius = 20,
	className = '',
	style = {},
	children
}) => {
	const boxStyle = {
		width: `${width}px`,
		height: `${height}px`,
		borderRadius: `${borderRadius}px`
	} as React.CSSProperties;

	return (
		<div className={`box ${className}`} style={{ ...style, ...boxStyle }}>
			<div className="content">{children || <h2>Html</h2>}</div>
		</div>
	);
};

const BorderAnimationDemo: React.FC = () => {
	const [config, setConfig] = useState({
		width: 300,
		height: 300,
		borderRadius: 20
	});

	const updateConfig = (newConfig: Partial<typeof config>) => {
		setConfig(prev => ({ ...prev, ...newConfig }));
	};

	return (
		<div className="border-animation-demo-container">
			<div className="config-panel">
				<h3>边框动画配置面板</h3>
				<div className="config-section">
					<div className="config-item">
						<label>宽度: {config.width}px</label>
						<input
							type="range"
							min="100"
							max="500"
							value={config.width}
							onChange={e => updateConfig({ width: Number(e.target.value) })}
						/>
					</div>

					<div className="config-item">
						<label>高度: {config.height}px</label>
						<input
							type="range"
							min="100"
							max="500"
							value={config.height}
							onChange={e => updateConfig({ height: Number(e.target.value) })}
						/>
					</div>

					<div className="config-item">
						<label>圆角: {config.borderRadius}px</label>
						<input
							type="range"
							min="0"
							max="50"
							value={config.borderRadius}
							onChange={e => updateConfig({ borderRadius: Number(e.target.value) })}
						/>
					</div>
				</div>
			</div>

			<div className="demo-display">
				<div className="boxes-container">
					<BorderAnimation {...config}>
						<h2>Html</h2>
					</BorderAnimation>
					<BorderAnimation {...config}>
						<h2 style={{ color: 'red' }}>❤</h2>
					</BorderAnimation>
					<BorderAnimation {...config}>
						<h2>CSS</h2>
					</BorderAnimation>
				</div>
			</div>
		</div>
	);
};

export default BorderAnimationDemo;
