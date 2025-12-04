import React from 'react';
import Masonry from 'react-masonry-css';
import './MasonryDemo.scss';

// 模拟图片数据
const imageData = [
	{ id: 1, url: 'https://picsum.photos/800/600?random=1', alt: '图片1' },
	{ id: 2, url: 'https://picsum.photos/800/400?random=2', alt: '图片2' },
	{ id: 3, url: 'https://picsum.photos/800/700?random=3', alt: '图片3' },
	{ id: 4, url: 'https://picsum.photos/800/500?random=4', alt: '图片4' },
	{ id: 5, url: 'https://picsum.photos/800/650?random=5', alt: '图片5' },
	{ id: 6, url: 'https://picsum.photos/800/450?random=6', alt: '图片6' },
	{ id: 7, url: 'https://picsum.photos/800/550?random=7', alt: '图片7' },
	{ id: 8, url: 'https://picsum.photos/800/350?random=8', alt: '图片8' },
	{ id: 9, url: 'https://picsum.photos/800/620?random=9', alt: '图片9' }
];

const MasonryDemo = () => {
	// 配置响应式列数：屏幕宽度 >= 1024px 时 3 列，>= 768px 时 2 列，默认 1 列
	const breakpointColumnsObj = {
		default: 1,
		768: 2,
		1024: 3
	};

	return (
		<div className="masonry-demo-container">
			<h2>React 瀑布流示例（react-masonry-css）</h2>
			{/* 核心组件 Masonry */}
			<Masonry
				// 响应式列数配置
				breakpointCols={breakpointColumnsObj}
				// 列间距（对应 CSS 中的 gap）
				className="my-masonry-grid"
				// 每列的容器类名
				columnClassName="my-masonry-grid_column"
			>
				{/* 遍历渲染图片项 */}
				{imageData.map(image => (
					<div key={image.id} className="masonry-item">
						<img
							src={image.url}
							alt={image.alt}
							className="masonry-image"
							loading="lazy" // 懒加载优化
						/>
					</div>
				))}
			</Masonry>
		</div>
	);
};

export default MasonryDemo;
