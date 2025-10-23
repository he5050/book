import React, { useState, useEffect } from 'react';
import './index.scss';

interface VwSolutionProps {
	designWidth?: number;
	maxWidth?: number;
	minWidth?: number;
	className?: string;
}

const VwSolution: React.FC<VwSolutionProps> = ({
	designWidth = 750,
	maxWidth = 750,
	minWidth = 320,
	className = ''
}) => {
	const [fontSize, setFontSize] = useState<string>('');

	useEffect(() => {
		const calculateFontSize = () => {
			const clientWidth = document.documentElement.clientWidth || window.innerWidth;

			if (!clientWidth) return;

			// 计算vw值: (100 / designWidth) * 100
			const vwValue = (100 / designWidth) * 100;

			if (clientWidth < minWidth) {
				// 小屏设备使用最小字体大小
				const minFontSize = (minWidth / designWidth) * 100;
				setFontSize(`${minFontSize}px`);
			} else if (clientWidth > maxWidth) {
				// 大屏设备固定字体大小
				setFontSize(`${100}px`);
			} else {
				// 正常情况使用vw单位
				setFontSize(`${vwValue}vw`);
			}
		};

		calculateFontSize();

		const handleResize = () => {
			calculateFontSize();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [designWidth, maxWidth, minWidth]);

	return (
		<div className={`mobile-adaptation-vw ${className}`}>
			<div className="demo-container">
				<h2 className="demo-title">VW适配方案演示</h2>
				<div className="demo-content">
					<div className="box box-1">Box 1</div>
					<div className="box box-2">Box 2</div>
					<div className="box box-3">Box 3</div>
				</div>
				<div className="config-info">
					<p>设计稿宽度: {designWidth}px</p>
					<p>当前根字体大小: {fontSize}</p>
				</div>
			</div>
		</div>
	);
};

export default VwSolution;
