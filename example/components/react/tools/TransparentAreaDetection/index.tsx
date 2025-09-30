import * as React from 'react';

interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

interface TransparentAreaDetectionProps {
	imageUrl: string;
	minWidth?: number;
	minHeight?: number;
	alphaThreshold?: number; // 透明度阈值 (0-255)
	onAreasDetected?: (areas: Rect[]) => void;
	className?: string;
	style?: React.CSSProperties;
}

const TransparentAreaDetection: React.FC<TransparentAreaDetectionProps> = ({
	imageUrl,
	minWidth = 10,
	minHeight = 10,
	alphaThreshold = 10, // 默认阈值
	onAreasDetected,
	className = '',
	style = {}
}) => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const [areas, setAreas] = React.useState<Rect[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const onAreasDetectedRef = React.useRef(onAreasDetected);

	// 更新回调函数引用
	React.useEffect(() => {
		onAreasDetectedRef.current = onAreasDetected;
	}, [onAreasDetected]);

	// 检查像素是否透明 (Alpha 通道小于阈值的视为透明)
	const isEmptyPixel = (data: Uint8ClampedArray, x: number, y: number, width: number): boolean => {
		const index = (y * width + x) * 4;
		return data[index + 3] < alphaThreshold;
	};

	// 扩散搜索透明区域
	const findEmptyArea = (
		data: Uint8ClampedArray,
		visited: boolean[],
		startX: number,
		startY: number,
		width: number,
		height: number
	): { x: number; y: number }[] => {
		const area: { x: number; y: number }[] = [];
		const stack: { x: number; y: number }[] = [{ x: startX, y: startY }];

		while (stack.length > 0) {
			const { x, y } = stack.pop()!;

			// 越界判断
			if (x < 0 || x >= width || y < 0 || y >= height) continue;
			// 是否已经访问过
			if (visited[y * width + x]) continue;

			// 标记为已访问
			visited[y * width + x] = true;

			// 是否是透明像素
			if (!isEmptyPixel(data, x, y, width)) continue;

			// 收集扩散到的点
			area.push({ x, y });
			// 扩散到相邻的点
			stack.push({ x: x + 1, y });
			stack.push({ x: x - 1, y });
			stack.push({ x, y: y + 1 });
			stack.push({ x, y: y - 1 });
		}

		return area;
	};

	// 将点集转换为矩形
	const pointsToRect = (
		points: { x: number; y: number }[],
		width: number,
		height: number
	): Rect | null => {
		// 如果点集为空，则返回 null
		if (points.length === 0) return null;

		// 调整过滤条件，使更敏感
		if (points.length < 5) return null; // 至少5个像素点才认为是有效区域

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (const point of points) {
			minX = Math.min(minX, point.x);
			minY = Math.min(minY, point.y);
			maxX = Math.max(maxX, point.x);
			maxY = Math.max(maxY, point.y);
		}

		return {
			x: minX,
			y: minY,
			w: maxX - minX + 1,
			h: maxY - minY + 1
		};
	};

	// 检测透明区域
	React.useEffect(() => {
		if (!imageUrl) return;

		setLoading(true);
		setError(null);

		const detectAreas = async () => {
			try {
				const img = new Image();
				img.crossOrigin = 'Anonymous';
				img.src = imageUrl;

				img.onload = () => {
					console.log('图像加载成功:', img.width, 'x', img.height);
					const canvas = canvasRef.current;
					if (!canvas) {
						console.error('Canvas 未找到');
						setError('Canvas 未找到');
						setLoading(false);
						return;
					}

					const ctx = canvas.getContext('2d', { willReadFrequently: true });
					if (!ctx) {
						console.error('无法获取 Canvas 上下文');
						setError('无法获取 Canvas 上下文');
						setLoading(false);
						return;
					}

					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0);
					const imageData = ctx.getImageData(0, 0, img.width, img.height);
					const data = imageData.data;
					console.log('图像数据获取成功，像素总数:', data.length / 4);
					const visited = new Array(img.width * img.height).fill(false);
					const emptyRects: Rect[] = [];

					// 遍历每个像素点
					let transparentPixelCount = 0;
					for (let y = 0; y < img.height; y++) {
						for (let x = 0; x < img.width; x++) {
							// 如果这个像素点已经访问过，则跳过
							// 如果这个像素点是透明像素，则进行扩散
							if (!visited[y * img.width + x] && isEmptyPixel(data, x, y, img.width)) {
								transparentPixelCount++;
								// 进行扩散
								const area = findEmptyArea(data, visited, x, y, img.width, img.height);
								// 将扩散到的点集转换为矩形
								const rect = pointsToRect(area, img.width, img.height);
								if (rect && rect.w >= minWidth && rect.h >= minHeight) {
									emptyRects.push(rect);
								}
							}
						}
					}

					console.log('透明像素数量:', transparentPixelCount);
					console.log('检测到的区域数量:', emptyRects.length);
					console.log('检测到的区域:', emptyRects);

					setAreas(emptyRects);
					onAreasDetectedRef.current?.(emptyRects);
					setLoading(false);
				};

				img.onerror = err => {
					console.error('图像加载失败:', err);
					setError('图像加载失败');
					setLoading(false);
				};
			} catch (err) {
				console.error('检测过程中发生错误:', err);
				setError('检测过程中发生错误: ' + (err as Error).message);
				setLoading(false);
			}
		};

		detectAreas();
	}, [imageUrl, minWidth, minHeight, alphaThreshold]);

	return (
		<div className={`transparent-area-detection ${className}`} style={style}>
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			{loading && <div>正在检测透明区域...</div>}
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<div>
				<h3>检测到 {areas.length} 个透明区域：</h3>
				{areas.length > 0 ? (
					<ul>
						{areas.map((area, index) => (
							<li key={index}>
								区域 {index + 1}: x={area.x}, y={area.y}, 宽={area.w}, 高={area.h}
							</li>
						))}
					</ul>
				) : (
					<p>未检测到符合条件的透明区域</p>
				)}
			</div>
		</div>
	);
};

export default TransparentAreaDetection;
