import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EchartsWatermark: React.FC = () => {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstanceRef = useRef<echarts.ECharts | null>(null);

	useEffect(() => {
		if (!chartRef.current) return;

		// 创建水印 Canvas
		const createWatermarkCanvas = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (!ctx) return canvas;

			// 设置 Canvas 尺寸，决定水印图案的大小和重复密度
			canvas.width = canvas.height = 100;

			// 配置文字样式
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.globalAlpha = 0.08; // 设置水印透明度，使其不影响图表内容的阅读
			ctx.font = '20px Microsoft Yahei, sans-serif';

			// 设置文字位置和角度
			ctx.translate(50, 50); // 将 Canvas 原点移动到中心，方便旋转和绘制
			ctx.rotate(-Math.PI / 4); // 逆时针旋转 45 度，使水印倾斜

			// 绘制水印文字
			ctx.fillText('ECHARTS', 0, 0); // 在 Canvas 中心绘制水印文字

			return canvas;
		};

		// 初始化图表
		const initChart = () => {
			if (chartRef.current) {
				// 销毁之前的实例（如果存在）
				if (chartInstanceRef.current) {
					chartInstanceRef.current.dispose();
				}

				// 创建水印 Canvas
				const watermarkCanvas = createWatermarkCanvas();

				// 初始化新的 echarts 实例
				chartInstanceRef.current = echarts.init(chartRef.current);

				// 图表数据，这里只是一个示例数据
				const builderJson = {
					all: 10887,
					charts: {
						map: 3237,
						lines: 2164,
						bar: 7561,
						pie: 6354,
						scatter: 4212,
						radar: 3123,
						tree: 1234,
						treemap: 2134,
						sunburst: 1243,
						boxplot: 2341
					}
				};

				// ECharts 配置
				const option: echarts.EChartsOption = {
					// 使用水印作为背景！这是关键！
					backgroundColor: {
						type: 'pattern', // 背景类型为图案
						image: watermarkCanvas, // 使用我们绘制的 Canvas 作为图案来源
						repeat: 'repeat' // 图案重复平铺
					},

					// 图表配置，这里只是一个简单的柱状图示例
					tooltip: {},
					title: [
						{
							text: '在线构建',
							subtext: '总计 ' + builderJson.all,
							left: '25%',
							textAlign: 'center'
						},
						{
							text: '各图表类型',
							subtext: '总计 ' + Object.keys(builderJson.charts).length,
							left: '75%',
							textAlign: 'center'
						}
					],

					// 系列数据
					series: [
						{
							type: 'bar',
							data: Object.keys(builderJson.charts).map(key => ({
								name: key,
								value: builderJson.charts[key as keyof typeof builderJson.charts]
							})),
							itemStyle: {
								color: '#409EFF'
							}
						}
					],

					xAxis: {
						type: 'category',
						data: Object.keys(builderJson.charts)
					},

					yAxis: {
						type: 'value'
					}
				};

				// 设置配置项
				chartInstanceRef.current.setOption(option);

				// 响应式处理，确保图表在窗口大小变化时能正确重绘
				const handleResize = () => {
					chartInstanceRef.current?.resize();
				};

				window.addEventListener('resize', handleResize);

				// 清理函数
				return () => {
					window.removeEventListener('resize', handleResize);
				};
			}
		};

		// 初始化图表
		initChart();

		// 组件卸载时清理
		return () => {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.dispose();
				chartInstanceRef.current = null;
			}
		};
	}, []);

	return (
		<div className="echarts-watermark-demo" style={{ padding: '20px' }}>
			<h2 style={{ marginBottom: '20px', color: '#333' }}>ECharts 图表水印示例</h2>
			<div ref={chartRef} style={{ width: '100%', height: '400px' }} />

			<div className="instructions" style={{ marginTop: '20px' }}>
				<h3 style={{ color: '#333', margin: '15px 0 10px' }}>使用说明：</h3>
				<ol style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '8px 0' }}>水印已集成到图表背景中，不影响图表交互</li>
					<li style={{ margin: '8px 0' }}>导出图表图片时，水印会自动包含在内</li>
					<li style={{ margin: '8px 0' }}>水印透明度较低，不会影响图表内容阅读</li>
				</ol>

				<h3 style={{ color: '#333', margin: '15px 0 10px' }}>核心特性：</h3>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '8px 0' }}>✅ 专门针对图表优化</li>
					<li style={{ margin: '8px 0' }}>✅ 导出图片自带水印</li>
					<li style={{ margin: '8px 0' }}>✅ 不影响图表交互</li>
					<li style={{ margin: '8px 0' }}>✅ 视觉效果自然</li>
				</ul>
			</div>
		</div>
	);
};

export default EchartsWatermark;
