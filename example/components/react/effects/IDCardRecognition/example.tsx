import React from 'react';
import IDCardRecognition from './index';

const IDCardRecognitionExample: React.FC = () => {
	return (
		<div style={{ padding: '20px' }}>
			<h2>微信小程序 VisionKit 身份证识别与裁剪演示</h2>
			<p>此组件演示了在微信小程序中使用 VisionKit 实现身份证自动识别与裁剪的效果</p>
			<div style={{ width: '100%', height: '500px' }}>
				<IDCardRecognition width={600} height={400} />
			</div>
			<div style={{ marginTop: '20px' }}>
				<h3>使用说明</h3>
				<ul>
					<li>点击"上传身份证"按钮选择身份证图片</li>
					<li>系统将自动识别身份证区域并进行裁剪</li>
					<li>处理完成后将显示裁剪后的标准化身份证图片</li>
				</ul>
			</div>
		</div>
	);
};

export default IDCardRecognitionExample;
