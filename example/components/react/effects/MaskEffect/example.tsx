import * as React from 'react';
import MaskEffect from './index';

const MaskEffectExample: React.FC = () => {
	const [maskType, setMaskType] = React.useState('gradient');
	const [maskMode, setMaskMode] = React.useState<'alpha' | 'luminance' | 'match-source'>('alpha');
	const [width, setWidth] = React.useState(500);
	const [height, setHeight] = React.useState(300);

	// 获取示例蒙版图像URL
	const getMaskImage = () => {
		switch (maskType) {
			case 'circle':
				return 'radial-gradient(circle, black 50%, transparent 50%)';
			case 'ellipse':
				return 'radial-gradient(ellipse, black 60%, transparent 60%)';
			case 'gradient':
				return 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)';
			case 'diamond':
				return 'linear-gradient(45deg, transparent 40%, black 40%, black 60%, transparent 60%), linear-gradient(-45deg, transparent 40%, black 40%, black 60%, transparent 60%)';
			default:
				return 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)';
		}
	};

	return (
		<div className="mask-demo-container">
			<h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Mask蒙版效果演示</h1>

			<div style={{ marginBottom: '30px', textAlign: 'center' }}>
				<h2 style={{ marginBottom: '15px' }}>默认Mask蒙版效果</h2>
				<div style={{ display: 'inline-block' }}>
					<MaskEffect
						width={500}
						height={300}
						backgroundImage="https://picsum.photos/500/300?random=1"
						maskImage="radial-gradient(circle, black 50%, transparent 50%)"
					/>
				</div>
			</div>

			<div style={{ marginBottom: '30px' }}>
				<h2 style={{ marginBottom: '15px', textAlign: 'center' }}>自定义配置Mask蒙版</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
						padding: '20px',
						backgroundColor: '#f5f5f5',
						borderRadius: '8px'
					}}
				>
					<div style={{ display: 'inline-block', width: '100%' }}>
						<MaskEffect
							width={width}
							height={height}
							backgroundImage="https://picsum.photos/500/300?random=2"
							maskImage={getMaskImage()}
							maskMode={maskMode}
						/>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '15px',
							width: '100%',
							maxWidth: '800px'
						}}
					>
						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>蒙版类型</label>
							<select
								value={maskType}
								onChange={e => setMaskType(e.target.value)}
								style={{ width: '100%', padding: '8px' }}
							>
								<option value="gradient">渐变蒙版</option>
								<option value="circle">圆形蒙版</option>
								<option value="ellipse">椭圆蒙版</option>
								<option value="diamond">菱形蒙版</option>
							</select>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>蒙版模式</label>
							<select
								value={maskMode}
								onChange={e => setMaskMode(e.target.value as any)}
								style={{ width: '100%', padding: '8px' }}
							>
								<option value="alpha">Alpha模式</option>
								<option value="luminance">亮度模式</option>
								<option value="match-source">匹配源模式</option>
							</select>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>宽度: {width}px</label>
							<input
								type="range"
								min="200"
								max="800"
								step="50"
								value={width}
								onChange={e => setWidth(Number(e.target.value))}
								style={{ width: '100%' }}
							/>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>高度: {height}px</label>
							<input
								type="range"
								min="100"
								max="500"
								step="50"
								value={height}
								onChange={e => setHeight(Number(e.target.value))}
								style={{ width: '100%' }}
							/>
						</div>
					</div>
				</div>
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#f0f0f0',
					borderRadius: '8px',
					maxWidth: '800px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ marginBottom: '15px' }}>Mask蒙版效果特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>支持多种蒙版类型：图片、渐变、SVG</li>
					<li style={{ margin: '10px 0' }}>支持alpha和luminance两种蒙版模式</li>
					<li style={{ margin: '10px 0' }}>可自定义蒙版尺寸、位置和重复方式</li>
					<li style={{ margin: '10px 0' }}>使用CSS实现，性能优异</li>
					<li style={{ margin: '10px 0' }}>使用TypeScript编写，具有完整的类型定义</li>
					<li style={{ margin: '10px 0' }}>适用于任意HTML元素</li>
				</ul>

				<h3 style={{ marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					Mask蒙版效果组件通过CSS的mask-image属性实现元素可见区域的控制。
					用户可以通过调整参数来自定义蒙版的类型、模式和外观。
				</p>
				<p style={{ marginTop: '10px' }}>
					<strong>Props说明：</strong>
					<br />
					• width: 容器宽度，默认500px
					<br />
					• height: 容器高度，默认300px
					<br />
					• backgroundImage: 背景图像URL
					<br />
					• maskImage: 蒙版图像，可以是URL或CSS渐变
					<br />
					• maskMode: 蒙版模式，可选alpha、luminance、match-source
					<br />
					• maskSize: 蒙版尺寸，默认100%
					<br />
					• maskPosition: 蒙版位置，默认center
					<br />
					• maskRepeat: 蒙版重复方式，默认no-repeat
					<br />
					• children: 子元素内容
					<br />
					• className: 自定义CSS类名
					<br />• style: 自定义内联样式
				</p>
			</div>
		</div>
	);
};

export default MaskEffectExample;
