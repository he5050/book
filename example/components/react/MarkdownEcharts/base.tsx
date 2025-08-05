import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight, materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button, Popover, Space } from 'antd';
import { CopyOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// 代码块组件
function CodeBlock({ code, language = '' }) {
	const [isDarkTheme, setIsDarkTheme] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div style={{ position: 'relative', margin: '16px 0' }}>
			<div
				style={{
					position: 'absolute',
					right: 8,
					top: 8,
					zIndex: 1,
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					borderRadius: 4,
					padding: 4
				}}
			>
				<Space>
					<Button
						type="text"
						size="small"
						icon={isDarkTheme ? <BulbFilled /> : <BulbOutlined />}
						onClick={() => setIsDarkTheme(!isDarkTheme)}
					/>
					<Popover open={copied} content="已复制！" trigger={[]}>
						<CopyToClipboard text={code} onCopy={handleCopy}>
							<Button type="text" size="small" icon={<CopyOutlined />} />
						</CopyToClipboard>
					</Popover>
				</Space>
			</div>

			<SyntaxHighlighter
				language={language.toLowerCase()}
				style={isDarkTheme ? materialOceanic : materialLight}
				customStyle={{
					padding: '40px 20px 20px',
					borderRadius: 8,
					fontSize: 14,
					overflowX: 'auto'
				}}
				PreTag="div"
			>
				{code.trim()}
			</SyntaxHighlighter>
		</div>
	);
}

// Markdown 渲染器组件
export default function MarkdownCodeBlock({ content }) {
	const components = {
		code({ node, inline, className, children, ...props }) {
			const match = /language-(\w+)/.exec(className || '');
			return !inline && match ? (
				<CodeBlock code={String(children).replace(/\n$/, '')} language={match[1]} />
			) : (
				<code className={className} {...props}>
					{children}
				</code>
			);
		}
	};

	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
			{content}
		</ReactMarkdown>
	);
}
