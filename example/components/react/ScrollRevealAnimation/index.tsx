import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface ScrollRevealAnimationProps {
	elementCount?: number;
	columns?: number;
	elementSize?: number;
	gap?: number;
	animationDuration?: number;
	threshold?: number;
	rootMargin?: string;
	enableRandomColors?: boolean;
	animationDelay?: number;
	borderRadius?: number;
	backgroundColor?: string;
	resetOnExit?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

interface ElementData {
	id: number;
	color: string;
	isVisible: boolean;
	animationDirection: 'left' | 'right' | 'bottom' | 'top';
}

const ScrollRevealAnimation: React.FC<ScrollRevealAnimationProps> = ({
	elementCount = 60,
	columns = 3,
	elementSize = 200,
	gap = 30,
	animationDuration = 0.5,
	threshold = 0.1,
	rootMargin = '0px',
	enableRandomColors = true,
	animationDelay = 0,
	borderRadius = 10,
	backgroundColor = '#111',
	resetOnExit = true,
	className = '',
	style = {}
}) => {
	const [elements, setElements] = useState<ElementData[]>([]);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// 生成随机颜色
	const generateRandomColor = useCallback(() => {
		const chars = '0123456789abcdef';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += chars[Math.floor(Math.random() * chars.length)];
		}
		return color;
	}, []);

	// 获取动画方向
	const getAnimationDirection = useCallback(
		(index: number): 'left' | 'right' | 'bottom' | 'top' => {
			const position = index % columns;
			if (position === 0) return 'left';
			if (position === 1) return 'bottom';
			if (position === 2) return 'right';
			return 'top';
		},
		[columns]
	);

	// 初始化元素
	useEffect(() => {
		const newElements: ElementData[] = Array.from({ length: elementCount }, (_, index) => ({
			id: index,
			color: enableRandomColors ? generateRandomColor() : '#ffffff',
			isVisible: false,
			animationDirection: getAnimationDirection(index)
		}));
		setElements(newElements);
	}, [elementCount, enableRandomColors, generateRandomColor, getAnimationDirection]);

	// 创建Intersection Observer
	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		observerRef.current = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const elementId = parseInt(entry.target.getAttribute('data-id') || '0');

					setElements(prev =>
						prev.map(el => (el.id === elementId ? { ...el, isVisible: entry.isIntersecting } : el))
					);
				});
			},
			{
				threshold,
				rootMargin
			}
		);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [threshold, rootMargin]);

	// 观察元素
	useEffect(() => {
		if (!observerRef.current || !containerRef.current) return;

		const elementNodes = containerRef.current.querySelectorAll('.scroll-element');
		elementNodes.forEach(node => {
			observerRef.current?.observe(node);
		});

		return () => {
			elementNodes.forEach(node => {
				observerRef.current?.unobserve(node);
			});
		};
	}, [elements]);

	// 重新生成颜色
	const regenerateColors = () => {
		setElements(prev =>
			prev.map(el => ({
				...el,
				color: enableRandomColors ? generateRandomColor() : '#ffffff'
			}))
		);
	};

	// 容器样式
	const containerStyle: React.CSSProperties = {
		backgroundColor,
		...style
	};

	// 网格样式
	const gridStyle: React.CSSProperties = {
		gridTemplateColumns: `repeat(${columns}, 1fr)`,
		gap: `${gap}px`,
		width: `${columns * elementSize + (columns - 1) * gap}px`
	};

	// 元素样式
	const getElementStyle = (element: ElementData): React.CSSProperties => {
		return {
			width: `${elementSize}px`,
			height: `${elementSize}px`,
			backgroundColor: element.color,
			borderRadius: `${borderRadius}px`,
			transitionDuration: `${animationDuration}s`,
			transitionDelay: `${animationDelay}s`
		};
	};

	return (
		<div className={`scroll-reveal-animation-container ${className}`} style={containerStyle}>
			{/* 标题区域 */}
			<section className="title-section">
				<h2>Scroll To Reveal</h2>
			</section>

			{/* 元素网格 */}
			<div ref={containerRef} className="elements-grid" style={gridStyle}>
				{elements.map(element => (
					<div
						key={element.id}
						data-id={element.id}
						className={`scroll-element ${element.animationDirection} ${
							element.isVisible ? 'active' : ''
						}`}
						style={getElementStyle(element)}
					/>
				))}
			</div>

			{/* 控制面板 */}
			<div className="control-panel">
				<button onClick={regenerateColors} className="control-button">
					重新生成颜色
				</button>

				<div className="stats">
					<span>元素总数: {elementCount}</span>
					<span>可见元素: {elements.filter(el => el.isVisible).length}</span>
				</div>
			</div>
		</div>
	);
};

export default ScrollRevealAnimation;
