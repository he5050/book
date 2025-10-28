import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import './complex-animation.scss';

const ComplexAnimation: React.FC = () => {
	// 定义动画关键帧：x从50→400，y从50→250，同时旋转360度
	const animationConfig = {
		x: [50, 400],
		y: [50, 250],
		rotation: [0, 360], // 旋转角度（单位：度）
		duration: 2000, // 动画时长（ms）
		easing: 'EaseInOut' // 缓动函数
	};

	return (
		<div className="complex-animation react-konva-demo-container">
			<Stage width={600} height={300} className="demo-stage">
				<Layer>
					<Rect
						width={80}
						height={50}
						fill="#ff4500"
						offsetX={40} // 旋转中心点（矩形中心）
						offsetY={25}
						x={50}
						y={50}
					/>
				</Layer>
			</Stage>
		</div>
	);
};

export default ComplexAnimation;
