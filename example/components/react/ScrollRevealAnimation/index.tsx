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

	// 获取动画方向 - 按照原始效果的规律 (匹配CSS的:nth-child选择器)
	const getAnimationDirection = useCallback(
		(index: number): 'left' | 'right' | 'bottom' | 'top' => {
			// 匹配CSS中的:nth-child(3n+1), :nth-child(3n+2), :nth-child(3n+3)
			const position = (index + 1) % 3;
			if (position === 1) return 'left';   // 3n+1 从左侧进入
			if (position === 2) return 'bottom'; // 3n+2 从底部进入  
			if (position === 0) return 'right';  // 3n+3 从右侧进入
			return 'left';
		},
		[]
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

	// 使用容器滚动触发逻辑
		useEffect(() => {
			const container = containerRef.current?.closest('.scroll-reveal-animation-container') as HTMLElement;
			if (!container) return;

			const handleScroll = () => {
					if (!containerRef.current) return;

					const elementNodes = containerRef.current.querySelectorAll('.scroll-element');
					elementNodes.forEach((node, index) => {
						const element = node as HTMLElement;
						// 计算元素相对于容器内容的位置
						const elementTop = element.offsetTop - container.offsetTop;
						const scrollY = container.scrollTop;

						setElements(prev =>
							prev.map(el => (el.id === index ? { ...el, isVisible: elementTop < scrollY } : el))
						);
					});
				};

			container.addEventListener('scroll', handleScroll);
			// 初始检查
			handleScroll();

			return () => {
				container.removeEventListener('scroll', handleScroll);
			};
		}, [elements.length]);

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

	// 网格样式 - 匹配原版700px容器的3列布局
	const gridStyle: React.CSSProperties = {
		gridTemplateColumns: '1fr 1fr 1fr', // 固定3列布局
		gap: `${gap}px`,
		width: '700px', // 匹配原版设计
		maxWidth: '100%'
	};

	// 元素样式 - 匹配原版200px固定尺寸
	const getElementStyle = (element: ElementData): React.CSSProperties => {
		return {
			width: '200px', // 匹配原版固定尺寸
			height: '200px',
			backgroundColor: element.color,
			borderRadius: `${borderRadius}px`,
			transition: `${animationDuration}s`,
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
