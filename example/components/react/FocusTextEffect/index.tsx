import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface FocusTextConfig {
	focusRadius: number;
	blurIntensity: number;
	text: string;
	fontSize: number;
	textColor: string;
	backgroundColor: string;
	circleVisible: boolean;
	circleColor: string;
	textOffset: number;
}

interface FocusTextEffectProps {
	config?: Partial<FocusTextConfig>;
	className?: string;
	style?: React.CSSProperties;
}

const defaultConfig: FocusTextConfig = {
	focusRadius: 30,
	blurIntensity: 10,
	text: 'FOCUS',
	fontSize: 8,
	textColor: '#ffffff',
	backgroundColor: '#222222',
	circleVisible: true,
	circleColor: '#ffffff',
	textOffset: 25
};

const FocusTextEffect: React.FC<FocusTextEffectProps> = ({
	config = {},
	className = '',
	style = {}
}) => {
	const finalConfig = { ...defaultConfig, ...config };
	const containerRef = useRef<HTMLDivElement>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const rafRef = useRef<number>();

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(() => {
				if (containerRef.current) {
					const rect = containerRef.current.getBoundingClientRect();
					setMousePos({
						x: e.clientX - rect.left,
						y: e.clientY - rect.top
					});
				}
			});
		};

		const container = containerRef.current;
		if (container) {
			container.addEventListener('mousemove', handleMouseMove);
		}

		return () => {
			if (container) {
				container.removeEventListener('mousemove', handleMouseMove);
			}
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	const containerStyle: React.CSSProperties = {
		backgroundColor: finalConfig.backgroundColor,
		...style
	};

	const textStyle: React.CSSProperties = {
		color: finalConfig.textColor,
		fontSize: `${finalConfig.fontSize}em`,
		transform: `translate(${mousePos.x / finalConfig.textOffset}px, ${
			mousePos.y / finalConfig.textOffset
		}px)`
	};

	const blurLayerStyle: React.CSSProperties = {
		...textStyle,
		filter: `blur(${finalConfig.blurIntensity}px)`
	};

	const focusLayerStyle: React.CSSProperties = {
		...textStyle,
		clipPath: `circle(${finalConfig.focusRadius}px at ${mousePos.x}px ${mousePos.y}px)`
	};

	const circleStyle: React.CSSProperties = {
		borderColor: finalConfig.circleColor,
		transform: `translate(${mousePos.x - finalConfig.focusRadius}px, ${
			mousePos.y - finalConfig.focusRadius
		}px)`,
		width: `${finalConfig.focusRadius * 2}px`,
		height: `${finalConfig.focusRadius * 2}px`,
		display: finalConfig.circleVisible ? 'block' : 'none'
	};

	return (
		<div ref={containerRef} className={`focus-text-effect ${className}`} style={containerStyle}>
			{/* 背景模糊层 */}
			<div className="text-layer blur-layer" style={blurLayerStyle}>
				<h2>{finalConfig.text}</h2>
			</div>

			{/* 聚焦清晰层 */}
			<div className="text-layer focus-layer" style={focusLayerStyle}>
				<h2>{finalConfig.text}</h2>
			</div>

			{/* 跟随圆圈 */}
			<div className="focus-circle" style={circleStyle}></div>
		</div>
	);
};

const FocusTextDemo: React.FC = () => {
	const [config, setConfig] = useState<FocusTextConfig>(defaultConfig);

	const updateConfig = (key: keyof FocusTextConfig, value: number | string | boolean) => {
		setConfig(prev => ({ ...prev, [key]: value }));
	};

	const resetConfig = () => {
		setConfig(defaultConfig);
	};

	return (
		<div className="focus-text-demo">
			<div className="demo-container">
				<div className="preview-section">
					<h3>效果预览</h3>
					<div className="preview-area">
						<FocusTextEffect config={config} />
					</div>
				</div>

				<div className="controls-section">
					<h3>参数配置</h3>

					<div className="control-group">
						<label>文本内容:</label>
						<input
							type="text"
							value={config.text}
							onChange={e => updateConfig('text', e.target.value)}
							placeholder="输入文本内容"
						/>
					</div>

					<div className="control-group">
						<label>聚焦半径: {config.focusRadius}px</label>
						<input
							type="range"
							min="20"
							max="300"
							value={config.focusRadius}
							onChange={e => updateConfig('focusRadius', Number(e.target.value))}
						/>
					</div>

					<div className="control-group">
						<label>模糊强度: {config.blurIntensity}px</label>
						<input
							type="range"
							min="5"
							max="30"
							value={config.blurIntensity}
							onChange={e => updateConfig('blurIntensity', Number(e.target.value))}
						/>
					</div>

					<div className="control-group">
						<label>字体大小: {config.fontSize}em</label>
						<input
							type="range"
							min="4"
							max="12"
							step="0.5"
							value={config.fontSize}
							onChange={e => updateConfig('fontSize', Number(e.target.value))}
						/>
					</div>

					<div className="control-group">
						<label>文字偏移: {config.textOffset}</label>
						<input
							type="range"
							min="10"
							max="50"
							value={config.textOffset}
							onChange={e => updateConfig('textOffset', Number(e.target.value))}
						/>
					</div>

					<div className="control-group">
						<label>文字颜色:</label>
						<input
							type="color"
							value={config.textColor}
							onChange={e => updateConfig('textColor', e.target.value)}
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

					<div className="control-group">
						<label>圆圈颜色:</label>
						<input
							type="color"
							value={config.circleColor}
							onChange={e => updateConfig('circleColor', e.target.value)}
						/>
					</div>

					<div className="control-group">
						<label>
							<input
								type="checkbox"
								checked={config.circleVisible}
								onChange={e => updateConfig('circleVisible', e.target.checked)}
							/>
							显示跟随圆圈
						</label>
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
					{`<FocusTextEffect
  config={{
    focusRadius: ${config.focusRadius},
    blurIntensity: ${config.blurIntensity},
    text: "${config.text}",
    fontSize: ${config.fontSize},
    textColor: "${config.textColor}",
    backgroundColor: "${config.backgroundColor}",
    circleVisible: ${config.circleVisible},
    circleColor: "${config.circleColor}",
    textOffset: ${config.textOffset}
  }}
/>`}
				</pre>
			</div>
		</div>
	);
};

export default FocusTextDemo;
