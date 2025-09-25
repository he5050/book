import React, { useState } from 'react';
import EchartsWatermark from './EchartsWatermark';
import PageWatermark from './PageWatermark';
import DomWatermark from './DomWatermark';

const WatermarkDemo: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'echarts' | 'page' | 'dom'>('echarts');
	const [echartsWatermarkEnabled, setEchartsWatermarkEnabled] = useState(false); // ECharts水印开关
	const [pageWatermarkEnabled, setPageWatermarkEnabled] = useState(false); // 页面水印开关
	const [domWatermarkEnabled, setDomWatermarkEnabled] = useState(false); // DOM节点水印开关

	// 切换ECharts水印开关
	const toggleEchartsWatermark = () => {
		setEchartsWatermarkEnabled(!echartsWatermarkEnabled);
	};

	// 切换页面水印开关
	const togglePageWatermark = () => {
		setPageWatermarkEnabled(!pageWatermarkEnabled);
	};

	// 切换DOM节点水印开关
	const toggleDomWatermark = () => {
		setDomWatermarkEnabled(!domWatermarkEnabled);
	};

	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
			<h1 style={{ textAlign: 'center', color: '#333' }}>水印组件演示</h1>

			{/* 页面水印 - 根据开关状态决定是否渲染 */}
			{pageWatermarkEnabled && <PageWatermark text1="页面水印" text2="防篡改保护" enabled={true} />}

			{/* 控制面板 */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: '20px',
					backgroundColor: '#fff',
					padding: '10px',
					borderRadius: '8px'
				}}
			>
				{/* 标签页切换 */}
				<div style={{ display: 'flex' }}>
					<button
						onClick={() => setActiveTab('echarts')}
						style={{
							padding: '10px 20px',
							margin: '0 5px',
							backgroundColor: activeTab === 'echarts' ? '#409EFF' : '#eee',
							color: activeTab === 'echarts' ? '#fff' : '#333',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer'
						}}
					>
						ECharts 图表水印
					</button>
					<button
						onClick={() => setActiveTab('page')}
						style={{
							padding: '10px 20px',
							margin: '0 5px',
							backgroundColor: activeTab === 'page' ? '#409EFF' : '#eee',
							color: activeTab === 'page' ? '#fff' : '#333',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer'
						}}
					>
						页面水印
					</button>
					<button
						onClick={() => setActiveTab('dom')}
						style={{
							padding: '10px 20px',
							margin: '0 5px',
							backgroundColor: activeTab === 'dom' ? '#409EFF' : '#eee',
							color: activeTab === 'dom' ? '#fff' : '#333',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer'
						}}
					>
						DOM 节点水印
					</button>
				</div>
			</div>

			{/* 内容区域 */}
			<div
				style={{
					backgroundColor: '#fff',
					padding: '20px',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
				}}
			>
				{activeTab === 'echarts' && (
					<div>
						<div style={{ marginBottom: '10px' }}>
							<button
								onClick={toggleEchartsWatermark}
								style={{
									padding: '5px 10px',
									backgroundColor: echartsWatermarkEnabled ? '#409EFF' : '#eee',
									color: echartsWatermarkEnabled ? '#fff' : '#333',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							>
								{echartsWatermarkEnabled ? '关闭 ECharts 水印' : '开启 ECharts 水印'}
							</button>
							<span style={{ marginLeft: '10px' }}>
								当前状态: {echartsWatermarkEnabled ? '已启用' : '已禁用'}
							</span>
						</div>
						<EchartsWatermark enabled={echartsWatermarkEnabled} />
					</div>
				)}

				{activeTab === 'page' && (
					<div>
						<div style={{ marginBottom: '10px' }}>
							<button
								onClick={togglePageWatermark}
								style={{
									padding: '5px 10px',
									backgroundColor: pageWatermarkEnabled ? '#409EFF' : '#eee',
									color: pageWatermarkEnabled ? '#fff' : '#333',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							>
								{pageWatermarkEnabled ? '关闭页面水印' : '开启页面水印'}
							</button>
							<span style={{ marginLeft: '10px' }}>
								当前状态: {pageWatermarkEnabled ? '已启用' : '已禁用'}
							</span>
						</div>
						<h2>页面水印示例</h2>
						<p>页面水印已应用到整个页面，查看页面背景可以看到水印效果。</p>
						<p>即使通过开发者工具尝试删除水印元素，也会被自动恢复。</p>
					</div>
				)}

				{activeTab === 'dom' && (
					<div>
						<div style={{ marginBottom: '10px' }}>
							<button
								onClick={toggleDomWatermark}
								style={{
									padding: '5px 10px',
									backgroundColor: domWatermarkEnabled ? '#409EFF' : '#eee',
									color: domWatermarkEnabled ? '#fff' : '#333',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							>
								{domWatermarkEnabled ? '关闭 DOM 节点水印' : '开启 DOM 节点水印'}
							</button>
							<span style={{ marginLeft: '10px' }}>
								当前状态: {domWatermarkEnabled ? '已启用' : '已禁用'}
							</span>
						</div>
						<DomWatermark text="DOM节点水印" enabled={domWatermarkEnabled}>
							<h2>DOM 节点水印示例</h2>
							<p>这个区域应用了DOM节点水印，水印只在这个区域内显示。</p>
							<p>水印会自动适应容器大小，并具有防篡改功能。</p>
						</DomWatermark>
					</div>
				)}
			</div>
		</div>
	);
};

export default WatermarkDemo;
