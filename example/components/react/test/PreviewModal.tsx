import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import LightGallery from 'lightgallery/react';
import 'photoswipe/dist/photoswipe.css';
import React, { useEffect, useRef } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Gallery as PSGallery, PhotoSwipe } from 'react-photoswipe-gallery';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { usePreview } from './PreviewProvider';

const PreviewModal: React.FC = () => {
	const { current, closePreview, type } = usePreview();
	if (!current) return null;
	const { list, index, src } = current;

	if (type === 'lightbox') {
		return (
			<Lightbox
				mainSrc={src}
				nextSrc={list[(index + 1) % list.length]}
				prevSrc={list[(index - 1 + list.length) % list.length]}
				onCloseRequest={closePreview}
				onMovePrevRequest={() => closePreview()}
				onMoveNextRequest={() => closePreview()}
			/>
		);
	}

	if (type === 'modal') {
		return (
			<div
				className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
				onClick={closePreview}
			>
				<img src={src} alt="preview" className="max-w-full max-h-full rounded shadow-lg" />
			</div>
		);
	}

	if (type === 'photoSwipe') {
		return (
			<PSGallery withDownloadButton>
				<PhotoSwipe
					isOpen
					items={list.map(url => ({ src: url, width: 800, height: 600 }))}
					options={{ index, bgOpacity: 0.9, showHideOpacity: true }}
					onClose={closePreview}
				/>
			</PSGallery>
		);
	}

	if (type === 'lightGallery') {
		return (
			<div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center">
				<LightGallery
					dynamic
					dynamicEl={list.map(src => ({ src }))}
					index={index}
					onCloseAfter={closePreview}
				/>
			</div>
		);
	}

	if (type === 'viewerjs') {
		const containerRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (containerRef.current) {
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
		}, [index]);

		return (
			<div className="hidden" ref={containerRef}>
				{list.map((src, i) => (
					<img src={src} key={i} alt="" />
				))}
			</div>
		);
	}

	return null;
};

export default PreviewModal;
