import React from 'react';
import './index.scss';

interface FloatingDotProps {
	index: number;
}

const FloatingDot: React.FC<FloatingDotProps> = ({ index }) => {
	return <div className="floating-dot-item" style={{ '--i': index } as React.CSSProperties} />;
};

const FloatingDotsAnimation: React.FC = () => {
	// 创建21个点
	const dots = Array.from({ length: 21 }, (_, index) => <FloatingDot key={index} index={index} />);

	return (
		<div className="floating-dots-container">
			<div className="floating-dots-wrapper">
				<div className="floating-dots-container-inner">{dots}</div>
			</div>
		</div>
	);
};

export default FloatingDotsAnimation;
