import React, { useState, useRef, useEffect } from 'react';
import PromptTemplate, { PromptTemplateHandles } from './index';
import type { CustomElement } from './types';

const PromptTemplateExample: React.FC = () => {
	const promptTemplateRef = useRef<PromptTemplateHandles>(null);
	const [output, setOutput] = useState('');

	// 预设模板示例
	const templates: { name: string; content: CustomElement[] }[] = [
		{
			name: '文章写作',
			content: [
				{
					type: 'paragraph',
					children: [
						{ text: '请帮我写一篇关于' },
						{ type: 'input-tag', children: [{ text: '' }], label: '[主题]' },
						{ text: '的' },
						{
							type: 'select-tag',
							children: [{ text: '' }],
							value: '文章',
							options: [
								{ label: '文章', value: '文章' },
								{ label: '论文', value: '论文' },
								{ label: '报告', value: '报告' }
							]
						},
						{ text: '，要求字数在' },
						{ type: 'input-tag', children: [{ text: '1000' }], label: '[字数]' },
						{ text: '字左右。' }
					]
				}
			]
		},
		{
			name: '代码解释',
			content: [
				{
					type: 'paragraph',
					children: [
						{ text: '请解释以下' },
						{
							type: 'select-tag',
							children: [{ text: '' }],
							value: 'JavaScript',
							options: [
								{ label: 'JavaScript', value: 'JavaScript' },
								{ label: 'Python', value: 'Python' },
								{ label: 'Java', value: 'Java' }
							]
						},
						{ text: '代码的作用：' },
						{
							type: 'input-tag',
							children: [{ text: 'console.log("Hello World")' }],
							label: '[代码]'
						}
					]
				}
			]
		}
	];

	// 默认模板（用于初始化）
	const defaultTemplate: CustomElement[] = [
		{
			type: 'paragraph',
			children: [
				{ text: '请帮我写一篇关于' },
				{ type: 'input-tag', children: [{ text: '人工智能' }], label: '[主题]' },
				{ text: '的' },
				{
					type: 'select-tag',
					children: [{ text: '' }],
					value: '文章',
					options: [
						{ label: '文章', value: '文章' },
						{ label: '论文', value: '论文' },
						{ label: '报告', value: '报告' }
					]
				},
				{ text: '，要求字数在' },
				{ type: 'input-tag', children: [{ text: '1500' }], label: '[字数]' },
				{ text: '字左右。' }
			]
		}
	];

	// 应用模板
	const applyTemplate = (template: { content: CustomElement[] }) => {
		promptTemplateRef.current?.setContent(template.content);
	};

	// 获取内容
	const handleGetContent = () => {
		const content = promptTemplateRef.current?.getContent();
		setOutput(content || '');
	};

	// 组件挂载时设置默认内容
	useEffect(() => {
		if (promptTemplateRef.current) {
			promptTemplateRef.current.setContent(defaultTemplate);
		}
	}, []);

	return (
		<div style={{ padding: '20px' }}>
			<h2>豆包Prompt变量模板输入框示例</h2>

			<div style={{ marginBottom: '20px' }}>
				<h3>选择模板：</h3>
				<div style={{ marginBottom: '10px' }}>
					{templates.map((template, index) => (
						<button
							key={index}
							onClick={() => applyTemplate(template)}
							style={{
								marginRight: '10px',
								padding: '8px 16px',
								backgroundColor: '#f0f0f0',
								border: '1px solid #ddd',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
						>
							{template.name}
						</button>
					))}
				</div>
				<button
					onClick={handleGetContent}
					style={{
						padding: '8px 16px',
						backgroundColor: '#409eff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					获取内容
				</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<PromptTemplate ref={promptTemplateRef} placeholder="请输入Prompt模板..." />
			</div>

			{output && (
				<div>
					<h3>输出内容：</h3>
					<div
						style={{
							padding: '10px',
							backgroundColor: '#f5f5f5',
							border: '1px solid #ddd',
							borderRadius: '4px',
							whiteSpace: 'pre-wrap'
						}}
					>
						{output}
					</div>
				</div>
			)}
		</div>
	);
};

export default PromptTemplateExample;
