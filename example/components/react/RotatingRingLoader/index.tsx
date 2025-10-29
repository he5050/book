import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface RotatingRingConfig {
	circleSize: number;
	animationDuration: number;
	ballSize: number;
	glowIntensity: number;
	primaryColor: string;
	hueRotate1: number;
	hueRotate2: number;
	reflectionOpacity: number;
	backgroundColor: string;
	innerMaskSize: number;
	gradientOpacity: number;
	shadowLayers: number;
}

interface CircleData {
	id: number;
	type: 'gradient' | 'ball';
	animationDelay: number;
	hueRotate: number;
	zIndex: number;
}

interface RotatingRingLoaderProps {
	config?: Partial<RotatingRingConfig>;
	className?: string;
	style?: React.CSSProperties;
}

const defaultConfig: RotatingRingConfig = {
	circleSize: 200,
	animationDuration: 3,
	ballSize: 20,
	glowIntensity: 100,
	primaryColor: '#00ff99',
	hueRotate1: 290,
	hueRotate2: 240,
	reflectionOpacity: 0.3,
	backgroundColor: '#000000',
	innerMaskSize: 20,
	gradientOpacity: 0.33,
	shadowLayers: 10
};

const RotatingRingLoader: React.FC<RotatingRingLoaderProps> = ({
	config = {},
	className = '',
	style = {}
}) => {
	const finalConfig = { ...defaultConfig, ...config };
	const loaderRef = useRef<HTMLDivElement>(null);

	const generateCircles = (): CircleData[] => {
		return Array.from({ length: 6 }, (_, index) => ({
			id: index,
			type: index < 3 ? 'gradient' : 'ball',
			animationDelay: getAnimationDelay(index),
			hueRotate: getHueRotate(index),
			zIndex: index < 3 ? 1 : 100
		}));
	};

	const getAnimationDelay = (index: number): number => {
		if (index === 1 || index === 3) return -1;
		if (index === 2 || index === 5) return -2;
		return 0;
	};

	const getHueRotate = (index: number): number => {
		if (index === 1 || index === 3) return finalConfig.hueRotate1;
		if (index === 2 || index === 5) return finalConfig.hueRotate2;
		return 0;
	};

	const generateGlowShadows = (): string => {
		const shadows = [];
		for (let i = 1; i <= finalConfig.shadowLayers; i++) {
			const blur = i * (finalConfig.glowIntensity / finalConfig.shadowLayers);
			shadows.push(`0 0 ${blur}px ${finalConfig.primaryColor}`);
		}
		return shadows.join(', ');
	};

	const circles = generateCircles();

	const loaderStyle: React.CSSProperties = {
		height: finalConfig.circleSize,
		backgroundColor: finalConfig.backgroundColor,
		'--circle-size': `${finalConfig.circleSize}px`,
		'--animation-duration': `${finalConfig.animationDuration}s`,
		'--ball-size': `${finalConfig.ballSize}px`,
		'--primary-color': finalConfig.primaryColor,
		'--reflection-opacity': finalConfig.reflectionOpacity,
		'--inner-mask-size': `${finalConfig.innerMaskSize}px`,
		'--gradient-opacity': finalConfig.gradientOpacity,
		'--glow-shadows': generateGlowShadows(),
		WebkitBoxReflect: `below 0px linear-gradient(transparent, transparent, rgba(0,0,0,${finalConfig.reflectionOpacity}))`,
		...style
	} as React.CSSProperties & Record<string, string>;

	return (
		<div ref={loaderRef} className={`rotating-ring-loader ${className}`} style={loaderStyle}>
			{circles.map(circle => (
				<div
					key={circle.id}
					className="rotating-circle"
					style={{
						width: finalConfig.circleSize,
						height: finalConfig.circleSize,
						animationDelay: `${circle.animationDelay}s`,
						filter: circle.hueRotate > 0 ? `hue-rotate(${circle.hueRotate}deg)` : 'none',
						zIndex: circle.zIndex
					}}
				>
					{circle.type === 'gradient' ? (
						<span className="inner-mask"></span>
					) : (
						<i className="glow-ball"></i>
					)}
				</div>
			))}
		</div>
	);
};

