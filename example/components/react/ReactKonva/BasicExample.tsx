import React, { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import './basic-example.scss';

// 配色方案
const COLOR_SCHEMES = {
	modern: {
		primary: '#4361ee',
		secondary: '#3f37c9',
		accent: '#4895ef',
		success: '#4cc9f0',
		warning: '#f72585'
	},
	vibrant: {
		primary: '#ff6b6b',
		secondary: '#4ecdc4',
		accent: '#1a535c',
		success: '#ffe66d',
		warning: '#ff9f1c'
	},
	professional: {
		primary: '#2a9d8f',
		secondary: '#e9c46a',
		accent: '#f4a261',
		success: '#e76f51',
		warning: '#264653'
	}
};

const BasicExample: React.FC = () => {
	// 状态：存储所有矩形的信息（位置、大小、颜色）
	const [rectangles, setRectangles] = useState([
		{ x: 50, y: 50, width: 100, height: 60, color: COLOR_SCHEMES.modern.primary },
		{ x: 200, y: 50, width: 120, height: 70, color: COLOR_SCHEMES.modern.secondary },
		{ x: 350, y: 50, width: 80, height: 80, color: COLOR_SCHEMES.modern.accent }
	]);
	
	// 状态：记录当前是否在拖拽矩形
	const [isDragging, setIsDragging] = useState(false);
	
	// 状态：当前配色方案
	const [colorScheme, setColorScheme] = useState('modern');

	// 新增矩形：在随机位置添加一个蓝色矩形
	const addRectangle = () => {
		const colors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES];
		const colorKeys = Object.keys(colors);
		const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors];
		
		setRectangles([
			...rectangles,
			{
				x: Math.random() * 400, // 随机X坐标（Stage宽度为500）
				y: Math.random() * 300, // 随机Y坐标（Stage高度为400）
				width: 80 + Math.random() * 60, // 随机宽度
				height: 50 + Math.random() * 40, // 随机高度
				color: randomColor
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

	// 切换配色方案
	const handleColorSchemeChange = (scheme: string) => {
		setColorScheme(scheme);
		const colors = COLOR_SCHEMES[scheme as keyof typeof COLOR_SCHEMES];
		setRectangles(rectangles.map((rect, index) => ({
			...rect,
			color: Object.values(colors)[index % Object.values(colors).length]
		})));
	};

	// 清空所有矩形
	const clearRectangles = () => {
		setRectangles([]);
	};

	return (
		<div className="basic-example react-konva-demo-container">
			<div className="controls">
				{/* 按钮：触发新增矩形 */}
				<button onClick={addRectangle} className="control-button">
					添加矩形
				</button>
				<button onClick={clearRectangles} className="control-button clear-button">
					清空画布
				</button>
				{/* 配色方案选择 */}
				<div className="color-scheme-selector">
					<label>配色方案:</label>
					<select 
						value={colorScheme} 
						onChange={(e) => handleColorSchemeChange(e.target.value)}
						className="scheme-select"
					>
						<option value="modern">现代</option>
						<option value="vibrant">鲜艳</option>
						<option value="professional">专业</option>
					</select>
				</div>
				{/* 拖拽状态提示 */}
				{isDragging && <Text text="拖拽中..." x={200} y={10} fontSize={16} fill="#333" />}
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
							stroke="#fff" // 边框颜色
							strokeWidth={2} // 边框宽度
							draggable // 允许拖拽
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							shadowColor="rgba(0, 0, 0, 0.3)"
							shadowBlur={5}
							shadowOffsetX={2}
							shadowOffsetY={2}
							// 鼠标悬停时显示指针
							onMouseOver={e => {
								e.target.setAttrs({ 
									stroke: '#ff0', // 悬停时边框变黄
									shadowBlur: 10
								});
							}}
							onMouseOut={e => {
								e.target.setAttrs({ 
									stroke: '#fff', // 离开时恢复边框颜色
									shadowBlur: 5
								});
							}}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default BasicExample;