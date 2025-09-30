import * as React from 'react';
import MaskEffect from '../index';

const ImageMaskExample: React.FC = () => {
	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
			<h3 style={{ marginBottom: '15px' }}>图像遮罩效果</h3>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<MaskEffect
					width={300}
					height={200}
					backgroundImage="https://picsum.photos/300/200?random=3"
					maskImage="radial-gradient(circle, black 50%, transparent 50%)"
					maskSize="cover"
					maskPosition="center"
					maskRepeat="no-repeat"
				/>
			</div>
			<div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
				<p>使用圆形蒙版创建图像遮罩效果</p>
			</div>
		</div>
	);
};

export default ImageMaskExample;
