import * as React from 'react';
import { useState } from 'react';
import LiquidButton from './index';
import './index.scss';

const LiquidAnimationExample: React.FC = () => {
	const [clickCount, setClickCount] = useState(0);

	const handleClick = () => {
		setClickCount(prev => prev + 1);
	};

	return (
		<div className="liquid-animation-demo">
			<h2>液态动画效果演示</h2>

			<div className="demo-section">
				<h3>基础液态按钮</h3>
				<LiquidButton onClick={handleClick}>点击次数: {clickCount}</LiquidButton>
			</div>

			<div className="demo-section">
				<h3>自定义样式按钮</h3>
				<LiquidButton className="custom-liquid-button" onClick={handleClick}>
					红色主题
				</LiquidButton>
			</div>

			<div className="demo-section">
				<h3>不同尺寸按钮</h3>
				<div className="button-group">
					<LiquidButton className="small-button">小按钮</LiquidButton>
					<LiquidButton className="large-button">大按钮</LiquidButton>
				</div>
			</div>

			<div className="demo-info">
				<h3>液态动画特点</h3>
				<ul>
					<li>通过CSS变量实现参数化控制</li>
					<li>利用关键帧动画模拟液体流动效果</li>
					<li>支持动态交互反馈</li>
					<li>可自定义颜色、尺寸等属性</li>
					<li>性能优化，使用硬件加速属性</li>
				</ul>

				<h3>参数配置说明</h3>
				<table>
					<thead>
						<tr>
							<th>参数</th>
							<th>类型</th>
							<th>默认值</th>
							<th>说明</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>children</td>
							<td>React.ReactNode</td>
							<td>'液态按钮'</td>
							<td>按钮显示文本</td>
						</tr>
						<tr>
							<td>className</td>
							<td>string</td>
							<td>''</td>
							<td>自定义CSS类名</td>
						</tr>
						<tr>
							<td>style</td>
							<td>React.CSSProperties</td>
							<td>{'{}'}</td>
							<td>自定义内联样式</td>
						</tr>
						<tr>
							<td>onClick</td>
							<td>{'() => void'}</td>
							<td>undefined</td>
							<td>点击事件回调</td>
						</tr>
					</tbody>
				</table>

				<h3>CSS 变量配置</h3>
				<table>
					<thead>
						<tr>
							<th>变量名</th>
							<th>默认值</th>
							<th>说明</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>--liquid-btn-bg</td>
							<td>#4a90e2</td>
							<td>按钮背景色</td>
						</tr>
						<tr>
							<td>--liquid-animation-duration</td>
							<td>2s</td>
							<td>动画持续时间</td>
						</tr>
						<tr>
							<td>--liquid-btn-radius</td>
							<td>8px</td>
							<td>按钮圆角大小</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default LiquidAnimationExample;
