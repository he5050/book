import React, { useState, useMemo, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Editor, Text, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import type { CustomElement, CustomText } from './types';
import InputTag from './InputTag';
import SelectTag from './SelectTag';

interface PromptTemplateProps {
	placeholder?: string;
	initialValue?: CustomElement[];
}

export interface PromptTemplateHandles {
	getContent: () => string;
	setContent: (value: CustomElement | CustomElement[]) => void;
}

const PromptTemplate = forwardRef<PromptTemplateHandles, PromptTemplateProps>(
	({ placeholder = '请输入Prompt模板', initialValue }, ref) => {
		// 初始化编辑器
		const editor = useMemo(() => withHistory(withReact(createEditor())), []);

		// 默认内容
		const defaultContent: CustomElement[] = [
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

		// 初始值
		const initialContent = initialValue || defaultContent;

		// 内联元素定义
		const withInlines = (editor: any) => {
			const { isInline } = editor;

			editor.isInline = (element: CustomElement) => {
				return ['select-tag', 'input-tag'].includes(element.type) || isInline(element);
			};

			return editor;
		};

		// 渲染元素
		const renderElement = useCallback(({ attributes, children, element }: any) => {
			switch (element.type) {
				case 'input-tag':
					return <InputTag {...attributes} element={element} children={children} />;
				case 'select-tag':
					return <SelectTag {...attributes} element={element} children={children} />;
				default:
					return (
						<p {...attributes} className="slate-paragraph">
							{children}
						</p>
					);
			}
		}, []);

		// 渲染占位符
		const renderPlaceholder = useCallback(() => {
			return <div className="slate-placeholder">{placeholder}</div>;
		}, [placeholder]);

		// 渲染叶子节点
		const renderLeaf = useCallback(({ attributes, children, leaf }: any) => {
			return (
				<span
					{...attributes}
					style={{
						paddingLeft: leaf.text === '' ? '0.1px' : ''
					}}
				>
					{children}
				</span>
			);
		}, []);

		// 内容序列化
		const serializeToPlainText = (nodes: any[]): string => {
			return nodes
				.map(node => {
					if (Text.isText(node)) {
						return node.text;
					}

					const children = serializeToPlainText(node.children);

					switch (node.type) {
						case 'input-tag':
							return children || node.label || '';
						case 'select-tag':
							return node.value || '';
						case 'paragraph':
							return children + '\n\n';
						default:
							return children;
					}
				})
				.join('');
		};

		// 获取内容
		const getContent = () => {
			return serializeToPlainText(editor.children);
		};

		// 设置内容
		const setContent = (value: CustomElement | CustomElement[]) => {
			const content = Array.isArray(value) ? value : [value];

			Editor.withoutNormalizing(editor, () => {
				// 清空现有内容
				for (let i = editor.children.length - 1; i >= 0; i--) {
					Transforms.removeNodes(editor, { at: [i] });
				}

				// 插入新内容
				Transforms.insertNodes(editor, content);
			});

			// 重置选择位置到开头
			const startPoint = Editor.start(editor, [0, 0]);
			Transforms.select(editor, {
				anchor: startPoint,
				focus: startPoint
			});
		};

		// 通过 ref 暴露方法
		useImperativeHandle(ref, () => ({
			getContent,
			setContent
		}));

		return (
			<div className="prompt-template-container">
				<Slate
					editor={withInlines(editor) as any}
					initialValue={initialContent}
					onChange={value => {}}
				>
					<Editable
						className="prompt-template-editor"
						placeholder={placeholder}
						renderElement={renderElement}
						renderPlaceholder={renderPlaceholder}
						renderLeaf={renderLeaf}
					/>
				</Slate>
			</div>
		);
	}
);

export default PromptTemplate;
