import React from 'react';
import ReactKonvaDemo from './index';

const ReactKonvaExample: React.FC = () => {
	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<h1>react-konva 图形绘制与交互示例</h1>
			<p>本示例展示了 react-konva 的各种功能，包括基础图形绘制、动画效果、事件处理等。</p>
			<ReactKonvaDemo />
		</div>
	);
};

export default ReactKonvaExample;
