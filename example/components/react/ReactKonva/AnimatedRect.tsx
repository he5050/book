import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import './animated-rect.scss';

const AnimatedRect: React.FC = () => {
	const [scale, setScale] = useState(1); // 缩放比例，初始为1
	const [growing, setGrowing] = useState(true); // 是否正在放大
	const [rotation, setRotation] = useState(0); // 旋转角度
	const [position, setPosition] = useState({ x: 100, y: 50 }); // 位置

	// 每30ms更新一次缩放比例，实现动画效果
	useEffect(() => {
		const timer = setInterval(() => {
			setScale(prev => {
				// 放大到1.2后开始缩小，缩小到0.8后开始放大
				if (prev >= 1.2) setGrowing(false);
				if (prev <= 0.8) setGrowing(true);
				return growing ? prev + 0.01 : prev - 0.01;
			});

			// 旋转动画
			setRotation(prev => (prev + 2) % 360);

			// 位置动画（轻微摆动）
			setPosition(prev => ({
				x: 100 + Math.sin(Date.now() / 1000) * 20,
				y: 50 + Math.cos(Date.now() / 1000) * 10
			}));
		}, 30);

		// 组件卸载时清除定时器，避免内存泄漏
		return () => clearInterval(timer);
	}, [growing]);

	return (
		<div className="animated-rect react-konva-demo-container">
			<Stage width={600} height={200} className="demo-stage">
				<Layer>
					<Rect
						x={position.x}
						y={position.y}
						width={100}
						height={60}
						fill="#4361ee"
						scaleX={scale} // X轴缩放比例
						scaleY={scale} // Y轴缩放比例
						offsetX={50} // 缩放中心点X（矩形宽度的一半）
						offsetY={30} // 缩放中心点Y（矩形高度的一半）
						rotation={rotation}
						shadowColor="rgba(0, 0, 0, 0.3)"
						shadowBlur={10}
						shadowOffsetX={5}
						shadowOffsetY={5}
						cornerRadius={10}
					/>
					{/* 添加一些装饰性圆形 */}
					<Circle
						x={400}
						y={100}
						radius={30}
						fill="#4cc9f0"
						shadowColor="rgba(0, 0, 0, 0.2)"
						shadowBlur={8}
					/>
					<Circle
						x={500}
						y={100}
						radius={20}
						fill="#f72585"
						shadowColor="rgba(0, 0, 0, 0.2)"
						shadowBlur={8}
					/>
				</Layer>
			</Stage>
		</div>
	);
};

export default AnimatedRect;
