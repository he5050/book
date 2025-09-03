import React, { useEffect, useRef, useState } from 'react';

/**
 * 响应式 Canvas 组件 - 展示窗口调整适配
 *
 * 展示如何创建响应窗口大小变化的 Canvas，包括：
 * 1. 父容器自适应宽度的 Canvas
 * 2. 窗口调整时自动重绘的 Canvas
 * 3. 使用 ResizeObserver 监听容器大小变化
 */
const ResponsiveCanvas: React.FC = () => {
	// 引用 Canvas 元素和容器元素
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// 存储 Canvas 尺寸
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

	// 存储 ResizeObserver 实例
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		// 初始化 Canvas
		updateCanvasSize();

		// 创建 ResizeObserver 监听容器大小变化
		if (containerRef.current) {
			resizeObserverRef.current = new ResizeObserver(handleResize);
			resizeObserverRef.current.observe(containerRef.current);
		}

		// 监听窗口大小变化
		window.addEventListener('resize', updateCanvasSize);

		// 清理函数
		return () => {
			window.removeEventListener('resize', updateCanvasSize);
			if (resizeObserverRef.current) {
				resizeObserverRef.current.disconnect();
			}
		};
	}, []);

	// 当 Canvas 尺寸变化时重新绘制
	useEffect(() => {
		if (canvasRef.current && canvasSize.width > 0 && canvasSize.height > 0) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				drawResponsiveContent(ctx);
			}
		}
	}, [canvasSize]);

	/**
	 * 处理 ResizeObserver 回调
	 */
	const handleResize = () => {
		updateCanvasSize();
	};

	/**
	 * 更新 Canvas 尺寸
	 */
	const updateCanvasSize = () => {
		if (containerRef.current && canvasRef.current) {
			// 获取容器尺寸
			const containerWidth = containerRef.current.clientWidth;
			const containerHeight = 250; // 固定高度

			// 获取设备像素比
			const dpr = window.devicePixelRatio || 1;

			// 设置 Canvas 元素的 CSS 尺寸
			canvasRef.current.style.width = `${containerWidth}px`;
			canvasRef.current.style.height = `${containerHeight}px`;

			// 设置 Canvas 画布尺寸（考虑设备像素比）
			canvasRef.current.width = containerWidth * dpr;
			canvasRef.current.height = containerHeight * dpr;

			// 更新状态
			setCanvasSize({
				width: containerWidth,
				height: containerHeight
			});
		}
	};

	/**
	 * 绘制响应式内容
	 * @param ctx Canvas 上下文
	 */
	const drawResponsiveContent = (ctx: CanvasRenderingContext2D) => {
		const canvas = ctx.canvas;
		const dpr = window.devicePixelRatio || 1;

		// 应用设备像素比缩放
		ctx.scale(dpr, dpr);

		// 清空画布
		ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

		// 绘制背景
		const gradient = ctx.createLinearGradient(0, 0, canvas.width / dpr, 0);
		gradient.addColorStop(0, '#f8f9fa');
		gradient.addColorStop(1, '#e9ecef');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

		// 绘制响应式网格
		const gridSize = 40;
		ctx.strokeStyle = '#dee2e6';
		ctx.lineWidth = 1;

		// 计算网格线数量
		const horizontalLines = Math.floor(canvas.height / dpr / gridSize);
		const verticalLines = Math.floor(canvas.width / dpr / gridSize);

		// 绘制水平线
		for (let i = 0; i <= horizontalLines; i++) {
			const y = i * gridSize;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width / dpr, y);
			ctx.stroke();
		}

		// 绘制垂直线
		for (let i = 0; i <= verticalLines; i++) {
			const x = i * gridSize;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height / dpr);
			ctx.stroke();
		}

		// 绘制中心圆形
		const centerX = canvas.width / dpr / 2;
		const centerY = canvas.height / dpr / 2;
		const radius = Math.min(centerX, centerY) * 0.4;

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(66, 135, 245, 0.6)';
		ctx.fill();

		// 绘制文本
		ctx.fillStyle = '#212529';
		ctx.font = '16px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(
			`Canvas 尺寸: ${Math.round(canvas.width / dpr)} × ${Math.round(canvas.height / dpr)}`,
			centerX,
			centerY - 10
		);
		ctx.fillText('调整窗口大小查看效果', centerX, centerY + 20);

		// 绘制边框
		ctx.strokeStyle = '#4263eb';
		ctx.lineWidth = 2;
		ctx.strokeRect(10, 10, canvas.width / dpr - 20, canvas.height / dpr - 20);

		// 重置变换
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	};

	return (
		<div className="responsive-canvas-demo">
			<div className="canvas-controls">
				<button onClick={updateCanvasSize}>重新调整</button>
			</div>

			<div
				ref={containerRef}
				className="canvas-container"
				style={
					{
						width: '100%',
						maxWidth: '800px',
						margin: '0 auto'
					} as React.CSSProperties
				}
			>
				<canvas ref={canvasRef}></canvas>
				<div className="canvas-info">
					当前尺寸: {canvasSize.width} × {canvasSize.height}
					(设备像素比: {(window.devicePixelRatio || 1).toFixed(2)})
				</div>
			</div>

			<div className="responsive-info">
				<p>此 Canvas 会自动适应容器宽度变化，尝试调整浏览器窗口大小查看效果</p>
			</div>
		</div>
	);
};

export default ResponsiveCanvas;
