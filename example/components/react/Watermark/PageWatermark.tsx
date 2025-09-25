import React, { useEffect } from 'react';

interface PageWatermarkProps {
	text1: string;
	text2: string;
}

const PageWatermark: React.FC<PageWatermarkProps> = ({ text1, text2 }) => {
	useEffect(() => {
		// 创建水印
		const createWatermark = () => {
			// 1. 创建 Canvas 元素
			const canvas = document.createElement('canvas');
			canvas.width = 150;
			canvas.height = 120;

			// 2. 获取 2D 绘图上下文
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// 3. 设置文字样式和位置
			ctx.rotate((-20 * Math.PI) / 180); // 逆时针旋转 20 度
			ctx.translate(-50, 20); // 调整文字位置
			ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // 设置文字颜色和透明度
			ctx.font = '16px Microsoft Yahei'; // 设置字体

			// 4. 绘制水印文字
			ctx.fillText(text1, canvas.width / 3, canvas.height / 2);
			ctx.fillText(text2, canvas.width / 3, canvas.height / 2 + 20);

			// 5. 创建水印容器
			const watermarkDiv = document.createElement('div');
			const styleStr = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				z-index: 99999;
				pointer-events: none;
				background-repeat: repeat;
				background-image: url('${canvas.toDataURL('image/png')}')
			`;

			watermarkDiv.setAttribute('style', styleStr);
			watermarkDiv.classList.add('page-watermark');
			document.body.appendChild(watermarkDiv);

			// 6. 防篡改监听机制
			const observer = new MutationObserver(() => {
				const wmInstance = document.body.querySelector('.page-watermark');

				// 检测水印是否被删除或修改
				if (!wmInstance || wmInstance.getAttribute('style') !== styleStr) {
					if (wmInstance) {
						// 样式被修改，重新设置
						wmInstance.setAttribute('style', styleStr);
					} else {
						// 元素被删除，重新添加
						document.body.appendChild(watermarkDiv);
					}
				}
			});

			// 7. 开始监听 DOM 变化
			observer.observe(document.body, {
				attributes: true,
				subtree: true,
				childList: true
			});

			return { watermarkDiv, observer };
		};

		// 创建水印
		const watermarkInfo = createWatermark();

		// 清理函数
		return () => {
			// 移除水印
			if (watermarkInfo?.watermarkDiv && document.body.contains(watermarkInfo.watermarkDiv)) {
				document.body.removeChild(watermarkInfo.watermarkDiv);
			}
			// 断开观察器
			watermarkInfo?.observer?.disconnect();
		};
	}, [text1, text2]);

	return null; // 此组件不渲染任何UI元素
};

export default PageWatermark;
