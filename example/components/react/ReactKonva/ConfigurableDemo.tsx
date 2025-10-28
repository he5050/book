import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
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
	fillColor = '#4169e1',
	strokeColor = '#333',
	strokeWidth = 2,
	draggable = true
}) => {
	// 生成矩形数据
	const generateRectangles = () => {
		return Array.from({ length: rectCount }, (_, i) => ({
			id: i,
			x: 50 + ((i * 80) % (width - 100)),
			y: 50 + Math.floor(i / 5) * 80,
			width: 60,
			height: 40,
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			draggable: draggable
		}));
	};

	const [rectangles] = useState(generateRectangles());

	return (
		<div className="configurable-demo react-konva-demo-container">
			<Stage width={width} height={height} className="demo-stage">
				<Layer>
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
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default ConfigurableDemo;
