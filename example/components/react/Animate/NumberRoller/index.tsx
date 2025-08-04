import React, { useEffect, useRef, useState, RefObject } from 'react';
import './index.scss';

interface NumberRollerProps {}

const NumberRoller: React.FC<NumberRollerProps> = () => {
	// 配置参数
	const CONFIG = {
		DURATION: 2000, // 动画持续时间（毫秒）
		ROLL_COUNT: 2, // 额外滚动圈数
		DELAY_BETWEEN_DIGITS: 40, // 数字间延迟（毫秒）
		DIGIT_HEIGHT: 60, // 单个数字高度（像素）
		TARGET_NUMBER: 7140909 // 目标数字
	};

	const [digits, setDigits] = useState<string[]>([]);
	const digitListRefs = useRef<(HTMLDivElement | null)[]>([]);

	// 初始化数字列表
	useEffect(() => {
		const numStr = CONFIG.TARGET_NUMBER.toString();
		setDigits(numStr.split(''));
	}, []);

	// 组件挂载后启动动画
	useEffect(() => {
		if (digits.length === 0) return;

		// 确保DOM已渲染
		const timer = setTimeout(() => {
			digits.forEach((_, index) => {
				const listRef = digitListRefs.current[index];
				if (!listRef) return;

				// 计算每个数字的延迟
				const delay = (digits.length - index - 1) * CONFIG.DELAY_BETWEEN_DIGITS;

				// 设置过渡效果
				listRef.style.transition = `transform ${CONFIG.DURATION - delay}ms ease-in-out`;

				// 延迟启动动画
				setTimeout(() => {
					const targetDigit = parseInt(digits[index], 10);
					const extraRolls = CONFIG.ROLL_COUNT * 10;
					const targetY = -(extraRolls + targetDigit) * CONFIG.DIGIT_HEIGHT;
					listRef.style.transform = `translateY(${targetY}px)`;
				}, delay);
			});
		}, 100);

		return () => clearTimeout(timer);
	}, [
		digits,
		CONFIG.DELAY_BETWEEN_DIGITS,
		CONFIG.DURATION,
		CONFIG.ROLL_COUNT,
		CONFIG.DIGIT_HEIGHT
	]);

	// 生成数字列表（0-9循环ROLL_COUNT+1次）
	const renderDigitList = (index: number) => {
		const digitItems: React.ReactNode[] = [];
		// 生成足够的数字以支持滚动效果
		for (let i = 0; i <= CONFIG.ROLL_COUNT; i++) {
			for (let j = 0; j < 10; j++) {
				digitItems.push(
					<div key={`${i}-${j}`} className="digit">
						{j}
					</div>
				);
			}
		}

		// 使用回调引用设置ref
		const setRef = (el: HTMLDivElement | null) => {
			digitListRefs.current[index] = el;
		};

		return (
			<div ref={setRef} className="digit-list">
				{digitItems}
			</div>
		);
	};

	return (
		<div className="counter-container">
			<div className="prefix">今日已解决</div>
			<div id="counter">
				{digits.map((_, index) => (
					<div key={index} className="digit-container">
						{renderDigitList(index)}
					</div>
				))}
			</div>
			<div className="suffix">个问题</div>
		</div>
	);
};

export default NumberRoller;