const RotatingRingLoaderDemo: React.FC = () => {
	const [config, setConfig] = useState<RotatingRingConfig>(defaultConfig);
	const [isPlaying, setIsPlaying] = useState(true);

	const updateConfig = (key: keyof RotatingRingConfig, value: number | string) => {
		setConfig(prev => ({ ...prev, [key]: value }));
	};

	const resetConfig = () => {
		setConfig(defaultConfig);
	};

	const toggleAnimation = () => {
		setIsPlaying(!isPlaying);
	};

	const themePresets = [
		{
			name: 'Neon Green',
			primaryColor: '#00ff99',
			backgroundColor: '#000000',
			hueRotate1: 290,
			hueRotate2: 240
		},
		{
			name: 'Electric Blue',
			primaryColor: '#00aaff',
			backgroundColor: '#0a0a0a',
			hueRotate1: 180,
			hueRotate2: 120
		},
		{
			name: 'Cyber Purple',
			primaryColor: '#aa00ff',
			backgroundColor: '#0f0a0f',
			hueRotate1: 60,
			hueRotate2: 30
		},
		{
			name: 'Fire Orange',
			primaryColor: '#ff6600',
			backgroundColor: '#1a0a00',
			hueRotate1: 45,
			hueRotate2: 90
		}
	];

	const applyTheme = (theme: (typeof themePresets)[0]) => {
		setConfig(prev => ({
			...prev,
			primaryColor: theme.primaryColor,
			backgroundColor: theme.backgroundColor,
			hueRotate1: theme.hueRotate1,
			hueRotate2: theme.hueRotate2
		}));
	};

	return (
		<div className="rotating-ring-demo">
			<div className="demo-container">
				<div className="preview-section">
					<h3>效果预览</h3>
					<div className="preview-area">
						<RotatingRingLoader
							config={{
								...config,
								animationDuration: isPlaying ? config.animationDuration : 0
							}}
						/>
					</div>
					<div className="animation-controls">
						<button onClick={toggleAnimation} className="control-btn">
							{isPlaying ? '暂停动画' : '播放动画'}
						</button>
					</div>
				</div>

				<div className="controls-section">
					<h3>参数配置</h3>

					<div className="controls-grid">
						<div className="control-group">
							<label>圆环尺寸: {config.circleSize}px</label>
							<input
								type="range"
								min="100"
								max="400"
								value={config.circleSize}
								onChange={e => updateConfig('circleSize', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>动画时长: {config.animationDuration}s</label>
							<input
								type="range"
								min="1"
								max="10"
								step="0.5"
								value={config.animationDuration}
								onChange={e => updateConfig('animationDuration', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>发光球尺寸: {config.ballSize}px</label>
							<input
								type="range"
								min="10"
								max="40"
								value={config.ballSize}
								onChange={e => updateConfig('ballSize', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>发光强度: {config.glowIntensity}px</label>
							<input
								type="range"
								min="50"
								max="200"
								value={config.glowIntensity}
								onChange={e => updateConfig('glowIntensity', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>色相偏移1: {config.hueRotate1}°</label>
							<input
								type="range"
								min="0"
								max="360"
								value={config.hueRotate1}
								onChange={e => updateConfig('hueRotate1', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>色相偏移2: {config.hueRotate2}°</label>
							<input
								type="range"
								min="0"
								max="360"
								value={config.hueRotate2}
								onChange={e => updateConfig('hueRotate2', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>倒影透明度: {config.reflectionOpacity}</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={config.reflectionOpacity}
								onChange={e => updateConfig('reflectionOpacity', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>内部遮罩: {config.innerMaskSize}px</label>
							<input
								type="range"
								min="10"
								max="50"
								value={config.innerMaskSize}
								onChange={e => updateConfig('innerMaskSize', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>渐变透明度: {config.gradientOpacity}</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.05"
								value={config.gradientOpacity}
								onChange={e => updateConfig('gradientOpacity', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>阴影层数: {config.shadowLayers}</label>
							<input
								type="range"
								min="5"
								max="15"
								value={config.shadowLayers}
								onChange={e => updateConfig('shadowLayers', Number(e.target.value))}
							/>
						</div>

						<div className="control-group">
							<label>主要颜色:</label>
							<input
								type="color"
								value={config.primaryColor}
								onChange={e => updateConfig('primaryColor', e.target.value)}
							/>
						</div>

						<div className="control-group">
							<label>背景颜色:</label>
							<input
								type="color"
								value={config.backgroundColor}
								onChange={e => updateConfig('backgroundColor', e.target.value)}
							/>
						</div>
					</div>

					<div className="control-group">
						<label>预设主题:</label>
						<div className="theme-buttons">
							{themePresets.map(theme => (
								<button
									key={theme.name}
									className="theme-btn"
									style={{ backgroundColor: theme.primaryColor }}
									onClick={() => applyTheme(theme)}
								>
									{theme.name}
								</button>
							))}
						</div>
					</div>

					<div className="control-actions">
						<button onClick={resetConfig} className="reset-btn">
							重置配置
						</button>
					</div>
				</div>
			</div>

			<div className="code-section">
				<h3>当前配置代码</h3>
				<pre className="code-block">
					{`<RotatingRingLoader
  config={{
    circleSize: ${config.circleSize},
    animationDuration: ${config.animationDuration},
    ballSize: ${config.ballSize},
    glowIntensity: ${config.glowIntensity},
    primaryColor: "${config.primaryColor}",
    hueRotate1: ${config.hueRotate1},
    hueRotate2: ${config.hueRotate2},
    reflectionOpacity: ${config.reflectionOpacity},
    backgroundColor: "${config.backgroundColor}",
    innerMaskSize: ${config.innerMaskSize},
    gradientOpacity: ${config.gradientOpacity},
    shadowLayers: ${config.shadowLayers}
  }}
/>`}
				</pre>
			</div>
		</div>
	);
};

export default RotatingRingLoaderDemo;
