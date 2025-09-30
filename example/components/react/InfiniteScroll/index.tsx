import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.scss';

interface Item {
	id: number;
	name: string;
	description: string;
}

interface InfiniteScrollExampleProps {
	// 容器宽度
	width?: number;
	// 容器高度
	height?: number;
	// 初始数据量
	initialCount?: number;
	// 每次加载数据量
	loadCount?: number;
	// 最大数据量
	maxCount?: number;
	// 主题
	theme?: 'light' | 'dark';
}

const InfiniteScrollExample: React.FC<InfiniteScrollExampleProps> = ({
	width = 500,
	height,
	initialCount = 20,
	loadCount = 20,
	maxCount = 100,
	theme = 'light'
}) => {
	const [items, setItems] = useState<Item[]>(
		Array.from({ length: initialCount }, (_, i) => ({
			id: i,
			name: `数据项 #${i}`,
			description: `这是第 ${i + 1} 个数据项的描述信息，包含一些示例文本内容。`
		}))
	);
	const [hasMore, setHasMore] = useState(true);

	const fetchMoreData = () => {
		// 模拟异步请求
		setTimeout(() => {
			const currentLength = items.length;
			const newItems = Array.from({ length: loadCount }, (_, i) => ({
				id: currentLength + i,
				name: `数据项 #${currentLength + i}`,
				description: `这是第 ${currentLength + i + 1} 个数据项的描述信息，包含一些示例文本内容。`
			}));

			setItems(prev => [...prev, ...newItems]);

			// 检查是否达到最大数据量
			if (currentLength + newItems.length >= maxCount) {
				setHasMore(false);
			}
		}, 1000);
	};

	return (
		<div className={`infinite-scroll-example ${theme}`} style={{ width: `${width}px` }}>
			<InfiniteScroll
				dataLength={items.length}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={
					<div className="scroll-loader">
						<div className="loading-spinner"></div>
						<span>加载中...</span>
					</div>
				}
				endMessage={
					<p className="scroll-end-message">
						<b>🎉 没有更多数据了</b>
					</p>
				}
				height={height}
			>
				<div className="items-container">
					{items.map(item => (
						<div key={item.id} className="item">
							<div className="item-content">
								<div className="item-icon">📄</div>
								<div className="item-text">
									<div className="item-title">{item.name}</div>
									<div className="item-description">{item.description}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default InfiniteScrollExample;
