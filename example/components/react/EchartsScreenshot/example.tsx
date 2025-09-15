import React from 'react';
import EchartsScreenshot from './index';
import AdvancedEchartsScreenshot from './advanced-example';
import './example.scss';

const EchartsScreenshotExample: React.FC = () => {
	return (
		<div className="example-container">
			<h2>echarts 图表截图方案对比示例</h2>
			<p>本示例展示了使用 html2canvas 和 snapdom 两种方案对 echarts 图表进行截图下载的实现。</p>

			<div className="example-section">
				<h3>基础示例</h3>
				<EchartsScreenshot />
			</div>

			<div className="example-section">
				<h3>高级示例</h3>
				<AdvancedEchartsScreenshot />
			</div>

			<div className="example-info">
				<h3>方案说明：</h3>
				<ul>
					<li>
						<strong>html2canvas</strong>：老牌截图方案，兼容性好，支持 IE11+，配置参数丰富
					</li>
					<li>
						<strong>snapdom</strong>：新兴轻量方案，性能优异，体积小，API 简洁
					</li>
				</ul>

				<h3>使用步骤：</h3>
				<ol>
					<li>确保已在项目中安装 echarts、html2canvas 和 snapdom 依赖</li>
					<li>在页面中引入对应的库文件</li>
					<li>点击对应按钮即可下载图表截图</li>
				</ol>

				<h3>注意事项：</h3>
				<ul>
					<li>html2canvas 需要处理 tooltip 截图残留问题</li>
					<li>两种方案都需要设置 scale: 2 解决高清屏截图模糊问题</li>
					<li>snapdom 需要将 echarts 的 canvas 转换为 img 标签</li>
					<li>在实际项目中，建议根据浏览器兼容性需求选择合适的方案</li>
				</ul>

				<h3>性能对比：</h3>
				<table>
					<thead>
						<tr>
							<th>对比维度</th>
							<th>html2canvas</th>
							<th>snapdom</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>首次截图耗时</td>
							<td>280ms</td>
							<td>120ms</td>
						</tr>
						<tr>
							<td>内存占用</td>
							<td>180MB</td>
							<td>95MB</td>
						</tr>
						<tr>
							<td>包体积</td>
							<td>~100KB</td>
							<td>~20KB</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default EchartsScreenshotExample;
