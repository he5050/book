import React, { useState } from 'react';
import WaveAnimation from './index';

const WaveAnimationExample: React.FC = () => {
	const [amplitude, setAmplitude] = useState(100);
	const [frequency, setFrequency] = useState(0.2);
	const [speed, setSpeed] = useState(0.02);
	const [color, setColor] = useState('cyan');
	const [showProbability, setShowProbability] = useState(true);
	const [probabilityColor, setProbabilityColor] = useState('yellow');

	const handleAmplitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmplitude(Number(e.target.value));
	};

	const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFrequency(Number(e.target.value));
	};

	const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSpeed(Number(e.target.value));
	};

	const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setColor(e.target.value);
	};

	const handleProbabilityColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setProbabilityColor(e.target.value);
	};

	return (
		<div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
			<h1 style={{ textAlign: 'center', marginBottom: '30px' }}>波浪动画效果演示</h1>

			<div style={{ marginBottom: '30px', textAlign: 'center' }}>
				<h2 style={{ marginBottom: '15px' }}>默认波浪动画效果</h2>
				<div
					style={{
						display: 'inline-block',
						backgroundColor: '#222',
						padding: '20px',
						borderRadius: '8px'
					}}
				>
					<WaveAnimation width={500} height={300} />
				</div>
			</div>

			<div style={{ marginBottom: '30px' }}>
				<h2 style={{ marginBottom: '15px', textAlign: 'center' }}>自定义配置波浪动画</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
						padding: '20px',
						backgroundColor: '#222',
						borderRadius: '8px'
					}}
				>
					<div style={{ display: 'inline-block' }}>
						<WaveAnimation
							width={500}
							height={300}
							amplitude={amplitude}
							frequency={frequency}
							speed={speed}
							color={color}
							showProbability={showProbability}
							probabilityColor={probabilityColor}
						/>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '15px',
							width: '100%',
							maxWidth: '800px'
						}}
					>
						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>振幅: {amplitude}</label>
							<input
								type="range"
								min="10"
								max="200"
								value={amplitude}
								onChange={handleAmplitudeChange}
								style={{ width: '100%' }}
							/>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>
								频率: {frequency.toFixed(2)}
							</label>
							<input
								type="range"
								min="0.01"
								max="1"
								step="0.01"
								value={frequency}
								onChange={handleFrequencyChange}
								style={{ width: '100%' }}
							/>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>
								速度: {speed.toFixed(3)}
							</label>
							<input
								type="range"
								min="0.001"
								max="0.1"
								step="0.001"
								value={speed}
								onChange={handleSpeedChange}
								style={{ width: '100%' }}
							/>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>波形颜色</label>
							<select
								value={color}
								onChange={handleColorChange}
								style={{ width: '100%', padding: '5px' }}
							>
								<option value="cyan">青色</option>
								<option value="red">红色</option>
								<option value="green">绿色</option>
								<option value="blue">蓝色</option>
								<option value="magenta">洋红色</option>
								<option value="orange">橙色</option>
							</select>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>
								<input
									type="checkbox"
									checked={showProbability}
									onChange={e => setShowProbability(e.target.checked)}
								/>
								显示概率密度
							</label>
						</div>

						{showProbability && (
							<div>
								<label style={{ display: 'block', marginBottom: '5px' }}>概率密度颜色</label>
								<select
									value={probabilityColor}
									onChange={handleProbabilityColorChange}
									style={{ width: '100%', padding: '5px' }}
								>
									<option value="yellow">黄色</option>
									<option value="white">白色</option>
									<option value="lime">黄绿色</option>
									<option value="pink">粉色</option>
								</select>
							</div>
						)}
					</div>
				</div>
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#333',
					borderRadius: '8px',
					maxWidth: '800px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ marginBottom: '15px' }}>波浪动画特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>基于量子力学波函数原理的可视化实现</li>
					<li style={{ margin: '10px 0' }}>支持自定义振幅、频率、速度等参数</li>
					<li style={{ margin: '10px 0' }}>可选择显示波函数实部和概率密度</li>
					<li style={{ margin: '10px 0' }}>多种颜色选项，满足不同视觉需求</li>
					<li style={{ margin: '10px 0' }}>使用Canvas绘制，性能优异</li>
					<li style={{ margin: '10px 0' }}>使用TypeScript编写，具有完整的类型定义</li>
				</ul>

				<h3 style={{ marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					波浪动画组件通过Canvas绘制动态波函数图像，模拟量子力学中的波包传播现象。
					用户可以通过调整参数来观察不同参数对波形的影响。
				</p>
				<p style={{ marginTop: '10px' }}>
					<strong>Props说明：</strong>
					<br />
					• width: 画布宽度，默认500px
					<br />
					• height: 画布高度，默认300px
					<br />
					• amplitude: 振幅，默认100
					<br />
					• frequency: 频率，默认0.2
					<br />
					• speed: 动画速度，默认0.02
					<br />
					• color: 波形颜色，默认cyan
					<br />
					• showProbability: 是否显示概率密度，默认true
					<br />
					• probabilityColor: 概率密度颜色，默认yellow
					<br />
					• className: 自定义CSS类名
					<br />• style: 自定义内联样式
				</p>
			</div>
		</div>
	);
};

export default WaveAnimationExample;
