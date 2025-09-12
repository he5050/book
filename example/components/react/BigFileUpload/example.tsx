import React, { useState, useRef } from 'react';
import { useBigFileUpload } from './useBigFileUpload';

const BigFileUploadExample: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { progress, isUploading, error, upload, cancelUpload } = useBigFileUpload();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			alert('请先选择文件');
			return;
		}

		const result = await upload(selectedFile);
		if (result.success) {
			alert('上传成功');
		} else {
			alert(`上传失败: ${result.message}`);
		}
	};

	const handleCancel = () => {
		cancelUpload();
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		setSelectedFile(null);
	};

	return (
		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
			<h2>大文件上传示例</h2>

			<div style={{ marginBottom: '20px' }}>
				<input type="file" ref={fileInputRef} onChange={handleFileChange} disabled={isUploading} />
			</div>

			{selectedFile && (
				<div style={{ marginBottom: '20px' }}>
					<p>文件名: {selectedFile.name}</p>
					<p>文件大小: {Math.round((selectedFile.size / 1024 / 1024) * 100) / 100} MB</p>
				</div>
			)}

			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={handleUpload}
					disabled={!selectedFile || isUploading}
					style={{
						padding: '10px 20px',
						marginRight: '10px',
						backgroundColor: '#4096ff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: !selectedFile || isUploading ? 'not-allowed' : 'pointer',
						opacity: !selectedFile || isUploading ? 0.6 : 1
					}}
				>
					{isUploading ? '上传中...' : '开始上传'}
				</button>

				{isUploading && (
					<button
						onClick={handleCancel}
						style={{
							padding: '10px 20px',
							backgroundColor: '#ff4d4f',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer'
						}}
					>
						取消上传
					</button>
				)}
			</div>

			{isUploading && (
				<div style={{ marginBottom: '20px' }}>
					<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
						<span style={{ marginRight: '10px' }}>上传进度:</span>
						<div
							style={{
								flex: 1,
								height: '20px',
								backgroundColor: '#f0f0f0',
								borderRadius: '10px',
								overflow: 'hidden'
							}}
						>
							<div
								style={{
									width: `${progress.percent}%`,
									height: '100%',
									backgroundColor: '#52c41a',
									transition: 'width 0.3s ease'
								}}
							></div>
						</div>
						<span style={{ marginLeft: '10px' }}>{progress.percent}%</span>
					</div>
				</div>
			)}

			{error && (
				<div
					style={{
						color: '#ff4d4f',
						padding: '10px',
						backgroundColor: '#fff2f0',
						borderRadius: '4px',
						marginBottom: '20px'
					}}
				>
					错误: {error}
				</div>
			)}

			<div
				style={{
					marginTop: '30px',
					padding: '15px',
					backgroundColor: '#f6ffed',
					border: '1px solid #b7eb8f',
					borderRadius: '6px'
				}}
			>
				<h3>功能说明</h3>
				<ul>
					<li>支持大文件分片上传</li>
					<li>支持秒传功能（文件已存在时直接完成）</li>
					<li>支持断点续传（自动跳过已上传分片）</li>
					<li>支持并发控制（默认并发数为3）</li>
					<li>实时显示上传进度</li>
					<li>支持取消上传</li>
				</ul>
			</div>
		</div>
	);
};

export default BigFileUploadExample;
