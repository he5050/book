// components/preview/PreviewModal.tsx
import React, { useEffect, useRef } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { usePreview } from './PreviewProvider';

// PhotoSwipe
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

// LightGallery
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import LightGallery from 'lightgallery/react';

// ViewerJS
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

const PreviewModal: React.FC = () => {
	const { current, closePreview, updatePreview, type } = usePreview();
	if (!current || !type) return null;

	const { list, index, src } = current;

	// 🔹 Lightbox 分支
	const renderLightbox = () => {
		const nextIndex = list.length ? (index + 1) % list.length : 0;
		const prevIndex = list.length ? (index - 1 + list.length) % list.length : 0;

		return (
			<Lightbox
				mainSrc={src}
				nextSrc={list[nextIndex]}
				prevSrc={list[prevIndex]}
				onCloseRequest={closePreview}
				onMovePrevRequest={() => updatePreview(prevIndex)}
				onMoveNextRequest={() => updatePreview(nextIndex)}
			/>
		);
	};

	// 🔹 原生 Modal 分支
	const renderModal = () => (
		<div
			className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
			onClick={closePreview}
		>
			<img src={src} alt="preview" className="max-w-full max-h-full rounded shadow-lg" />
		</div>
	);

	// 🔹 PhotoSwipe 分支
	const renderPhotoSwipe = () => (
		<Gallery>
			{list.map((itemSrc, i) => (
				<Item
					key={i}
					original={itemSrc}
					thumbnail={itemSrc}
					width="800"
					height="600"
					id={`ps-item-${i}`}
				>
					{({ ref, open }) => (
						<img
							ref={ref}
							style={{ display: 'none' }}
							onClick={() => {
								// 点击隐藏 img 打开指定 index
								open({ index });
							}}
							alt=""
						/>
					)}
				</Item>
			))}
		</Gallery>
	);

	// 🔹 LightGallery 分支
	const renderLightGallery = () => (
		<div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center">
			<LightGallery
				dynamic
				dynamicEl={list.map(src => ({ src }))}
				index={index}
				onCloseAfter={closePreview}
			/>
		</div>
	);

	// 🔹 ViewerJS 分支
	const renderViewerJs = () => {
		const containerRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (containerRef.current && list.length > 0) {
				const viewer = new Viewer(containerRef.current, {
					hidden() {
						closePreview();
					},
					inline: false,
					toolbar: true,
					navbar: false
				});
				viewer.view(index);
				return () => viewer.destroy();
			}
		}, [index, list]);

		return (
			<div className="hidden" ref={containerRef}>
				{list.map((itemSrc, i) => (
					<img src={itemSrc} key={i} alt="" />
				))}
			</div>
		);
	};

	// ✅ 拔选渲染
	switch (type) {
		case 'lightbox':
			return renderLightbox();
		case 'modal':
			return renderModal();
		case 'photoSwipe':
			return renderPhotoSwipe();
		case 'lightGallery':
			return renderLightGallery();
		case 'viewerjs':
			return renderViewerJs();
		default:
			return null;
	}
};

export default PreviewModal;
