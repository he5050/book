import React, { useRef, useState, useEffect, useCallback } from 'react';
import './index.scss';

interface ImageViewerProps {
	src?: string;
	className?: string;
}

const DEFAULT_IMAGE = 'https://picsum.photos/200/200';

const ImageViewer: React.FC<ImageViewerProps> = ({ src = DEFAULT_IMAGE, className }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	const [scale, setScale] = useState(1);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [lastMouseX, setLastMouseX] = useState(0);
	const [lastMouseY, setLastMouseY] = useState(0);

	// 计算显示的百分比
	const scalePercent = `${Math.round(scale * 100)}%`;
    // 居中图片
	const centerImage = useCallback(() => {
		if (!containerRef.current || !imageRef.current) return;

		const container = containerRef.current;
		const img = imageRef.current;

		// If image dimensions aren't available yet, set up a load event handler
		if (img.naturalWidth === 0 || img.naturalHeight === 0) {
			// We'll rely on the onLoad handler to call centerImage again
			return;
		}

		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;
		const imgWidth = img.naturalWidth * scale;
		const imgHeight = img.naturalHeight * scale;

		// 计算居中位置
		const centeredX = (containerWidth - imgWidth) / 2;
		const centeredY = (containerHeight - imgHeight) / 2;

		setOffsetX(centeredX);
		setOffsetY(centeredY);
	}, [scale]);

	// 初始化和图片加载完成后居中
	useEffect(() => {
		centerImage();
	}, [src]);

	// 窗口大小变化时重新居中
	useEffect(() => {
		window.addEventListener('resize', centerImage);
		return () => window.removeEventListener('resize', centerImage);
	}, [centerImage]);

	

	// 拖拽相关方法
	const startDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault(); // Prevent text selection during drag
		setIsDragging(true);
		setLastMouseX(e.clientX);
		setLastMouseY(e.clientY);
	}, []);

	const stopDrag = useCallback(() => {
		setIsDragging(false);
	}, []);

	const drag = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isDragging || !containerRef.current) return;

			const dx = e.clientX - lastMouseX;
			const dy = e.clientY - lastMouseY;

			// Use requestAnimationFrame for smoother updates
			requestAnimationFrame(() => {
				setOffsetX(prev => prev + dx);
				setOffsetY(prev => prev + dy);
			});

			setLastMouseX(e.clientX);
			setLastMouseY(e.clientY);
		},
		[isDragging, lastMouseX, lastMouseY]
	);

	// 缩放相关方法
	const handleZoom = useCallback(
		(factor: number) => {
			if (!containerRef.current || !imageRef.current) return;

			// 限制缩放范围
			const newScale = Math.max(0.5, Math.min(5, scale * factor));

			// 计算缩放后鼠标位置的偏移量
			if (containerRef.current && imageRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const mouseX = lastMouseX - rect.left;
				const mouseY = lastMouseY - rect.top;

				// 计算缩放前后鼠标在图片上的相对位置
				const imgX = (mouseX - offsetX) / scale;
				const imgY = (mouseY - offsetY) / scale;

				// 计算新的偏移量
				const newOffsetX = mouseX - imgX * newScale;
				const newOffsetY = mouseY - imgY * newScale;

				setScale(newScale);
				setOffsetX(newOffsetX);
				setOffsetY(newOffsetY);
			}
		},
		[lastMouseX, lastMouseY, offsetX, offsetY, scale]
	);

	// 重置图片
	const resetImage = useCallback(() => {
		setScale(1);
		centerImage();
	}, [centerImage]);

	// 滚轮缩放
	const handleWheel = useCallback(
		(e: React.WheelEvent<HTMLDivElement>) => {
			e.preventDefault();
			const factor = e.deltaY < 0 ? 1.1 : 0.9;
			setLastMouseX(e.clientX);
			setLastMouseY(e.clientY);
			handleZoom(factor);
		},
		[handleZoom, setLastMouseX, setLastMouseY]
	);

	return (
		<div className="w-full h-400px">
			<div
				ref={containerRef}
				className={`image-viewer ${className || ''}`}
				onMouseDown={startDrag}
				onMouseMove={drag}
				onMouseUp={stopDrag}
				onMouseLeave={stopDrag}
				onWheel={handleWheel}
			>
				{/* 图片 */}
				<img
					ref={imageRef}
					src={src}
					alt="可缩放图片"
					className={isDragging ? '' : 'transitioning'}
					onLoad={() => centerImage()} // Center image after it loads
					style={{
						transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
						cursor: isDragging ? 'grabbing' : 'grab'
					}}
				/>

				{/* 控制按钮 */}
				<div className="control-panel">
					<button onClick={() => handleZoom(1.2)} title="放大">
						+
					</button>
					<button onClick={() => handleZoom(0.8)} title="缩小">
						-
					</button>
					<button onClick={resetImage} title="重置">
						⟳
					</button>
					<span className="scale-indicator">{scalePercent}</span>
				</div>
			</div>
		</div>
	);
};

export default ImageViewer;
