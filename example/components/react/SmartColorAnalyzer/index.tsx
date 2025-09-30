import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface SmartColorAnalyzerProps {
	canvasWidth?: number;
	canvasHeight?: number;
	initialColor?: string;
	enableAnimation?: boolean;
	showVisualization?: boolean;
	updateInterval?: number;
}

const SmartColorAnalyzer: React.FC<SmartColorAnalyzerProps> = ({
	canvasWidth = 525,
	canvasHeight = 350,
	initialColor = '#000000',
	enableAnimation = true,
	showVisualization = true,
	updateInterval = 1000
}) => {
	// 引用
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// 状态
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentColor, setCurrentColor] = useState(initialColor);
	const [warmRatio, setWarmRatio] = useState(0);
	const [coolRatio, setCoolRatio] = useState(0);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	// 颜色选项
	const colorOptions = [
		'#000000', // 黑色
		'#ff0000', // 红色
		'#00ff00', // 绿色
		'#0000ff', // 蓝色
		'#ffff00', // 黄色
		'#ff00ff', // 紫色
		'#00ffff', // 青色
		'#ff9900' // 橙色
	];

	// 初始化Canvas
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// 获取设备像素比
		const dpr = window.devicePixelRatio || 1;

		// 设置Canvas实际尺寸（考虑设备像素比）
		canvas.width = canvasWidth * dpr;
		canvas.height = canvasHeight * dpr;

		// 设置Canvas显示尺寸
		canvas.style.width = `${canvasWidth}px`;
		canvas.style.height = `${canvasHeight}px`;

		// 获取绘图上下文
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// 缩放绘图上下文以适配高清屏
		ctx.scale(dpr, dpr);

		// 设置初始背景
		ctx.fillStyle = '#f8f9fa';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// 添加事件监听器
		const startDrawing = (e: MouseEvent | TouchEvent) => {
			setIsDrawing(true);
			// 获取起始坐标
			let x, y;
			if (e instanceof MouseEvent) {
				const rect = canvas.getBoundingClientRect();
				x = e.clientX - rect.left;
				y = e.clientY - rect.top;
			} else {
				const rect = canvas.getBoundingClientRect();
				x = e.touches[0].clientX - rect.left;
				y = e.touches[0].clientY - rect.top;
			}

			// 初始化路径
			if (ctx) {
				ctx.beginPath();
				ctx.moveTo(x, y);
			}
			draw(e);
		};

		const stopDrawing = () => {
			setIsDrawing(false);
			// 不再调用 ctx.beginPath()，这样可以保持绘制的路径
		};

		const draw = (e: MouseEvent | TouchEvent) => {
			if (!isDrawing || !ctx) return;

			// 获取坐标
			let x, y;
			if (e instanceof MouseEvent) {
				const rect = canvas.getBoundingClientRect();
				x = e.clientX - rect.left;
				y = e.clientY - rect.top;
			} else {
				const rect = canvas.getBoundingClientRect();
				x = e.touches[0].clientX - rect.left;
				y = e.touches[0].clientY - rect.top;
			}

			// 设置绘图样式
			ctx.lineWidth = 5 * dpr; // 考虑设备像素比调整线宽
			ctx.lineCap = 'round';
			ctx.strokeStyle = currentColor;

			// 绘制线条
			ctx.lineTo(x, y);
			ctx.stroke();
			// 不再调用 beginPath 和 moveTo，保持路径连续
		};

		// 添加事件监听器
		canvas.addEventListener('mousedown', startDrawing);
		canvas.addEventListener('mouseup', stopDrawing);
		canvas.addEventListener('mouseout', stopDrawing);
		canvas.addEventListener('mousemove', draw);

		// 移动端支持
		canvas.addEventListener('touchstart', e => {
			e.preventDefault();
			startDrawing(e);
		});
		canvas.addEventListener('touchend', stopDrawing);
		canvas.addEventListener('touchmove', e => {
			e.preventDefault();
			draw(e);
		});

		// 清理函数
		return () => {
			canvas.removeEventListener('mousedown', startDrawing);
			canvas.removeEventListener('mouseup', stopDrawing);
			canvas.removeEventListener('mouseout', stopDrawing);
			canvas.removeEventListener('mousemove', draw);
			canvas.removeEventListener('touchstart', startDrawing as EventListener);
			canvas.removeEventListener('touchend', stopDrawing);
			canvas.removeEventListener('touchmove', draw as EventListener);
		};
	}, [isDrawing, currentColor, canvasWidth, canvasHeight]);

	// 智能颜色分类算法
	const classifyColor = (r: number, g: number, b: number): 'warm' | 'cold' | 'neutral' => {
		// RGB-HSV混合模型
		// 转换为HSV
		const cR = r / 255;
		const cG = g / 255;
		const cB = b / 255;

		// 计算HSV中的H(色相)和S(饱和度)
		const max = Math.max(cR, cG, cB);
		const min = Math.min(cR, cG, cB);
		let h = max;

		const d = max - min;
		const s = max === 0 ? 0 : d / max;

		// 计算色相角度(0-360°)
		if (max === min) {
			h = 0; // 无色调(灰度)
		} else {
			switch (max) {
				case cR:
					h = (cG - cB) / d + (cG < cB ? 6 : 0);
					break;
				case cG:
					h = (cB - cR) / d + 2;
					break;
				case cB:
					h = (cR - cG) / d + 4;
					break;
			}
			h *= 60;
		}

		const lightness = (max + min) / 2;

		// 中性色过滤
		if ((s < 0.1 && (h < 140 || h > 280)) || lightness < 0.1 || lightness > 0.9) {
			return 'neutral';
		}

		// 自适应权重调整
		const rWeight = 0.5 + (cR - 0.5) * 0.5;
		const gWeight = 0.3 + (cG - 0.5) * 0.3;
		const bWeight = 0.2 + (cB - 0.5) * 0.2;

		// 智能分类算法
		if (h >= 330 || h <= 60) {
			// 红色到黄色范围 - 暖色
			if (s < 0.3) {
				// 低饱和度区域使用加权判断
				return rWeight > bWeight + 0.05 ? 'warm' : 'cold';
			}
			return 'warm';
		} else if (h >= 140 && h <= 280) {
			// 青色到蓝色范围 - 冷色
			if (s < 0.3) {
				// 低饱和度区域使用加权判断
				return bWeight > rWeight + 0.05 ? 'cold' : 'warm';
			}
			return 'cold';
		} else {
			// 中间区域使用RGB加权值判定
			const warmScore = rWeight * 0.7 + gWeight * 0.3;
			const coldScore = bWeight * 0.85 + gWeight * 0.2;

			// 自适应阈值
			const threshold = 0.5 + (s - 0.5) * 0.2;
			return warmScore > coldScore + threshold ? 'warm' : 'cold';
		}
	};

	// 分析颜色
	const analyzeColors = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		setIsAnalyzing(true);

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			setIsAnalyzing(false);
			return;
		}

		try {
			// 使用canvasWidth和canvasHeight而不是canvas.width和canvas.height
			// 因为canvas的物理尺寸是经过dpr缩放的
			const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
			const data = imageData.data;

			let warmPixels = 0;
			let coolPixels = 0;
			let neutralPixels = 0;

			// 高效像素遍历 - 每4个元素为一个RGBA像素
			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				// Alpha通道在data[i + 3]，这里我们忽略透明度

				const colorType = classifyColor(r, g, b);
				if (colorType === 'warm') {
					warmPixels++;
				} else if (colorType === 'cold') {
					coolPixels++;
				} else {
					neutralPixels++;
				}
			}

			// 实时计算比例并更新UI
			const colorPixels = warmPixels + coolPixels;
			const warmPercentage = colorPixels > 0 ? Math.round((warmPixels / colorPixels) * 100) : 0;
			const coolPercentage = colorPixels > 0 ? Math.round((coolPixels / colorPixels) * 100) : 0;

			setWarmRatio(warmPercentage);
			setCoolRatio(coolPercentage);
		} catch (error) {
			console.error('颜色分析出错:', error);
		} finally {
			setIsAnalyzing(false);
		}
	};

	// 清空Canvas
	const clearCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// 使用canvasWidth和canvasHeight而不是canvas.width和canvas.height
		ctx.fillStyle = '#f8f9fa';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// 重置比例
		setWarmRatio(0);
		setCoolRatio(0);
	};

	// 定时分析
	useEffect(() => {
		if (!showVisualization) return;

		const interval = setInterval(() => {
			analyzeColors();
		}, updateInterval);

		return () => clearInterval(interval);
	}, [showVisualization, updateInterval]);

	// 初始分析
	useEffect(() => {
		if (showVisualization) {
			const timer = setTimeout(() => {
				analyzeColors();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [showVisualization]);

	return (
		<div
			ref={containerRef}
			className="smart-color-analyzer"
			style={{ maxWidth: `${canvasWidth + 40}px` }}
		>
			<div className="analyzer-header">
				<h3>智能颜色分析器</h3>
				<div className="controls">
					<button onClick={analyzeColors} disabled={isAnalyzing} className="analyze-btn">
						{isAnalyzing ? '分析中...' : '分析颜色'}
					</button>
					<button onClick={clearCanvas} className="clear-btn">
						清空画布
					</button>
				</div>
			</div>

			{/* 颜色选择器 */}
			<div className="color-picker">
				<span>选择颜色:</span>
				<div className="color-options">
					{colorOptions.map(color => (
						<button
							key={color}
							className={`color-option ${currentColor === color ? 'active' : ''}`}
							style={{ backgroundColor: color }}
							onClick={() => setCurrentColor(color)}
							aria-label={`选择颜色 ${color}`}
						/>
					))}
					<input
						type="color"
						value={currentColor}
						onChange={e => setCurrentColor(e.target.value)}
						className="custom-color"
					/>
				</div>
			</div>

			{/* Canvas画布 */}
			<div className="canvas-container">
				<canvas
					ref={canvasRef}
					className="drawing-canvas"
					style={{ width: canvasWidth, height: canvasHeight }}
				/>
			</div>

			{/* 结果展示 */}
			{showVisualization && (
				<div className="analysis-results">
					<div className="results-header">
						<h4>分析结果</h4>
						<span className="analysis-status">{isAnalyzing ? '正在分析...' : '分析完成'}</span>
					</div>

					<div className="ratios-display">
						<div className="ratio-item warm">
							<span className="ratio-label">暖色调</span>
							<span className="ratio-value">{warmRatio}%</span>
						</div>
						<div className="ratio-item cold">
							<span className="ratio-label">冷色调</span>
							<span className="ratio-value">{coolRatio}%</span>
						</div>
					</div>

					{/* 可视化图表 */}
					{enableAnimation && (
						<div className="visualization-chart">
							<div className="chart-container">
								<div
									className="warm-bar"
									style={{
										height: `${warmRatio}%`,
										transition: 'height 0.5s ease'
									}}
								/>
								<div
									className="cold-bar"
									style={{
										height: `${coolRatio}%`,
										transition: 'height 0.5s ease'
									}}
								/>
							</div>
							<div className="chart-labels">
								<span>暖色</span>
								<span>冷色</span>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SmartColorAnalyzer;
