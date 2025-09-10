import React, { useState, useRef } from 'react';
import SizeTransition, { SizeTransitionHandles } from './index';

const SizeTransitionExample: React.FC = () => {
	const [showContent, setShowContent] = useState(true);
	const sizeTransitionRef = useRef<SizeTransitionHandles>(null);

	const toggleContent = () => {
		setShowContent(!showContent);
	};

	const handleExpand = () => {
		sizeTransitionRef.current?.expand();
	};

	const handleContract = () => {
		sizeTransitionRef.current?.contract();
	};

	const handleToggle = () => {
		sizeTransitionRef.current?.toggle();
	};

	return (
		<div style={{ padding: '20px' }}>
			<h2>不固定高度 div 过渡效果示例</h2>

			<div style={{ marginBottom: '20px' }}>
				<button onClick={toggleContent} style={{ marginRight: '10px' }}>
					{showContent ? '收起内容' : '展开内容'}
				</button>
				<button onClick={handleExpand} style={{ marginRight: '10px' }}>
					展开
				</button>
				<button onClick={handleContract} style={{ marginRight: '10px' }}>
					收起
				</button>
				<button onClick={handleToggle}>切换</button>
			</div>

			<SizeTransition ref={sizeTransitionRef} minHeight={0} initState={showContent}>
				<div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
					<h3>这是可变高度的内容区域</h3>
					<p>这段内容的高度是不固定的，会根据内容的多少自动调整。</p>
					{showContent && (
						<>
							<p>当我们点击按钮时，这个区域会有一个平滑的高度过渡动画效果。</p>
							<p>这比直接显示/隐藏要友好得多，提升了用户体验。</p>
							<ul>
								<li>列表项 1</li>
								<li>列表项 2</li>
								<li>列表项 3</li>
								<li>列表项 4</li>
								<li>列表项 5</li>
							</ul>
							<p>
								通过使用 ResizeObserver API，我们可以监听元素尺寸的变化，从而实现流畅的过渡动画。
							</p>
						</>
					)}
				</div>
			</SizeTransition>
		</div>
	);
};

export default SizeTransitionExample;
