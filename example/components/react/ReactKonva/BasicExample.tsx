import React, { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import './basic-example.scss';

const BasicExample: React.FC = () => {
	// 状态：存储所有矩形的信息（位置、大小、颜色）
	const [rectangles, setRectangles] = useState([
		{ x: 50, y: 50, width: 100, height: 60, color: '#ff6347' }
	]);
	// 状态：记录当前是否在拖拽矩形
	const [isDragging, setIsDragging] = useState(false);

	// 新增矩形：在随机位置添加一个蓝色矩形
	const addRectangle = () => {
		setRectangles([
			...rectangles,
			{
				x: Math.random() * 400, // 随机X坐标（Stage宽度为500）
				y: Math.random() * 300, // 随机Y坐标（Stage高度为400）
				width: 80 + Math.random() * 60, // 随机宽度
				height: 50 + Math.random() * 40, // 随机高度
				color: '#4169e1'
			}
		]);
	};

	// 拖拽事件：开始拖拽时更新状态
	const handleDragStart = () => {
		setIsDragging(true);
	};

	// 拖拽事件：结束拖拽时更新状态
	const handleDragEnd = (e: any) => {
		setIsDragging(false);
		// 更新被拖拽矩形的最终位置
		const updatedRects = rectangles.map((rect, index) => {
			if (index === e.target.index) {
				// e.target.index 是当前图形在父组件中的索引
				return { ...rect, x: e.target.x(), y: e.target.y() };
			}
			return rect;
		});
		setRectangles(updatedRects);
	};

	return (
		<div className="basic-example react-konva-demo-container">
			<div className="controls">
				{/* 按钮：触发新增矩形 */}
				<button onClick={addRectangle} className="control-button">
					添加矩形
				</button>
				{/* 拖拽状态提示 */}
				{isDragging && <Text text="拖拽中..." x={200} y={10} fontSize={16} />}
			</div>

			{/* Stage：画布容器，width/height 定义画布大小 */}
			<Stage width={600} height={400} className="demo-stage">
				{/* Layer：渲染层，所有图形元素必须放在Layer内 */}
				<Layer>
					{/* 遍历渲染所有矩形 */}
					{rectangles.map((rect, index) => (
						<Rect
							key={index} // 建议使用唯一ID，此处为简化用index
							x={rect.x}
							y={rect.y}
							width={rect.width}
							height={rect.height}
							fill={rect.color}
							stroke="#333" // 边框颜色
							strokeWidth={2} // 边框宽度
							draggable // 允许拖拽
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							// 鼠标悬停时显示指针
							onMouseOver={e => {
								e.target.setAttrs({ stroke: '#ff0' }); // 悬停时边框变黄
							}}
							onMouseOut={e => {
								e.target.setAttrs({ stroke: '#333' }); // 离开时恢复边框颜色
							}}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default BasicExample;
