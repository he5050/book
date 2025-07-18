import React, { useEffect, useRef } from 'react';
import './index.scss';

 const ClockWarp = () => {
	const clockRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		init();

		// 添加resize事件监听
		window.addEventListener('resize', init);

		// 清理函数
		return () => {
			window.removeEventListener('resize', init);
			
			// 取消动画帧，防止内存泄漏
			if (animationFrameId.current !== null) {
				cancelAnimationFrame(animationFrameId.current);
				animationFrameId.current = null;
			}
		};
	}, []);

	// 使用useRef来存储动画帧ID，以便在组件卸载时取消动画
	const animationFrameId = useRef<number | null>(null);
	
	const init = () => {
		const clock = clockRef.current;

		if (clock) {
			// 清除之前的动态元素，避免重复创建
			const dynamic = clock.querySelector('.dynamic');
			if (dynamic) {
				dynamic.innerHTML = '';
			}
			
			// 如果存在之前的动画，取消它
			if (animationFrameId.current !== null) {
				cancelAnimationFrame(animationFrameId.current);
				animationFrameId.current = null;
			}
			
			utilityClock(clock);
		}
	};
	function utilityClock(container: HTMLDivElement) {
		// 使用可选链和类型断言，确保在元素不存在时不会导致错误
		let dynamic = container.querySelector('.dynamic') as HTMLDivElement | null;
		let hourElement = container.querySelector('.hour') as HTMLDivElement | null;
		let minuteElement = container.querySelector('.minute') as HTMLDivElement | null;
		let secondElement = container.querySelector('.second') as HTMLDivElement | null;
		
		// 如果任何必要的元素不存在，则提前返回
		if (!dynamic || !hourElement || !minuteElement || !secondElement) {
			console.error('Clock elements not found');
			return;
		}
		
		let minute = function(n: number): void {
			// 不应该有return语句，因为返回类型是void
			n % 5 == 0 ? minuteText(n) : minuteLine(n);
		};
		
		let minuteText = function(n: number): void {
			let element = document.createElement('div');
			element.className = 'minute-text';
			element.innerHTML = (n < 10 ? '0' : '') + n;
			position(element, n / 60, 135);
			dynamic.appendChild(element);
		};
		
		let minuteLine = function(n: number): void {
			let anchors = document.createElement('div');
			anchors.className = 'anchors';
			let element = document.createElement('div');
			element.className = 'element minute-line';
			rotate(anchors, n);
			anchors.appendChild(element);
			dynamic.appendChild(anchors);
		};
		
		let hour = function(n: number): void {
			let element = document.createElement('div');
			element.className = 'hour-text hour-' + n;
			element.innerHTML = n.toString();
			position(element, n / 12, 105);
			dynamic.appendChild(element);
		};
		
		let position = function(element: HTMLElement, phase: number, r: number): void {
			let theta = phase * 2 * Math.PI;
			element.style.top = (-r * Math.cos(theta)).toFixed(1) + 'px';
			element.style.left = (r * Math.sin(theta)).toFixed(1) + 'px';
		};
		
		let rotate = function(element: HTMLElement, second: number): void {
			element.style.transform = element.style.webkitTransform = 'rotate(' + second * 6 + 'deg)';
		};
		let animate = function () {
			// 检查元素是否存在，防止在元素不存在时尝试操作它们
			if (!secondElement || !minuteElement || !hourElement) {
				return;
			}
			
			let now = new Date();
			let time =
				now.getHours() * 3600 +
				now.getMinutes() * 60 +
				now.getSeconds() * 1 +
				now.getMilliseconds() / 1000;
			
			rotate(secondElement, time);
			rotate(minuteElement, time / 60);
			rotate(hourElement, time / 60 / 12);
			
			// 存储动画帧ID，以便在组件卸载时取消
			animationFrameId.current = requestAnimationFrame(animate);
		};
		// 在创建分钟和小时标记之前再次检查dynamic元素是否存在
		// 虽然我们在函数开头已经检查过，但为了代码的一致性和安全性，这里再次检查
		if (dynamic) {
			for (let i = 1; i <= 60; i++) minute(i);
			for (let i = 1; i <= 12; i++) hour(i);
		}
		
		animate();
	}
	return (
		<div className="clock-warp">
			<div className="fill">
				<div className="reference"></div>
				<div className="clock" id="utility-clock" ref={clockRef}>
					<div className="centre">
						<div className="dynamic"></div>
						<div className="expand round circle-1"></div>
						<div className="anchors hour">
							<div className="element thin-hand"></div>
							<div className="element fat-hand"></div>
						</div>
						<div className="anchors minute">
							<div className="element thin-hand"></div>
							<div className="element fat-hand minute-hand"></div>
						</div>
						<div className="anchors second">
							<div className="element second-hand"></div>
						</div>
						<div className="expand round circle-2"></div>
						<div className="expand round circle-3"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ClockWarp;