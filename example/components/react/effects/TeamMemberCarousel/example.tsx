import React, { useState } from 'react';
import TeamMemberCarousel from './index';

const TeamMemberCarouselExample: React.FC = () => {
	const [customMembers, setCustomMembers] = useState([
		{
			name: '瀑布飞流',
			role: '水景风光',
			imageUrl:
				'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '瀑布飞流风景'
		},
		{
			name: '草原牧场',
			role: '草原风光',
			imageUrl:
				'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '草原牧场风景'
		},
		{
			name: '极光夜空',
			role: '极地风光',
			imageUrl:
				'https://images.unsplash.com/photo-1505228395891-9a51e7f86e1c?q=80&w=3867&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '极光夜空风景'
		},
		{
			name: '峡谷奇观',
			role: '地质风光',
			imageUrl:
				'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '峡谷奇观风景'
		}
	]);

	const handleAddMember = () => {
		const newMember = {
			name: `风景 ${customMembers.length + 1}`,
			role: '自然美景',
			imageUrl:
				'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: `风景 ${customMembers.length + 1}`
		};
		setCustomMembers([...customMembers, newMember]);
	};

	const handleRemoveMember = () => {
		if (customMembers.length > 1) {
			setCustomMembers(customMembers.slice(0, -1));
		}
	};

	return (
		<div className="team-member-carousel-example" style={{ padding: '20px' }}>
			<h1 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>3D风景轮播演示</h1>

			<div style={{ marginBottom: '30px' }}>
				<TeamMemberCarousel containerWidth={500} />
			</div>

			<div style={{ marginBottom: '30px' }}>
				<h2 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>自定义风景图片</h2>
				<div
					style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
				>
					<div style={{ width: '100%' }}>
						<TeamMemberCarousel members={customMembers} containerWidth={500} />
					</div>

					<div style={{ display: 'flex', gap: '10px' }}>
						<button
							onClick={handleAddMember}
							style={{
								padding: '8px 16px',
								backgroundColor: '#4a90e2',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
						>
							添加风景
						</button>
						<button
							onClick={handleRemoveMember}
							style={{
								padding: '8px 16px',
								backgroundColor: '#4a90e2',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
						>
							删除风景
						</button>
					</div>
				</div>
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#f8f9fa',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
					textAlign: 'left',
					maxWidth: '800px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>3D风景轮播特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>具有3D效果的风景图片轮播展示</li>
					<li style={{ margin: '10px 0' }}>支持多种交互方式切换图片（箭头、指示点、键盘、触摸）</li>
					<li style={{ margin: '10px 0' }}>响应式设计，适配不同屏幕尺寸</li>
					<li style={{ margin: '10px 0' }}>支持自定义风景图片数据</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>该组件通过3D变换实现风景图片的轮播展示效果，用户可以通过多种方式切换图片。</p>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>参数配置</h3>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>
						<strong>members</strong>: 风景图片数组，默认包含6个示例图片
					</li>
					<li style={{ margin: '10px 0' }}>
						<strong>containerWidth</strong>: 容器宽度，默认为500px
					</li>
					<li style={{ margin: '10px 0' }}>
						<strong>className</strong>: 自定义CSS类名
					</li>
					<li style={{ margin: '10px 0' }}>
						<strong>style</strong>: 自定义内联样式
					</li>
				</ul>
			</div>
		</div>
	);
};

export default TeamMemberCarouselExample;
