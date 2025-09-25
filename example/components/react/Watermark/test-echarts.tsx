import React from 'react';
import EchartsWatermark from './EchartsWatermark';

const TestEchartsWatermark: React.FC = () => {
	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
			<h1 style={{ textAlign: 'center', color: '#333' }}>ECharts 水印组件测试</h1>
			<div
				style={{
					backgroundColor: '#fff',
					padding: '20px',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
				}}
			>
				<EchartsWatermark />
			</div>
		</div>
	);
};

export default TestEchartsWatermark;
