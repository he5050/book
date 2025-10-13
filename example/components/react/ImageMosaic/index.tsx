import * as React from 'react';
import './index.scss';

interface MosaicRegion {
	id: string;
	left: number;
	top: number;
	width: number;
	height: number;
}

const ImageMosaic: React.FC = () => {
	// 获取DOM元素
	const uploadAreaRef = React.useRef<HTMLDivElement>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const previewContainerRef = React.useRef<HTMLDivElement>(null);
	const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
	const selectionRectRef = React.useRef<HTMLDivElement>(null);
	const resetBtnRef = React.useRef<HTMLButtonElement>(null);
	const saveBtnRef = React.useRef<HTMLButtonElement>(null);
	const mosaicSizeRef = React.useRef<HTMLInputElement>(null);
	const sizeValueRef = React.useRef<HTMLDivElement>(null);
	const loadingRef = React.useRef<HTMLDivElement>(null);
	const resultContainerRef = React.useRef<HTMLDivElement>(null);
	const resultImageRef = React.useRef<HTMLImageElement>(null);
	const downloadBtnRef = React.useRef<HTMLAnchorElement>(null);
	const statusInfoRef = React.useRef<HTMLDivElement>(null);
	const statusTextRef = React.useRef<HTMLSpanElement>(null);
	const modeIndicatorRef = React.useRef<HTMLSpanElement>(null);

	// 初始化变量
	const originalImageRef = React.useRef<HTMLImageElement | null>(null);
	const isSelectingRef = React.useRef(false);
	const isResizingRef = React.useRef(false);
	const isMovingRef = React.useRef(false);
	const startXRef = React.useRef(0);
	const startYRef = React.useRef(0);
	const currentXRef = React.useRef(0);
	const currentYRef = React.useRef(0);
	const mosaicStrengthRef = React.useRef(15);
	const mosaicRegionsRef = React.useRef<MosaicRegion[]>([]);
	const currentModeRef = React.useRef('selecting');
	const resizeDirectionRef = React.useRef('');
	const startLeftRef = React.useRef(0);
	const startTopRef = React.useRef(0);
	const startWidthRef = React.useRef(0);
	const startHeightRef = React.useRef(0);
	const currentRegionRef = React.useRef<MosaicRegion | null>(null);

	// React状态
	const [mosaicStrength, setMosaicStrength] = React.useState(15);
	const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isResultVisible, setIsResultVisible] = React.useState(false);
	const [modeIndicator, setModeIndicator] = React.useState('选择区域');
	const [statusText, setStatusText] = React.useState(
		'按住鼠标左键并拖拽选择区域，松开后自动添加马赛克'
	);

	// 更新马赛克强度显示
	const updateMosaicSize = (value: number) => {
		mosaicStrengthRef.current = value;
		setMosaicStrength(value);

		if (currentModeRef.current === 'adjusting' && currentRegionRef.current) {
			applyMosaicToCurrentArea();
		}
	};

	// 上传区域点击事件
	const handleUploadAreaClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// 拖拽事件
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		if (uploadAreaRef.current) {
			uploadAreaRef.current.classList.add('active');
		}
	};

	const handleDragLeave = () => {
		if (uploadAreaRef.current) {
			uploadAreaRef.current.classList.remove('active');
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (uploadAreaRef.current) {
			uploadAreaRef.current.classList.remove('active');
		}

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileSelect(e.dataTransfer.files[0]);
		}
	};

	// 文件选择处理
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFileSelect(e.target.files[0]);
		}
	};

	// 处理文件选择
	const handleFileSelect = (file: File) => {
		if (!file.type.match('image.*')) {
			alert('请选择图片文件');
			return;
		}

		const reader = new FileReader();
		reader.onload = e => {
			const img = new Image();
			img.onload = () => {
				originalImageRef.current = img;
				setupPreview(img);
				setIsPreviewVisible(true);
			};
			img.src = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	};

	// 设置预览
	const setupPreview = (img: HTMLImageElement) => {
		if (!previewCanvasRef.current) return;

		const canvas = previewCanvasRef.current;
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) return;

		// 设置画布尺寸
		const maxWidth = 500;
		const scale = Math.min(maxWidth / img.width, 1);
		canvas.width = img.width * scale;
		canvas.height = img.height * scale;

		// 绘制图片
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		// 重置状态
		mosaicRegionsRef.current = [];
		currentModeRef.current = 'selecting';
		setModeIndicator('选择区域');
		setStatusText('按住鼠标左键并拖拽选择区域，松开后自动添加马赛克');
	};

	// 开始选择区域
	const startSelection = (x: number, y: number) => {
		if (!previewCanvasRef.current) return;

		isSelectingRef.current = true;
		startXRef.current = x;
		startYRef.current = y;
		currentXRef.current = x;
		currentYRef.current = y;

		if (selectionRectRef.current) {
			selectionRectRef.current.style.left = x + 'px';
			selectionRectRef.current.style.top = y + 'px';
			selectionRectRef.current.style.width = '0px';
			selectionRectRef.current.style.height = '0px';
			selectionRectRef.current.classList.add('visible');
		}
	};

	// 更新选择区域
	const updateSelection = (x: number, y: number) => {
		if (!isSelectingRef.current || !selectionRectRef.current) return;

		currentXRef.current = x;
		currentYRef.current = y;

		const left = Math.min(startXRef.current, x);
		const top = Math.min(startYRef.current, y);
		const width = Math.abs(x - startXRef.current);
		const height = Math.abs(y - startYRef.current);

		selectionRectRef.current.style.left = left + 'px';
		selectionRectRef.current.style.top = top + 'px';
		selectionRectRef.current.style.width = width + 'px';
		selectionRectRef.current.style.height = height + 'px';
	};

	// 完成选择区域
	const finishSelection = () => {
		if (!isSelectingRef.current || !selectionRectRef.current) return;

		isSelectingRef.current = false;
		selectionRectRef.current.classList.remove('visible');

		const left = Math.min(startXRef.current, currentXRef.current);
		const top = Math.min(startYRef.current, currentYRef.current);
		const width = Math.abs(currentXRef.current - startXRef.current);
		const height = Math.abs(currentYRef.current - startYRef.current);

		// 只有当区域足够大时才创建马赛克区域
		if (width > 10 && height > 10) {
			createMosaicArea(left, top, width, height);
		}
	};

	// 创建马赛克区域
	const createMosaicArea = (left: number, top: number, width: number, height: number) => {
		if (!previewCanvasRef.current) return;

		const region: MosaicRegion = {
			id: 'region_' + Date.now(),
			left,
			top,
			width,
			height
		};

		mosaicRegionsRef.current.push(region);
		renderMosaicArea(region);
		applyMosaicToArea(region);

		currentModeRef.current = 'adjusting';
		setModeIndicator('调整区域');
		setStatusText('可以拖动区域调整位置或拖拽角落调整大小');
	};

	// 渲染马赛克区域
	const renderMosaicArea = (region: MosaicRegion) => {
		if (!previewContainerRef.current) return;

		const mosaicArea = document.createElement('div');
		mosaicArea.className = 'mosaic-area visible';
		mosaicArea.id = region.id;
		mosaicArea.style.left = region.left + 'px';
		mosaicArea.style.top = region.top + 'px';
		mosaicArea.style.width = region.width + 'px';
		mosaicArea.style.height = region.height + 'px';

		// 添加控制点
		const handles = ['nw', 'ne', 'sw', 'se'];
		handles.forEach(handle => {
			const handleEl = document.createElement('div');
			handleEl.className = `resize-handle resize-${handle}`;
			mosaicArea.appendChild(handleEl);
		});

		// 添加删除按钮
		const deleteBtn = document.createElement('button');
		deleteBtn.className = 'delete-btn';
		deleteBtn.innerHTML = '×';
		deleteBtn.onclick = () => removeMosaicArea(region.id);
		mosaicArea.appendChild(deleteBtn);

		// 添加事件监听
		mosaicArea.onmousedown = e => handleMosaicAreaMouseDown(e, region);

		previewContainerRef.current.querySelector('.canvas-container')?.appendChild(mosaicArea);
	};

	// 移除马赛克区域
	const removeMosaicArea = (id: string) => {
		const regionIndex = mosaicRegionsRef.current.findIndex(r => r.id === id);
		if (regionIndex !== -1) {
			mosaicRegionsRef.current.splice(regionIndex, 1);
		}

		const element = document.getElementById(id);
		if (element) {
			element.remove();
		}

		// 重新绘制画布
		if (originalImageRef.current) {
			setupPreview(originalImageRef.current);
			// 重新应用所有马赛克区域
			mosaicRegionsRef.current.forEach(region => {
				renderMosaicArea(region);
				applyMosaicToArea(region);
			});
		}
	};

	// 马赛克区域鼠标按下事件
	const handleMosaicAreaMouseDown = (e: MouseEvent, region: MosaicRegion) => {
		e.stopPropagation();

		const target = e.target as HTMLElement;
		const regionElement = document.getElementById(region.id);
		if (!regionElement) return;

		// 检查是否点击了控制点
		if (target.classList.contains('resize-handle')) {
			isResizingRef.current = true;
			resizeDirectionRef.current = target.className.split(' ')[1].replace('resize-', '');
			startLeftRef.current = region.left;
			startTopRef.current = region.top;
			startWidthRef.current = region.width;
			startHeightRef.current = region.height;
			currentRegionRef.current = region;
		} else if (target.classList.contains('delete-btn')) {
			// 删除按钮已在前面处理
			return;
		} else {
			// 移动区域
			isMovingRef.current = true;
			startXRef.current = e.clientX;
			startYRef.current = e.clientY;
			startLeftRef.current = region.left;
			startTopRef.current = region.top;
			currentRegionRef.current = region;
		}
	};

	// 应用马赛克到指定区域
	const applyMosaicToArea = (region: MosaicRegion) => {
		if (!previewCanvasRef.current) return;

		const canvas = previewCanvasRef.current;
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) return;

		applyMosaic(
			canvas,
			ctx,
			region.left,
			region.top,
			region.width,
			region.height,
			mosaicStrengthRef.current
		);
	};

	// 应用马赛克到当前区域
	const applyMosaicToCurrentArea = () => {
		if (currentRegionRef.current) {
			applyMosaicToArea(currentRegionRef.current);
		}
	};

	// 马赛克算法实现
	const applyMosaic = (
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		blockSize: number
	) => {
		try {
			// 获取指定区域的图像数据
			const imageData = ctx.getImageData(x, y, width, height);
			const data = imageData.data;

			// 遍历每个马赛克块
			for (let i = 0; i < height; i += blockSize) {
				for (let j = 0; j < width; j += blockSize) {
					// 计算当前块的平均颜色
					const avgColor = calculateAverageColor(
						data,
						j,
						i,
						Math.min(blockSize, width - j),
						Math.min(blockSize, height - i),
						width
					);

					// 用平均颜色填充整个块
					fillBlockWithColor(
						ctx,
						x + j,
						y + i,
						Math.min(blockSize, width - j),
						Math.min(blockSize, height - i),
						avgColor
					);
				}
			}
		} catch (error) {
			console.error('应用马赛克时出错:', error);
		}
	};

	// 计算指定区域的平均颜色
	const calculateAverageColor = (
		data: Uint8ClampedArray,
		x: number,
		y: number,
		width: number,
		height: number,
		rowWidth: number
	) => {
		let r = 0,
			g = 0,
			b = 0;
		let count = 0;

		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				const idx = ((y + i) * rowWidth + (x + j)) * 4;
				r += data[idx];
				g += data[idx + 1];
				b += data[idx + 2];
				count++;
			}
		}

		return {
			r: Math.floor(r / count),
			g: Math.floor(g / count),
			b: Math.floor(b / count)
		};
	};

	// 用指定颜色填充矩形区域
	const fillBlockWithColor = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		color: { r: number; g: number; b: number }
	) => {
		ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
		ctx.fillRect(x, y, width, height);
	};

	// 重置图片
	const resetImage = () => {
		if (originalImageRef.current) {
			setupPreview(originalImageRef.current);
		}

		// 清空文件输入
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}

		setIsPreviewVisible(false);
		setIsResultVisible(false);
	};

	// 保存图片
	const saveImage = () => {
		if (!previewCanvasRef.current) return;

		setIsLoading(true);

		try {
			const dataUrl = previewCanvasRef.current.toDataURL('image/png');

			if (resultImageRef.current) {
				resultImageRef.current.src = dataUrl;
			}

			if (downloadBtnRef.current) {
				downloadBtnRef.current.href = dataUrl;
				downloadBtnRef.current.download = 'mosaic-image.png';
			}

			setIsResultVisible(true);
		} catch (error) {
			console.error('保存图片时出错:', error);
			alert('保存图片时出错，请重试');
		} finally {
			setIsLoading(false);
		}
	};

	// 鼠标事件处理
	const handleMouseDown = (e: React.MouseEvent) => {
		if (!previewCanvasRef.current) return;

		const rect = previewCanvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// 检查是否点击了现有的马赛克区域
		let clickedOnRegion = false;
		for (const region of mosaicRegionsRef.current) {
			if (
				x >= region.left &&
				x <= region.left + region.width &&
				y >= region.top &&
				y <= region.top + region.height
			) {
				clickedOnRegion = true;
				break;
			}
		}

		// 如果没有点击在现有区域上，则开始新的选择
		if (!clickedOnRegion && currentModeRef.current === 'selecting') {
			startSelection(x, y);
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!previewCanvasRef.current) return;

		const rect = previewCanvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (isSelectingRef.current) {
			updateSelection(x, y);
		} else if (isMovingRef.current && currentRegionRef.current) {
			const dx = e.clientX - startXRef.current;
			const dy = e.clientY - startYRef.current;

			const newLeft = startLeftRef.current + dx;
			const newTop = startTopRef.current + dy;

			// 边界检查
			const canvas = previewCanvasRef.current;
			const region = currentRegionRef.current;
			const boundedLeft = Math.max(0, Math.min(newLeft, canvas.width - region.width));
			const boundedTop = Math.max(0, Math.min(newTop, canvas.height - region.height));

			// 更新区域位置
			region.left = boundedLeft;
			region.top = boundedTop;

			// 更新DOM元素位置
			const regionElement = document.getElementById(region.id);
			if (regionElement) {
				regionElement.style.left = boundedLeft + 'px';
				regionElement.style.top = boundedTop + 'px';
			}
		} else if (isResizingRef.current && currentRegionRef.current) {
			const dx = e.clientX - startXRef.current;
			const dy = e.clientY - startYRef.current;

			const region = currentRegionRef.current;
			let newLeft = region.left;
			let newTop = region.top;
			let newWidth = region.width;
			let newHeight = region.height;

			// 根据拖拽方向调整尺寸
			switch (resizeDirectionRef.current) {
				case 'nw':
					newLeft = startLeftRef.current + dx;
					newTop = startTopRef.current + dy;
					newWidth = startWidthRef.current - dx;
					newHeight = startHeightRef.current - dy;
					break;
				case 'ne':
					newTop = startTopRef.current + dy;
					newWidth = startWidthRef.current + dx;
					newHeight = startHeightRef.current - dy;
					break;
				case 'sw':
					newLeft = startLeftRef.current + dx;
					newWidth = startWidthRef.current - dx;
					newHeight = startHeightRef.current + dy;
					break;
				case 'se':
					newWidth = startWidthRef.current + dx;
					newHeight = startHeightRef.current + dy;
					break;
			}

			// 最小尺寸限制
			if (newWidth < 20) {
				newWidth = 20;
				if (resizeDirectionRef.current === 'nw' || resizeDirectionRef.current === 'sw') {
					newLeft = region.left + region.width - 20;
				}
			}

			if (newHeight < 20) {
				newHeight = 20;
				if (resizeDirectionRef.current === 'nw' || resizeDirectionRef.current === 'ne') {
					newTop = region.top + region.height - 20;
				}
			}

			// 边界检查
			const canvas = previewCanvasRef.current;
			if (newLeft < 0) {
				newWidth += newLeft;
				newLeft = 0;
			}
			if (newTop < 0) {
				newHeight += newTop;
				newTop = 0;
			}
			if (newLeft + newWidth > canvas.width) {
				newWidth = canvas.width - newLeft;
			}
			if (newTop + newHeight > canvas.height) {
				newHeight = canvas.height - newTop;
			}

			// 更新区域尺寸
			region.left = newLeft;
			region.top = newTop;
			region.width = newWidth;
			region.height = newHeight;

			// 更新DOM元素尺寸
			const regionElement = document.getElementById(region.id);
			if (regionElement) {
				regionElement.style.left = newLeft + 'px';
				regionElement.style.top = newTop + 'px';
				regionElement.style.width = newWidth + 'px';
				regionElement.style.height = newHeight + 'px';
			}

			// 重新应用马赛克
			applyMosaicToArea(region);
		}
	};

	const handleMouseUp = () => {
		if (isSelectingRef.current) {
			finishSelection();
		}

		isSelectingRef.current = false;
		isMovingRef.current = false;
		isResizingRef.current = false;
		currentRegionRef.current = null;
	};

	// 添加事件监听器
	React.useEffect(() => {
		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (!previewCanvasRef.current) return;

			const rect = previewCanvasRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			if (isSelectingRef.current) {
				updateSelection(x, y);
			} else if (isMovingRef.current && currentRegionRef.current) {
				const dx = e.clientX - startXRef.current;
				const dy = e.clientY - startYRef.current;

				const newLeft = startLeftRef.current + dx;
				const newTop = startTopRef.current + dy;

				// 边界检查
				const canvas = previewCanvasRef.current;
				const region = currentRegionRef.current;
				const boundedLeft = Math.max(0, Math.min(newLeft, canvas.width - region.width));
				const boundedTop = Math.max(0, Math.min(newTop, canvas.height - region.height));

				// 更新区域位置
				region.left = boundedLeft;
				region.top = boundedTop;

				// 更新DOM元素位置
				const regionElement = document.getElementById(region.id);
				if (regionElement) {
					regionElement.style.left = boundedLeft + 'px';
					regionElement.style.top = boundedTop + 'px';
				}
			} else if (isResizingRef.current && currentRegionRef.current) {
				const dx = e.clientX - startXRef.current;
				const dy = e.clientY - startYRef.current;

				const region = currentRegionRef.current;
				let newLeft = region.left;
				let newTop = region.top;
				let newWidth = region.width;
				let newHeight = region.height;

				// 根据拖拽方向调整尺寸
				switch (resizeDirectionRef.current) {
					case 'nw':
						newLeft = startLeftRef.current + dx;
						newTop = startTopRef.current + dy;
						newWidth = startWidthRef.current - dx;
						newHeight = startHeightRef.current - dy;
						break;
					case 'ne':
						newTop = startTopRef.current + dy;
						newWidth = startWidthRef.current + dx;
						newHeight = startHeightRef.current - dy;
						break;
					case 'sw':
						newLeft = startLeftRef.current + dx;
						newWidth = startWidthRef.current - dx;
						newHeight = startHeightRef.current + dy;
						break;
					case 'se':
						newWidth = startWidthRef.current + dx;
						newHeight = startHeightRef.current + dy;
						break;
				}

				// 最小尺寸限制
				if (newWidth < 20) {
					newWidth = 20;
					if (resizeDirectionRef.current === 'nw' || resizeDirectionRef.current === 'sw') {
						newLeft = region.left + region.width - 20;
					}
				}

				if (newHeight < 20) {
					newHeight = 20;
					if (resizeDirectionRef.current === 'nw' || resizeDirectionRef.current === 'ne') {
						newTop = region.top + region.height - 20;
					}
				}

				// 边界检查
				const canvas = previewCanvasRef.current;
				if (newLeft < 0) {
					newWidth += newLeft;
					newLeft = 0;
				}
				if (newTop < 0) {
					newHeight += newTop;
					newTop = 0;
				}
				if (newLeft + newWidth > canvas.width) {
					newWidth = canvas.width - newLeft;
				}
				if (newTop + newHeight > canvas.height) {
					newHeight = canvas.height - newTop;
				}

				// 更新区域尺寸
				region.left = newLeft;
				region.top = newTop;
				region.width = newWidth;
				region.height = newHeight;

				// 更新DOM元素尺寸
				const regionElement = document.getElementById(region.id);
				if (regionElement) {
					regionElement.style.left = newLeft + 'px';
					regionElement.style.top = newTop + 'px';
					regionElement.style.width = newWidth + 'px';
					regionElement.style.height = newHeight + 'px';
				}

				// 重新应用马赛克
				applyMosaicToArea(region);
			}
		};

		const handleGlobalMouseUp = () => {
			if (isSelectingRef.current) {
				finishSelection();
			}

			isSelectingRef.current = false;
			isMovingRef.current = false;
			isResizingRef.current = false;
			currentRegionRef.current = null;
		};

		document.addEventListener('mousemove', handleGlobalMouseMove);
		document.addEventListener('mouseup', handleGlobalMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleGlobalMouseMove);
			document.removeEventListener('mouseup', handleGlobalMouseUp);
		};
	}, []);

	return (
		<div className="image-mosaic-container">
			<h1>图片马赛克处理工具</h1>

			<div
				className={`upload-area ${isPreviewVisible ? '' : 'visible'}`}
				ref={uploadAreaRef}
				onClick={handleUploadAreaClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<div className="upload-icon">📁</div>
				<div className="upload-text">点击选择图片或拖拽图片到此处</div>
			</div>

			<input
				type="file"
				ref={fileInputRef}
				accept="image/*"
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>

			<div
				className={`preview-container ${isPreviewVisible ? 'visible' : ''}`}
				ref={previewContainerRef}
			>
				<div
					className="canvas-container"
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
				>
					<canvas ref={previewCanvasRef}></canvas>
					<div className="selection-rect" ref={selectionRectRef}></div>
				</div>

				<div className="status" ref={statusInfoRef}>
					当前模式:{' '}
					<span className="mode-indicator" ref={modeIndicatorRef}>
						{modeIndicator}
					</span>
					<span ref={statusTextRef}>{statusText}</span>
				</div>

				<div className="tools">
					<div className="tool-group">
						<button className="btn btn-default" ref={resetBtnRef} onClick={resetImage}>
							重置图片
						</button>
					</div>
					<div className="tool-group">
						<button className="btn btn-danger" ref={saveBtnRef} onClick={saveImage}>
							保存图片
						</button>
					</div>
				</div>

				<div className="slider-container">
					<div className="slider-label">马赛克强度:</div>
					<input
						type="range"
						ref={mosaicSizeRef}
						min="5"
						max="50"
						value={mosaicStrength}
						onChange={e => updateMosaicSize(parseInt(e.target.value))}
					/>
					<div className="size-indicator" ref={sizeValueRef}>
						{mosaicStrength}px
					</div>
				</div>

				<div className="instructions">
					<h3>使用说明：</h3>
					<ul>
						<li>按住鼠标左键并拖拽选择需要打马赛克的区域</li>
						<li>松开鼠标后，系统会自动为选中区域添加马赛克</li>
						<li>马赛克区域显示后，可以拖动区域调整位置或拖拽角落调整大小</li>
						<li>调整马赛克强度滑块改变马赛克颗粒大小</li>
						<li>点击"保存图片"下载处理后的图片</li>
					</ul>
				</div>
			</div>

			<div className={`loading ${isLoading ? 'visible' : ''}`} ref={loadingRef}>
				<div className="spinner"></div>
				<div>正在处理图片...</div>
			</div>

			<div
				className={`result-container ${isResultVisible ? 'visible' : ''}`}
				ref={resultContainerRef}
			>
				<img ref={resultImageRef} className="result-image" alt="处理后的图片" />
				<a
					href="#"
					className="download-btn"
					ref={downloadBtnRef}
					onClick={e => {
						// 触发下载
						if (downloadBtnRef.current) {
							const link = downloadBtnRef.current;
							const event = new MouseEvent('click');
							link.dispatchEvent(event);
						}
					}}
				>
					下载图片
				</a>
			</div>
		</div>
	);
};

export default ImageMosaic;
