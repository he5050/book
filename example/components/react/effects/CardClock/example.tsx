import React, { useState } from 'react';
import CardClock from './index';

const CardClockExample: React.FC = () => {
	const [customTime, setCustomTime] = useState({
		hour: 12,
		minute: 30,
		second: 45
	});

	const [pieceSize, setPieceSize] = useState(10);

	const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 0;
		setCustomTime({
			...customTime,
			hour: Math.min(23, Math.max(0, value))
		});
	};

	const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 0;
		setCustomTime({
			...customTime,
			minute: Math.min(59, Math.max(0, value))
		});
	};

	const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 0;
		setCustomTime({
			...customTime,
			second: Math.min(59, Math.max(0, value))
		});
	};

	const handlePieceSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 10;
		setPieceSize(Math.min(30, Math.max(5, value)));
	};

	return (
		<div style={{ padding: '20px' }}>
			<h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>卡片时钟效果演示</h1>

			<div style={{ marginBottom: '30px', textAlign: 'center' }}>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>默认尺寸 (570px × 400px)</h2>
				<div
					style={{
						display: 'inline-block',
						backgroundColor: '#f0f0f0',
						borderRadius: '8px',
						padding: '20px'
					}}
				>
					<CardClock pieceSize={pieceSize} />
				</div>
			</div>
=======

			<div style={{ marginBottom: '30px' }}>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>自定义时间显示</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
						padding: '20px',
						backgroundColor: '#f0f0f0',
						borderRadius: '8px'
					}}
				>
					<div style={{ display: 'inline-block' }}>
						<CardClock
							hour={customTime.hour}
							minute={customTime.minute}
							second={customTime.second}
							pieceSize={pieceSize}
						/>
					</div>

					<div
						style={{
							display: 'flex',
							gap: '20px',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<div>
							<label style={{ marginRight: '10px' }}>小时:</label>
							<input
								type="number"
								min="0"
								max="23"
								value={customTime.hour}
								onChange={handleHourChange}
								style={{ padding: '5px', width: '60px' }}
							/>
						</div>

						<div>
							<label style={{ marginRight: '10px' }}>分钟:</label>
							<input
								type="number"
								min="0"
								max="59"
								value={customTime.minute}
								onChange={handleMinuteChange}
								style={{ padding: '5px', width: '60px' }}
							/>
						</div>

						<div>
							<label style={{ marginRight: '10px' }}>秒:</label>
							<input
								type="number"
								min="0"
								max="59"
								value={customTime.second}
								onChange={handleSecondChange}
								style={{ padding: '5px', width: '60px' }}
							/>
						</div>

						<div>
							<label style={{ marginRight: '10px' }}>片段大小:</label>
							<input
								type="range"
								min="5"
								max="30"
								value={pieceSize}
								onChange={handlePieceSizeChange}
								style={{ padding: '5px', width: '100px' }}
							/>
							<span style={{ marginLeft: '10px' }}>{pieceSize}px</span>
						</div>
					</div>
				</div>
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
				<h2 style={{ color: '#333', marginBottom: '15px' }}>卡片时钟特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>使用13个片段组合成数字0-9的显示</li>
					<li style={{ margin: '10px 0' }}>通过CSS transition实现平滑的显示/隐藏动画</li>
					<li style={{ margin: '10px 0' }}>支持实时时间显示和自定义时间显示</li>
					<li style={{ margin: '10px 0' }}>可通过pieceSize属性控制片段大小（默认10px）</li>
					<li style={{ margin: '10px 0' }}>可通过containerWidth和containerHeight控制容器尺寸</li>
					<li style={{ margin: '10px 0' }}>使用TypeScript编写，具有完整的类型定义</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					卡片时钟通过13个片段的不同组合来显示数字0-9，布局与原版HTML代码完全一致。
					每个片段都可以通过CSS控制显示或隐藏，从而形成不同的数字形状。
				</p>
				<p style={{ marginTop: '10px' }}>
					<strong>Props说明：</strong><br/>
					• pieceSize: 片段大小，默认10px<br/>
					• containerWidth: 容器宽度，默认570px<br/>
					• containerHeight: 容器高度，默认400px<br/>
					• hour/minute/second: 自定义时间，不传则显示当前时间
				</p>
			</div>
		</div>
	);
};

export default CardClockExample;
