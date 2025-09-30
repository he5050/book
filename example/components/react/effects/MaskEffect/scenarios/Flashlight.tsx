import * as React from 'react';
import MaskEffect from '../index';

const FlashlightExample: React.FC = () => {
	const [position, setPosition] = React.useState({ x: '50%', y: '50%' });

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setPosition({ x: `${x}%`, y: `${y}%` });
	};

	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
			<h3 style={{ marginBottom: '15px' }}>手电筒效果</h3>
			<div
				style={{ display: 'flex', justifyContent: 'center' }}
				onMouseMove={handleMouseMove}
				onMouseLeave={() => setPosition({ x: '50%', y: '50%' })}
			>
				<MaskEffect
					width={400}
					height={250}
					backgroundImage="linear-gradient(135deg, #2c3e50 0%, #4a6491 100%)"
					maskImage={`radial-gradient(circle at ${position.x} ${position.y}, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(255, 255, 255, 0.7) 30%, rgba(0, 0, 0, 0) 60%)`}
					maskMode="alpha"
					maskSize="100% 100%"
					maskPosition="center"
					maskRepeat="no-repeat"
				>
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							fontSize: '20px',
							fontWeight: 'bold',
							textAlign: 'center',
							textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
						}}
					>
						<div>手电筒效果演示</div>
						<div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 'normal' }}>
							将鼠标悬停在此区域上查看效果
						</div>
						<div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
							<div style={{ width: '40px', height: '40px', backgroundColor: '#3498db', borderRadius: '50%' }}></div>
							<div style={{ width: '40px', height: '40px', backgroundColor: '#e74c3c', borderRadius: '50%' }}></div>
							<div style={{ width: '40px', height: '40px', backgroundColor: '#2ecc71', borderRadius: '50%' }}></div>
						</div>
					</div>
				</MaskEffect>
			</div>
			<div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
				<p>使用径向渐变蒙版和鼠标跟踪创建手电筒追光效果</p>
			</div>
		</div>
	);
};

export default FlashlightExample;
