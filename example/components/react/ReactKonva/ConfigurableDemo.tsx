import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import './configurable-demo.scss';

interface ConfigurableDemoProps {
	width?: number;
	height?: number;
	rectCount?: number;
	fillColor?: string;
	strokeColor?: string;
	strokeWidth?: number;
	draggable?: boolean;
}

const ConfigurableDemo: React.FC<ConfigurableDemoProps> = ({
	width = 600,
	height = 400,
	rectCount = 5,
	fillColor = '#4361ee',
	strokeColor = '#fff',
	strokeWidth = 2,
	draggable = true
}) => {
	// 生成矩形数据
	const generateRectangles = () => {
		return Array.from({ length: rectCount }, (_, i) => ({
			id: `rect-${i}`,
			x: 50 + ((i * 100) % (width - 150)),
			y: 50 + Math.floor(i / 5) * 80,
			width: 80,
			height: 60,
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			draggable: draggable,
			radius: i % 2 === 0 ? 0 : 10 // 交替圆角
		}));
	};

	// 生成圆形数据
	const generateCircles = () => {
		return Array.from({ length: Math.max(1, Math.floor(rectCount / 2)) }, (_, i) => ({
			id: `circle-${i}`,
			x: 100 + ((i * 120) % (width - 150)),
			y: 200 + Math.floor(i / 3) * 100,
			radius: 30,
			fill: '#f72585',
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			draggable: draggable
		}));
	};

	const [rectangles] = useState(generateRectangles());
	const [circles] = useState(generateCircles());

	return (
		<div className="configurable-demo react-konva-demo-container">
			<Stage width={width} height={height} className="demo-stage">
				<Layer>
					{/* 背景装饰 */}
					<Rect x={0} y={0} width={width} height={height} fill="rgba(248, 249, 250, 0.8)" />

					{/* 矩形元素 */}
					{rectangles.map(rect => (
						<Rect
							key={rect.id}
							x={rect.x}
							y={rect.y}
							width={rect.width}
							height={rect.height}
							fill={rect.fill}
							stroke={rect.stroke}
							strokeWidth={rect.strokeWidth}
							draggable={rect.draggable}
							cornerRadius={rect.radius}
							shadowColor="rgba(0, 0, 0, 0.2)"
							shadowBlur={6}
							shadowOffsetX={2}
							shadowOffsetY={2}
						/>
					))}

					{/* 圆形元素 */}
					{circles.map(circle => (
						<Circle
							key={circle.id}
							x={circle.x}
							y={circle.y}
							radius={circle.radius}
							fill={circle.fill}
							stroke={circle.stroke}
							strokeWidth={circle.strokeWidth}
							draggable={circle.draggable}
							shadowColor="rgba(0, 0, 0, 0.2)"
							shadowBlur={6}
							shadowOffsetX={2}
							shadowOffsetY={2}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default ConfigurableDemo;
