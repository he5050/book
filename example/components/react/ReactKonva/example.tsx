import React from 'react';
import ReactKonvaDemo from './index';

const ReactKonvaExample: React.FC = () => {
	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<h1>react-konva 图形绘制与交互示例</h1>
			<p>
				本示例展示了 react-konva
				的各种功能，包括基础图形绘制、动画效果、事件处理等。所有组件都支持实时配置，您可以在页面上直接调整参数查看效果。
			</p>
			<div
				style={{
					backgroundColor: '#f8f9fa',
					padding: '20px',
					borderRadius: '8px',
					marginBottom: '20px',
					border: '1px solid #e9ecef'
				}}
			>
				<h2>功能说明</h2>
				<ul>
					<li>
						<strong>基础示例</strong>：展示可拖拽矩形，支持配色方案切换
					</li>
					<li>
						<strong>简单动画</strong>：实现缩放和旋转动画效果
					</li>
					<li>
						<strong>复杂动画</strong>：多元素协同动画演示
					</li>
					<li>
						<strong>图形变换</strong>：支持旋转、缩放和颜色调整
					</li>
					<li>
						<strong>事件处理</strong>：展示点击、悬停和拖拽事件
					</li>
					<li>
						<strong>可配置参数</strong>：通过 props 控制图形外观
					</li>
					<li>
						<strong>增强配置器</strong>：功能丰富的实时配置面板
					</li>
				</ul>
			</div>
			<ReactKonvaDemo />
		</div>
	);
};

export default ReactKonvaExample;
