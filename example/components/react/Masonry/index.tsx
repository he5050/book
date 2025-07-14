import React from 'react';
import MasonryImageGallery from './MasonryImageGallery';
import PreviewModal from './PreviewModal';
import { PreviewProvider } from './PreviewProvider';

// 示例图片数据（可替换为后端数据）
const images = Array.from({ length: 30 }, (_, i) => ({
	id: i,
	src: `https://picsum.photos/id/${i + 10}/300/${150 + (i % 5) * 40}`
}));

const MasonryDemo: React.FC = () => {
	return (
		<div className="w-[500px] h-[600px] overflow-auto">
			<PreviewProvider type="lightbox">
				{/* 可替换为 photoSwipe / viewerjs / lightbox / modal */}
				<MasonryImageGallery images={images} />
				<PreviewModal />
			</PreviewProvider>
		</div>
	);
};
export default MasonryDemo;
