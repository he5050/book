import React, { useState } from 'react';
import WeatherCard from './index';

const WeatherCardExample: React.FC = () => {
	const [location, setLocation] = useState('New York');
	const [apiKey, setApiKey] = useState('');

	const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocation(e.target.value);
	};

	const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setApiKey(e.target.value);
	};

	return (
		<div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh' }}>
			<h1 style={{ textAlign: 'center', color: 'white', marginBottom: '30px' }}>
				天气卡片效果演示
			</h1>

			<div style={{ marginBottom: '30px', textAlign: 'center' }}>
				<h2 style={{ color: 'white', marginBottom: '15px' }}>默认天气卡片效果</h2>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<WeatherCard />
				</div>
			</div>

			<div style={{ marginBottom: '30px' }}>
				<h2 style={{ color: 'white', marginBottom: '15px', textAlign: 'center' }}>
					自定义配置天气卡片
				</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
						padding: '20px',
						backgroundColor: '#222',
						borderRadius: '8px'
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<WeatherCard location={location} apiKey={apiKey} />
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
							gap: '15px',
							width: '100%',
							maxWidth: '600px'
						}}
					>
						<div>
							<label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>位置:</label>
							<input
								type="text"
								value={location}
								onChange={handleLocationChange}
								placeholder="输入城市名"
								style={{
									width: '100%',
									padding: '8px',
									borderRadius: '4px',
									border: '1px solid #ccc'
								}}
							/>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>
								API Key:
							</label>
							<input
								type="text"
								value={apiKey}
								onChange={handleApiKeyChange}
								placeholder="输入天气API密钥"
								style={{
									width: '100%',
									padding: '8px',
									borderRadius: '4px',
									border: '1px solid #ccc'
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#333',
					borderRadius: '8px',
					maxWidth: '800px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ color: 'white', marginBottom: '15px' }}>天气卡片特点</h2>
				<ul style={{ paddingLeft: '20px', color: 'white' }}>
					<li style={{ margin: '10px 0' }}>结合3D云层动画和天气信息展示</li>
					<li style={{ margin: '10px 0' }}>支持自定义位置和API密钥配置</li>
					<li style={{ margin: '10px 0' }}>包含当前天气、日出日落、降水概率等信息</li>
					<li style={{ margin: '10px 0' }}>5天天气预报功能</li>
					<li style={{ margin: '10px 0' }}>响应式设计，适配不同屏幕尺寸</li>
					<li style={{ margin: '10px 0' }}>使用TypeScript编写，具有完整的类型定义</li>
				</ul>

				<h3 style={{ color: 'white', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p style={{ color: 'white' }}>
					天气卡片组件结合了3D云层动画和天气信息展示功能。用户可以通过配置位置和API密钥来获取真实的天气数据。
					组件包含当前天气、日出日落时间、降水概率、湿度、风速等信息，以及5天天气预报。
				</p>
				<p style={{ color: 'white', marginTop: '10px' }}>
					<strong>Props说明：</strong>
					<br />
					• location: 城市位置，默认为"New York"
					<br />
					• apiKey: 天气API密钥
					<br />
					• className: 自定义CSS类名
					<br />• style: 自定义内联样式
				</p>
			</div>
		</div>
	);
};

export default WeatherCardExample;
