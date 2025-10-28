import React from 'react';
import BasicExample from './BasicExample';
import AnimatedRect from './AnimatedRect';
import ComplexAnimation from './ComplexAnimation';
import RotatableRect from './RotatableRect';
import MouseEvents from './MouseEvents';
import ConfigurableDemo from './ConfigurableDemo';
import EnhancedConfigurator from './EnhancedConfigurator';
import './index.scss';

const ReactKonvaDemo: React.FC = () => {
	return (
		<div className="react-konva-demo">
			<h2>react-konva 图形绘制与交互示例</h2>

			<div className="demo-section">
				<h3>1. 基础示例 - 可拖拽矩形</h3>
				<p>展示 react-konva 的基本用法，包括 Stage、Layer 和图形元素的创建，以及拖拽功能的实现。</p>
				<BasicExample />
			</div>

			<div className="demo-section">
				<h3>2. 简单动画 - 呼吸效果</h3>
				<p>通过状态更新实现矩形的缩放动画效果。</p>
				<AnimatedRect />
			</div>

			<div className="demo-section">
				<h3>3. 复杂动画</h3>
				<p>展示更复杂的动画效果实现。</p>
				<ComplexAnimation />
			</div>

			<div className="demo-section">
				<h3>4. 图形变换 - 旋转控制</h3>
				<p>通过滑块控制矩形的旋转角度。</p>
				<RotatableRect />
			</div>

			<div className="demo-section">
				<h3>5. 事件处理</h3>
				<p>展示鼠标事件的处理，包括点击、悬停和拖拽。</p>
				<MouseEvents />
			</div>

			<div className="demo-section">
				<h3>6. 可配置参数示例</h3>
				<p>展示如何通过参数配置控制图形的外观和行为。</p>
				<ConfigurableDemo
					width={600}
					height={300}
					rectCount={8}
					fillColor="#ff6b6b"
					strokeColor="#333"
					strokeWidth={2}
					draggable={true}
				/>
			</div>

			<div className="demo-section">
				<h3>7. 增强配置器</h3>
				<p>功能丰富的配置器，支持实时调整画布和图形属性。</p>
				<EnhancedConfigurator />
			</div>
		</div>
	);
};

export default ReactKonvaDemo;
