import React, { useState } from 'react';
import InfiniteScrollExample from './index';

const InfiniteScrollDemo = () => {
	const [config, setConfig] = useState({
		width: 500,
		height: 400,
		initialCount: 20,
		loadCount: 10,
		maxCount: 100,
		theme: 'light' as 'light' | 'dark'
	});

	return (
		<div style={{ padding: '20px' }}>
			<h2>无限滚动加载演示</h2>

			<div
				style={{
					marginBottom: '20px',
					padding: '15px',
					backgroundColor: '#f5f5f5',
					borderRadius: '8px'
				}}
			>
				<h3>配置面板</h3>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '10px'
					}}
				>
					<div>
						<label>宽度: </label>
						<input
							type="range"
							min="300"
							max="800"
							value={config.width}
							onChange={e => setConfig({ ...config, width: parseInt(e.target.value) })}
						/>
						<span> {config.width}px</span>
					</div>

					<div>
						<label>高度: </label>
						<input
							type="range"
							min="200"
							max="600"
							value={config.height}
							onChange={e => setConfig({ ...config, height: parseInt(e.target.value) })}
						/>
						<span> {config.height}px</span>
					</div>

					<div>
						<label>初始数据量: </label>
						<input
							type="range"
							min="5"
							max="50"
							value={config.initialCount}
							onChange={e => setConfig({ ...config, initialCount: parseInt(e.target.value) })}
						/>
						<span> {config.initialCount}</span>
					</div>

					<div>
						<label>每次加载: </label>
						<input
							type="range"
							min="5"
							max="30"
							value={config.loadCount}
							onChange={e => setConfig({ ...config, loadCount: parseInt(e.target.value) })}
						/>
						<span> {config.loadCount}</span>
					</div>

					<div>
						<label>最大数据量: </label>
						<input
							type="range"
							min="50"
							max="200"
							value={config.maxCount}
							onChange={e => setConfig({ ...config, maxCount: parseInt(e.target.value) })}
						/>
						<span> {config.maxCount}</span>
					</div>

					<div>
						<label>主题: </label>
						<select
							value={config.theme}
							onChange={e => setConfig({ ...config, theme: e.target.value as 'light' | 'dark' })}
						>
							<option value="light">浅色</option>
							<option value="dark">深色</option>
						</select>
					</div>
				</div>
			</div>

			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<InfiniteScrollExample
					width={config.width}
					height={config.height}
					initialCount={config.initialCount}
					loadCount={config.loadCount}
					maxCount={config.maxCount}
					theme={config.theme}
				/>
			</div>
		</div>
	);
};

export default InfiniteScrollDemo;
