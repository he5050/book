import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.scss';

declare global {
	interface Window {
		CanvasKitInit?: (config: { locateFile: (file: string) => string }) => Promise<any>;
		__canvasKitPromise?: Promise<any>;
	}
}

type DrawMode = 'roundRect' | 'rect' | 'oval' | 'circle' | 'line' | 'arc' | 'points' | 'path';

const CANVASKIT_CDN = 'https://unpkg.com/canvaskit-wasm@0.38.0/bin';

const loadCanvasKit = async () => {
	if (window.__canvasKitPromise) {
		return window.__canvasKitPromise;
	}

	window.__canvasKitPromise = new Promise<any>((resolve, reject) => {
		const handleReady = () => {
			if (!window.CanvasKitInit) {
				reject(new Error('CanvasKitInit 未找到'));
				return;
			}
			window
				.CanvasKitInit({
					locateFile: file => `${CANVASKIT_CDN}/${file}`
				})
				.then(resolve)
				.catch(reject);
		};

		if (window.CanvasKitInit) {
			handleReady();
			return;
		}

		const existingScript = document.querySelector<HTMLScriptElement>('script[data-canvaskit]');
		if (existingScript) {
			existingScript.addEventListener('load', handleReady);
			existingScript.addEventListener('error', () => reject(new Error('CanvasKit 脚本加载失败')));
			return;
		}

		const script = document.createElement('script');
		script.src = `${CANVASKIT_CDN}/canvaskit.js`;
		script.async = true;
		script.crossOrigin = 'anonymous';
		script.dataset.canvaskit = 'true';
		script.addEventListener('load', handleReady);
		script.addEventListener('error', () => reject(new Error('CanvasKit 脚本加载失败')));
		document.head.appendChild(script);
	});

	return window.__canvasKitPromise;
};

const shapeOptions: Array<{ label: string; value: DrawMode }> = [
	{ label: '圆角矩形', value: 'roundRect' },
	{ label: '矩形', value: 'rect' },
	{ label: '椭圆', value: 'oval' },
	{ label: '圆', value: 'circle' },
	{ label: '直线', value: 'line' },
	{ label: '椭圆弧', value: 'arc' },
	{ label: '点/线段', value: 'points' },
	{ label: '路径', value: 'path' }
];

const defaultPoints = new Float32Array([60, 60, 120, 120, 180, 80, 240, 140, 320, 100]);

const createColor4f = (ck: any, hex: string) => {
	if (!ck) {
		return Float32Array.from([1, 0.35, 0.37, 1]);
	}

	try {
		if (typeof ck.parseColorString === 'function') {
			const parsed = ck.parseColorString(hex);
			if (parsed) {
				return parsed;
			}
		}
	} catch (error) {
		console.warn('[CanvasKit] parseColorString 失败，使用手动转换', error);
	}

	const sanitized = hex.replace('#', '');
	const bigint = Number.parseInt(sanitized.length === 3 ? sanitized.repeat(2) : sanitized, 16);
	const r = ((bigint >> 16) & 255) / 255;
	const g = ((bigint >> 8) & 255) / 255;
	const b = (bigint & 255) / 255;
	return typeof ck.Color4f === 'function' ? ck.Color4f(r, g, b, 1) : Float32Array.from([r, g, b, 1]);
};

