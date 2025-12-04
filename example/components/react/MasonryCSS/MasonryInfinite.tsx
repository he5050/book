import * as React from 'react';
import Masonry from 'react-masonry-css';
import { useInView } from 'react-intersection-observer'; // 监听元素是否进入视口
import './MasonryInfinite.scss';

const MasonryInfinite = () => {
	const [imageData, setImageData] = React.useState<any[]>([]);
	const [page, setPage] = React.useState(1);
	const [isLoading, setIsLoading] = React.useState(false);

	// 配置 Intersection Observer：监听"加载更多"提示框
	const { ref, inView } = useInView({
		threshold: 0.1, // 当元素 10% 进入视口时触发
		triggerOnce: false // 允许重复触发
	});

	// 模拟请求数据
	const fetchImages = async (pageNum: number) => {
		setIsLoading(true);
		try {
			// 模拟接口延迟
			await new Promise(resolve => setTimeout(resolve, 1000));
			// 生成新图片数据（实际项目中替换为接口请求）
			const newImages = Array.from({ length: 6 }, (_, i) => ({
				id: (pageNum - 1) * 6 + i + 1,
				url: `https://picsum.photos/800/${(400 + Math.random() * 300) | 0}?random=${
					(pageNum - 1) * 6 + i + 1
				}`,
				alt: `图片${(pageNum - 1) * 6 + i + 1}`
			}));
			// 合并数据（避免覆盖原有数据）
			setImageData(prev => [...prev, ...newImages]);
		} catch (error) {
			console.error('加载图片失败：', error);
		} finally {
			setIsLoading(false);
		}
	};

	// 初始加载第一页数据
	React.useEffect(() => {
		fetchImages(1);
	}, []);

	// 当"加载更多"元素进入视口时，加载下一页
	React.useEffect(() => {
		if (inView && !isLoading) {
			setPage(prev => prev + 1);
		}
	}, [inView, isLoading]);

	// 页面更新时加载对应页数据
	React.useEffect(() => {
		if (page > 1) {
			fetchImages(page);
		}
	}, [page]);

	// 响应式列数配置
	const breakpointColumnsObj = {
		default: 1,
		768: 2,
		1024: 3
	};

	return (
		<div className="masonry-infinite-container">
			<h2>无限滚动瀑布流</h2>
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className="my-masonry-grid"
				columnClassName="my-masonry-grid_column"
			>
				{imageData.map(image => (
					<div key={image.id} className="masonry-item">
						<img
							src={image.url}
							alt={image.alt}
							className="masonry-image"
							loading="lazy" // 图片懒加载
						/>
					</div>
				))}
			</Masonry>
			{/* 加载更多提示框：通过 ref 监听是否进入视口 */}
			<div ref={ref} className="loading-more">
				{isLoading ? '加载中...' : '下拉加载更多'}
			</div>
		</div>
	);
};

export default MasonryInfinite;
