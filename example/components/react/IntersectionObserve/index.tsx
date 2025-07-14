import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
const IntersectionObserve: React.FC = () => {
	const statusIndicatorRef = useRef(null);
	const targetElementRef = useRef(null);
	const thresholdElementRef = useRef(null);
	const thresholdDemoRef = useRef(null);
	const thresholdValueRef = useRef(null);
	const moveUpBtnRef = useRef(null);
	const moveDownBtnRef = useRef(null);

	const [intersectionRatio, setIntersectionRatio] = useState(0);
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [thresholdValue, setThresholdValue] = useState(0);
	const [currentPosition, setCurrentPosition] = useState(400);

	// 在组件挂载后创建阈值标记
	useEffect(() => {
		const thresholdDemo = thresholdDemoRef.current;
		if (!thresholdDemo) return;

		for (let i = 0; i <= 10; i++) {
			const position = i * 10;
			const marker = document.createElement('div');
			marker.className = 'threshold-markers';
			marker.style.top = `${position}%`;

			const label = document.createElement('div');
			label.className = 'threshold-label';
			label.textContent = `${i * 10}%`;
			label.style.top = `${position}%`;

			thresholdDemo.appendChild(marker);
			thresholdDemo.appendChild(label);
		}
	}, []);

	// 基本观察器
	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				setIsIntersecting(entry.isIntersecting);
				setIntersectionRatio(Math.round(entry.intersectionRatio * 100));

				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				} else {
					entry.target.classList.remove('visible');
				}
			});
		});

		if (targetElementRef.current) {
			observer.observe(targetElementRef.current);
		}

		return () => {
			if (targetElementRef.current) {
				observer.unobserve(targetElementRef.current);
			}
		};
	}, []);

	// 阈值观察器
	useEffect(() => {
		const thresholdObserver = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					setThresholdValue(Math.round(entry.intersectionRatio * 100));
				});
			},
			{
				threshold: Array.from({ length: 11 }, (_, i) => i / 10)
			}
		);

		if (thresholdElementRef.current) {
			thresholdObserver.observe(thresholdElementRef.current);
		}

		return () => {
			if (thresholdElementRef.current) {
				thresholdObserver.unobserve(thresholdElementRef.current);
			}
		};
	}, []);

	// 控制元素位置
	const moveUp = () => {
		const newPosition = Math.max(0, currentPosition - 50);
		setCurrentPosition(newPosition);
		if (thresholdElementRef.current) {
			thresholdElementRef.current.style.top = `${newPosition}px`;
		}
	};

	const moveDown = () => {
		const newPosition = Math.min(400, currentPosition + 50);
		setCurrentPosition(newPosition);
		if (thresholdElementRef.current) {
			thresholdElementRef.current.style.top = `${newPosition}px`;
		}
	};

	return (
		<div className="intersection-observer-demo">
			<header>
				<h1>Intersection Observer API 演示</h1>
				<p>这个演示将帮助你理解 Intersection Observer API 的工作原理和应用场景</p>
			</header>

			<div className="status-indicator" ref={statusIndicatorRef}>
				{isIntersecting ? `元素可见 (${intersectionRatio}%)` : `元素不可见 (${intersectionRatio}%)`}
			</div>

			<div className="section">
				<h2>基本演示</h2>
				<div className="description">
					<p>
						向下滚动页面，观察目标元素的颜色变化。当元素进入视口时，它会变成绿色；离开时变回灰色。
					</p>
					<p>右上角的状态指示器会显示元素的可见状态和交叉比例。</p>
				</div>

				<div className="demo-container">
					<div className="target-element" ref={targetElementRef}>
						目标元素
					</div>
				</div>
			</div>

			<div className="section">
				<h2>阈值（Threshold）演示</h2>
				<div className="description">
					<p>阈值定义了目标元素与视口交叉的比例达到多少时触发回调。值范围从 0 到 1。</p>
					<p>在这个演示中，你可以通过按钮控制目标元素的位置，观察不同交叉比例下的回调触发情况。</p>
				</div>

				<div className="controls">
					<button ref={moveUpBtnRef} onClick={moveUp}>
						向上移动
					</button>
					<button ref={moveDownBtnRef} onClick={moveDown}>
						向下移动
					</button>
				</div>

				<div className="threshold-demo" ref={thresholdDemoRef}>
					<div className="threshold-element" ref={thresholdElementRef}>
						阈值元素
					</div>
				</div>

				<div className="threshold-value" ref={thresholdValueRef}>
					{thresholdValue}%
				</div>
			</div>
		</div>
	);
};

export default IntersectionObserve;
