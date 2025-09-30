import * as React from 'react';
import RippleEffect from './index';

const RippleEffectExample: React.FC = () => {
	const [buttonColor, setButtonColor] = React.useState('rgba(0, 0, 0, 0.1)');
	const [duration, setDuration] = React.useState(600);
	const [width, setWidth] = React.useState(500);
	const [height, setHeight] = React.useState(100);

	const handleButtonClick = () => {
		console.log('按钮被点击了！');
	};

	const handleCardClick = () => {
		console.log('卡片被点击了！');
	};

	return (
		<div className="ripple-demo-container">
			<h1 style={{ textAlign: 'center', marginBottom: '30px' }}>水波纹效果演示</h1>

			<div style={{ marginBottom: '30px', textAlign: 'center' }}>
				<h2 style={{ marginBottom: '15px' }}>默认水波纹效果</h2>
				<div style={{ display: 'inline-block' }}>
					<RippleEffect onClick={handleButtonClick}>
						<div
							style={{
								width: '100%',
								height: '100%',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '8px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white',
								fontSize: '18px',
								fontWeight: 'bold'
							}}
						>
							点击我试试水波纹效果
						</div>
					</RippleEffect>
				</div>
			</div>

			<div style={{ marginBottom: '30px' }}>
				<h2 style={{ marginBottom: '15px', textAlign: 'center' }}>自定义配置水波纹</h2>
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
						<RippleEffect
							width={width}
							height={height}
							color={buttonColor}
							duration={duration}
							onClick={handleCardClick}
						>
							<div
								style={{
									width: '100%',
									height: '100%',
									background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
									borderRadius: '8px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
									fontSize: '18px',
									fontWeight: 'bold'
								}}
							>
								自定义水波纹效果
							</div>
						</RippleEffect>
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
							<label style={{ display: 'block', marginBottom: '5px' }}>波纹颜色</label>
							<input
								type="color"
								value={buttonColor}
								onChange={e => setButtonColor(e.target.value)}
								style={{ width: '100%', height: '40px' }}
							/>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px' }}>
								动画时长: {duration}ms
							</label>
							<input
								type="range"
								min="200"
								max="2000"
								step="100"
								value={duration}
								onChange={e => setDuration(Number(e.target.value))}
								style={{ width: '100%' }}
							/>
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
								min="50"
								max="300"
								step="10"
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
				<h2 style={{ marginBottom: '15px' }}>水波纹效果特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>模仿 Material Design Ripple 效果</li>
					<li style={{ margin: '10px 0' }}>支持自定义波纹颜色、大小和动画时长</li>
					<li style={{ margin: '10px 0' }}>响应式设计，适配不同尺寸元素</li>
					<li style={{ margin: '10px 0' }}>使用 CSS transition 实现流畅动画</li>
					<li style={{ margin: '10px 0' }}>使用 TypeScript 编写，具有完整的类型定义</li>
					<li style={{ margin: '10px 0' }}>性能优化，动画结束后自动清理元素</li>
				</ul>

				<h3 style={{ marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					水波纹效果组件通过在点击位置创建波纹元素并应用 CSS 动画来实现。
					用户可以通过调整参数来自定义波纹的外观和动画效果。
				</p>
				<p style={{ marginTop: '10px' }}>
					<strong>Props 说明：</strong>
					<br />
					• width: 容器宽度，默认 500px
					<br />
					• height: 容器高度，默认 100px
					<br />
					• color: 波纹颜色，默认 rgba(0, 0, 0, 0.1)
					<br />
					• duration: 动画时长，默认 600ms
					<br />
					• children: 子元素内容
					<br />
					• className: 自定义 CSS 类名
					<br />
					• style: 自定义内联样式
					<br />• onClick: 点击事件处理函数
				</p>
			</div>
		</div>
	);
};

export default RippleEffectExample;
