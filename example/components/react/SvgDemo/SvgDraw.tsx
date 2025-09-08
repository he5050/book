import React, { useRef, useState, useEffect } from 'react';
import './SvgDraw.scss';

const SvgDraw = () => {
	const svgRef = useRef<SVGSVGElement>(null);
	const drawingGroupRef = useRef<SVGGElement>(null);
	const isDrawingRef = useRef(false);
	const currentPathRef = useRef<SVGPathElement | null>(null);
	const historyStackRef = useRef<SVGPathElement[]>([]);
	const redoStackRef = useRef<SVGPathElement[]>([]);

	const [brushType, setBrushType] = useState('calligraphy'); // calligraphy, pencil, splatter, pen
	const [brushColor, setBrushColor] = useState('#000000');
	const [brushSize, setBrushSize] = useState(3);

	// 初始化 SVG 画布
	useEffect(() => {
		if (svgRef.current && drawingGroupRef.current) {
			// 设置画布大小
			svgRef.current.setAttribute('width', '100%');
			svgRef.current.setAttribute('height', '500');

			// 应用初始笔刷
			updateBrushFilter();
		}
	}, []);

	// 更新笔刷滤镜
	const updateBrushFilter = () => {
		if (drawingGroupRef.current) {
			drawingGroupRef.current.style.filter =
				brushType === 'pen' ? 'url(#pen-filter)' : `url(#${brushType}-filter)`;
		}
	};

	// 笔刷类型改变
	const handleBrushTypeChange = (type: string) => {
		setBrushType(type);
		setTimeout(updateBrushFilter, 0);
	};

	// 开始绘制
	const startDrawing = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
		if (!svgRef.current || !drawingGroupRef.current) return;

		isDrawingRef.current = true;
		redoStackRef.current = []; // 清空重做栈

		// 创建新的路径元素
		const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		newPath.setAttribute('fill', 'none');
		newPath.setAttribute('stroke', brushColor);
		newPath.setAttribute('stroke-width', brushSize.toString());
		newPath.setAttribute('stroke-linecap', 'round');
		newPath.setAttribute('stroke-linejoin', 'round');

		// 根据笔刷类型和大小设置特定属性
		if (brushType === 'calligraphy') {
			// 毛笔效果根据笔刷大小调整
			newPath.setAttribute('stroke-linecap', 'butt');
		} else if (brushType === 'pencil') {
			// 铅笔效果根据笔刷大小调整
			newPath.setAttribute('stroke-linecap', 'square');
		}

		// 获取起始点坐标
		let x, y;
		if ('touches' in e) {
			const rect = svgRef.current.getBoundingClientRect();
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else {
			const rect = svgRef.current.getBoundingClientRect();
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		// 设置路径的起始点
		newPath.setAttribute('d', `M ${x} ${y}`);

		// 添加到绘图组
		drawingGroupRef.current.appendChild(newPath);
		currentPathRef.current = newPath;
	};

	// 绘制中
	const draw = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
		if (!isDrawingRef.current || !currentPathRef.current || !svgRef.current) return;

		// 获取当前坐标
		let x, y;
		if ('touches' in e) {
			const rect = svgRef.current.getBoundingClientRect();
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else {
			const rect = svgRef.current.getBoundingClientRect();
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		// 更新路径数据
		const currentPath = currentPathRef.current;
		const currentD = currentPath.getAttribute('d') || '';

		// 根据笔刷类型使用不同的绘制算法
		if (brushType === 'calligraphy') {
			// 毛笔效果：动态笔触宽度变化
			const points = currentD.split('L').length + currentD.split('Q').length;

			// 模拟笔触压力变化，创建自然的笔触宽度变化
			// 使用更复杂的算法模拟真实毛笔的提按效果
			const speed = Math.min(1, points * 0.05); // 根据点数计算速度
			const pressure = Math.sin(points * 0.3) * 0.4 + 0.8 + speed * 0.2; // 压力变化
			const dynamicWidth = Math.max(1, brushSize * pressure);

			// 使用quadratic bezier曲线创建更自然的笔触
			if (points > 1) {
				// 解析最后几个点来计算控制点
				const segments = currentD.split(/ [LQ] /);
				if (segments.length > 1) {
					const lastSegment = segments[segments.length - 1];
					const lastPoint = lastSegment.split(' ');
					if (lastPoint.length >= 2) {
						const lastX = parseFloat(lastPoint[0]);
						const lastY = parseFloat(lastPoint[1]);

						// 计算控制点，使曲线更自然
						const dx = x - lastX;
						const dy = y - lastY;
						const distance = Math.sqrt(dx * dx + dy * dy);

						// 控制点距离当前点的距离影响曲线的弯曲程度
						const controlDistance = Math.min(20, distance * 0.3);
						const angle = Math.atan2(dy, dx);

						const cx = lastX + Math.cos(angle) * controlDistance;
						const cy = lastY + Math.sin(angle) * controlDistance;

						currentPath.setAttribute('d', `${currentD} Q ${cx} ${cy} ${x} ${y}`);
					} else {
						currentPath.setAttribute('d', `${currentD} L ${x} ${y}`);
					}
				} else {
					currentPath.setAttribute('d', `${currentD} L ${x} ${y}`);
				}
			} else {
				currentPath.setAttribute('d', `${currentD} L ${x} ${y}`);
			}

			// 动态调整笔刷宽度
			currentPath.setAttribute('stroke-width', dynamicWidth.toString());
		} else if (brushType === 'pen') {
			// 钢笔效果：使用平滑的贝塞尔曲线
			const points = currentD.split('L').length + currentD.split('Q').length;

			if (points > 2) {
				// 使用平滑的曲线算法
				const segments = currentD.split(/ [LQ] /);
				if (segments.length > 1) {
					const lastSegment = segments[segments.length - 1];
					const lastPoint = lastSegment.split(' ');
					if (lastPoint.length >= 2) {
						const lastX = parseFloat(lastPoint[0]);
						const lastY = parseFloat(lastPoint[1]);

						// 计算控制点以创建平滑曲线
						const dx = x - lastX;
						const dy = y - lastY;
						const distance = Math.sqrt(dx * dx + dy * dy);

						// 控制点距离当前点的距离影响曲线的平滑程度
						const controlDistance = Math.min(15, distance * 0.2);
						const angle = Math.atan2(dy, dx);

						const cx = lastX + Math.cos(angle) * controlDistance;
						const cy = lastY + Math.sin(angle) * controlDistance;

						currentPath.setAttribute('d', `${currentD} Q ${cx} ${cy} ${x} ${y}`);
					} else {
						currentPath.setAttribute('d', `${currentD} L ${x} ${y}`);
					}
				} else {
					currentPath.setAttribute('d', `${currentD} L ${x} ${y}`);
				}
			} else {
				currentPath.setAttribute('d', `${currentD} L ${x} ${y}`);
			}
		} else {
			// 其他笔刷类型使用直线连接
			currentPath.setAttribute('d', `${currentD} L ${x} ${y}`);
		}
	};

	// 结束绘制
	const stopDrawing = () => {
		if (!isDrawingRef.current || !currentPathRef.current) return;

		isDrawingRef.current = false;

		// 将完成的路径添加到历史栈
		if (currentPathRef.current) {
			historyStackRef.current.push(currentPathRef.current);
		}

		currentPathRef.current = null;
	};

	// 撤销
	const undo = () => {
		if (historyStackRef.current.length === 0 || !drawingGroupRef.current) return;

		const lastPath = historyStackRef.current.pop();
		if (lastPath) {
			lastPath.style.display = 'none';
			redoStackRef.current.push(lastPath);
		}
	};

	// 重做
	const redo = () => {
		if (redoStackRef.current.length === 0 || !drawingGroupRef.current) return;

		const lastUndonePath = redoStackRef.current.pop();
		if (lastUndonePath) {
			lastUndonePath.style.display = '';
			historyStackRef.current.push(lastUndonePath);
		}
	};

	// 清空画布
	const clearCanvas = () => {
		if (!drawingGroupRef.current) return;

		// 清空所有路径
		while (drawingGroupRef.current.firstChild) {
			drawingGroupRef.current.removeChild(drawingGroupRef.current.firstChild);
		}

		// 重置历史记录
		historyStackRef.current = [];
		redoStackRef.current = [];
	};

	return (
		<div className="svg-draw-container">
			<div className="controls">
				<div className="control-group">
					<label>笔刷类型:</label>
					<button
						className={brushType === 'calligraphy' ? 'active' : ''}
						data-brush="calligraphy"
						onClick={() => handleBrushTypeChange('calligraphy')}
					>
						毛笔
					</button>
					<button
						className={brushType === 'pencil' ? 'active' : ''}
						data-brush="pencil"
						onClick={() => handleBrushTypeChange('pencil')}
					>
						铅笔
					</button>
					<button
						className={brushType === 'splatter' ? 'active' : ''}
						data-brush="splatter"
						onClick={() => handleBrushTypeChange('splatter')}
					>
						泼墨
					</button>
					<button
						className={brushType === 'pen' ? 'active' : ''}
						data-brush="pen"
						onClick={() => handleBrushTypeChange('pen')}
					>
						钢笔
					</button>
				</div>

				<div className="control-group">
					<label>颜色:</label>
					<input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} />
				</div>

				<div className="control-group">
					<label>大小: {brushSize}px</label>
					<input
						type="range"
						min="1"
						max="20"
						value={brushSize}
						onChange={e => setBrushSize(parseInt(e.target.value))}
					/>
				</div>

				<div className="control-group">
					<button onClick={undo}>撤销</button>
					<button onClick={redo}>重做</button>
					<button onClick={clearCanvas}>清空</button>
				</div>
			</div>

			<div className="canvas-container">
				<svg
					ref={svgRef}
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={stopDrawing}
					onMouseLeave={stopDrawing}
					onTouchStart={startDrawing}
					onTouchMove={draw}
					onTouchEnd={stopDrawing}
				>
					{/* 定义滤镜效果 */}
					<defs>
						{/* 毛笔滤镜 */}
						<filter id="calligraphy-filter" x="-50%" y="-50%" width="200%" height="200%">
							{/* 创建水墨纹理噪点 */}
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.008"
								numOctaves="5"
								result="noise"
								seed="1"
							/>
							{/* 模拟毛笔的不规则边缘 */}
							<feDisplacementMap
								in="SourceGraphic"
								in2="noise"
								scale="20"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 模拟墨水晕染 */}
							<feGaussianBlur stdDeviation="2.5" result="blurred" />
							{/* 创建水墨纹理 */}
							<feTurbulence
								type="turbulence"
								baseFrequency="0.015"
								numOctaves="4"
								result="texture"
								seed="2"
							/>
							{/* 模拟墨水在宣纸上的扩散效果 */}
							<feDisplacementMap
								in="blurred"
								in2="texture"
								scale="10"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 锐化边缘，让晕染的墨迹有清晰边界 */}
							<feColorMatrix
								type="matrix"
								values="1 0 0 0 0
                                      0 1 0 0 0
                                      0 0 1 0 0
                                      0 0 0 10 -5"
								result="sharpened"
							/>
							{/* 添加最终的纹理效果 */}
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.04"
								numOctaves="3"
								result="finalTexture"
								seed="3"
							/>
							<feDisplacementMap
								in="sharpened"
								in2="finalTexture"
								scale="6"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 添加颜色深度效果 */}
							<feComponentTransfer>
								<feFuncA type="table" tableValues="0 0.2 0.4 0.8 1" />
							</feComponentTransfer>
						</filter>

						{/* 铅笔滤镜 */}
						<filter id="pencil-filter" x="-30%" y="-30%" width="160%" height="160%">
							{/* 创建更明显的铅笔颗粒感噪点 */}
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.1"
								numOctaves="4"
								result="pencilNoise"
								seed="3"
							/>
							{/* 增强扭曲效果模拟铅笔质感 */}
							<feDisplacementMap
								in="SourceGraphic"
								in2="pencilNoise"
								scale="4"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 添加纹理效果 */}
							<feTurbulence
								type="turbulence"
								baseFrequency="0.15"
								numOctaves="2"
								result="texture"
								seed="4"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="texture"
								scale="3"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 添加铅笔特有的粗糙质感 */}
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.05"
								numOctaves="3"
								result="roughness"
								seed="5"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="roughness"
								scale="2"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 添加铅笔线条的细微变化 */}
							<feTurbulence
								type="turbulence"
								baseFrequency="0.08"
								numOctaves="2"
								result="variation"
								seed="6"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="variation"
								scale="1.5"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
						</filter>

						{/* 泼墨滤镜 */}
						<filter id="splatter-filter" x="-70%" y="-70%" width="240%" height="240%">
							{/* 创建更明显的随机斑点 */}
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.003"
								numOctaves="2"
								result="splatterNoise"
								seed="5"
							/>
							{/* 更严重的扭曲形成墨点飞溅效果 */}
							<feDisplacementMap
								in="SourceGraphic"
								in2="splatterNoise"
								scale="40"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 添加额外的噪点效果 */}
							<feTurbulence
								type="turbulence"
								baseFrequency="0.01"
								numOctaves="3"
								result="extraNoise"
								seed="6"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="extraNoise"
								scale="20"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 添加颜色变化效果 */}
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.02"
								numOctaves="2"
								result="colorVariation"
								seed="7"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="colorVariation"
								scale="10"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
							{/* 添加飞溅的小点效果 */}
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.05"
								numOctaves="3"
								result="splatterDots"
								seed="8"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="splatterDots"
								scale="5"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
						</filter>

						{/* 钢笔滤镜 - 轻微平滑效果 */}
						<filter id="pen-filter" x="-10%" y="-10%" width="120%" height="120%">
							<feGaussianBlur stdDeviation="0.2" result="smoothed" />
						</filter>
					</defs>

					{/* 绘图组，所有绘制的路径都会添加到这里 */}
					<g ref={drawingGroupRef} id="drawing-group"></g>
				</svg>
			</div>
		</div>
	);
};

export default SvgDraw;
