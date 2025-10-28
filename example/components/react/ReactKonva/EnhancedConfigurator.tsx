import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import './enhanced-configurator.scss';

interface ShapeConfig {
	id: string;
	type: 'rect' | 'circle';
	x: number;
	y: number;
	width?: number;
	height?: number;
	radius?: number;
	fill: string;
	stroke: string;
	strokeWidth: number;
	draggable: boolean;
	rotation?: number;
}

interface ConfiguratorProps {
	initialWidth?: number;
	initialHeight?: number;
}

const EnhancedConfigurator: React.FC<ConfiguratorProps> = ({
	initialWidth = 600,
	initialHeight = 400
}) => {
	// 画布配置
	const [stageConfig, setStageConfig] = useState({
		width: initialWidth,
		height: initialHeight,
		background: '#f0f0f0'
	});

	// 形状配置
	const [shapes, setShapes] = useState<ShapeConfig[]>([
		{
			id: 'rect1',
			type: 'rect',
			x: 50,
			y: 50,
			width: 100,
			height: 60,
			fill: '#ff6b6b',
			stroke: '#333',
			strokeWidth: 2,
			draggable: true
		},
		{
			id: 'circle1',
			type: 'circle',
			x: 200,
			y: 100,
			radius: 40,
			fill: '#4ecdc4',
			stroke: '#333',
			strokeWidth: 2,
			draggable: true
		},
		{
			id: 'rect2',
			type: 'rect',
			x: 300,
			y: 150,
			width: 80,
			height: 80,
			fill: '#1a535c',
			stroke: '#333',
			strokeWidth: 2,
			draggable: true,
			rotation: 45
		}
	]);

	// 新形状配置
	const [newShapeConfig, setNewShapeConfig] = useState({
		type: 'rect' as 'rect' | 'circle',
		fill: '#ffe66d',
		stroke: '#333',
		strokeWidth: 2,
		draggable: true,
		width: 80,
		height: 60,
		radius: 30
	});

	// 添加新形状
	const addShape = () => {
		const newShape: ShapeConfig = {
			id: `shape-${Date.now()}`,
			type: newShapeConfig.type,
			x: Math.random() * (stageConfig.width - 100),
			y: Math.random() * (stageConfig.height - 100),
			fill: newShapeConfig.fill,
			stroke: newShapeConfig.stroke,
			strokeWidth: newShapeConfig.strokeWidth,
			draggable: newShapeConfig.draggable
		};

		if (newShapeConfig.type === 'rect') {
			newShape.width = newShapeConfig.width;
			newShape.height = newShapeConfig.height;
		} else {
			newShape.radius = newShapeConfig.radius;
		}

		setShapes([...shapes, newShape]);
	};

	// 删除形状
	const removeShape = (id: string) => {
		setShapes(shapes.filter(shape => shape.id !== id));
	};

	// 更新形状位置
	const handleDragEnd = (id: string, e: any) => {
		setShapes(
			shapes.map(shape => {
				if (shape.id === id) {
					return { ...shape, x: e.target.x(), y: e.target.y() };
				}
				return shape;
			})
		);
	};

	// 清空所有形状
	const clearShapes = () => {
		setShapes([]);
	};

	return (
		<div className="enhanced-configurator react-konva-demo-container">
			<div className="config-panel">
				<h3>配置面板</h3>
				
				<div className="config-section">
					<h4>画布设置</h4>
					<div className="config-row">
						<label>宽度:</label>
						<input
							type="range"
							min="400"
							max="800"
							value={stageConfig.width}
							onChange={e => setStageConfig({ ...stageConfig, width: parseInt(e.target.value) })}
						/>
						<span>{stageConfig.width}px</span>
					</div>
					<div className="config-row">
						<label>高度:</label>
						<input
							type="range"
							min="300"
							max="600"
							value={stageConfig.height}
							onChange={e => setStageConfig({ ...stageConfig, height: parseInt(e.target.value) })}
						/>
						<span>{stageConfig.height}px</span>
					</div>
					<div className="config-row">
						<label>背景色:</label>
						<input
							type="color"
							value={stageConfig.background}
							onChange={e => setStageConfig({ ...stageConfig, background: e.target.value })}
						/>
					</div>
				</div>

				<div className="config-section">
					<h4>新形状设置</h4>
					<div className="config-row">
						<label>类型:</label>
						<select
							value={newShapeConfig.type}
							onChange={e => setNewShapeConfig({ ...newShapeConfig, type: e.target.value as 'rect' | 'circle' })}
						>
							<option value="rect">矩形</option>
							<option value="circle">圆形</option>
						</select>
					</div>
					{newShapeConfig.type === 'rect' && (
						<>
							<div className="config-row">
								<label>宽度:</label>
								<input
									type="range"
									min="20"
									max="200"
									value={newShapeConfig.width}
									onChange={e => setNewShapeConfig({ ...newShapeConfig, width: parseInt(e.target.value) })}
								/>
								<span>{newShapeConfig.width}px</span>
							</div>
							<div className="config-row">
								<label>高度:</label>
								<input
									type="range"
									min="20"
									max="200"
									value={newShapeConfig.height}
									onChange={e => setNewShapeConfig({ ...newShapeConfig, height: parseInt(e.target.value) })}
								/>
								<span>{newShapeConfig.height}px</span>
							</div>
						</>
					)}
					{newShapeConfig.type === 'circle' && (
						<div className="config-row">
							<label>半径:</label>
							<input
								type="range"
								min="10"
								max="100"
								value={newShapeConfig.radius}
								onChange={e => setNewShapeConfig({ ...newShapeConfig, radius: parseInt(e.target.value) })}
							/>
							<span>{newShapeConfig.radius}px</span>
						</div>
					)}
					<div className="config-row">
						<label>填充色:</label>
						<input
							type="color"
							value={newShapeConfig.fill}
							onChange={e => setNewShapeConfig({ ...newShapeConfig, fill: e.target.value })}
						/>
					</div>
					<div className="config-row">
						<label>边框色:</label>
						<input
							type="color"
							value={newShapeConfig.stroke}
							onChange={e => setNewShapeConfig({ ...newShapeConfig, stroke: e.target.value })}
						/>
					</div>
					<div className="config-row">
						<label>边框宽度:</label>
						<input
							type="range"
							min="0"
							max="10"
							value={newShapeConfig.strokeWidth}
							onChange={e => setNewShapeConfig({ ...newShapeConfig, strokeWidth: parseInt(e.target.value) })}
						/>
						<span>{newShapeConfig.strokeWidth}px</span>
					</div>
					<div className="config-row">
						<label>可拖拽:</label>
						<input
							type="checkbox"
							checked={newShapeConfig.draggable}
							onChange={e => setNewShapeConfig({ ...newShapeConfig, draggable: e.target.checked })}
						/>
					</div>
				</div>

				<div className="control-buttons">
					<button onClick={addShape} className="control-button add-button">
						添加形状
					</button>
					<button onClick={clearShapes} className="control-button clear-button">
						清空画布
					</button>
				</div>
			</div>

			<div className="canvas-panel">
				<Stage
					width={stageConfig.width}
					height={stageConfig.height}
					className="demo-stage"
					style={{ backgroundColor: stageConfig.background }}
				>
					<Layer>
						{shapes.map(shape => {
							if (shape.type === 'rect' && shape.width && shape.height) {
								return (
									<Rect
										key={shape.id}
										x={shape.x}
										y={shape.y}
										width={shape.width}
										height={shape.height}
										fill={shape.fill}
										stroke={shape.stroke}
										strokeWidth={shape.strokeWidth}
										draggable={shape.draggable}
										rotation={shape.rotation}
										onDragEnd={e => handleDragEnd(shape.id, e)}
										ondblclick={() => removeShape(shape.id)}
										onTap={() => removeShape(shape.id)}
									/>
								);
							} else if (shape.type === 'circle' && shape.radius) {
								return (
									<Circle
										key={shape.id}
										x={shape.x}
										y={shape.y}
										radius={shape.radius}
										fill={shape.fill}
										stroke={shape.stroke}
										strokeWidth={shape.strokeWidth}
										draggable={shape.draggable}
										onDragEnd={e => handleDragEnd(shape.id, e)}
										ondblclick={() => removeShape(shape.id)}
										onTap={() => removeShape(shape.id)}
									/>
								);
							}
							return null;
						})}
						<Text
							text="双击形状可删除"
							x={10}
							y={10}
							fontSize={14}
							fill="#666"
						/>
					</Layer>
				</Stage>
			</div>
		</div>
	);
};

export default EnhancedConfigurator;