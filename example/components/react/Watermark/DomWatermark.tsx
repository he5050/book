import React, { useEffect, useRef } from 'react';

interface DomWatermarkProps {
	text: string;
	children: React.ReactNode;
}

const DomWatermark: React.FC<DomWatermarkProps> = ({ text, children }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<MutationObserver | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;

		// 创建水印
		const createWatermark = () => {
			// 1. 创建 Canvas 元素
			const canvas = document.createElement('canvas');
			canvas.width = 150;
			canvas.height = 100;

			// 2. 获取 2D 绘图上下文
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// 3. 设置文字样式和位置
			ctx.rotate((-20 * Math.PI) / 180); // 逆时针旋转 20 度
			ctx.translate(-30, 20); // 调整文字位置
			ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // 设置文字颜色和透明度
			ctx.font = '14px Microsoft Yahei'; // 设置字体

			// 4. 绘制水印文字
			ctx.fillText(text, canvas.width / 3, canvas.height / 2);

			// 5. 应用水印到容器
			container.style.position = 'relative';
			container.style.backgroundImage = `url('${canvas.toDataURL('image/png')}')`;
			container.style.backgroundRepeat = 'repeat';

			// 6. 创建防篡改监听器
			observerRef.current = new MutationObserver(() => {
				// 检查背景是否被修改
				if (container.style.backgroundImage !== `url('${canvas.toDataURL('image/png')}')`) {
					container.style.backgroundImage = `url('${canvas.toDataURL('image/png')}')`;
				}
			});

			// 7. 开始监听元素变化
			observerRef.current.observe(container, {
				attributes: true,
				attributeFilter: ['style']
			});
		};

		// 创建水印
		createWatermark();

		// 清理函数
		return () => {
			// 断开观察器
			if (observerRef.current) {
				observerRef.current.disconnect();
				observerRef.current = null;
			}
		};
	}, [text]);

	return (
		<div ref={containerRef} style={{ padding: '20px' }}>
			{children}
		</div>
	);
};

export default DomWatermark;
