import imagesLoaded from 'imagesloaded';
import Masonry from 'masonry-layout';
import React, { useEffect, useRef, useState } from 'react';
import { usePreview } from './PreviewProvider';

type ImageItem = {
	id: number | string;
	src: string;
};

interface MasonryImageGalleryProps {
	images: ImageItem[];
	pageSize?: number;
	skeletonCount?: number;
	columnCount?: number; // 控制展示的列数
}

const MasonryImageGallery: React.FC<MasonryImageGalleryProps> = ({
	images = [],
	pageSize = 12,
	skeletonCount = 6,
	columnCount = 4 // 默认4列
}) => {
	const gridRef = useRef<HTMLDivElement>(null);
	const loaderRef = useRef<HTMLDivElement>(null);
	const masonryInstanceRef = useRef<any>(null);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const { openPreview } = usePreview();

	// 根据列数生成对应的CSS类
	const getColumnClasses = () => {
		switch (columnCount) {
			case 2:
				return 'w-full sm:w-1/2';
			case 3:
				return 'w-full sm:w-1/2 md:w-1/3';
			case 5:
				return 'w-full sm:w-1/2 md:w-1/3 lg:w-1/5';
			case 6:
				return 'w-full sm:w-1/2 md:w-1/3 lg:w-1/6';
			case 4:
			default:
				return 'w-full sm:w-1/2 md:w-1/3 lg:w-1/4';
		}
	};

	// 确保currentImages至少是一个空数组
	const currentImages = images && Array.isArray(images) ? images.slice(0, page * pageSize) : [];
	const isEnd = currentImages.length >= (images?.length || 0);
	const imgList = currentImages.map(i => i.src).filter(src => src); // 过滤掉空src

	useEffect(() => {
		if (!gridRef.current) return;

		// 只在新图片加载时设置loading状态，避免已有布局时的闪烁
		const isNewImages = currentImages.length > 0 && (!masonryInstanceRef.current || currentImages.length > imgList.length);
		if (isNewImages) {
			setIsLoading(true);
		}

		const imgLoad = imagesLoaded(gridRef.current);

		const layoutMasonry = () => {
			// 如果已经有实例，则重新布局而不是创建新实例
			if (masonryInstanceRef.current) {
				masonryInstanceRef.current.reloadItems();
				masonryInstanceRef.current.layout();
			} else {
				// 首次创建实例
				masonryInstanceRef.current = new Masonry(gridRef.current!, {
					itemSelector: '.masonry-item',
					columnWidth: '.masonry-sizer',
					gutter: 16,
					percentPosition: true
				});
			}
			setIsLoading(false);
			setInitialLoading(false);
		};

		imgLoad.on('always', layoutMasonry);

		// 清理函数 - 移除监听器
		return () => {
			imgLoad.off('always', layoutMasonry);
			// imgLoad.destroy() 方法不存在，已移除
		};
	}, [currentImages]);

	// 组件卸载时销毁 Masonry 实例
	useEffect(() => {
		return () => {
			if (masonryInstanceRef.current) {
				// 销毁 Masonry 实例的引用
				masonryInstanceRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		const el = loaderRef.current;
		if (!el || isEnd) return;

		// 创建一次性的IntersectionObserver配置
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && !isLoading) {
					setPage(p => p + 1);
				}
			},
			{ threshold: 1.0 }
		);

		observer.observe(el);

		// 清理函数
		return () => observer.disconnect();
	}, [isLoading, isEnd]); // 只有当依赖项真正改变时才重新创建观察者

	/**
	 * 打开图片预览
	 * @param idx 图片索引
	 */
	const handleOpenPreview = (idx: number) => {
		if (idx < 0 || idx >= imgList.length) return; // 安全检查
		openPreview(imgList, idx);
	};

	return (
		<div className="p-6">
			<div className="masonry-grid relative" ref={gridRef}>
				<div className={`masonry-sizer ${getColumnClasses()}`} />
				{currentImages.map((img, idx) => (
					<div
						key={img.id}
						className={`masonry-item mb-4 float-left ${getColumnClasses()}`}
					>
						<div
							className="rounded shadow overflow-hidden cursor-pointer"
							// 使用封装的handleOpenPreview
							onClick={() => handleOpenPreview(idx)}
						>
							<img
								src={img.src}
								alt={`img-${img.id}`}
								loading="lazy"
								className="w-full object-cover block"
							/>
						</div>
					</div>
				))}
				{initialLoading &&
					Array.from({ length: skeletonCount }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className={`masonry-item mb-4 float-left ${getColumnClasses()}`}
						>
							<div className="animate-pulse bg-gray-300 h-40 rounded shadow" />
						</div>
					))}
				{!isEnd && !isLoading && (
					<div ref={loaderRef} className="w-full h-12 my-4 text-center text-gray-500">
						加载中...
					</div>
				)}
			</div>
		</div>
	);
};

export default MasonryImageGallery;