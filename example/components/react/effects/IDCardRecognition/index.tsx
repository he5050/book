import React, { useState, useRef } from 'react';
import './index.scss';

interface IDCardRecognitionProps {
	width?: number;
	height?: number;
	className?: string;
}

const IDCardRecognition: React.FC<IDCardRecognitionProps> = ({
	width = 600,
	height = 400,
	className = ''
}) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [status, setStatus] = useState('等待上传身份证图片');
	const fileInputRef = useRef<HTMLInputElement>(null);

	// 模拟身份证识别过程
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsProcessing(true);
		setStatus('正在识别身份证...');

		// 模拟处理过程
		setTimeout(() => {
			// 模拟识别结果
			const isSuccess = Math.random() > 0.3; // 70% 成功率

			if (isSuccess) {
				setStatus('识别成功，正在裁剪...');
				// 模拟裁剪过程
				setTimeout(() => {
					setIsProcessing(false);
					setResult(
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACCCAMAAADQNkiAAAAA1BMVEW10NBjBBbqAAAAH0lEQVRo3u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICD2SgAAd4xKcAAAAAASUVORK5CYII='
					);
					setStatus('身份证识别与裁剪完成');
				}, 1500);
			} else {
				setIsProcessing(false);
				setStatus('未识别到身份证，请重新上传清晰的图片');
			}
		}, 2000);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleReset = () => {
		setResult(null);
		setStatus('等待上传身份证图片');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className={`id-card-recognition ${className}`} style={{ width, height }}>
			<div className="recognition-header">
				<h3>身份证识别与裁剪演示</h3>
				<p className="status">{status}</p>
			</div>

			<div className="recognition-content">
				{result ? (
					<div className="result-container">
						<img src={result} alt="识别后的身份证" className="result-image" />
						<p>裁剪后的身份证图片</p>
					</div>
				) : (
					<div className="upload-area">
						<div className="upload-placeholder">
							<div className="upload-icon">📷</div>
							<p>请上传身份证图片</p>
						</div>
					</div>
				)}
			</div>

			<div className="recognition-controls">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileUpload}
					accept="image/*"
					style={{ display: 'none' }}
				/>
				<button onClick={handleUploadClick} disabled={isProcessing} className="upload-button">
					{isProcessing ? '处理中...' : '上传身份证'}
				</button>
				{result && (
					<button onClick={handleReset} className="reset-button">
						重新上传
					</button>
				)}
			</div>

			<div className="recognition-info">
				<h4>技术说明</h4>
				<ul>
					<li>基于微信小程序 VisionKit 实现</li>
					<li>自动识别身份证区域</li>
					<li>透视矫正与智能裁剪</li>
					<li>返回标准化图片</li>
				</ul>
			</div>
		</div>
	);
};

export default IDCardRecognition;
