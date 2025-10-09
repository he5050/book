import React, { useState } from 'react';
import PinyinConverter, { getTheFirstLetterForPinyin } from './index';

const PinyinConverterExample: React.FC = () => {
	const [text, setText] = useState('你好世界');
	const [mode, setMode] = useState<'initial' | 'full' | 'tone' | 'annotated'>('initial');
	const [library, setLibrary] = useState<'localeCompare' | 'pinyin-pro' | 'pinyinjs'>('pinyin-pro');
	const [useUpperCase, setUseUpperCase] = useState(false);
	const [showAnnotated, setShowAnnotated] = useState(false);

	return (
		<div
			className="pinyin-converter-demo"
			style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}
		>
			<h3>拼音转换组件示例</h3>

			<div
				style={{
					marginBottom: '15px',
					padding: '10px',
					backgroundColor: '#fff3cd',
					border: '1px solid #ffeaa7',
					borderRadius: '4px'
				}}
			>
				<strong>注意：</strong>如果使用 pinyinjs 库出现 "__dirname is not defined"
				错误，这是因为该库依赖 Node.js 环境。建议优先使用 pinyin-pro 库。
			</div>

			{/* 参数控制面板 */}
			<div
				className="control-panel"
				style={{
					marginBottom: '20px',
					padding: '15px',
					backgroundColor: '#f5f5f5',
					borderRadius: '5px'
				}}
			>
				<div className="control-item" style={{ marginBottom: '10px' }}>
					<label>
						输入文本:
						<input
							type="text"
							value={text}
							onChange={e => setText(e.target.value)}
							style={{ width: '400px', marginLeft: '10px', padding: '5px' }}
						/>
					</label>
				</div>

				<div className="control-item" style={{ marginBottom: '10px' }}>
					<label>
						转换模式:
						<select
							value={mode}
							onChange={e => setMode(e.target.value as any)}
							style={{ marginLeft: '10px', padding: '5px' }}
						>
							<option value="initial">拼音首字母</option>
							<option value="full">完整拼音</option>
							<option value="tone">带音调拼音</option>
							<option value="annotated">注音显示</option>
						</select>
					</label>
				</div>

				<div className="control-item" style={{ marginBottom: '10px' }}>
					<label>
						使用库:
						<select
							value={library}
							onChange={e => setLibrary(e.target.value as any)}
							style={{ marginLeft: '10px', padding: '5px' }}
						>
							<option value="localeCompare">localeCompare</option>
							<option value="pinyin-pro">pinyin-pro</option>
							<option value="pinyinjs">pinyinjs</option>
						</select>
					</label>
				</div>

				<div className="control-item" style={{ marginBottom: '10px' }}>
					<label>
						大写输出:
						<input
							type="checkbox"
							checked={useUpperCase}
							onChange={e => setUseUpperCase(e.target.checked)}
							style={{ marginLeft: '10px', verticalAlign: 'middle' }}
						/>
					</label>
				</div>

				<div className="control-item">
					<label>
						注音显示:
						<input
							type="checkbox"
							checked={showAnnotated}
							onChange={e => setShowAnnotated(e.target.checked)}
							style={{ marginLeft: '10px', verticalAlign: 'middle' }}
						/>
					</label>
				</div>
			</div>

			{/* 组件演示 */}
			<div className="demo-container" style={{ marginBottom: '20px' }}>
				<h4>转换结果：</h4>
				<PinyinConverter
					text={text}
					mode={mode}
					library={library}
					useUpperCase={useUpperCase}
					showAnnotated={showAnnotated}
				/>
			</div>

			{/* localeCompare 方式单独演示 */}
			<div className="demo-container">
				<h4>localeCompare 方式演示（获取拼音首字母）：</h4>
				<div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
					{text.split('').map((char, index) => (
						<span key={index} style={{ marginRight: '10px' }}>
							{char}: {getTheFirstLetterForPinyin(char, useUpperCase)}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default PinyinConverterExample;
