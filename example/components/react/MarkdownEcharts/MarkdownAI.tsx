import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button, Space, Popover, message } from 'antd';
import { CopyOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight, materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as echarts from 'echarts';
import 'github-markdown-css';

// 根据类型和数据生成 ECharts 配置
const generateOptionByTypeAndData = (type: string, data: any): echarts.EChartsOption => {
	switch (type) {
		case 'line':
			return {
				title: { text: data.title || '折线图', left: 'center' },
				tooltip: { trigger: 'axis' },
				xAxis: { type: 'category', data: data.xData || [] },
				yAxis: { type: 'value' },
				series: [
					{
						type: 'line',
						data: data.yData || [],
						smooth: true,
						itemStyle: { color: data.color || '#5470c6' }
					}
				]
			};
		case 'bar':
			return {
				title: { text: data.title || '柱状图', left: 'center' },
				tooltip: { trigger: 'axis' },
				xAxis: { type: 'category', data: data.xData || [] },
				yAxis: { type: 'value' },
				series: [
					{
						type: 'bar',
						data: data.yData || [],
						itemStyle: { color: data.color || '#91cc75' }
					}
				]
			};
		case 'pie':
			return {
				title: { text: data.title || '饼图', left: 'center' },
				tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
				series: [
					{
						name: data.name || '数据',
						type: 'pie',
						radius: '50%',
						data: data.data || [],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			};
		default:
			return {};
	}
};

// 获取默认配置
const getDefaultOption = (
	id: string,
	defaultChartOptions?: {
		line?: echarts.EChartsOption;
		bar?: echarts.EChartsOption;
		pie?: echarts.EChartsOption;
	}
): echarts.EChartsOption => {
	// 优先使用外部传入的默认配置
	if (defaultChartOptions) {
		if ((id.includes('line') || id.includes('1')) && defaultChartOptions.line) {
			return defaultChartOptions.line;
		}
		if ((id.includes('bar') || id.includes('2')) && defaultChartOptions.bar) {
			return defaultChartOptions.bar;
		}
		if ((id.includes('pie') || id.includes('3')) && defaultChartOptions.pie) {
			return defaultChartOptions.pie;
		}
	}

	// 返回空的占位图表
	return getEmptyChartOption(id);
};

// ECharts 配置类型定义
interface ChartConfig {
	id: string;
	type?: 'line' | 'bar' | 'pie' | 'custom';
	option?: echarts.EChartsOption;
	data?: any;
}

interface MarkdownAIProps {
	content: string;
	className?: string;
	// 新增：ECharts 配置
	chartConfigs?: ChartConfig[];
	// 新增：默认图表配置
	defaultChartOptions?: {
		line?: echarts.EChartsOption;
		bar?: echarts.EChartsOption;
		pie?: echarts.EChartsOption;
	};
}

// ECharts 容器组件
const EChartsContainer: React.FC<{
	id: string;
	style?: React.CSSProperties;
	chartConfigs?: ChartConfig[];
	defaultChartOptions?: {
		line?: echarts.EChartsOption;
		bar?: echarts.EChartsOption;
		pie?: echarts.EChartsOption;
	};
}> = ({ id, style, chartConfigs, defaultChartOptions }) => {
	const chartRef = useRef<echarts.ECharts | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// 调试信息
		console.log('EChartsContainer useEffect 触发, ID:', id);
		console.log('containerRef.current:', containerRef.current);
		console.log('chartRef.current:', chartRef.current);

		// 使用 ref 而不是 getElementById，确保能找到元素
		if (containerRef.current && !chartRef.current) {
			console.log('开始初始化 ECharts 实例, ID:', id);
			// 初始化 ECharts 实例
			chartRef.current = echarts.init(containerRef.current);

			// 查找外部传入的配置
			const externalConfig = chartConfigs?.find(config => config.id === id);
			let option: echarts.EChartsOption = {};

			if (externalConfig) {
				// 使用外部传入的配置
				console.log('使用外部配置, ID:', id, 'config:', externalConfig);
				if (externalConfig.option) {
					option = externalConfig.option;
				} else if (externalConfig.type && externalConfig.data) {
					// 根据类型和数据生成配置
					option = generateOptionByTypeAndData(externalConfig.type, externalConfig.data);
				}
			} else {
				// 使用默认配置或内置配置
				option = getDefaultOption(id, defaultChartOptions);
			}

			// 设置图表配置
			console.log('设置图表配置, ID:', id, 'option:', option);
			chartRef.current.setOption(option);
			console.log('图表配置设置完成, ID:', id);

			// 监听窗口大小变化
			const handleResize = () => {
				chartRef.current?.resize();
			};
			window.addEventListener('resize', handleResize);

			// 清理函数
			return () => {
				window.removeEventListener('resize', handleResize);
				if (chartRef.current) {
					chartRef.current.dispose();
					chartRef.current = null;
				}
			};
		}
	}, [id, chartConfigs, defaultChartOptions]);

	return (
		<div
			ref={containerRef}
			style={{
				width: '100%',
				height: '400px',
				margin: '16px 0',
				border: '1px solid #e1e5e9',
				borderRadius: '8px',
				backgroundColor: '#fff',
				...style
			}}
		/>
	);
};

// 空的占位图表配置
const getEmptyChartOption = (id: string): echarts.EChartsOption => {
	const chartType =
		id.includes('line') || id.includes('1')
			? '折线图'
			: id.includes('bar') || id.includes('2')
			? '柱状图'
			: id.includes('pie') || id.includes('3')
			? '饼图'
			: '图表';

	return {
		title: {
			text: `${chartType}容器`,
			subtext: '请通过 chartConfigs 或 defaultChartOptions 传入数据',
			left: 'center',
			top: 'middle',
			textStyle: {
				color: '#999',
				fontSize: 16
			},
			subtextStyle: {
				color: '#ccc',
				fontSize: 12
			}
		},
		graphic: {
			type: 'text',
			left: 'center',
			top: '60%',
			style: {
				text: '暂无数据',
				fontSize: 14,
				fill: '#ccc'
			}
		}
	};
};

// 代码块组件 - 基于 base.tsx 的实现
function CodeBlock({ code, language = '' }: { code: string; language?: string }) {
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

// 消除多余空白的插件
const removeExtraWhitespace = () => {
	return (tree: any) => {
		const removeWhitespace = (node: any) => {
			// 保持 pre 标签内的空白
			if (node.tagName === 'pre') {
				return;
			}

			if (node.type === 'text') {
				// 将多个空白字符替换为单个空格
				node.value = node.value.replace(/\s+/g, ' ');
			}

			if (node.children) {
				node.children = node.children.filter((child: any) => {
					if (child.type === 'text') {
						// 移除空白文本节点
						return child.value.trim() !== '';
					}
					removeWhitespace(child);
					return true;
				});
			}
		};

		removeWhitespace(tree);
		return tree;
	};
};

// 处理引用标记的函数
const replaceReferences = (str: string): string => {
	// 定义正则表达式匹配 [[数字,'描述']] 格式
	const regex = /\[\[(\d+),'(.*?)'\]\]/g;

	// 使用 replace 方法进行全局替换
	return str.replace(regex, (match, num, id) => {
		return `<sup className="text-blue-600 cursor-pointer" data-supid="${id}">[${num}]</sup>`;
	});
};

const MarkdownAI: React.FC<MarkdownAIProps> = ({
	content,
	className = '',
	chartConfigs,
	defaultChartOptions
}) => {
	// 处理引用标记
	const processedContent = replaceReferences(content);

	// 点击引用标记的处理函数
	const handleSupClick = (event: React.MouseEvent<HTMLElement>) => {
		const target = event.target as HTMLElement;
		const supid = target.dataset.supid;
		if (supid) {
			console.log('Clicked sup data-supid:', supid);
			message.info(`点击了引用: ${supid}`);
		}
	};
	// 自定义组件渲染器
	const components = {
		// 代码块处理 - 参考 base.tsx 的实现
		code({ node, inline, className, children, ...props }: any) {
			const match = /language-(\w+)/.exec(className || '');
			return !inline && match ? (
				<CodeBlock code={String(children).replace(/\n$/, '')} language={match[1]} />
			) : (
				<code className={className} {...props}>
					{children}
				</code>
			);
		},
		// 自定义表格样式
		table: ({ children, ...props }: any) => (
			<div style={{ overflowX: 'auto', margin: '16px 0' }}>
				<table
					{...props}
					style={{
						width: '100%',
						borderCollapse: 'collapse',
						border: '1px solid #e1e5e9'
					}}
				>
					{children}
				</table>
			</div>
		),
		// 自定义表头样式
		th: ({ children, ...props }: any) => (
			<th
				{...props}
				style={{
					padding: '12px',
					backgroundColor: '#f6f8fa',
					border: '1px solid #e1e5e9',
					fontWeight: 600,
					textAlign: 'left'
				}}
			>
				{children}
			</th>
		),
		// 自定义表格单元格样式
		td: ({ children, ...props }: any) => (
			<td
				{...props}
				style={{
					padding: '12px',
					border: '1px solid #e1e5e9'
				}}
			>
				{children}
			</td>
		),
		// 自定义链接样式
		a: ({ children, href, ...props }: any) => (
			<a
				{...props}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				style={{
					color: '#0969da',
					textDecoration: 'none'
				}}
				onMouseEnter={e => {
					e.currentTarget.style.textDecoration = 'underline';
				}}
				onMouseLeave={e => {
					e.currentTarget.style.textDecoration = 'none';
				}}
			>
				{children}
			</a>
		),
		// 自定义列表样式
		ul: ({ children, ...props }: any) => (
			<ul
				{...props}
				style={{
					paddingLeft: '20px',
					margin: '16px 0'
				}}
			>
				{children}
			</ul>
		),
		ol: ({ children, ...props }: any) => (
			<ol
				{...props}
				style={{
					paddingLeft: '20px',
					margin: '16px 0'
				}}
			>
				{children}
			</ol>
		),
		// 自定义引用样式
		blockquote: ({ children, ...props }: any) => (
			<blockquote
				{...props}
				style={{
					borderLeft: '4px solid #d1d9e0',
					paddingLeft: '16px',
					margin: '16px 0',
					color: '#656d76',
					fontStyle: 'italic'
				}}
			>
				{children}
			</blockquote>
		),
		// 自定义上标处理（引用标记）
		sup: ({ children, ...props }: any) => (
			<sup
				{...props}
				className="text-blue-600 cursor-pointer hover:text-blue-800"
				onClick={handleSupClick}
				style={{
					color: '#0969da',
					cursor: 'pointer',
					textDecoration: 'none'
				}}
				onMouseEnter={e => {
					e.currentTarget.style.textDecoration = 'underline';
				}}
				onMouseLeave={e => {
					e.currentTarget.style.textDecoration = 'none';
				}}
			>
				{children}
			</sup>
		),
		// 自定义 div 处理（支持 ECharts 容器）
		div: ({ children, id, style, ...props }: any) => {
			// 检查是否是 ECharts 容器
			if (id && id.includes('echarts-container')) {
				return (
					<EChartsContainer
						key={id}
						id={id}
						style={style}
						chartConfigs={chartConfigs}
						defaultChartOptions={defaultChartOptions}
					/>
				);
			}

			// 普通 div
			return (
				<div {...props} id={id} style={style}>
					{children}
				</div>
			);
		}
	};

	return (
		<div
			className={`markdown-body ${className}`}
			style={{
				padding: '20px',
				lineHeight: '1.6',
				fontSize: '14px'
			}}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw, removeExtraWhitespace]}
				components={components}
			>
				{processedContent}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownAI;
export type { ChartConfig, MarkdownAIProps };
