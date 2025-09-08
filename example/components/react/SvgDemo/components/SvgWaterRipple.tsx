import React, { useState, useEffect, useRef } from 'react';
import './SvgWaterRipple.scss';

const SvgWaterRipple = () => {
	const [progress, setProgress] = useState(50);
	const [scale, setScale] = useState(15);
	const [frequencyX, setFrequencyX] = useState(0.05);
	const [frequencyY, setFrequencyY] = useState(0.05);
	const [octaves, setOctaves] = useState(2);
	const [type, setType] = useState<'fractalNoise' | 'turbulence'>('fractalNoise');
	const [animationSpeed, setAnimationSpeed] = useState(10);
	const [strokeWidth, setStrokeWidth] = useState(20);
	const [activeColor, setActiveColor] = useState('#ceff00');
	const [inactiveColor, setInactiveColor] = useState('#333');

	// 新增纹理控制参数
	const [seed, setSeed] = useState(0);
	const [stitchTiles, setStitchTiles] = useState<'stitch' | 'noStitch'>('stitch');
	const [amplitude, setAmplitude] = useState(10);
	const [waveType, setWaveType] = useState<'sine' | 'square' | 'triangle' | 'sawtooth'>('sine');

	const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
	const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
	const animateRef = useRef<SVGAnimateElement>(null);

	const radius = 50;
	const circumference = 2 * Math.PI * radius;

	// 更新滤镜参数
	const updateFilter = () => {
		if (turbulenceRef.current && displacementMapRef.current && animateRef.current) {
			turbulenceRef.current.setAttribute('baseFrequency', `${frequencyX} ${frequencyY}`);
			turbulenceRef.current.setAttribute('numOctaves', octaves.toString());
			turbulenceRef.current.setAttribute('type', type);
			turbulenceRef.current.setAttribute('seed', seed.toString());
			turbulenceRef.current.setAttribute('stitchTiles', stitchTiles);
			displacementMapRef.current.setAttribute('scale', scale.toString());
			animateRef.current.setAttribute('dur', `${animationSpeed}s`);
		}
	};

	// 初始化和更新滤镜
	useEffect(() => {
		updateFilter();
	}, [scale, frequencyX, frequencyY, octaves, type, animationSpeed, seed, stitchTiles]);

	return (
		<div className="svg-water-ripple-container">
			<h3>SVG 水波纹进度条</h3>
			<div className="demo-content">
				<div className="progress-container">
					<svg className="progress-ring" viewBox="0 0 120 120">
						{/* 背景圆环 */}
						<circle
							className="progress-ring__circle progress-ring__background"
							r={radius}
							cx="60"
							cy="60"
							style={{ stroke: inactiveColor }}
						/>
						{/* 进度圆环 */}
						<circle
							className="progress-ring__circle progress-ring__progress"
							r={radius}
							cx="60"
							cy="60"
							style={{
								stroke: activeColor,
								strokeWidth: strokeWidth,
								strokeDasharray: `${circumference} ${circumference}`,
								strokeDashoffset: circumference - (progress / 100) * circumference
							}}
						/>
					</svg>
					<div className="progress-text" style={{ color: activeColor }}>
						{Math.round(progress)}%
					</div>
				</div>

				{/* SVG 滤镜定义 */}
				<svg width="0" height="0">
					<filter id="wobble-filter">
						<feTurbulence
							ref={turbulenceRef}
							type="fractalNoise"
							baseFrequency="0.05 0.05"
							numOctaves="2"
							seed="0"
							stitchTiles="stitch"
							result="turbulenceResult"
						>
							{/* 动画：让 turbulence 的基础频率动起来，模拟流动效果 */}
							<animate
								ref={animateRef}
								attributeName="baseFrequency"
								dur="10s"
								values={`0.05 0.05;${0.05 + amplitude / 1000} ${
									0.05 - amplitude / 1000
								};0.05 0.05;`}
								repeatCount="indefinite"
							/>
						</feTurbulence>
						<feDisplacementMap
							ref={displacementMapRef}
							in="SourceGraphic"
							in2="turbulenceResult"
							scale="15"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
				</svg>
			</div>

			<div className="controls">
				<div className="control-group">
					<label htmlFor="progress">进度: {progress}%</label>
					<input
						type="range"
						id="progress"
						min="0"
						max="100"
						value={progress}
						onChange={e => setProgress(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="scale">波纹幅度 (scale): {scale}</label>
					<input
						type="range"
						id="scale"
						min="0"
						max="50"
						value={scale}
						step="1"
						onChange={e => setScale(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="frequencyX">波纹频率 X: {frequencyX.toFixed(2)}</label>
					<input
						type="range"
						id="frequencyX"
						min="0.01"
						max="0.2"
						value={frequencyX}
						step="0.01"
						onChange={e => setFrequencyX(parseFloat(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="frequencyY">波纹频率 Y: {frequencyY.toFixed(2)}</label>
					<input
						type="range"
						id="frequencyY"
						min="0.01"
						max="0.2"
						value={frequencyY}
						step="0.01"
						onChange={e => setFrequencyY(parseFloat(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="octaves">波纹细节 (numOctaves): {octaves}</label>
					<input
						type="range"
						id="octaves"
						min="1"
						max="10"
						value={octaves}
						step="1"
						onChange={e => setOctaves(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="type">噪声类型: {type}</label>
					<select
						id="type"
						value={type}
						onChange={e => setType(e.target.value as 'fractalNoise' | 'turbulence')}
					>
						<option value="fractalNoise">分形噪声</option>
						<option value="turbulence">湍流噪声</option>
					</select>
				</div>

				<div className="control-group">
					<label htmlFor="animationSpeed">动画速度: {animationSpeed}s</label>
					<input
						type="range"
						id="animationSpeed"
						min="1"
						max="30"
						value={animationSpeed}
						step="1"
						onChange={e => setAnimationSpeed(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="strokeWidth">边框宽度: {strokeWidth}px</label>
					<input
						type="range"
						id="strokeWidth"
						min="1"
						max="40"
						value={strokeWidth}
						step="1"
						onChange={e => setStrokeWidth(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="activeColor">激活颜色:</label>
					<input
						type="color"
						id="activeColor"
						value={activeColor}
						onChange={e => setActiveColor(e.target.value)}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="inactiveColor">背景颜色:</label>
					<input
						type="color"
						id="inactiveColor"
						value={inactiveColor}
						onChange={e => setInactiveColor(e.target.value)}
					/>
				</div>

				{/* 新增纹理控制选项 */}
				<div className="control-group">
					<label htmlFor="seed">噪声种子 (seed): {seed}</label>
					<input
						type="range"
						id="seed"
						min="0"
						max="100"
						value={seed}
						step="1"
						onChange={e => setSeed(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="stitchTiles">拼接模式: {stitchTiles}</label>
					<select
						id="stitchTiles"
						value={stitchTiles}
						onChange={e => setStitchTiles(e.target.value as 'stitch' | 'noStitch')}
					>
						<option value="stitch">拼接</option>
						<option value="noStitch">不拼接</option>
					</select>
				</div>

				<div className="control-group">
					<label htmlFor="amplitude">波纹振幅: {amplitude}</label>
					<input
						type="range"
						id="amplitude"
						min="1"
						max="50"
						value={amplitude}
						step="1"
						onChange={e => setAmplitude(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<label htmlFor="waveType">波纹类型: {waveType}</label>
					<select
						id="waveType"
						value={waveType}
						onChange={e =>
							setWaveType(e.target.value as 'sine' | 'square' | 'triangle' | 'sawtooth')
						}
					>
						<option value="sine">正弦波</option>
						<option value="square">方波</option>
						<option value="triangle">三角波</option>
						<option value="sawtooth">锯齿波</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default SvgWaterRipple;
