import React, { useState, useCallback } from 'react';
import './index.scss';

// 零宽字符字典
const zeroWidthMap: { [key: string]: string } = {
	'0': '\u200b', // Zero Width Space
	'1': '\u200c' // Zero Width Non-Joiner
};

// 反向字典
const binaryMap: { [key: string]: string } = {
	'\u200b': '0',
	'\u200c': '1'
};

// 文本转二进制
function textToBinary(text: string): string {
	return text
		.split('')
		.map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
		.join('');
}

// 二进制转文本
function binaryToText(binary: string): string {
	let result = '';
	for (let i = 0; i < binary.length; i += 8) {
		const byte = binary.slice(i, i + 8);
		result += String.fromCharCode(parseInt(byte, 2));
	}
	return result;
}

// 编码水印
function encodeWatermark(text: string, secret: string): string {
	const binary = textToBinary(secret);
	const hiddenStr = binary
		.split('')
		.map(b => zeroWidthMap[b])
		.join('');

	// 将隐形字符插入到文本的第一个字符后面
	return text.slice(0, 1) + hiddenStr + text.slice(1);
}

// 解码水印
function decodeWatermark(text: string): string {
	// 提取所有零宽字符
	const hiddenChars = text.match(/[\u200b\u200c]/g);
	if (!hiddenChars) return '未发现水印';

	// 转回二进制字符串
	const binaryStr = hiddenChars.map(c => binaryMap[c]).join('');

	// 二进制转文本
	return binaryToText(binaryStr);
}

const ZeroWidthWatermark: React.FC = () => {
	const [originalText, setOriginalText] = useState<string>('公司机密文档，严禁外传！');
	const [secret, setSecret] = useState<string>('User_9527');
	const [watermarkText, setWatermarkText] = useState<string>('');
	const [decodedText, setDecodedText] = useState<string>('');
	const [copyStatus, setCopyStatus] = useState<string>('');

	// 编码水印
	const handleEncode = useCallback(() => {
		const result = encodeWatermark(originalText, secret);
		setWatermarkText(result);
		setCopyStatus('');
	}, [originalText, secret]);

	// 解码水印
	const handleDecode = useCallback(() => {
		const result = decodeWatermark(watermarkText);
		setDecodedText(result);
	}, [watermarkText]);

	// 复制带水印的文本
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(watermarkText);
			setCopyStatus('复制成功！');
			setTimeout(() => setCopyStatus(''), 2000);
		} catch (err) {
			setCopyStatus('复制失败！');
			setTimeout(() => setCopyStatus(''), 2000);
		}
	}, [watermarkText]);

	// 组件挂载时生成一次示例
	React.useEffect(() => {
		handleEncode();
	}, []);

	return (
		<div className="zero-width-watermark-demo">
			<h2 className="zero-width-watermark-title">零宽字符隐形水印演示</h2>

			<div className="zero-width-watermark-section">
				<h3>编码区域</h3>
				<div className="zero-width-watermark-form">
					<div className="form-group">
						<label>原始文本:</label>
						<textarea
							value={originalText}
							onChange={e => setOriginalText(e.target.value)}
							rows={3}
							placeholder="请输入原始文本"
						/>
					</div>

					<div className="form-group">
						<label>隐藏信息:</label>
						<input
							type="text"
							value={secret}
							onChange={e => setSecret(e.target.value)}
							placeholder="请输入要隐藏的信息"
						/>
					</div>

					<button onClick={handleEncode} className="encode-btn">
						生成带水印文本
					</button>
				</div>

				<div className="result-section">
					<h4>带水印文本:</h4>
					<div className="watermark-text-display">
						{watermarkText || '点击"生成带水印文本"按钮生成'}
					</div>
					<button onClick={handleCopy} className="copy-btn" disabled={!watermarkText}>
						复制文本
					</button>
					{copyStatus && <span className="copy-status">{copyStatus}</span>}
				</div>
			</div>

			<div className="zero-width-watermark-section">
				<h3>解码区域</h3>
				<div className="decode-section">
					<div className="form-group">
						<label>待解码文本:</label>
						<textarea
							value={watermarkText}
							onChange={e => setWatermarkText(e.target.value)}
							rows={3}
							placeholder="请输入包含水印的文本"
						/>
					</div>

					<button onClick={handleDecode} className="decode-btn" disabled={!watermarkText}>
						提取隐藏信息
					</button>

					<div className="decoded-result">
						<h4>解码结果:</h4>
						<div className="decoded-text">{decodedText || '点击"提取隐藏信息"按钮查看结果'}</div>
					</div>
				</div>
			</div>

			<div className="zero-width-watermark-info">
				<h3>技术说明</h3>
				<div className="info-content">
					<p>零宽字符隐形水印利用 Unicode 中的零宽字符（\u200b 和 \u200c）来隐藏信息。</p>
					<p>这些字符在文本中不可见，但会随着文本一起被复制，从而实现信息的隐蔽传播。</p>
					<p>当怀疑文档泄露时，可通过解码功能提取隐藏的用户信息，追踪泄露源头。</p>
				</div>
			</div>
		</div>
	);
};

export default ZeroWidthWatermark;
