import * as React from 'react';
import HoverCard3D from './index';

const HoverCard3DExample: React.FC = () => {
	return (
		<div
			className="hover-card-3d-example"
			style={{
				padding: '20px',
				textAlign: 'center',
				maxWidth: '1200px',
				margin: '0 auto',
				backgroundColor: '#1a2a6c',
				minHeight: '100vh'
			}}
		>
			<h1 style={{ color: '#fff', marginBottom: '30px', paddingTop: '20px' }}>
				3D悬停卡片效果演示
			</h1>

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
				<HoverCard3D />
				<HoverCard3D
					icon="fas fa-paint-brush"
					title="精美设计"
					content="注重每一个细节，为用户提供直观、愉悦的视觉与交互体验。"
				/>
				<HoverCard3D
					icon="fas fa-code"
					title="优质代码"
					content="遵循最佳实践，编写清晰、可维护且经过充分测试的代码。"
				/>
			</div>

			<div
				style={{
					marginTop: '40px',
					padding: '25px',
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					borderRadius: '12px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
					textAlign: 'left',
					maxWidth: '900px',
					margin: '0 auto'
				}}
			>
				<h2 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '24px' }}>3D悬停卡片特点</h2>

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
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								鼠标悬停时卡片会浮起、倾斜并产生动态的光泽效果
							</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								使用玻璃态设计(Glassmorphism)增强现代感
							</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								卡片整体变换与内部元素独立动画相结合
							</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								动态光泽效果，创造光斑移动效果
							</li>
						</ul>
					</div>

					<div>
						<h3 style={{ color: '#3498db', marginBottom: '12px' }}>技术要点</h3>
						<ul style={{ paddingLeft: '20px', color: '#555' }}>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>perspective属性创建3D空间感</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>translateZ()变换创造层次感</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>backdrop-filter实现毛玻璃效果</li>
							<li style={{ margin: '10px 0', lineHeight: '1.6' }}>
								transform-style: preserve-3d保持3D空间
							</li>
						</ul>
					</div>
				</div>

				<h3 style={{ color: '#2c3e50', marginTop: '25px', marginBottom: '15px' }}>使用说明</h3>
				<p style={{ color: '#555', lineHeight: '1.7' }}>
					将鼠标悬停在卡片上，卡片会浮起、倾斜并产生动态的光泽效果，同时所有的元素会有深度感变化。
					移开鼠标后，卡片会恢复原始状态。您可以通过修改组件的props来自定义卡片的图标、标题和内容。
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
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
						<div>
							<p>
								<strong>icon</strong>: 图标类名 (默认: 'fas fa-rocket')
							</p>
						</div>
						<div>
							<p>
								<strong>title</strong>: 卡片标题 (默认: '创新技术')
							</p>
						</div>
						<div>
							<p>
								<strong>content</strong>: 卡片内容 (默认:
								'采用前沿技术栈，打造高性能、高可用的现代化应用解决方案。')
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HoverCard3DExample;
