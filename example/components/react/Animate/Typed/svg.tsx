import React, { useEffect, useRef, useState } from 'react';
import './svg.scss';
// 导入样式

// 打字机效果的输入文本列表
const INPUT_TEXTS = ['TESt1', 'TESt2', 'TESt3', 'TESt4'];

/**
 * SVG打字机效果组件
 * 实现基于SVG的打字机动画效果，模拟AI搜索框的交互体验
 * 使用CSS clip-path实现打字效果，避免DOM重排导致的抖动
 */
const TypedDemo: React.FC = () => {
	// 当前显示的完整文本
	const [currentText, setCurrentText] = useState<string>(INPUT_TEXTS[0]);
	// 当前可见字符数量（用于控制clip-path）
	const [visibleChars, setVisibleChars] = useState<number>(0);
	// 当前光标位置
	const [cursorPosition, setCursorPosition] = useState<number>(135);
	// 引用，用于控制动画的中断
	const typeRef = useRef<boolean>(false);
	// 文本容器引用
	const textRef = useRef<SVGTextElement>(null);
	// 当前文本索引
	const textIndexRef = useRef<number>(0);
	// 是否正在擦除
	const isErasingRef = useRef<boolean>(false);

	// 更新光标位置
	useEffect(() => {
		if (!textRef.current) {
			return;
		}

		// 使用 getSubStringLength 方法精确计算可见文本的宽度
		// 这种方法对于等宽和非等宽字体都能准确工作，从而解决光标对齐问题
		const visibleWidth = textRef.current.getSubStringLength(0, visibleChars);

		// 更新光标位置
		setCursorPosition(135 + visibleWidth);
	}, [visibleChars, currentText]);

	// 打字机效果
	useEffect(() => {
		typeRef.current = false;
		let timeoutId: number;
		const typingSpeed = 80;

		const animationTick = () => {
			if (typeRef.current) return;

			if (isErasingRef.current) {
				// 擦除逻辑
				setVisibleChars(prev => {
					if (prev > 0) {
						timeoutId = window.setTimeout(animationTick, typingSpeed / 2);
						return prev - 1;
					} else {
						// 擦除完毕, 切换文本
						isErasingRef.current = false;
						const nextIndex = (textIndexRef.current + 1) % INPUT_TEXTS.length;
						textIndexRef.current = nextIndex;
						setCurrentText(INPUT_TEXTS[nextIndex]); // 这会触发 effect 重新运行
						return 0;
					}
				});
			} else {
				// 打字逻辑
				setVisibleChars(prev => {
					if (prev < currentText.length) {
						timeoutId = window.setTimeout(animationTick, typingSpeed);
						return prev + 1;
					} else {
						// 打字完毕, 等待后开始擦除
						isErasingRef.current = true;
						timeoutId = window.setTimeout(animationTick, 2000);
						return prev;
					}
				});
			}
		};

		// 开始动画
		// 为新文本设置初始延迟
		timeoutId = window.setTimeout(animationTick, 1000);

		// 清理函数
		return () => {
			typeRef.current = true;
			clearTimeout(timeoutId);
		};
	}, [currentText]); // 仅在 currentText 改变时重新运行 effect

	// 固定颜色
	const textFill = '#000';
	const rectFill = '#EBF6FF';
	const iconFill = '#828282';
	const cursorFill = '#5E85FF';

	return (
		<div className="typed-container">
			<div className="svg-container">
				<svg width="100%" height="200px" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
					{/* 搜索框背景 */}
					<rect
						x="30"
						y="70"
						width="640"
						height="60"
						rx="30"
						stroke="#5E85FF"
						strokeWidth="2"
						fill={rectFill}
					/>

					{/* 搜索图标 */}
					<circle cx="70" cy="100" r="15" fill="none" stroke={iconFill} strokeWidth="2" />
					<line x1="80" y1="110" x2="90" y2="120" stroke={iconFill} strokeWidth="2" />

					{/* 打字机效果 */}
					<g>
						<style>
							{`
                .typing-text { 
                  font: 18px sans-serif; 
                  fill: ${textFill}; 
                }
                .cursor { 
                  fill: ${cursorFill}; 
                }
              `}
						</style>
						{/* 完整文本（用于计算宽度） */}
						<text x="135" y="108" className="typing-text" ref={textRef} opacity="0">
							<tspan>{currentText}</tspan>
						</text>

						{/* 可见文本（使用clipPath实现打字效果） */}
						<defs>
							<clipPath id="text-clip">
								<rect x="135" y="78" width={cursorPosition - 135 + 5} height="60" />
							</clipPath>
						</defs>

						<text x="135" y="108" className="typing-text" clipPath="url(#text-clip)">
							<tspan>{currentText}</tspan>
						</text>

						{/* 光标 */}
						<rect x={cursorPosition} y="93" width="2" height="16" className="cursor">
							<animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
						</rect>
					</g>
				</svg>
			</div>

			<div className="description">
				<h3>SVG 打字机效果</h3>
				<p>这个示例展示了如何使用 SVG 和 JavaScript 创建打字机效果。</p>
				<p>核心原理：</p>
				<ul>
					<li>使用 SVG 的 text 元素显示文本</li>
					<li>使用 rect 元素创建闪烁的光标</li>
					<li>通过 JavaScript 控制文本内容和光标位置</li>
					<li>使用 getComputedTextLength() 计算文本宽度</li>
				</ul>
			</div>
		</div>
	);
};

export default TypedDemo;
