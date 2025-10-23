import React, { useState, useEffect } from 'react';
import './index.scss';

interface VwJsSolutionProps {
	designWidth?: number;
	maxWidth?: number;
	minWidth?: number;
	className?: string;
}

const VwJsSolution: React.FC<VwJsSolutionProps> = ({
	designWidth = 750,
	maxWidth = 750,
	minWidth = 320,
	className = ''
}) => {
	const [fontSize, setFontSize] = useState<string>('');
	const [isModernBrowser, setIsModernBrowser] = useState<boolean>(true);

	useEffect(() => {
		// 检测浏览器是否支持vw单位
		const checkVwSupport = () => {
			return window.CSS && CSS.supports && CSS.supports('width', '1vw');
		};

		const calculateFontSize = () => {
			const clientWidth = document.documentElement.clientWidth || window.innerWidth;

			if (!clientWidth) return;

			const isSupported = checkVwSupport();
			setIsModernBrowser(isSupported);

			if (isSupported) {
				// 现代浏览器使用vw单位
				const vwValue = (100 / designWidth) * 100;

				if (clientWidth < minWidth) {
					const minFontSize = (minWidth / designWidth) * 100;
					setFontSize(`${minFontSize}px`);
				} else if (clientWidth > maxWidth) {
					setFontSize(`${100}px`);
				} else {
					setFontSize(`${vwValue}vw`);
				}
			} else {
				// 老旧浏览器使用JS计算
				if (clientWidth < minWidth) {
					const minFontSize = (minWidth / designWidth) * 100;
					setFontSize(`${minFontSize}px`);
				} else if (clientWidth > maxWidth) {
					setFontSize(`${100}px`);
				} else {
					const calculatedFontSize = (clientWidth / designWidth) * 100;
					setFontSize(`${calculatedFontSize}px`);
				}
			}
		};

		calculateFontSize();

		// 老旧浏览器需要监听resize事件
		if (!checkVwSupport()) {
			const handleResize = () => {
				calculateFontSize();
			};

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}
	}, [designWidth, maxWidth, minWidth]);

	return (
		<div className={`mobile-adaptation-vw-js ${className}`}>
			<div className="demo-container">
				<h2 className="demo-title">VW+JS兼容方案演示</h2>
				<div className="browser-info">
					<span className={`status-indicator ${isModernBrowser ? 'modern' : 'legacy'}`}>
						{isModernBrowser ? '现代浏览器' : '老旧浏览器'}
					</span>
				</div>
				<div className="demo-content">
					<div className="card card-1">
						<h3>适配方案</h3>
						<p>使用vw单位进行适配</p>
					</div>
					<div className="card card-2">
						<h3>兼容处理</h3>
						<p>JS降级方案</p>
					</div>
					<div className="card card-3">
						<h3>响应式</h3>
						<p>自适应布局</p>
					</div>
				</div>
				<div className="config-info">
					<p>设计稿宽度: {designWidth}px</p>
					<p>当前根字体大小: {fontSize}</p>
					<p>浏览器类型: {isModernBrowser ? '支持vw单位' : '不支持vw单位，使用JS计算'}</p>
				</div>
			</div>
		</div>
	);
};

export default VwJsSolution;
