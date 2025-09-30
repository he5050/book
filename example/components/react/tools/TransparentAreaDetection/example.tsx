import * as React from 'react';
import TransparentAreaDetection from './index';

const TransparentAreaDetectionExample: React.FC = () => {
	const [imageUrl, setImageUrl] = React.useState('');
	const [minWidth, setMinWidth] = React.useState(10);
	const [minHeight, setMinHeight] = React.useState(10);
	const [alphaThreshold, setAlphaThreshold] = React.useState(10);
	const [detectedAreas, setDetectedAreas] = React.useState<any[]>([]);

	const handleAreasDetected = (areas: any[]) => {
		setDetectedAreas(areas);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = event => {
				setImageUrl(event.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
			<h1 style={{ textAlign: 'center', marginBottom: '30px' }}>图像透明区域检测演示</h1>

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
					<label style={{ display: 'block', marginBottom: '5px' }}>上传图像文件:</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						style={{ width: '100%' }}
					/>
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
				{imageUrl ? (
					<TransparentAreaDetection
						imageUrl={imageUrl}
						minWidth={minWidth}
						minHeight={minHeight}
						alphaThreshold={alphaThreshold}
						onAreasDetected={handleAreasDetected}
					/>
				) : (
					<div style={{ textAlign: 'center', color: '#666' }}>
						请上传一张包含透明区域的图像进行检测
					</div>
				)}
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

			<div
				style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}
			>
				<h2 style={{ marginBottom: '15px' }}>技术说明</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>基于 Canvas API 实现图像像素级分析</li>
					<li style={{ margin: '10px 0' }}>使用深度优先搜索算法识别连续透明区域</li>
					<li style={{ margin: '10px 0' }}>支持自定义最小区域尺寸过滤</li>
					<li style={{ margin: '10px 0' }}>提供详细的区域坐标和尺寸信息</li>
					<li style={{ margin: '10px 0' }}>使用 TypeScript 编写，具有完整的类型定义</li>
				</ul>

				<h3 style={{ marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					图像透明区域检测组件通过分析图像的 Alpha 通道来识别透明区域。
					用户可以通过调整参数来过滤掉过小的区域，获得更精确的检测结果。
				</p>
				<p style={{ marginTop: '10px' }}>
					<strong>Props 说明：</strong>
					<br />
					• imageUrl: 图像 URL 地址
					<br />
					• minWidth: 最小区域宽度，默认 10px
					<br />
					• minHeight: 最小区域高度，默认 10px
					<br />
					• alphaThreshold: 透明度阈值 (0-255)，默认 10
					<br />
					• onAreasDetected: 区域检测完成回调函数
					<br />
					• className: 自定义 CSS 类名
					<br />• style: 自定义内联样式
				</p>
			</div>
		</div>
	);
};

export default TransparentAreaDetectionExample;
