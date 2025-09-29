import React from 'react';
import FlightEventFlowchart from './FlightEventFlowchart';

const FlightEventFlowchartExample: React.FC = () => {
	return (
		<div className="flight-event-flowchart-example" style={{ padding: '20px' }}>
			<h1 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>
				Canvas事件流程图演示
			</h1>

			<div style={{ marginBottom: '30px' }}>
				<FlightEventFlowchart containerWidth={500} />
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#f8f9fa',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
					textAlign: 'left',
					maxWidth: '800px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>Canvas事件流程图特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>使用HTML5 Canvas绘制高颜值事件流程图</li>
					<li style={{ margin: '10px 0' }}>展示从起飞到降落的完整飞行事件时间线</li>
					<li style={{ margin: '10px 0' }}>支持播放、暂停、重置动画控制功能</li>
					<li style={{ margin: '10px 0' }}>响应式设计，适配不同容器宽度</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					该组件通过Canvas实现了一个事件流程图，展示飞行过程中的关键事件。用户可以通过控制按钮来播放、暂停和重置动画效果。
				</p>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>参数配置</h3>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>
						<strong>containerWidth</strong>: 容器宽度，默认为500px
					</li>
				</ul>
			</div>
		</div>
	);
};

export default FlightEventFlowchartExample;
