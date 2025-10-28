import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import './mouse-events.scss';

const MouseEvents: React.FC = () => {
	const [clicked, setClicked] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [dragging, setDragging] = useState<boolean>(false);
	const [positions, setPositions] = useState({
		rect1: { x: 50, y: 50 },
		circle1: { x: 250, y: 100 },
		rect2: { x: 400, y: 150 }
	});

	// 处理拖拽结束事件
	const handleDragEnd = (id: string, e: any) => {
		setDragging(false);
		setPositions({
			...positions,
			[id]: { x: e.target.x(), y: e.target.y() }
		});
	};

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
						x={positions.rect1.x}
						y={positions.rect1.y}
						width={100}
						height={60}
						fill="#4361ee"
						stroke="#fff"
						strokeWidth={2}
						draggable
						onClick={() => setClicked('蓝色矩形')}
						onMouseOver={() => setHovered('蓝色矩形')}
						onMouseOut={() => setHovered(null)}
						onDragStart={() => setDragging(true)}
						onDragEnd={e => handleDragEnd('rect1', e)}
						shadowColor="rgba(67, 97, 238, 0.3)"
						shadowBlur={10}
						shadowOffsetX={3}
						shadowOffsetY={3}
						cornerRadius={8}
					/>

					{/* 圆形 - 支持点击和悬停 */}
					<Circle
						x={positions.circle1.x}
						y={positions.circle1.y}
						radius={40}
						fill="#4cc9f0"
						stroke="#fff"
						strokeWidth={2}
						onClick={() => setClicked('青色圆形')}
						onMouseOver={() => setHovered('青色圆形')}
						onMouseOut={() => setHovered(null)}
						shadowColor="rgba(76, 201, 240, 0.3)"
						shadowBlur={10}
						shadowOffsetX={3}
						shadowOffsetY={3}
					/>

					{/* 绿色矩形 - 支持点击和拖拽 */}
					<Rect
						x={positions.rect2.x}
						y={positions.rect2.y}
						width={80}
						height={80}
						fill="#2a9d8f"
						stroke="#fff"
						strokeWidth={2}
						draggable
						onClick={() => setClicked('绿色矩形')}
						onMouseOver={() => setHovered('绿色矩形')}
						onMouseOut={() => setHovered(null)}
						onDragStart={() => setDragging(true)}
						onDragEnd={e => handleDragEnd('rect2', e)}
						rotation={45}
						shadowColor="rgba(42, 157, 143, 0.3)"
						shadowBlur={10}
						shadowOffsetX={3}
						shadowOffsetY={3}
					/>

					{/* 状态文本 */}
					{clicked && (
						<Text
							text={`点击了: ${clicked}`}
							x={30}
							y={350}
							fontSize={16}
							fill="#333"
							fontStyle="bold"
						/>
					)}
					{hovered && <Text text={`悬停在: ${hovered}`} x={30} y={370} fontSize={14} fill="#666" />}
				</Layer>
			</Stage>
		</div>
	);
};

export default MouseEvents;
