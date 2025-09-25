import React from 'react';
import EchartsWatermark from './EchartsWatermark';

const WatermarkEchartsExample: React.FC = () => {
	return (
		<div className="watermark-echarts-example">
			<h2>ECharts 图表水印演示</h2>
			<p>这是一个在 ECharts 图表中集成水印的示例，水印作为图表背景显示。</p>

			<div className="chart-container">
				<EchartsWatermark />
			</div>

			<div className="explanation">
				<h3>实现原理</h3>
				<p>
					ECharts 图表水印通过创建一个 Canvas 元素并在其中绘制水印图案， 然后将这个 Canvas 作为
					ECharts 图表的背景图案来实现。
				</p>

				<h3>核心代码</h3>
				<pre>
					{`// 创建水印 Canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// 配置 Canvas
canvas.width = canvas.height = 100;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.globalAlpha = 0.08;
ctx.font = '20px Microsoft Yahei';
ctx.translate(50, 50);
ctx.rotate(-Math.PI / 4);
ctx.fillText('ECHARTS', 0, 0);

// ECharts 配置
backgroundColor: {
  type: 'pattern',
  image: canvas,
  repeat: 'repeat'
}`}
				</pre>

				<h3>优势</h3>
				<ul>
					<li>水印与图表完美融合，不影响交互</li>
					<li>导出图表时水印自动包含在内</li>
					<li>视觉效果自然，专业感强</li>
				</ul>
			</div>
		</div>
	);
};

export default WatermarkEchartsExample;
