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
}

const MasonryImageGallery: React.FC<MasonryImageGalleryProps> = ({
	images,
	pageSize = 12,
	skeletonCount = 6
}) => {
	const gridRef = useRef<HTMLDivElement>(null);
	const loaderRef = useRef<HTMLDivElement>(null);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const { openPreview } = usePreview();

	const currentImages = images.slice(0, page * pageSize);
	const isEnd = currentImages.length >= images.length;
	const imgList = currentImages.map(i => i.src);

	useEffect(() => {
		if (!gridRef.current) return;
		const imgLoad = imagesLoaded(gridRef.current);
		setIsLoading(true);
		imgLoad.on('always', () => {
			new Masonry(gridRef.current!, {
				itemSelector: '.masonry-item',
				columnWidth: '.masonry-sizer',
				gutter: 16,
				percentPosition: true
			});
			setIsLoading(false);
		});
	}, [currentImages]);

	useEffect(() => {
		const el = loaderRef.current;
		if (!el || isEnd) return;
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && !isLoading) {
					setPage(p => p + 1);
				}
			},
			{ threshold: 1.0 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [isLoading, currentImages]);

	return (
		<div className="p-6">
			<div className="masonry-grid relative" ref={gridRef}>
				<div className="masonry-sizer w-full sm:w-1/2 md:w-1/3 lg:w-1/4" />
				{currentImages.map((img, idx) => (
					<div
						key={img.id}
						className="masonry-item mb-4 float-left w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
					>
						<div
							className="rounded shadow overflow-hidden cursor-pointer"
							onClick={() => openPreview(imgList, idx)}
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
				{isLoading &&
					Array.from({ length: skeletonCount }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="masonry-item mb-4 float-left w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
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
