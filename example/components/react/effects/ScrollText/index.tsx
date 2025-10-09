import React, { useState, useEffect, useRef } from 'react';
import './scroll-text.scss';

interface ScrollTextProps {
	children: React.ReactNode;
	speed?: number; // 滚动速度，单位秒
	pauseOnHover?: boolean; // 鼠标悬停时是否暂停
	className?: string;
}

const ScrollText: React.FC<ScrollTextProps> = ({
	children,
	speed = 10,
	pauseOnHover = true,
	className = ''
}) => {
	const [needToScroll, setNeedToScroll] = useState(false);
	const outerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

	// 检查文本是否超出容器
	const isOverflow = () => {
		if (!outerRef.current || !innerRef.current) return false;

		const outerWidth = outerRef.current.getBoundingClientRect().width;
		const innerWidth = innerRef.current.getBoundingClientRect().width;
		return innerWidth > outerWidth;
	};

	// 检查是否需要滚动
	const check = () => {
		const overflow = isOverflow();
		setNeedToScroll(overflow);
	};

	// 启动定时器检查
	const startCheck = () => {
		if (checkTimerRef.current) {
			clearInterval(checkTimerRef.current);
		}
		checkTimerRef.current = setInterval(check, 100);
		check(); // 立即执行一次
	};

	// 停止定时器
	const stopCheck = () => {
		if (checkTimerRef.current) {
			clearInterval(checkTimerRef.current);
			checkTimerRef.current = null;
		}
	};

	// 鼠标进入事件
	const handleMouseEnter = () => {
		if (pauseOnHover && needToScroll && outerRef.current) {
			const inner = outerRef.current.querySelector('.st-inner') as HTMLElement;
			if (inner) {
				inner.style.animationPlayState = 'paused';
			}
		}
	};

	// 鼠标离开事件
	const handleMouseLeave = () => {
		if (pauseOnHover && needToScroll && outerRef.current) {
			const inner = outerRef.current.querySelector('.st-inner') as HTMLElement;
			if (inner) {
				inner.style.animationPlayState = 'running';
			}
		}
	};

	useEffect(() => {
		startCheck();

		return () => {
			stopCheck();
		};
	}, [children, speed, pauseOnHover]);

	return (
		<div
			className={`scroll-text-container ${className}`}
			ref={outerRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div
				className={`st-inner ${needToScroll ? 'st-scrolling' : ''}`}
				style={{
					animationDuration: `${speed}s`,
					animationPlayState: needToScroll ? 'running' : 'paused'
				}}
			>
				<span className="st-section" ref={innerRef}>
					{children}
				</span>
				{needToScroll && (
					<span className="st-section" style={{ userSelect: 'none' }}>
						{children}
					</span>
				)}
			</div>
		</div>
	);
};

export default ScrollText;
