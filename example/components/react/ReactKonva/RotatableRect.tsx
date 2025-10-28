import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import './rotatable-rect.scss';

const RotatableRect: React.FC = () => {
	const [rotation, setRotation] = useState(0); // 初始旋转角度为0

	return (
		<div className="rotatable-rect react-konva-demo-container">
			{/* 滑块：控制旋转角度（0~360度） */}
			<div className="controls">
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

			<Stage width={600} height={200} className="demo-stage">
				<Layer>
					<Rect
						x={150}
						y={100}
						width={100}
						height={60}
						fill="#9370db"
						rotation={rotation}
						offsetX={50} // 旋转基准点为矩形中心
						offsetY={30}
						stroke="#333"
						strokeWidth={2}
					/>
				</Layer>
			</Stage>
		</div>
	);
};

export default RotatableRect;
