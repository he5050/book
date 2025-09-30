import * as React from 'react';
import './index.scss';

interface LiquidButtonProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

const LiquidButton: React.FC<LiquidButtonProps> = ({
	children = '液态按钮',
	className = '',
	style = {},
	onClick
}) => {
	// 处理按钮点击事件，创建水波纹效果
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const button = e.currentTarget;
		const ripple = document.createElement('span');
		const rect = button.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		const x = e.clientX - rect.left - size / 2;
		const y = e.clientY - rect.top - size / 2;

		ripple.style.width = ripple.style.height = `${size}px`;
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;
		ripple.classList.add('liquid-button__ripple');

		button.appendChild(ripple);

		// 动画结束后移除水波纹元素
		setTimeout(() => {
			ripple.remove();
		}, 800);

		// 调用传入的onClick回调
		if (onClick) {
			onClick();
		}
	};

	return (
		<button className={`liquid-button ${className}`} style={style} onClick={handleClick}>
			<span className="liquid-button__text">{children}</span>
			<span className="liquid-button__wave"></span>
		</button>
	);
};

export default LiquidButton;
