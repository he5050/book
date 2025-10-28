import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import './complex-animation.scss';

const ComplexAnimation: React.FC = () => {
	const [time, setTime] = useState(0);
	const [positions, setPositions] = useState({
		rect1: { x: 50, y: 50 },
		circle1: { x: 200, y: 100 },
		rect2: { x: 350, y: 150 }
	});

	// 动画循环
	useEffect(() => {
		const interval = setInterval(() => {
			setTime(prev => prev + 0.05);
		}, 50);

		return () => clearInterval(interval);
	}, []);

	// 根据时间更新位置
	useEffect(() => {
		setPositions({
			rect1: {
				x: 50 + Math.sin(time) * 100,
				y: 50 + Math.cos(time * 0.7) * 50
			},
			circle1: {
				x: 200 + Math.cos(time * 1.2) * 80,
				y: 100 + Math.sin(time * 0.8) * 60
			},
			rect2: {
				x: 350 + Math.sin(time * 1.5) * 60,
				y: 150 + Math.cos(time * 1.3) * 40
			}
		});
	}, [time]);

	// 计算旋转角度
	const rotation = time * 30;

	return (
		<div className="complex-animation react-konva-demo-container">
			<Stage width={600} height={300} className="demo-stage">
				<Layer>
					{/* 背景网格 */}
					{Array.from({ length: 20 }).map((_, i) => (
						<React.Fragment key={i}>
							<Rect
								x={i * 30}
								y={0}
								width={1}
								height={300}
								fill="rgba(200, 200, 200, 0.3)"
							/>
							<Rect
								x={0}
								y={i * 30}
								width={600}
								height={1}
								fill="rgba(200, 200, 200, 0.3)"
							/>
						</React.Fragment>
					))}
					
					{/* 移动的矩形 */}
					<Rect
						x={positions.rect1.x}
						y={positions.rect1.y}
						width={80}
						height={50}
						fill="#4361ee"
						rotation={rotation}
						offsetX={40}
						offsetY={25}
						stroke="#fff"
						strokeWidth={2}
						shadowColor="rgba(67, 97, 238, 0.4)"
						shadowBlur={12}
						shadowOffsetX={4}
						shadowOffsetY={4}
						cornerRadius={10}
					/>
					
					{/* 移动的圆形 */}
					<Circle
						x={positions.circle1.x}
						y={positions.circle1.y}
						radius={40}
						fill="#f72585"
						stroke="#fff"
						strokeWidth={2}
						shadowColor="rgba(247, 37, 133, 0.4)"
						shadowBlur={12}
						shadowOffsetX={4}
						shadowOffsetY={4}
					/>
					
					{/* 旋转的矩形 */}
					<Rect
						x={positions.rect2.x}
						y={positions.rect2.y}
						width={60}
						height={60}
						fill="#4cc9f0"
						rotation={-rotation}
						offsetX={30}
						offsetY={30}
						stroke="#fff"
						strokeWidth={2}
						shadowColor="rgba(76, 201, 240, 0.4)"
						shadowBlur={12}
						shadowOffsetX={4}
						shadowOffsetY={4}
					/>
					
					{/* 标题文本 */}
					<Text
						text="复杂动画演示"
						x={200}
						y={20}
						fontSize={24}
						fontStyle="bold"
						fill="#333"
						shadowColor="rgba(0, 0, 0, 0.2)"
						shadowBlur={4}
					/>
					
					{/* 时间显示 */}
					<Text
						text={`时间: ${time.toFixed(2)}s`}
						x={20}
						y={260}
						fontSize={16}
						fill="#666"
					/>
				</Layer>
			</Stage>
		</div>
	);
};

export default ComplexAnimation;