import * as React from 'react';
import MaskEffect from '../index';

const TextFadeExample: React.FC = () => {
	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
			<h3 style={{ marginBottom: '15px' }}>文字渐隐效果</h3>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<MaskEffect
					width={400}
					height={150}
					backgroundImage="linear-gradient(45deg, #ff6b6b, #4ecdc4)"
					maskImage="linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)"
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
							fontSize: '24px',
							fontWeight: 'bold',
							textAlign: 'center'
						}}
					>
						这是一段演示文字渐隐效果的文本内容
					</div>
				</MaskEffect>
			</div>
			<div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
				<p>使用线性渐变蒙版创建文字底部渐隐效果</p>
			</div>
		</div>
	);
};

export default TextFadeExample;
