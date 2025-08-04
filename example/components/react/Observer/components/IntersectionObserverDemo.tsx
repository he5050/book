import { useEffect, useRef, useState } from 'react';

// 自定义 Hook：useIntersectionObserver
export const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
	const targetRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const element = targetRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
				setEntry(entry);
			},
			{
				threshold: 0.1,
				rootMargin: '0px',
				...options
			}
		);

		observer.observe(element);

		return () => {
			observer.unobserve(element);
			observer.disconnect();
		};
	}, [options]);

	return { isIntersecting, entry, targetRef };
};

// 懒加载图片组件
const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
	const { isIntersecting, targetRef } = useIntersectionObserver({
		threshold: 0.1,
		rootMargin: '50px'
	});

	return (
		<div
			ref={targetRef}
			style={{
				width: '300px',
				height: '200px',
				backgroundColor: '#f0f0f0',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				margin: '20px 0',
				border: '2px solid #ddd',
				borderRadius: '8px'
			}}
		>
			{isIntersecting ? (
				<img
					src={src}
					alt={alt}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						borderRadius: '6px'
					}}
					onLoad={() => console.log(`图片加载完成: ${alt}`)}
				/>
			) : (
				<div style={{ color: '#666', textAlign: 'center' }}>
					<div>📷</div>
					<div>图片懒加载中...</div>
				</div>
			)}
		</div>
	);
};

// 无限滚动组件
const InfiniteScroll = () => {
	const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
	const [loading, setLoading] = useState(false);
	const { isIntersecting, targetRef } = useIntersectionObserver({
		threshold: 1.0
	});

	useEffect(() => {
		if (isIntersecting && !loading) {
			setLoading(true);
			// 模拟 API 请求
			setTimeout(() => {
				setItems(prev => [...prev, ...Array.from({ length: 5 }, (_, i) => prev.length + i + 1)]);
				setLoading(false);
			}, 1000);
		}
	}, [isIntersecting, loading]);

	return (
		<div
			style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}
		>
			{items.map(item => (
				<div
					key={item}
					style={{
						padding: '20px',
						margin: '10px 0',
						backgroundColor: '#f8f9fa',
						borderRadius: '4px',
						border: '1px solid #e9ecef'
					}}
				>
					列表项 #{item}
				</div>
			))}
			<div
				ref={targetRef}
				style={{
					padding: '20px',
					textAlign: 'center',
					color: '#666'
				}}
			>
				{loading ? '加载中...' : '滚动到底部加载更多'}
			</div>
		</div>
	);
};

// 视口可见性检测组件
const VisibilityTracker = () => {
	const { isIntersecting, entry, targetRef } = useIntersectionObserver({
		threshold: [0, 0.25, 0.5, 0.75, 1]
	});

	const visibilityPercentage = entry ? Math.round(entry.intersectionRatio * 100) : 0;

	return (
		<div style={{ margin: '50px 0' }}>
			<div
				ref={targetRef}
				style={{
					width: '300px',
					height: '200px',
					backgroundColor: isIntersecting ? '#4CAF50' : '#f44336',
					color: 'white',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '8px',
					transition: 'background-color 0.3s ease'
				}}
			>
				<h3>可见性追踪器</h3>
				<p>状态: {isIntersecting ? '可见' : '不可见'}</p>
				<p>可见度: {visibilityPercentage}%</p>
			</div>
		</div>
	);
};

const IntersectionObserverDemo = () => {
	return (
		<div style={{ padding: '20px' }}>
			<h2>IntersectionObserver 示例</h2>

			<section style={{ marginBottom: '40px' }}>
				<h3>1. 懒加载图片</h3>
				<p>向下滚动查看图片懒加载效果：</p>
				<div
					style={{ height: '300px', overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}
				>
					<div
						style={{
							height: '200px',
							backgroundColor: '#f0f0f0',
							margin: '10px 0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						滚动区域开始
					</div>
					<LazyImage src="https://picsum.photos/300/200?random=1" alt="随机图片 1" />
					<LazyImage src="https://picsum.photos/300/200?random=2" alt="随机图片 2" />
					<LazyImage src="https://picsum.photos/300/200?random=3" alt="随机图片 3" />
					<div
						style={{
							height: '200px',
							backgroundColor: '#f0f0f0',
							margin: '10px 0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						滚动区域结束
					</div>
				</div>
			</section>

			<section style={{ marginBottom: '40px' }}>
				<h3>2. 无限滚动</h3>
				<p>滚动到底部自动加载更多内容：</p>
				<InfiniteScroll />
			</section>

			<section style={{ marginBottom: '40px' }}>
				<h3>3. 视口可见性检测</h3>
				<p>滚动页面观察元素的可见性变化：</p>
				<div
					style={{ height: '300px', overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}
				>
					<div
						style={{
							height: '200px',
							backgroundColor: '#f0f0f0',
							margin: '10px 0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						滚动区域开始
					</div>
					<VisibilityTracker />
					<div
						style={{
							height: '200px',
							backgroundColor: '#f0f0f0',
							margin: '10px 0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						滚动区域结束
					</div>
				</div>
			</section>
		</div>
	);
};

export default IntersectionObserverDemo;