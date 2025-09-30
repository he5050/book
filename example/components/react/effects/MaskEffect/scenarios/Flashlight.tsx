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
					backgroundImage="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
					maskImage={`radial-gradient(circle at ${position.x} ${position.y}, white 20%, black 70%)`}
					maskMode="luminance"
					maskSize="100% 100%"
					maskPosition="center"
					maskRepeat="no-repeat"
				>
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							fontSize: '20px',
							fontWeight: 'bold',
							textAlign: 'center'
						}}
					>
						将鼠标悬停在此区域上查看手电筒效果
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
