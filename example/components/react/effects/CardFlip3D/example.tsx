import * as React from 'react';
import CardFlip3D from './index';

const CardFlip3DExample: React.FC = () => {
	return (
		<div
			className="card-flip-3d-example"
			style={{ padding: '20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}
		>
			<h1 style={{ color: '#333', marginBottom: '30px' }}>3D卡片翻转动画效果演示</h1>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '30px',
					marginBottom: '40px'
				}}
			>
				<CardFlip3D />
				<CardFlip3D
					frontIcon="🚀"
					frontTitle="极致性能"
					frontContent="体验卓越的性能表现"
					backTitle="性能优化"
					backContent="通过先进的技术优化，确保您的应用运行流畅、响应迅速。"
				/>
				<CardFlip3D
					frontIcon="❤️"
					frontTitle="用户体验"
					frontContent="以用户为中心的设计"
					backTitle="用户至上"
					backContent="我们始终将用户体验放在首位，打造直观易用的交互界面。"
				/>
			</div>

			<div
				style={{
					marginTop: '40px',
					padding: '25px',
					backgroundColor: '#f8f9fa',
					borderRadius: '12px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
					textAlign: 'left',
					maxWidth: '900px',
					margin: '0 auto'
				}}
			>
				<h2 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '24px' }}>
					3D卡片翻转动画特点
				</h2>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '20px',
						marginBottom: '25px'
					}}
				>
					<div>
						<h3 style={{ color: '#3498db', marginBottom: '12px' }}>核心特性</h3>
						<ul style={{ paddingLeft: '20px', color: '#555' }}>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>使用CSS 3D变换实现卡片翻转</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								鼠标悬停时卡片会翻转显示背面内容
							</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								正面和背面都有独特的渐变色背景
							</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>带有光泽流动效果的动画</li>
						</ul>
					</div>

					<div>
						<h3 style={{ color: '#3498db', marginBottom: '12px' }}>技术要点</h3>
						<ul style={{ paddingLeft: '20px', color: '#555' }}>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>perspective属性创建3D空间感</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								transform-style: preserve-3d保持3D空间
							</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								backface-visibility: hidden隐藏背面
							</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								cubic-bezier缓动函数使动画更生动
							</li>
						</ul>
					</div>
				</div>

				<h3 style={{ color: '#2c3e50', marginTop: '25px', marginBottom: '15px' }}>使用说明</h3>
				<p style={{ color: '#555', lineHeight: '1.7' }}>
					将鼠标悬停在卡片上，卡片会以3D方式翻转展示背面内容。移开鼠标后，卡片会翻转回正面。
					您可以通过修改组件的props来自定义卡片的正面和背面内容。
				</p>

				<div
					style={{
						marginTop: '25px',
						padding: '20px',
						backgroundColor: '#e3f2fd',
						borderRadius: '8px',
						borderLeft: '4px solid #2196f3'
					}}
				>
					<h4 style={{ color: '#0d47a1', marginTop: 0 }}>参数配置选项</h4>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
						<div>
							<p>
								<strong>frontIcon</strong>: 正面图标 (默认: '💡')
							</p>
							<p>
								<strong>frontTitle</strong>: 正面标题 (默认: '创意设计')
							</p>
							<p>
								<strong>frontContent</strong>: 正面内容 (默认: '探索无限创意可能性')
							</p>
						</div>
						<div>
							<p>
								<strong>backTitle</strong>: 背面标题 (默认: '创意解决方案')
							</p>
							<p>
								<strong>backContent</strong>: 背面内容 (默认:
								'我们提供独特的设计思路和创意解决方案...')
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardFlip3DExample;
