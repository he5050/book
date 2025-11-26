import React, { useState, useRef } from 'react';
import VoiceAlert from './index';

const VoiceAlertDemo: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'demo' | 'simulation'>('demo');
	const [sensorData, setSensorData] = useState([
		{ id: 1, name: '温度传感器', value: 25, threshold: 30, status: '正常' },
		{ id: 2, name: '湿度传感器', value: 60, threshold: 80, status: '正常' },
		{ id: 3, name: '压力传感器', value: 100, threshold: 120, status: '正常' }
	]);

	// 创建ref来访问VoiceAlert组件的方法
	const voiceAlertRef = useRef<any>(null);

	// 模拟传感器数据更新
	const simulateSensorUpdate = () => {
		setSensorData(prev =>
			prev.map(sensor => {
				// 模拟数据波动
				const change = (Math.random() - 0.5) * 10;
				const newValue = Math.max(0, sensor.value + change);

				// 更新状态
				let status = '正常';
				if (newValue > sensor.threshold) {
					status = '超限';
					// 触发错误报警
					if (voiceAlertRef.current) {
						voiceAlertRef.current.handleNewAlert({
							message: `${sensor.name}数值超限，当前值：${newValue.toFixed(1)}`,
							type: 'error',
							priority: 3
						});
					}
				} else if (newValue > sensor.threshold * 0.8) {
					status = '警告';
					// 触发警告报警
					if (voiceAlertRef.current) {
						voiceAlertRef.current.handleNewAlert({
							message: `${sensor.name}数值接近阈值，请关注。当前值：${newValue.toFixed(1)}`,
							type: 'warning',
							priority: 2
						});
					}
				}

				return {
					...sensor,
					value: parseFloat(newValue.toFixed(1)),
					status
				};
			})
		);
	};

	// 触发测试报警
	const triggerTestAlert = (type: 'info' | 'warning' | 'error') => {
		const messages = {
			info: '系统运行正常，所有传感器数据在正常范围内。',
			warning: '警告：温度传感器数值接近阈值，请关注。',
			error: '紧急报警：压力传感器数值超限，立即处理！'
		};

		// 调用VoiceAlert组件的方法触发报警
		if (voiceAlertRef.current) {
			voiceAlertRef.current.handleNewAlert({
				message: messages[type],
				type: type,
				priority: type === 'error' ? 3 : type === 'warning' ? 2 : 1
			});
		}

		console.log(`触发${type}类型报警:`, messages[type]);
	};

	return (
		<div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
			<h1>Vue2语音报警功能演示</h1>
			<p>基于Web Speech API实现的语音报警功能，支持多浏览器、可配置参数和消息管理</p>

			{/* 标签页导航 */}
			<div
				style={{
					display: 'flex',
					gap: '10px',
					marginBottom: '20px',
					borderBottom: '1px solid #eee',
					paddingBottom: '10px'
				}}
			>
				<button
					style={{
						padding: '10px 20px',
						border: 'none',
						background: activeTab === 'demo' ? '#3498db' : '#f8f9fa',
						color: activeTab === 'demo' ? 'white' : '#333',
						borderRadius: '5px 5px 0 0',
						cursor: 'pointer'
					}}
					onClick={() => setActiveTab('demo')}
				>
					基础演示
				</button>
				<button
					style={{
						padding: '10px 20px',
						border: 'none',
						background: activeTab === 'simulation' ? '#3498db' : '#f8f9fa',
						color: activeTab === 'simulation' ? 'white' : '#333',
						borderRadius: '5px 5px 0 0',
						cursor: 'pointer'
					}}
					onClick={() => setActiveTab('simulation')}
				>
					系统监控模拟
				</button>
			</div>

			{/* 基础演示 */}
			{activeTab === 'demo' && (
				<div>
					<div
						style={{
							backgroundColor: '#f8f9fa',
							padding: '20px',
							borderRadius: '8px',
							marginBottom: '20px'
						}}
					>
						<h2>语音报警组件演示</h2>
						<p>组件提供了完整的语音报警功能，支持音量、语速、音调调节，消息历史记录管理</p>

						<VoiceAlert
							ref={voiceAlertRef}
							maxAlerts={30}
							autoSpeak={true}
							showControlPanel={true}
						/>
					</div>

					{/* 模拟报警按钮 */}
					<div
						style={{
							display: 'flex',
							gap: '10px',
							flexWrap: 'wrap',
							marginBottom: '20px'
						}}
					>
						<button
							style={{
								padding: '10px 20px',
								border: '1px solid #27ae60',
								background: '#2ecc71',
								color: 'white',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
							onClick={() => triggerTestAlert('info')}
						>
							触发信息报警
						</button>
						<button
							style={{
								padding: '10px 20px',
								border: '1px solid #f39c12',
								background: '#f39c12',
								color: 'white',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
							onClick={() => triggerTestAlert('warning')}
						>
							触发警告报警
						</button>
						<button
							style={{
								padding: '10px 20px',
								border: '1px solid #c0392b',
								background: '#e74c3c',
								color: 'white',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
							onClick={() => triggerTestAlert('error')}
						>
							触发错误报警
						</button>
					</div>
				</div>
			)}

			{/* 系统监控模拟 */}
			{activeTab === 'simulation' && (
				<div>
					<div
						style={{
							backgroundColor: '#f8f9fa',
							padding: '20px',
							borderRadius: '8px',
							marginBottom: '20px'
						}}
					>
						<h2>系统监控模拟</h2>
						<p>模拟工业监控系统中的传感器数据监控和语音报警</p>

						<VoiceAlert
							ref={voiceAlertRef}
							maxAlerts={50}
							autoSpeak={true}
							showControlPanel={false}
						/>
					</div>

					{/* 实时数据展示 */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '20px',
							marginBottom: '20px'
						}}
					>
						{sensorData.map(sensor => (
							<div
								key={sensor.id}
								style={{
									padding: '15px',
									border: '1px solid #ddd',
									borderRadius: '8px',
									background: 'white',
									boxShadow: sensor.status === '超限' ? '0 0 0 2px #f44336' : 'none'
								}}
							>
								<h3>{sensor.name}</h3>
								<p>数值: {sensor.value}</p>
								<p>
									状态:
									<span
										style={{
											color:
												sensor.status === '超限'
													? '#f44336'
													: sensor.status === '警告'
													? '#ff9800'
													: '#4caf50',
											fontWeight: 'bold'
										}}
									>
										{sensor.status}
									</span>
								</p>
								<p>阈值: {sensor.threshold}</p>
							</div>
						))}
					</div>

					{/* 控制按钮 */}
					<div
						style={{
							display: 'flex',
							gap: '10px',
							flexWrap: 'wrap'
						}}
					>
						<button
							style={{
								padding: '10px 20px',
								border: '1px solid #3498db',
								background: '#3498db',
								color: 'white',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
							onClick={simulateSensorUpdate}
						>
							模拟数据更新
						</button>
						<button
							style={{
								padding: '10px 20px',
								border: '1px solid #9b59b6',
								background: '#9b59b6',
								color: 'white',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
							onClick={() => {
								// 模拟异常数据
								const newData = sensorData.map(sensor => ({
									...sensor,
									value: sensor.threshold + 5,
									status: '超限'
								}));

								setSensorData(newData);

								// 触发报警
								if (voiceAlertRef.current) {
									newData.forEach(sensor => {
										if (sensor.status === '超限') {
											voiceAlertRef.current.handleNewAlert({
												message: `${sensor.name}数值超限，当前值：${sensor.value}`,
												type: 'error',
												priority: 3
											});
										}
									});
								}
							}}
						>
							模拟异常报警
						</button>
					</div>
				</div>
			)}

			{/* 使用说明 */}
			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#e3f2fd',
					borderRadius: '8px'
				}}
			>
				<h3>使用说明</h3>
				<ul>
					<li>组件基于Web Speech API实现，支持Chrome、Edge等现代浏览器</li>
					<li>可以通过滑块调节音量、语速和音调参数</li>
					<li>支持多种消息类型：信息(info)、警告(warning)、错误(error)、成功(success)</li>
					<li>点击消息列表中的🔊按钮可以重新播报特定消息</li>
					<li>点击×按钮可以删除特定消息</li>
					<li>支持自动播报新消息和手动播报</li>
				</ul>
			</div>
		</div>
	);
};

export default VoiceAlertDemo;
