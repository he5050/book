import * as React from 'react';
const { useState, useRef } = React;
import './index.scss';

interface RippleEffectProps {
	width?: number;
	height?: number;
	color?: string;
	duration?: number;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

interface Ripple {
	id: number;
	x: number;
	y: number;
	size: number;
}

const RippleEffect: React.FC<RippleEffectProps> = ({
	width = 500,
	height = 100,
	color = 'rgba(0, 0, 0, 0.1)',
	duration = 600,
	children,
	className = '',
	style = {},
	onClick
}) => {
	const [ripples, setRipples] = useState<Ripple[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const rippleId = useRef(0);

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// 计算波纹大小，确保能覆盖整个容器
			const size = Math.max(rect.width, rect.height) * 2;

			const newRipple = {
				id: rippleId.current++,
				x,
				y,
				size
			};

			setRipples((prev: Ripple[]) => [...prev, newRipple]);

			// 动画结束后移除波纹
			setTimeout(() => {
				setRipples((prev: Ripple[]) => prev.filter((ripple: Ripple) => ripple.id !== newRipple.id));
			}, duration);
		}

		// 调用传入的点击处理函数
		if (onClick) {
			onClick(e);
		}
	};

	return (
		<div
			ref={containerRef}
			className={`ripple-effect ${className}`}
			style={{
				width,
				height,
				position: 'relative',
				overflow: 'hidden',
				cursor: 'pointer',
				...style
			}}
			onClick={handleClick}
		>
			{children}
			{ripples.map((ripple: Ripple) => (
				<span
					key={ripple.id}
					className="ripple"
					style={{
						left: ripple.x,
						top: ripple.y,
						width: ripple.size,
						height: ripple.size,
						backgroundColor: color
					}}
				/>
			))}
		</div>
	);
};

export default RippleEffect;
