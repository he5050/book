import React from 'react';
import BasicCanvas from './BasicCanvas';
import HiDPICanvas from './HiDPICanvas';
import ResponsiveCanvas from './ResponsiveCanvas';
import './index.scss';

/**
 * Canvas 示例组件 - 展示不同的 Canvas 画布实现方式
 *
 * 包含三个子组件：
 * 1. 基础 Canvas - 展示画布尺寸概念
 * 2. 高清屏适配 Canvas - 展示 devicePixelRatio 适配
 * 3. 响应式 Canvas - 展示窗口调整适配
 */
const CanvasDemo: React.FC = () => {
	return (
		<div className="canvas-demo-container">
			<h2>Canvas 画布示例</h2>

			<div className="canvas-section">
				<h3>1. 基础 Canvas（画布尺寸概念）</h3>
				<p>展示画布尺寸（Canvas Dimensions）和画板尺寸（Display Size）的区别</p>
				<div className="canvas-examples">
					<BasicCanvas />
				</div>
			</div>

			<div className="canvas-section">
				<h3>2. 高清屏适配（devicePixelRatio）</h3>
				<p>展示如何使用 devicePixelRatio 进行高清屏适配</p>
				<div className="canvas-examples">
					<HiDPICanvas />
				</div>
			</div>

			<div className="canvas-section">
				<h3>3. 响应式 Canvas</h3>
				<p>展示如何创建响应窗口大小变化的 Canvas</p>
				<div className="canvas-examples">
					<ResponsiveCanvas />
				</div>
			</div>
		</div>
	);
};

export default CanvasDemo;
