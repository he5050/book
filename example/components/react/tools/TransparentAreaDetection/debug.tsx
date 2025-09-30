import * as React from 'react';
import TransparentAreaDetection from './index';

const DebugTransparentAreaDetection: React.FC = () => {
	const [imageUrl, setImageUrl] = React.useState('');
	const [minWidth, setMinWidth] = React.useState(5);
	const [minHeight, setMinHeight] = React.useState(5);
	const [alphaThreshold, setAlphaThreshold] = React.useState(30);
	const [detectedAreas, setDetectedAreas] = React.useState<any[]>([]);

	const handleAreasDetected = (areas: any[]) => {
		console.log('检测到的区域:', areas);
		setDetectedAreas(areas);
	};

	// 测试图像URL
	const testImageUrl =
		'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png';

	React.useEffect(() => {
		// 组件加载后自动设置测试图像
		setImageUrl(testImageUrl);
	}, []);

	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
			<h1 style={{ textAlign: 'center', marginBottom: '30px' }}>图像透明区域检测调试</h1>

			<div
				style={{
					marginBottom: '30px',
					padding: '20px',
					backgroundColor: '#fff',
					borderRadius: '8px'
				}}
			>
				<h2 style={{ marginBottom: '15px' }}>配置参数</h2>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
					<div>
						<label style={{ display: 'block', marginBottom: '5px' }}>最小宽度: {minWidth}px</label>
						<input
							type="range"
							min="1"
							max="100"
							value={minWidth}
							onChange={e => setMinWidth(Number(e.target.value))}
							style={{ width: '100%' }}
						/>
					</div>

					<div>
						<label style={{ display: 'block', marginBottom: '5px' }}>最小高度: {minHeight}px</label>
						<input
							type="range"
							min="1"
							max="100"
							value={minHeight}
							onChange={e => setMinHeight(Number(e.target.value))}
							style={{ width: '100%' }}
						/>
					</div>
				</div>

				<div style={{ marginTop: '20px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>
						透明度阈值: {alphaThreshold}
					</label>
					<input
						type="range"
						min="0"
						max="255"
						value={alphaThreshold}
						onChange={e => setAlphaThreshold(Number(e.target.value))}
						style={{ width: '100%' }}
					/>
					<small>值越小，检测越敏感（0=完全透明，255=完全不透明）</small>
				</div>

				<div style={{ marginTop: '20px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>测试图像:</label>
					<img src={testImageUrl} alt="测试图像" style={{ maxWidth: '100%', height: 'auto' }} />
				</div>
			</div>

			<div
				style={{
					marginBottom: '30px',
					padding: '20px',
					backgroundColor: '#fff',
					borderRadius: '8px'
				}}
			>
				<h2 style={{ marginBottom: '15px' }}>检测结果</h2>
				<TransparentAreaDetection
					imageUrl={imageUrl}
					minWidth={minWidth}
					minHeight={minHeight}
					alphaThreshold={alphaThreshold}
					onAreasDetected={handleAreasDetected}
				/>
			</div>

			{detectedAreas.length > 0 && (
				<div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
					<h2 style={{ marginBottom: '15px' }}>区域详情</h2>
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ backgroundColor: '#f0f0f0' }}>
									<th style={{ border: '1px solid #ddd', padding: '8px' }}>序号</th>
									<th style={{ border: '1px solid #ddd', padding: '8px' }}>X坐标</th>
									<th style={{ border: '1px solid #ddd', padding: '8px' }}>Y坐标</th>
									<th style={{ border: '1px solid #ddd', padding: '8px' }}>宽度</th>
									<th style={{ border: '1px solid #ddd', padding: '8px' }}>高度</th>
									<th style={{ border: '1px solid #ddd', padding: '8px' }}>面积</th>
								</tr>
							</thead>
							<tbody>
								{detectedAreas.map((area, index) => (
									<tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
										<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
											{index + 1}
										</td>
										<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
											{area.x}
										</td>
										<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
											{area.y}
										</td>
										<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
											{area.w}
										</td>
										<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
											{area.h}
										</td>
										<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
											{area.w * area.h}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default DebugTransparentAreaDetection;
