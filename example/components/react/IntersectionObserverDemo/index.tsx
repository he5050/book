import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './index.scss';

// 懒加载图片组件
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const { ref, inView } = useInView({
		triggerOnce: true,
		rootMargin: '50px',
		threshold: 0.1
	});

	const handleImageLoad = () => {
		setIsLoaded(true);
	};

	const handleImageError = () => {
		setLoadError(true);
	};

	return (
		<div ref={ref} className="lazy-image-container">
			{!inView && <div className="placeholder">图片即将加载...</div>}
			{inView && !isLoaded && !loadError && <div className="loading">图片加载中...</div>}
			{inView && loadError && <div className="error">图片加载失败</div>}
			{inView && (
				<img
					src={src}
					alt={alt}
					onLoad={handleImageLoad}
					onError={handleImageError}
					className={`lazy-image ${isLoaded ? 'loaded' : ''} ${loadError ? 'error' : ''}`}
					style={{ display: isLoaded && !loadError ? 'block' : 'none' }}
				/>
			)}
		</div>
	);
};

// 动画盒子组件
const AnimationBox: React.FC<{ id: number }> = ({ id }) => {
	const { ref, inView } = useInView({
		threshold: 0.5
	});

	return (
		<div ref={ref} className={`animation-box ${inView ? 'visible' : ''}`}>
			<div className="box-content">
				<h3>动画盒子 #{id}</h3>
				<p>当这个盒子进入视窗50%时会触发动画效果</p>
				<div className="indicator">状态: {inView ? '可见' : '不可见'}</div>
			</div>
		</div>
	);
};

// 无限滚动列表项
const ListItem: React.FC<{ id: number }> = ({ id }) => {
	return (
		<div className="list-item">
			<div className="item-header">
				<div className="avatar" />
				<div className="user-info">
					<div className="username">用户 {id}</div>
					<div className="time">2小时前</div>
				</div>
			</div>
			<div className="item-content">
				这是列表项 #{id} 的内容。当滚动到页面底部时会自动加载更多内容。
			</div>
			<div className="item-footer">
				<button className="action-button">点赞</button>
				<button className="action-button">评论</button>
				<button className="action-button">分享</button>
			</div>
		</div>
	);
};

// 主组件
const IntersectionObserverDemo: React.FC = () => {
	const [listItems, setListItems] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
	const [loading, setLoading] = useState(false);
	const { ref: sentinelRef, inView } = useInView({
		rootMargin: '100px'
	});

	// 模拟加载更多数据
	const loadMoreItems = () => {
		if (loading) return;

		setLoading(true);

		// 模拟网络请求
		setTimeout(() => {
			const currentLength = listItems.length;
			const newItems = Array.from({ length: 10 }, (_, i) => currentLength + i + 1);
			setListItems(prev => [...prev, ...newItems]);
			setLoading(false);
		}, 1000);
	};

	// 当哨兵元素进入视图时加载更多数据
	useEffect(() => {
		if (inView && !loading) {
			loadMoreItems();
		}
	}, [inView, loading]);

	return (
		<div className="intersection-observer-demo">
			<h2 className="demo-title">Intersection Observer API 演示</h2>

			<div className="demo-section">
				<h3>1. 图片懒加载示例</h3>
				<div className="lazy-images-container">
					<LazyImage src="https://picsum.photos/400/300?random=1" alt="示例图片 1" />
					<LazyImage src="https://picsum.photos/400/300?random=2" alt="示例图片 2" />
					<LazyImage src="https://picsum.photos/400/300?random=3" alt="示例图片 3" />
				</div>
			</div>

			<div className="demo-section">
				<h3>2. 动画触发示例</h3>
				<div className="animation-boxes-container">
					{[1, 2, 3, 4, 5].map(id => (
						<AnimationBox key={id} id={id} />
					))}
				</div>
			</div>

			<div className="demo-section">
				<h3>3. 无限滚动示例</h3>
				<div className="infinite-scroll-container">
					<div className="list-items">
						{listItems.map(id => (
							<ListItem key={id} id={id} />
						))}
					</div>
					<div ref={sentinelRef} className="sentinel">
						{loading && <div className="loading-spinner">加载中...</div>}
					</div>
				</div>
			</div>

			<div className="demo-info">
				<h3>技术说明</h3>
				<div className="info-content">
					<p>
						Intersection Observer API
						提供了一种异步观察目标元素与其祖先元素或顶级文档视窗交叉状态的方法。
					</p>
					<p>
						相比于传统的 getBoundingClientRect() + 滚动事件监听的方式，Intersection Observer API
						具有更好的性能表现。
					</p>
					<p>常见应用场景包括：图片懒加载、无限滚动、动画触发、广告曝光统计等。</p>
				</div>
			</div>
		</div>
	);
};

export default IntersectionObserverDemo;
