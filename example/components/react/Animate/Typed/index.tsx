import React, { useEffect } from 'react';
import Typed from 'typed.js';
import './index.scss';
const TypedDemo: React.FC = () => {
	const typedRef = React.useRef<HTMLDivElement>(null);
	useEffect(() => {
		typedFun();
	}, []);
	const typedFun = () => {
		const text = ['这里是一个打字效果'] as string[];
		let lineIndex = 0;
		let charIndex = 0;
		const textDiv = document.getElementById('typed-demo-1');
		if (!textDiv) {
			console.error('Text container element not found');
			return;
		}

		let currentTimeout: number | null = null;
		const typeSpeed = 150; // 打字速度（毫秒）

		function typeText() {
			// 使用局部变量确保类型安全
			const localTextDiv = textDiv;
			if (lineIndex < text.length && localTextDiv) {
				if (charIndex < text[lineIndex].length) {
					localTextDiv.textContent += text[lineIndex][charIndex++];
					currentTimeout = window.setTimeout(typeText, typeSpeed);
				} else {
					if (lineIndex === text.length - 1) {
						return;
					}
					currentTimeout = window.setTimeout(() => {
						localTextDiv.textContent += '\n';
						lineIndex++;
						charIndex = 0;
						currentTimeout = window.setTimeout(typeText, typeSpeed);
					}, typeSpeed / 2);
				}
			}
		}

		// 启动打字效果
		currentTimeout = window.setTimeout(typeText, typeSpeed);

		// 返回清理函数
		return () => {
			if (currentTimeout !== null) {
				window.clearTimeout(currentTimeout);
			}
		};
	};
	useEffect(() => {
		const typed = new Typed(typedRef.current, {
			strings: ['<i>First</i> sentence.', '&amp; a second sentence.'],
			typeSpeed: 50,
			backSpeed: 50,
			loop: true,
			showCursor: false,
			cursorChar: '|',
			contentType: 'html'
		});

		return () => {
			typed.destroy();
		};
	}, []);
	return (
		<div className="h-full overflow-hidden typed-box">
			<div className=" lh-6  mb-3 text-4">1.打字效果</div>
			<div className="typed-content" id="typed-demo-1"></div>
			<div className=" lh-6  mb-3 text-4">2.typed.js</div>
			<span id="typed-demo-2" className="text-4" ref={typedRef}></span>
		</div>
	);
};

export default TypedDemo;
