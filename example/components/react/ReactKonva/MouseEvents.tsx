import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import './mouse-events.scss';

const MouseEvents: React.FC = () => {
	const [clicked, setClicked] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [dragging, setDragging] = useState<boolean>(false);

	return (
		<div className="mouse-events react-konva-demo-container">
			<div className="status">
				{clicked && <p>点击了: {clicked}</p>}
				{hovered && <p>悬停在: {hovered}</p>}
				{dragging && <p>拖拽中...</p>}
			</div>

			<Stage width={600} height={400} className="demo-stage">
				<Layer>
					{/* 矩形 - 支持点击和拖拽 */}
					<Rect
						x={50}
						y={50}
						width={100}
						height={60}
						fill="#ff6347"
						stroke="#333"
						strokeWidth={2}
						draggable
						onClick={() => setClicked('红色矩形')}
						onMouseOver={() => setHovered('红色矩形')}
						onMouseOut={() => setHovered(null)}
						onDragStart={() => setDragging(true)}
						onDragEnd={() => setDragging(false)}
					/>

					{/* 圆形 - 支持点击和悬停 */}
					<Circle
						x={250}
						y={100}
						radius={40}
						fill="#4169e1"
						stroke="#333"
						strokeWidth={2}
						onClick={() => setClicked('蓝色圆形')}
						onMouseOver={() => setHovered('蓝色圆形')}
						onMouseOut={() => setHovered(null)}
					/>

					{/* 绿色矩形 - 支持点击和拖拽 */}
					<Rect
						x={350}
						y={200}
						width={80}
						height={80}
						fill="#32cd32"
						stroke="#333"
						strokeWidth={2}
						draggable
						onClick={() => setClicked('绿色矩形')}
						onMouseOver={() => setHovered('绿色矩形')}
						onMouseOut={() => setHovered(null)}
						onDragStart={() => setDragging(true)}
						onDragEnd={() => setDragging(false)}
					/>

					{/* 状态文本 */}
					{clicked && <Text text={`点击了: ${clicked}`} x={50} y={350} fontSize={16} fill="#333" />}
				</Layer>
			</Stage>
		</div>
	);
};

export default MouseEvents;
