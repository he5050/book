import React, { useState, useEffect } from 'react';
import './index.scss';

interface RemSolutionProps {
	designWidth?: number;
	rem2px?: number;
	className?: string;
}

const RemSolution: React.FC<RemSolutionProps> = ({
	designWidth = 750,
	rem2px = 100,
	className = ''
}) => {
	const [defaultFontSize, setDefaultFontSize] = useState<number>(16);
	const [rootFontSize, setRootFontSize] = useState<string>('');

	// 获取浏览器默认字体大小
	const adapt = (designWidth: number, rem2px: number): number => {
		const d = window.document.createElement('p');
		d.style.width = '1rem';
		d.style.display = 'none';
		const head = window.document.getElementsByTagName('head')[0];
		head.appendChild(d);
		const defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
		head.removeChild(d); // 清理创建的元素
		return defaultFontSize;
	};

	useEffect(() => {
		// 获取默认字体大小
		const fontSize = adapt(designWidth, rem2px);
		setDefaultFontSize(fontSize);

		const recalc = () => {
			const clientWidth =
				window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			if (!clientWidth) return;

			if (clientWidth < designWidth) {
				// 核心计算公式
				const fontSizePercent = (((clientWidth / designWidth) * rem2px) / fontSize) * 100;
				setRootFontSize(`${fontSizePercent}%`);
				document.documentElement.style.fontSize = `${fontSizePercent}%`;
			} else {
				// 屏幕宽度≥designWidth时，固定根字体大小为625%
				setRootFontSize('625%');
				document.documentElement.style.fontSize = '625%';
			}
		};

		recalc();

		const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
		window.addEventListener(resizeEvt, recalc, false);
		document.addEventListener('DOMContentLoaded', recalc, false);

		return () => {
			window.removeEventListener(resizeEvt, recalc, false);
			document.removeEventListener('DOMContentLoaded', recalc, false);
		};
	}, [designWidth, rem2px]);

	return (
		<div className={`mobile-adaptation-rem ${className}`}>
			<div className="demo-container">
				<h2 className="demo-title">REM适配方案演示</h2>
				<div className="demo-content">
					<div className="block block-1">
						<div className="inner">Block 1</div>
					</div>
					<div className="block block-2">
						<div className="inner">Block 2</div>
					</div>
					<div className="block block-3">
						<div className="inner">Block 3</div>
					</div>
				</div>
				<div className="config-info">
					<p>设计稿宽度: {designWidth}px</p>
					<p>1rem对应像素: {rem2px}px</p>
					<p>默认字体大小: {defaultFontSize}px</p>
					<p>当前根字体大小: {rootFontSize}</p>
				</div>
			</div>
		</div>
	);
};

export default RemSolution;
