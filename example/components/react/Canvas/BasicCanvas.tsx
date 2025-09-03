import React, { useEffect, useRef } from 'react';

/**
 * 基础 Canvas 组件 - 展示画布尺寸概念
 *
 * 展示三种不同的 Canvas 配置：
 * 1. 默认 Canvas - 未设置尺寸
 * 2. HTML 属性设置尺寸 - 通过 width/height 属性设置画布尺寸
 * 3. CSS 样式设置尺寸 - 通过 style 设置画板尺寸
 * 4. 尺寸不一致 - 画布尺寸和画板尺寸不一致导致的问题
 */
const BasicCanvas: React.FC = () => {
	// 引用四个不同的 Canvas 元素
	const defaultCanvasRef = useRef<HTMLCanvasElement>(null);
	const htmlSizeCanvasRef = useRef<HTMLCanvasElement>(null);
	const cssSizeCanvasRef = useRef<HTMLCanvasElement>(null);
	const mismatchCanvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		// 绘制默认 Canvas
		if (defaultCanvasRef.current) {
			const ctx = defaultCanvasRef.current.getContext('2d');
			if (ctx) {
				drawPattern(ctx, '#ff6b6b');
			}
		}

		// 绘制 HTML 属性设置尺寸的 Canvas
		if (htmlSizeCanvasRef.current) {
			const ctx = htmlSizeCanvasRef.current.getContext('2d');
			if (ctx) {
				drawPattern(ctx, '#4ecdc4');
			}
		}

		// 绘制 CSS 样式设置尺寸的 Canvas
		if (cssSizeCanvasRef.current) {
			const ctx = cssSizeCanvasRef.current.getContext('2d');
			if (ctx) {
				drawPattern(ctx, '#ffbe0b');
			}
		}

		// 绘制尺寸不一致的 Canvas
		if (mismatchCanvasRef.current) {
			const ctx = mismatchCanvasRef.current.getContext('2d');
			if (ctx) {
				// 在画布尺寸上绘制一个精确的网格
				drawGrid(ctx, '#8338ec');
			}
		}
	}, []);

	/**
	 * 绘制彩色图案
	 * @param ctx Canvas 上下文
	 * @param color 主色调
	 */
	const drawPattern = (ctx: CanvasRenderingContext2D, color: string) => {
		// 清空画布
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// 绘制背景
		ctx.fillStyle = '#f8f9fa';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// 绘制边框
		ctx.strokeStyle = color;
		ctx.lineWidth = 4;
		ctx.strokeRect(10, 10, ctx.canvas.width - 20, ctx.canvas.height - 20);

		// 绘制文本
		ctx.fillStyle = '#333';
		ctx.font = '14px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(
			`Canvas 尺寸: ${ctx.canvas.width} × ${ctx.canvas.height}`,
			ctx.canvas.width / 2,
			ctx.canvas.height / 2
		);

		// 绘制装饰圆形
		ctx.beginPath();
		ctx.arc(ctx.canvas.width / 2, 30, 10, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
	};

	/**
	 * 绘制精确网格
	 * @param ctx Canvas 上下文
	 * @param color 网格颜色
	 */
	const drawGrid = (ctx: CanvasRenderingContext2D, color: string) => {
		// 清空画布
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// 绘制背景
		ctx.fillStyle = '#f8f9fa';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// 绘制网格
		const gridSize = 20;
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;

		// 绘制垂直线
		for (let x = 0; x <= ctx.canvas.width; x += gridSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, ctx.canvas.height);
			ctx.stroke();
		}

		// 绘制水平线
		for (let y = 0; y <= ctx.canvas.height; y += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(ctx.canvas.width, y);
			ctx.stroke();
		}

		// 绘制文本
		ctx.fillStyle = '#333';
		ctx.font = '14px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(
			`画布尺寸: ${ctx.canvas.width} × ${ctx.canvas.height}`,
			ctx.canvas.width / 2,
			ctx.canvas.height / 2 - 10
		);
		ctx.fillText('(网格会变形)', ctx.canvas.width / 2, ctx.canvas.height / 2 + 10);
	};

	return (
		<div className="basic-canvas-demo">
			<div className="canvas-examples">
				{/* 默认 Canvas */}
				<div className="canvas-wrapper">
					<canvas ref={defaultCanvasRef}></canvas>
					<div className="canvas-label">默认 Canvas</div>
					<div className="canvas-info">未设置尺寸 (300×150)</div>
				</div>

				{/* HTML 属性设置尺寸 */}
				<div className="canvas-wrapper">
					<canvas ref={htmlSizeCanvasRef} width="200" height="150"></canvas>
					<div className="canvas-label">HTML 属性设置尺寸</div>
					<div className="canvas-info">width="200" height="150"</div>
				</div>

				{/* CSS 样式设置尺寸 */}
				<div className="canvas-wrapper">
					<canvas ref={cssSizeCanvasRef} style={{ width: '200px', height: '150px' }}></canvas>
					<div className="canvas-label">CSS 样式设置尺寸</div>
					<div className="canvas-info">{`style={{ width: '200px', height: '150px' }}`}</div>
				</div>

				{/* 尺寸不一致 */}
				<div className="canvas-wrapper">
					<canvas
						ref={mismatchCanvasRef}
						width="200"
						height="150"
						style={{ width: '300px', height: '200px' }}
					></canvas>
					<div className="canvas-label">尺寸不一致</div>
					<div className="canvas-info">画布: 200×150, 画板: 300×200</div>
				</div>
			</div>
		</div>
	);
};

export default BasicCanvas;
