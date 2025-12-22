import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface StreamingMarkdownProps {
	content: string;
	isStreaming?: boolean;
	typingSpeed?: number;
	theme?: 'light' | 'dark';
	onContentChange?: (content: string) => void;
}

const StreamingMarkdownComparison: React.FC<StreamingMarkdownProps> = ({
	content = '',
	isStreaming = false,
	typingSpeed = 30,
	theme = 'light',
	onContentChange
}) => {
	// 状态管理
	const [displayedContent, setDisplayedContent] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [selectedLibrary, setSelectedLibrary] = useState('quarkdown');

	// 引用管理
	const contentRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// 核心逻辑实现
	const simulateStreaming = () => {
		if (currentIndex < content.length) {
			setDisplayedContent(prev => prev + content.charAt(currentIndex));
			setCurrentIndex(prev => prev + 1);
			onContentChange?.(displayedContent + content.charAt(currentIndex));
		} else {
			stopStreaming();
		}
	};

	const startStreaming = () => {
		if (!isStreaming) return;
		setIsPlaying(true);
		timerRef.current = setInterval(simulateStreaming, typingSpeed);
	};

	const stopStreaming = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setIsPlaying(false);
	};

	const resetStreaming = () => {
		stopStreaming();
		setDisplayedContent('');
		setCurrentIndex(0);
	};

	const togglePlayPause = () => {
		if (isPlaying) {
			stopStreaming();
		} else {
			startStreaming();
		}
	};

	// 生命周期管理
	useEffect(() => {
		if (isStreaming && content) {
			startStreaming();
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isStreaming, content, typingSpeed]);

	// 内容更新时重置流式播放
	useEffect(() => {
		if (!isStreaming) {
			setDisplayedContent(content);
		} else {
			resetStreaming();
			startStreaming();
		}
	}, [content, isStreaming]);

	// 主题处理
	const getThemeClass = () => {
		return theme === 'dark' ? 'streaming-markdown-dark' : 'streaming-markdown-light';
	};

	// 库选择处理
	const handleLibraryChange = (library: string) => {
		setSelectedLibrary(library);
	};

	return (
		<div className={`streaming-markdown-container ${getThemeClass()}`}>
			<div className="controls">
				<div className="library-selector">
					<label>选择渲染库:</label>
					<select
						value={selectedLibrary}
						onChange={e => handleLibraryChange(e.target.value)}
						disabled={isStreaming}
					>
						<option value="quarkdown">Quarkdown</option>
						<option value="incremark">Incremark</option>
						<option value="ant-design-x">ant-design-x</option>
						<option value="markstream-vue">markstream-vue</option>
					</select>
				</div>

				{isStreaming && (
					<div className="stream-controls">
						<button onClick={togglePlayPause}>{isPlaying ? '暂停' : '播放'}</button>
						<button onClick={resetStreaming}>重置</button>
						<div className="speed-control">
							<label>速度:</label>
							<input
								type="range"
								min="10"
								max="100"
								value={typingSpeed}
								onChange={e => onContentChange?.(e.target.value)}
							/>
							<span>{typingSpeed}ms/字符</span>
						</div>
					</div>
				)}
			</div>

			<div className="content-display">
				<div
					ref={contentRef}
					className="markdown-content"
					dangerouslySetInnerHTML={{ __html: displayedContent }}
				/>
			</div>

			<div className="library-info">
				<h3>{selectedLibrary} 特点:</h3>
				{selectedLibrary === 'quarkdown' && (
					<ul>
						<li>扩展的 Markdown 语法，支持函数和变量</li>
						<li>多种输出格式支持（HTML、PDF）</li>
						<li>内置主题系统和实时预览</li>
						<li>适合复杂文档和书籍制作</li>
					</ul>
				)}
				{selectedLibrary === 'incremark' && (
					<ul>
						<li>增量解析，只处理新增内容</li>
						<li>高性能，减少 CPU 消耗</li>
						<li>支持 AST 节点层动画</li>
						<li>同时支持 Vue 和 React</li>
					</ul>
				)}
				{selectedLibrary === 'ant-design-x' && (
					<ul>
						<li>专为 AI 聊天界面设计</li>
						<li>全量解析但优化了动画效果</li>
						<li>与 Ant Design 深度集成</li>
						<li>支持特殊块如 thinking</li>
					</ul>
				)}
				{selectedLibrary === 'markstream-vue' && (
					<ul>
						<li>Vue 专用流式渲染库</li>
						<li>支持 Mermaid 图表渐进渲染</li>
						<li>虚拟化处理大文档</li>
						<li>批处理渲染优化性能</li>
					</ul>
				)}
			</div>
		</div>
	);
};

export default StreamingMarkdownComparison;
