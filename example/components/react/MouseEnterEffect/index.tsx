import React, { useState, useRef, useEffect } from 'react';
import './index.scss';

interface MouseEnterEffectProps {
	boxCount?: number;
	boxWidth?: number;
	boxHeight?: number;
	backgroundColor?: string;
	effectColor?: string;
	borderRadius?: number;
	className?: string;
	style?: React.CSSProperties;
	onBoxEnter?: (index: number) => void;
	onBoxLeave?: (index: number) => void;
}

const MouseEnterEffect: React.FC<MouseEnterEffectProps> = ({
	boxCount = 2,
	boxWidth = 300,
	boxHeight = 420,
	backgroundColor = '#232323',
	effectColor = '#9dbc28',
	borderRadius = 20,
	className = '',
	style = {},
	onBoxEnter,
	onBoxLeave
}) => {
	const [boxes, setBoxes] = useState<Array<{ x: number; y: number }>>(
		Array(boxCount).fill({ x: 0, y: 0 })
	);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
		if (containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const x = e.clientX - containerRect.left;
			const y = e.clientY - containerRect.top;

			setBoxes(prev => {
				const newBoxes = [...prev];
				newBoxes[index] = { x, y };
				return newBoxes;
			});
		}
	};

	const handleBoxEnter = (index: number) => {
		onBoxEnter?.(index);
	};

	const handleBoxLeave = (index: number) => {
		onBoxLeave?.(index);
	};

	// 初始化盒子数组
	useEffect(() => {
		setBoxes(Array(boxCount).fill({ x: 0, y: 0 }));
	}, [boxCount]);

	return (
		<div
			ref={containerRef}
			className={`mouse-enter-effect-container ${className}`}
			style={
				{
					...style,
					'--box-width': `${boxWidth}px`,
					'--box-height': `${boxHeight}px`,
					'--bg-color': backgroundColor,
					'--effect-color': effectColor,
					'--border-radius': `${borderRadius}px`
				} as React.CSSProperties
			}
		>
			<div className="boxes-container">
				{boxes.map((_, index) => (
					<div
						key={index}
						className="effect-box"
						onMouseMove={e => handleMouseMove(index, e)}
						onMouseEnter={() => handleBoxEnter(index)}
						onMouseLeave={() => handleBoxLeave(index)}
						style={
							{
								'--mouse-x': `${boxes[index].x}px`,
								'--mouse-y': `${boxes[index].y}px`
							} as React.CSSProperties
						}
					/>
				))}
			</div>

			{/* 配置面板 */}
			<div className="config-panel">
				<h3>鼠标移入移出效果配置</h3>
				<div className="config-item">
					<label>盒子数量: {boxCount}</label>
					<input
						type="range"
						min="1"
						max="5"
						value={boxCount}
						onChange={e => {
							const count = parseInt(e.target.value);
							setBoxes(Array(count).fill({ x: 0, y: 0 }));
						}}
					/>
				</div>

				<div className="config-item">
					<label>盒子宽度: {boxWidth}px</label>
					<input
						type="range"
						min="200"
						max="500"
						value={boxWidth}
						onChange={e => {
							// 更新CSS变量
							if (containerRef.current) {
								containerRef.current.style.setProperty('--box-width', `${e.target.value}px`);
							}
						}}
					/>
				</div>

				<div className="config-item">
					<label>盒子高度: {boxHeight}px</label>
					<input
						type="range"
						min="300"
						max="600"
						value={boxHeight}
						onChange={e => {
							// 更新CSS变量
							if (containerRef.current) {
								containerRef.current.style.setProperty('--box-height', `${e.target.value}px`);
							}
						}}
					/>
				</div>

				<div className="config-item">
					<label>背景颜色:</label>
					<input
						type="color"
						value={backgroundColor}
						onChange={e => {
							// 更新CSS变量
							if (containerRef.current) {
								containerRef.current.style.setProperty('--bg-color', e.target.value);
							}
						}}
					/>
				</div>

				<div className="config-item">
					<label>效果颜色:</label>
					<input
						type="color"
						value={effectColor}
						onChange={e => {
							// 更新CSS变量
							if (containerRef.current) {
								containerRef.current.style.setProperty('--effect-color', e.target.value);
							}
						}}
					/>
				</div>

				<div className="config-item">
					<label>圆角大小: {borderRadius}px</label>
					<input
						type="range"
						min="0"
						max="50"
						value={borderRadius}
						onChange={e => {
							const radius = parseInt(e.target.value);
							// 更新CSS变量
							if (containerRef.current) {
								containerRef.current.style.setProperty('--border-radius', `${radius}px`);
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default MouseEnterEffect;
