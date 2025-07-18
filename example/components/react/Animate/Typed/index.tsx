import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import './index.scss';

const TypedDemo: React.FC = () => {
	const typedRef = React.useRef<HTMLSpanElement>(null);
	const manualTypedRef = React.useRef<HTMLDivElement>(null);

	// 1. 手动实现的打字效果
	useEffect(() => {
		const textDiv = manualTypedRef.current;
		if (!textDiv) {
			return;
		}

		const text = ['这里是一个打字效果'] as string[];
		let lineIndex = 0;
		let charIndex = 0;

		let timeoutId: number;
		const typeSpeed = 150; // 打字速度（毫秒）

		const typeText = () => {
			if (lineIndex < text.length) {
				if (charIndex < text[lineIndex].length) {
					textDiv.textContent += text[lineIndex][charIndex++];
					timeoutId = window.setTimeout(typeText, typeSpeed);
				} else {
					// 一行结束，准备换行（如果还有下一行）
					lineIndex++;
					charIndex = 0;
					if (lineIndex < text.length) {
						textDiv.textContent += '\n';
						timeoutId = window.setTimeout(typeText, typeSpeed);
					}
				}
			}
		};

		// 启动打字效果
		timeoutId = window.setTimeout(typeText, typeSpeed);

		// 返回清理函数
		return () => {
			window.clearTimeout(timeoutId);
		};
	}, []);

	// 2. 使用 typed.js 库的打字效果
	useEffect(() => {
		if (!typedRef.current) return;
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
			<div className="typed-content" ref={manualTypedRef} style={{ whiteSpace: 'pre-wrap' }}></div>
			<div className=" lh-6  mb-3 text-4">2.typed.js</div>
			<span className="text-4" ref={typedRef}></span>
		</div>
	);
};

export default TypedDemo;