const CanvasKitPrimer: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasKitRef = useRef<any>(null);
	const surfaceRef = useRef<any>(null);
	const [mode, setMode] = useState<DrawMode>('roundRect');
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
	const [useFill, setUseFill] = useState(false);
	const [strokeWidth, setStrokeWidth] = useState(4);
	const [radius, setRadius] = useState(32);
	const [arcSweep, setArcSweep] = useState(140);
	const [color, setColor] = useState('#ff5a5f');

	const color4f = useMemo(() => createColor4f(canvasKitRef.current, color), [color, status]);

	useEffect(() => {
		let cancelled = false;
		loadCanvasKit()
			.then(ck => {
				if (cancelled) return;
				canvasKitRef.current = ck;
				setStatus('ready');
			})
			.catch(err => {
				console.error('[CanvasKit] 初始化失败', err);
				if (!cancelled) {
					setStatus('error');
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (status !== 'ready' || !canvasKitRef.current || !canvasRef.current) {
			return;
		}

		if (surfaceRef.current) {
			return;
		}

		const ck = canvasKitRef.current;
		let surface = ck.MakeWebGLCanvasSurface(canvasRef.current);
		if (!surface) {
			surface = ck.MakeSWCanvasSurface(canvasRef.current);
		}
		if (!surface) {
			setStatus('error');
			console.error('[CanvasKit] 无法创建绘制表面');
			return;
		}
		surfaceRef.current = surface;
	}, [status]);

	const drawScene = useCallback(() => {
		const ck = canvasKitRef.current;
		const surface = surfaceRef.current;
		if (!ck || !surface) return;

		try {
			const canvas = surface.getCanvas();
			canvas.clear(typeof ck.Color === 'function' ? ck.Color(1, 1, 1, 1) : ck.WHITE);

			const paint = new ck.Paint();
			paint.setAntiAlias(true);
			paint.setColor(color4f);
			paint.setStrokeWidth(strokeWidth);
			paint.setStyle(useFill ? ck.PaintStyle.Fill : ck.PaintStyle.Stroke);

			switch (mode) {
				case 'roundRect': {
					const rect = ck.XYWHRect(80, 70, 320, 200);
					const r = Math.max(4, Math.min(radius, 160));
					const rrect = ck.RRectXY(rect, r, r);
					canvas.drawRRect(rrect, paint);
					break;
				}
				case 'rect': {
					canvas.drawRect(ck.XYWHRect(100, 80, 300, 180), paint);
					break;
				}
				case 'oval': {
					canvas.drawOval(ck.XYWHRect(100, 100, 280, 160), paint);
					break;
				}
				case 'circle': {
					canvas.drawCircle(240, 180, Math.max(12, Math.min(radius, 160)), paint);
					break;
				}
				case 'line': {
					canvas.drawLine(90, 100, 360, 250, paint);
					break;
				}
				case 'arc': {
					const oval = ck.XYWHRect(120, 90, 260, 180);
					canvas.drawArc(oval, 0, arcSweep, useFill, paint);
					break;
				}
				case 'points': {
					const points = Float32Array.from(defaultPoints);
					const modeType = useFill ? ck.PointMode.Polygon : ck.PointMode.Lines;
					canvas.drawPoints(modeType, points, paint);
					break;
				}
				case 'path': {
					const path = new ck.Path();
					path.moveTo(80, 240)
						.lineTo(180, 110)
						.cubicTo(220, 60, 320, 140, 340, 220)
						.close();
					canvas.drawPath(path, paint);
					path.delete();
					break;
				}
				default:
					break;
			}

			paint.delete();
			surface.flush();
		} catch (error) {
			console.error('[CanvasKit] 绘制失败', error);
		}
	}, [arcSweep, color4f, mode, radius, strokeWidth, useFill]);

	useEffect(() => {
		if (status !== 'ready') {
			return;
		}
		drawScene();
	}, [drawScene, status]);

	useEffect(() => {
		return () => {
			if (surfaceRef.current) {
				if (typeof surfaceRef.current.dispose === 'function') {
					surfaceRef.current.dispose();
				} else if (typeof surfaceRef.current.delete === 'function') {
					surfaceRef.current.delete();
				}
				surfaceRef.current = null;
			}
		};
	}, []);

	return (
		<div className="canvaskit-basic-demo">
			<div className="canvaskit-basic-demo__panel">
				<h3>CanvasKit 基础绘制</h3>
				<p className="canvaskit-basic-demo__desc">加载 WASM 版本 Skia，并演示多个几何图形的绘制与参数控制。</p>
				<div className="canvaskit-basic-demo__controls">
					<label className="canvaskit-basic-demo__field">
						<span>绘制对象</span>
						<select value={mode} onChange={event => setMode(event.target.value as DrawMode)}>
							{shapeOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</label>
					<label className="canvaskit-basic-demo__field">
						<span>线宽</span>
						<input
							type="range"
							min={1}
							max={12}
							step={1}
							value={strokeWidth}
							onChange={event => setStrokeWidth(Number(event.target.value))}
						/>
						<strong>{strokeWidth}px</strong>
					</label>
					<label className="canvaskit-basic-demo__field">
						<span>主色</span>
						<input type="color" value={color} onChange={event => setColor(event.target.value)} />
					</label>
					{mode === 'roundRect' || mode === 'circle' ? (
						<label className="canvaskit-basic-demo__field">
							<span>{mode === 'circle' ? '半径' : '圆角半径'}</span>
							<input
								type="range"
								min={8}
								max={80}
								step={4}
								value={radius}
								onChange={event => setRadius(Number(event.target.value))}
							/>
							<strong>{radius}px</strong>
						</label>
					) : null}
					{mode === 'arc' ? (
						<label className="canvaskit-basic-demo__field">
							<span>弧线角度</span>
							<input
								type="range"
								min={30}
								max={320}
								step={10}
								value={arcSweep}
								onChange={event => setArcSweep(Number(event.target.value))}
							/>
							<strong>{arcSweep}°</strong>
						</label>
					) : null}
					<label className="canvaskit-basic-demo__field canvaskit-basic-demo__field--inline">
						<input
							type="checkbox"
							checked={useFill}
							onChange={event => setUseFill(event.target.checked)}
						/>
						<span>{mode === 'points' ? '多边形连接' : '填充模式'}</span>
					</label>
				</div>
			</div>
			<div className="canvaskit-basic-demo__canvas-wrapper">
				<canvas ref={canvasRef} width={600} height={360} />
				{status === 'loading' ? <div className="canvaskit-basic-demo__status">正在加载 CanvasKit...</div> : null}
				{status === 'error' ? (
					<div className="canvaskit-basic-demo__status canvaskit-basic-demo__status--error">
						CanvasKit 初始化失败，请检查网络后重试。
					</div>
				) : null}
			</div>
		</div>
	);
};

export default CanvasKitPrimer;

