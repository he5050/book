import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import './rotatable-rect.scss';

const RotatableRect: React.FC = () => {
	const [rotation, setRotation] = useState(0); // 初始旋转角度为0
	const [scale, setScale] = useState(1); // 缩放比例
	const [color, setColor] = useState('#4361ee'); // 颜色

	// 预定义颜色方案
	const colorSchemes = [
		'#4361ee',
		'#3f37c9',
		'#4cc9f0',
		'#f72585',
		'#2a9d8f',
		'#e9c46a'
	];

	return (
		<div className="rotatable-rect react-konva-demo-container">
			{/* 控制面板 */}
			<div className="controls">
				<div className="control-group">
					<label>旋转角度：{rotation}°</label>
					<input
						type="range"
						min="0"
						max="360"
						value={rotation}
						onChange={e => setRotation(Number(e.target.value))}
						className="rotation-slider"
					/>
				</div>
				
				<div className="control-group">
					<label>缩放比例：{scale.toFixed(1)}</label>
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						value={scale}
						onChange={e => setScale(Number(e.target.value))}
						className="scale-slider"
					/>
				</div>
				
				<div className="color-controls">
					<label>颜色选择：</label>
					<div className="color-palette">
						{colorSchemes.map((colorOption, index) => (
							<div
								key={index}
								className={`color-option ${color === colorOption ? 'selected' : ''}`}
								style={{ backgroundColor: colorOption }}
								onClick={() => setColor(colorOption)}
							/>
						))}
					</div>
				</div>
			</div>

			<Stage width={600} height={200} className="demo-stage">
				<Layer>
					<Rect
						x={150}
						y={100}
						width={100}
						height={60}
						fill={color}
						rotation={rotation}
						scaleX={scale}
						scaleY={scale}
						offsetX={50} // 旋转基准点为矩形中心
						offsetY={30}
						stroke="#fff"
						strokeWidth={2}
						shadowColor="rgba(0, 0, 0, 0.3)"
						shadowBlur={8}
						shadowOffsetX={3}
						shadowOffsetY={3}
						cornerRadius={8}
					/>
					{/* 添加一些装饰性元素 */}
					<Circle
						x={400}
						y={100}
						radius={30}
						fill="#f72585"
						shadowColor="rgba(247, 37, 133, 0.3)"
						shadowBlur={8}
					/>
				</Layer>
			</Stage>
		</div>
	);
};

export default RotatableRect;