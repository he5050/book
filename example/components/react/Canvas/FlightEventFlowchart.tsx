import React, { useEffect, useRef, useState } from 'react';

interface FlightEvent {
	time: string;
	event: string;
	position: number;
}

interface FlightEventFlowchartProps {
	containerWidth?: number;
}

const FlightEventFlowchart: React.FC<FlightEventFlowchartProps> = ({ containerWidth = 500 }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [animationProgress, setAnimationProgress] = useState(0);
	const animationIdRef = useRef<number | null>(null);

	// 初始化事件数据
	const events: FlightEvent[] = [
		{ time: '2025-09-12 11:40', event: '起飞', position: 0.05 },
		{ time: '2025-09-12 11:42', event: '转弯', position: 0.15 },
		{ time: '2025-09-12 11:42', event: '发现问题', position: 0.25 },
		{ time: '2025-09-12 11:51', event: '返航', position: 0.35 },
		{ time: '2025-09-12 11:53', event: '飞行', position: 0.45 },
		{ time: '2025-09-12 11:55', event: '转弯', position: 0.55 },
		{ time: '2025-09-12 12:00', event: '飞行', position: 0.65 },
		{ time: '2025-09-12 12:30', event: '降落', position: 0.75 },
		{ time: '2025-09-12 12:30', event: '降落', position: 0.85 },
		{ time: '2025-09-12 13:41', event: '返航', position: 0.95 }
	];

	// 设置Canvas尺寸并处理高清屏适配
	const resizeCanvas = () => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();

			// 设置画布的实际尺寸
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;

			// 设置画布的显示尺寸
			canvas.style.width = rect.width + 'px';
			canvas.style.height = rect.height + 'px';

			// 缩放上下文以适应高清屏
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.scale(dpr, dpr);
			}

			drawFlowchart();
		}
	};

	// 绘制流程图
	const drawFlowchart = () => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// 获取实际显示尺寸（而不是画布尺寸）
		const displayWidth = parseFloat(canvas.style.width || '0') || canvas.width;
		const displayHeight = parseFloat(canvas.style.height || '0') || canvas.height;

		const width = displayWidth;
		const height = displayHeight;
		const timelineY = height / 2;
		const nodeRadius = 12;

		// 清除画布
		ctx.clearRect(0, 0, width, height);

		// 绘制时间轴
		ctx.beginPath();
		ctx.moveTo(width * 0.05, timelineY);
		ctx.lineTo(width * 0.95, timelineY);
		ctx.strokeStyle = '#667eea';
		ctx.lineWidth = 3;
		ctx.stroke();

		// 绘制箭头
		ctx.beginPath();
		ctx.moveTo(width * 0.95, timelineY);
		ctx.lineTo(width * 0.93, timelineY - 8);
		ctx.lineTo(width * 0.93, timelineY + 8);
		ctx.closePath();
		ctx.fillStyle = '#667eea';
		ctx.fill();

		// 绘制事件节点和标签
		events.forEach((ev, index) => {
			const x = width * ev.position;
			const isEven = index % 2 === 0;
			const nodeY = isEven ? timelineY - 50 : timelineY + 50;

			// 绘制连接线
			ctx.beginPath();
			ctx.moveTo(x, timelineY);
			ctx.lineTo(x, nodeY);
			ctx.strokeStyle = '#adb5bd';
			ctx.lineWidth = 1.5;
			ctx.setLineDash([5, 3]);
			ctx.stroke();
			ctx.setLineDash([]);

			// 绘制节点
			ctx.beginPath();
			ctx.arc(x, nodeY, nodeRadius, 0, Math.PI * 2);
			ctx.fillStyle = animationProgress >= ev.position ? '#F2050A' : '#667eea';
			ctx.fill();
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.stroke();

			// 绘制事件文本
			ctx.font = '14px Segoe UI, sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#495057';
			ctx.fillText(ev.event, x, nodeY + (isEven ? -30 : 30));

			// 绘制步骤编号（替换原来的时间显示）
			ctx.font = '12px Segoe UI, sans-serif';
			ctx.fillStyle = '#6c757d';
			ctx.fillText(`步骤 ${index + 1}`, x, nodeY + (isEven ? -50 : 50));
		});

		// 绘制动画进度
		if (animationProgress > 0) {
			ctx.beginPath();
			ctx.moveTo(width * 0.05, timelineY);
			ctx.lineTo(width * animationProgress, timelineY);
			ctx.strokeStyle = '#F2050A';
			ctx.lineWidth = 4;
			ctx.stroke();
		}
	};

	// 动画函数
	const animate = () => {
		setAnimationProgress(prev => {
			if (prev < 0.95) {
				const newProgress = prev + 0.005;
				return newProgress;
			} else {
				setIsAnimating(false);
				return prev;
			}
		});
	};

	// 动画循环 effect
	useEffect(() => {
		let frameId: number;

		if (isAnimating) {
			const loop = () => {
				animate();
				// 只有在仍然处于动画状态时才继续请求下一帧
				if (isAnimating) {
					frameId = requestAnimationFrame(loop);
				}
			};
			frameId = requestAnimationFrame(loop);
		}

		return () => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}
		};
	}, [isAnimating]);

	// 播放动画
	const playAnimation = () => {
		// 如果动画已经完成（进度>=0.95），重置进度再播放
		if (animationProgress >= 0.95) {
			setAnimationProgress(0);
		}
		setIsAnimating(true);
	};

	// 暂停动画
	const pauseAnimation = () => {
		setIsAnimating(false);
		// 暂停只是停止动画，但保持当前进度
	};

	// 重置视图
	const resetView = () => {
		setIsAnimating(false);
		setAnimationProgress(0); // 重置进度到0
	};

	// 初始化和响应式调整
	useEffect(() => {
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			// 确保清理所有可能的动画帧
			setIsAnimating(false);
		};
	}, []);

	// 监听动画进度变化并重新绘制
	useEffect(() => {
		drawFlowchart();
	}, [animationProgress]);

	return (
		<div className="flight-event-flowchart" style={{ width: containerWidth }}>
			<div className="canvas-container">
				<canvas ref={canvasRef} style={{ width: '100%', height: '400px' }}></canvas>
			</div>

			<div
				className="flight-event-controls"
				style={{
					marginTop: '15px',
					display: 'flex',
					gap: '10px',
					justifyContent: 'center'
				}}
			>
				<button
					onClick={playAnimation}
					style={{
						padding: '6px 12px',
						backgroundColor: '#4a90e2',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						transition: 'background-color 0.2s'
					}}
					onMouseOver={e => (e.currentTarget.style.backgroundColor = '#3a80d2')}
					onMouseOut={e => (e.currentTarget.style.backgroundColor = '#4a90e2')}
				>
					播放动画
				</button>
				<button
					onClick={pauseAnimation}
					style={{
						padding: '6px 12px',
						backgroundColor: '#4a90e2',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						transition: 'background-color 0.2s'
					}}
					onMouseOver={e => (e.currentTarget.style.backgroundColor = '#3a80d2')}
					onMouseOut={e => (e.currentTarget.style.backgroundColor = '#4a90e2')}
				>
					暂停动画
				</button>
				<button
					onClick={resetView}
					style={{
						padding: '6px 12px',
						backgroundColor: '#4a90e2',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						transition: 'background-color 0.2s'
					}}
					onMouseOver={e => (e.currentTarget.style.backgroundColor = '#3a80d2')}
					onMouseOut={e => (e.currentTarget.style.backgroundColor = '#4a90e2')}
				>
					重置视图
				</button>
			</div>
		</div>
	);
};

export default FlightEventFlowchart;
