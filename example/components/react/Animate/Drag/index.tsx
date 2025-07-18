import { CSSProperties, DragEvent, useEffect, useRef, useState } from 'react';
import './index.scss';

interface Item {
	id: number;
	color: string;
	imgSrc: string;
}

interface Position {
	top: number;
	left: number;
}

interface ItemsRef {
	[key: string]: HTMLDivElement | null;
}

interface DragState {
	_positions?: Record<string, Position>;
	lastSwappedId?: number;
	throttleTimeout?: number;
}

/**
 * 拖拽排序组件
 * 实现基于HTML5拖拽API的列表项拖拽排序功能
 * 支持拖拽动画效果和视觉反馈
 */
const DragDemo = () => {
	/** 列表项数据 */
	const [items, setItems] = useState<Item[]>([
		{ id: 1, color: '#b01a01', imgSrc: 'https://picsum.photos/id/237/200' },
		{ id: 2, color: '#70d265', imgSrc: 'https://picsum.photos/seed/picsum/200' },
		{ id: 3, color: '#f0e941', imgSrc: 'https://picsum.photos/200' },
		{ id: 4, color: '#da8218', imgSrc: 'https://picsum.photos/200?grayscale' },
		{ id: 5, color: '#f1e867', imgSrc: 'https://picsum.photos/200?blur=2' }
	]);

	/** 当前被拖拽的项 */
	const [draggedItem, setDraggedItem] = useState<Item | null>(null);
	/** 列表容器引用 */
	const listRef = useRef<HTMLDivElement>(null);
	/** 列表项引用集合 */
	const itemsRef = useRef<ItemsRef>({});
	/** 拖拽状态 */
	const dragStateRef = useRef<DragState>({});

	// 组件卸载时清理定时器
	useEffect(() => {
		return () => {
			if (dragStateRef.current.throttleTimeout) {
				clearTimeout(dragStateRef.current.throttleTimeout);
				dragStateRef.current.throttleTimeout = undefined;
			}
		};
	}, []);

	/**
	 * 记录元素位置
	 * @param elements - 需要记录位置的元素数组
	 * @returns 包含元素位置信息的对象
	 */
	const recordPosition = (elements: (HTMLDivElement | null)[]): Record<string, Position> => {
		const positions: Record<string, Position> = {};
		elements.forEach(element => {
			if (element && element.dataset.id) {
				const { top, left } = element.getBoundingClientRect();
				positions[element.dataset.id] = { top, left };
			}
		});
		return positions;
	};

	/**
	 * 处理拖拽开始事件
	 * @param e - 拖拽事件对象
	 * @param item - 被拖拽的列表项数据
	 */
	const handleDragStart = (e: DragEvent<HTMLDivElement>, item: Item) => {
		// 清除之前的状态
		if (dragStateRef.current.throttleTimeout) {
			clearTimeout(dragStateRef.current.throttleTimeout);
			dragStateRef.current.throttleTimeout = undefined;
		}
		dragStateRef.current.lastSwappedId = undefined;

		// 记录起始位置
		const positions = recordPosition(Object.values(itemsRef.current));
		dragStateRef.current._positions = positions;

		// 设置被拖拽元素
		setDraggedItem(item);

		// 添加moving样式（延迟添加以确保拖拽图像已经生成）
		setTimeout(() => {
			const target = e.target as HTMLDivElement;
			target.classList.add('moving');
		}, 0);

		// 设置拖拽效果
		e.dataTransfer.effectAllowed = 'move';
	};

	/**
	 * 处理拖拽结束事件
	 * @param e - 拖拽事件对象
	 */
	const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		target.classList.remove('moving');
		setDraggedItem(null);

		// 清理拖拽状态
		if (dragStateRef.current.throttleTimeout) {
			clearTimeout(dragStateRef.current.throttleTimeout);
			dragStateRef.current.throttleTimeout = undefined;
		}
		dragStateRef.current.lastSwappedId = undefined;
	};

	/**
	 * 处理拖拽经过事件
	 * @param e - 拖拽事件对象
	 * @param targetItem - 目标列表项数据
	 */
	const handleDragOver = (e: DragEvent<HTMLDivElement>, targetItem: Item) => {
		e.preventDefault();

		// 如果没有拖拽项或者拖拽项就是目标项，不做任何处理
		if (!draggedItem || draggedItem.id === targetItem.id) {
			return;
		}

		// 如果已经处理过这个目标项，不重复处理
		if (dragStateRef.current.lastSwappedId === targetItem.id) {
			return;
		}

		// 如果节流定时器存在，不处理
		if (dragStateRef.current.throttleTimeout) {
			return;
		}

		// 设置节流，防止频繁触发
		dragStateRef.current.throttleTimeout = window.setTimeout(() => {
			dragStateRef.current.throttleTimeout = undefined;
		}, 200);

		// 记录当前处理的目标项ID
		dragStateRef.current.lastSwappedId = targetItem.id;

		// 重新排序列表
		const newItems = [...items];
		const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
		const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

		// 移除拖拽项
		const [removed] = newItems.splice(draggedIndex, 1);
		// 插入到目标位置
		newItems.splice(targetIndex, 0, removed);

		setItems(newItems);

		// 执行动画
		requestAnimationFrame(() => {
			const currentPositions = recordPosition(Object.values(itemsRef.current));
			const previousPositions = dragStateRef.current._positions;

			// 为每个元素应用动画
			if (previousPositions) {
				Object.entries(currentPositions).forEach(([id, { top, left }]) => {
					const element = itemsRef.current[id];
					if (element && previousPositions[id]) {
						const prevPos = previousPositions[id];
						const deltaX = prevPos.left - left;
						const deltaY = prevPos.top - top;

						if (deltaX !== 0 || deltaY !== 0) {
							// 应用初始位置
							element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
							element.style.transition = 'none';

							// 强制重排
							element.offsetHeight;

							// 应用动画回到正常位置
							element.style.transition = 'transform 0.3s ease-out';
							element.style.transform = 'none';

							// 动画结束后清理
							const onTransitionEnd = () => {
								element.style.transition = 'none';
								element.removeEventListener('transitionend', onTransitionEnd);
							};
							element.addEventListener('transitionend', onTransitionEnd);
						}
					}
				});
			}

			// 更新位置记录
			dragStateRef.current._positions = currentPositions;
		});
	};

	/**
	 * 处理拖拽进入事件
	 * @param e - 拖拽事件对象
	 */
	const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	return (
		<div className="drag-container">
			<div className="list" ref={listRef}>
				{items.map(item => (
					<div
						key={item.id}
						data-id={item.id}
						ref={el => {
							itemsRef.current[item.id] = el;
						}}
						className="list-item"
						draggable="true"
						style={{ '--color': item.color } as CSSProperties}
						onDragStart={e => handleDragStart(e, item)}
						onDragEnd={handleDragEnd}
						onDragOver={e => handleDragOver(e, item)}
						onDragEnter={handleDragEnter}
					>
						<img src={item.imgSrc} alt="" />
						<span>{item.id}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default DragDemo;
