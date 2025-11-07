import React, { useEffect, useMemo, useState } from 'react';
import './index.scss';
import { calculateJustifiedLayout, LayoutConfig } from './layout';

interface GalleryItem {
	id: string;
	src: string;
	width: number;
	height: number;
	alt: string;
}

interface GallerySettings extends LayoutConfig {
	containerPadding: number;
	boxSpacing: number;
	targetRowHeight: number;
	minScale: number;
	maxScale: number;
	showWidows: boolean;
}

const createMockImages = (): GalleryItem[] => {
	const presets = [
		{ width: 1200, height: 800 },
		{ width: 900, height: 1200 },
		{ width: 1400, height: 900 },
		{ width: 1000, height: 700 },
		{ width: 1120, height: 840 },
		{ width: 980, height: 640 },
		{ width: 640, height: 640 },
		{ width: 1280, height: 720 },
		{ width: 1080, height: 1440 },
		{ width: 1600, height: 1060 },
		{ width: 900, height: 900 },
		{ width: 1500, height: 1000 }
	];

	return presets.map((preset, index) => {
		const id = `justified-${index + 1}`;
		return {
			id,
			src: `https://picsum.photos/seed/${id}/${preset.width}/${preset.height}`,
			width: preset.width,
			height: preset.height,
			alt: `示例图片 ${index + 1}`
		};
	});
};

const fetchMockGallery = (): Promise<GalleryItem[]> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(createMockImages());
		}, 380);
	});
};

const JustifiedLayoutGallery: React.FC = () => {
	const [images, setImages] = useState<GalleryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [settings, setSettings] = useState<GallerySettings>({
		containerWidth: 600,
		containerPadding: 16,
		boxSpacing: 12,
		targetRowHeight: 160,
		minScale: 0.75,
		maxScale: 1.35,
		showWidows: true
	});

	useEffect(() => {
		let isMounted = true;
		setIsLoading(true);
		fetchMockGallery().then(list => {
			if (isMounted) {
				setImages(list);
				setIsLoading(false);
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);

	const layoutResult = useMemo(() => {
		if (!images.length) {
			const padding = settings.containerPadding ?? 16;
			return {
				boxes: [],
				rows: [],
				containerHeight: padding * 2
			};
		}

		const layoutItems = images.map(image => ({
			id: image.id,
			aspectRatio: image.width / image.height,
			meta: image
		}));

		return calculateJustifiedLayout(layoutItems, settings);
	}, [images, settings]);

	const handleNumberChange = (key: keyof GallerySettings) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = Number(event.target.value);
			setSettings(prev => ({
				...prev,
				[key]: Number.isNaN(value) ? prev[key] : value
			}));
		};

	const toggleWidows = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;
		setSettings(prev => ({
			...prev,
			showWidows: checked
		}));
	};

	return (
		<div className="justified-layout-demo">
			<div className="justified-layout-demo__panel">
				<div className="justified-layout-demo__panel-header">
					<h3>布局参数配置</h3>
					<p>调整容器宽度、行高与间距，观察图像分布的实时变化。</p>
				</div>
				<div className="justified-layout-demo__controls">
					<label className="justified-layout-demo__control">
						<span>容器宽度：{Math.round(settings.containerWidth)}px</span>
						<input
							type="range"
							min={420}
							max={600}
							step={10}
							value={settings.containerWidth}
							onChange={handleNumberChange('containerWidth')}
						/>
					</label>
					<label className="justified-layout-demo__control">
			<span>目标行高：{Math.round(settings.targetRowHeight)}px</span>
						<input
							type="range"
							min={100}
							max={240}
							step={5}
							value={settings.targetRowHeight}
							onChange={handleNumberChange('targetRowHeight')}
						/>
					</label>
					<label className="justified-layout-demo__control">
			<span>容器内边距：{Math.round(settings.containerPadding)}px</span>
						<input
							type="range"
							min={8}
							max={32}
							step={2}
							value={settings.containerPadding}
							onChange={handleNumberChange('containerPadding')}
						/>
					</label>
					<label className="justified-layout-demo__control">
			<span>单元间距：{Math.round(settings.boxSpacing)}px</span>
						<input
							type="range"
							min={6}
							max={28}
							step={1}
							value={settings.boxSpacing}
							onChange={handleNumberChange('boxSpacing')}
						/>
					</label>
					<label className="justified-layout-demo__control justified-layout-demo__control--inline">
						<input type="checkbox" checked={settings.showWidows} onChange={toggleWidows} />
						<span>保留最后一行原始比例</span>
					</label>
				</div>
			</div>
			<div className="justified-layout-demo__stage" style={{ width: Math.min(settings.containerWidth, 600) }}>
				<header className="justified-layout-demo__stage-meta">
					<div>
						<strong>{images.length}</strong>
						<span>张图片</span>
					</div>
					<div>
						<strong>{layoutResult.rows.length}</strong>
						<span>行布局</span>
					</div>
					<div>
						<strong>{Math.round(layoutResult.containerHeight)}</strong>
						<span>容器高度 (px)</span>
					</div>
				</header>
				<div
					className="justified-layout-demo__grid"
					style={{ height: layoutResult.containerHeight }}
				>
					{isLoading && <div className="justified-layout-demo__loading">正在加载示例图片...</div>}
					{!isLoading &&
						layoutResult.boxes.map(box => {
							const meta = box.meta as GalleryItem | undefined;
							return (
								<figure
									key={box.id}
									className="justified-layout-demo__item"
									style={{
										width: `${box.width}px`,
										height: `${box.height}px`,
										left: `${box.left}px`,
										top: `${box.top}px`
									}}
								>
									{meta ? (
										<img src={meta.src} alt={meta.alt} loading="lazy" />
									) : null}
									<figcaption>
										{meta?.alt}
									</figcaption>
								</figure>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default JustifiedLayoutGallery;

