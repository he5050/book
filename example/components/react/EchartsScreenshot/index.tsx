import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import { snapdom } from '@zumer/snapdom';
import './echarts-screenshot.scss';

const EchartsScreenshot: React.FC = () => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartDomRef = useRef<HTMLDivElement>(null);
	const chartInstanceRef = useRef<echarts.ECharts | null>(null);
	const html2canvasBtnRef = useRef<HTMLButtonElement>(null);
	const snapdomBtnRef = useRef<HTMLButtonElement>(null);

	// 初始化 echarts 图表
	useEffect(() => {
		if (chartDomRef.current) {
			// 销毁之前的实例（如果存在）
			if (chartInstanceRef.current) {
				chartInstanceRef.current.dispose();
			}

			// 初始化新的 echarts 实例
			chartInstanceRef.current = echarts.init(chartDomRef.current);

			// 图表配置（折线图+柱状图组合）
			const option = {
				tooltip: { trigger: 'axis' },
				legend: { data: ['新增用户', '活跃用户'], top: 0 },
				xAxis: {
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月']
				},
				yAxis: { type: 'value' },
				series: [
					{
						name: '新增用户',
						type: 'bar',
						data: [1200, 1900, 2300, 2100, 2500, 3100],
						itemStyle: { color: '#409eff' }
					},
					{
						name: '活跃用户',
						type: 'line',
						data: [800, 1500, 1800, 1600, 2000, 2600],
						lineStyle: { width: 3, color: '#67c23a' },
						symbol: 'circle',
						symbolSize: 8
					}
				]
			};

			chartInstanceRef.current.setOption(option);

			// 窗口 resize 时重绘图表
			const handleResize = () => {
				chartInstanceRef.current?.resize();
			};

			window.addEventListener('resize', handleResize);

			// 清理函数
			return () => {
				window.removeEventListener('resize', handleResize);
				if (chartInstanceRef.current) {
					chartInstanceRef.current.dispose();
				}
			};
		}
	}, []);

	// 更新按钮状态
	const updateButtonState = (
		btnRef: React.RefObject<HTMLButtonElement>,
		text: string,
		disabled: boolean
	) => {
		if (btnRef.current) {
			btnRef.current.textContent = text;
			btnRef.current.disabled = disabled;
		}
	};

	// html2canvas 截图实现
	const handleHtml2CanvasScreenshot = async () => {
		if (!chartContainerRef.current || !chartInstanceRef.current) return;

		try {
			// 更新按钮状态
			updateButtonState(html2canvasBtnRef, '截图中...', true);

			// 强制重绘图表
			chartInstanceRef.current.resize();

			// 配置 html2canvas 参数（针对 echarts 场景专项优化）
			const html2canvasOptions = {
				scale: 2, // 2倍缩放：解决高清屏截图模糊（echarts canvas 必配）
				useCORS: true, // 允许跨域图片加载（若图表含跨域背景图）
				logging: false, // 关闭控制台冗余日志
				backgroundColor: '#fff', // 截图背景色（与图表容器背景一致）
				ignoreElements: (el: Element) => {
					// 忽略 echarts 临时元素：tooltip 浮层、loading 状态等
					return (
						el.classList.contains('echarts-tooltip') || el.classList.contains('echarts-loading')
					);
				},
				windowWidth: document.documentElement.clientWidth, // 适配页面宽度
				windowHeight: document.documentElement.clientHeight
			};

			// 生成截图 canvas
			const canvas = await html2canvas(chartContainerRef.current, html2canvasOptions);

			// 转换 canvas 为 PNG 图片并触发下载
			const downloadLink = document.createElement('a');
			// 文件名格式：图表名称_日期.png（如"用户增长趋势_2024-08-24.png"）
			const fileName = `用户增长趋势_${new Date().toISOString().slice(0, 10)}.png`;
			downloadLink.download = fileName;
			// 转为图片URL：0.92为图片质量（0-1，平衡质量与体积）
			downloadLink.href = canvas.toDataURL('image/png', 0.92);

			// 触发点击下载
			downloadLink.click();

			// 释放 URL 资源（避免内存泄漏）
			URL.revokeObjectURL(downloadLink.href);

			// 恢复按钮状态
			updateButtonState(html2canvasBtnRef, '📷 html2canvas 截图下载', false);
		} catch (error) {
			console.error('html2canvas 截图失败：', error);
			alert('截图失败，请重试！');

			// 恢复按钮状态
			updateButtonState(html2canvasBtnRef, '📷 html2canvas 截图下载', false);
		}
	};

	// snapdom 截图实现
	const handleSnapdomScreenshot = async () => {
		if (!chartContainerRef.current || !chartInstanceRef.current) return;

		try {
			// 更新按钮状态
			updateButtonState(snapdomBtnRef, '截图中...', true);

			// 强制重绘图表
			chartInstanceRef.current.resize();

			// 配置 snapdom 参数（极简设计，针对 echarts 适配）
			const snapdomOptions = {
				scale: 2, // 高清缩放（与 echarts 适配）
				allowCORS: true, // 跨域图片支持
				transparent: false, // 关闭透明（避免图表背景变透明）
				// 核心适配：处理 echarts canvas（SVG 不兼容直接嵌入 canvas）
				processNode: (node: HTMLElement) => {
					// 若节点是 echarts 的 canvas，转为 img 标签（SVG 兼容关键步骤）
					if (node.tagName === 'CANVAS' && node.parentElement?.id === 'user-chart') {
						// 创建临时 canvas 复制原图表内容
						const tempCanvas = document.createElement('canvas');
						tempCanvas.width = (node as HTMLCanvasElement).width;
						tempCanvas.height = (node as HTMLCanvasElement).height;
						const ctx = tempCanvas.getContext('2d');
						if (ctx) {
							ctx.drawImage(node as HTMLCanvasElement, 0, 0);
						}

						// 创建 img 标签替换原 canvas
						const chartImg = document.createElement('img');
						chartImg.src = tempCanvas.toDataURL('image/png');
						chartImg.style.width = '100%';
						chartImg.style.height = '100%';
						chartImg.style.objectFit = 'contain';

						return chartImg;
					}

					// 过滤 echarts tooltip 元素
					if (node.classList.contains('echarts-tooltip')) {
						return document.createComment('忽略 echarts tooltip');
					}

					return node;
				}
			};

			// 生成图片 URL（snapdom 直接返回可下载的 URL）
			const imageUrl = await snapdom(chartContainerRef.current, snapdomOptions);

			// 触发图片下载
			const downloadLink = document.createElement('a');
			const fileName = `用户增长趋势_${new Date().toISOString().slice(0, 10)}.png`;
			downloadLink.download = fileName;
			downloadLink.href = imageUrl;

			downloadLink.click();

			// 释放资源
			URL.revokeObjectURL(imageUrl);

			// 恢复按钮状态
			updateButtonState(snapdomBtnRef, '📸 snapdom 截图下载', false);
		} catch (error) {
			console.error('snapdom 截图失败：', error);
			alert('截图失败，请重试！');

			// 恢复按钮状态
			updateButtonState(snapdomBtnRef, '📸 snapdom 截图下载', false);
		}
	};

	return (
		<div className="echarts-screenshot-container">
			<h2>echarts 图表截图方案对比示例</h2>

			{/* 图表容器 */}
			<div ref={chartContainerRef} id="chart-container" className="echarts-chart-wrapper">
				<h3 className="echarts-chart-title">2024年月度用户增长趋势</h3>
				{/* echarts 画布 */}
				<div ref={chartDomRef} id="user-chart" className="echarts-chart-container"></div>
			</div>

			{/* 操作按钮 */}
			<div className="echarts-screenshot-buttons">
				<button
					ref={html2canvasBtnRef}
					onClick={handleHtml2CanvasScreenshot}
					className="echarts-screenshot-btn html2canvas"
				>
					📷 html2canvas 截图下载
				</button>

				<button
					ref={snapdomBtnRef}
					onClick={handleSnapdomScreenshot}
					className="echarts-screenshot-btn snapdom"
				>
					📸 snapdom 截图下载
				</button>
			</div>

			{/* 使用说明 */}
			<div className="echarts-instructions">
				<h3>使用说明：</h3>
				<ol>
					<li>确保已在项目中安装 echarts、html2canvas 和 snapdom 依赖</li>
					<li>点击对应按钮即可下载图表截图</li>
					<li>html2canvas 兼容性更好（支持 IE11+），snapdom 性能更优</li>
				</ol>

				<h3>关键避坑点：</h3>
				<ul>
					<li>
						<strong>html2canvas</strong>：需要处理 tooltip 截图残留问题，设置 scale: 2
						解决高清屏模糊
					</li>
					<li>
						<strong>snapdom</strong>：需要将 echarts 的 canvas 转换为 img 标签，注意样式继承问题
					</li>
				</ul>
			</div>
		</div>
	);
};

export default EchartsScreenshot;
