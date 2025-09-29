import React, { useState } from 'react';
import ScrollText from './index';

const ScrollTextExample: React.FC = () => {
	const [text, setText] = useState(
		'这是一段很长的文本，用于演示大屏文字滚动组件的效果。当文本超出容器宽度时，组件会自动开始滚动，并且实现无缝衔接滚动效果。'
	);
	const [speed, setSpeed] = useState(10);
	const [pauseOnHover, setPauseOnHover] = useState(true);

	return (
		<div className="scroll-text-demo">
			<h3>大屏文字滚动组件示例</h3>

			{/* 参数控制面板 */}
			<div className="control-panel">
				<div className="control-item">
					<label>
						滚动文本:
						<input
							type="text"
							value={text}
							onChange={e => setText(e.target.value)}
							style={{ width: '400px', marginLeft: '10px' }}
						/>
					</label>
				</div>

				<div className="control-item">
					<label>
						滚动速度 (秒):
						<input
							type="range"
							min="1"
							max="30"
							value={speed}
							onChange={e => setSpeed(Number(e.target.value))}
							style={{ marginLeft: '10px', marginRight: '10px' }}
						/>
						{speed}秒
					</label>
				</div>

				<div className="control-item">
					<label>
						鼠标悬停暂停:
						<input
							type="checkbox"
							checked={pauseOnHover}
							onChange={e => setPauseOnHover(e.target.checked)}
							style={{ marginLeft: '10px' }}
						/>
					</label>
				</div>
			</div>

			{/* 组件演示 */}
			<div className="demo-container">
				<h4>组件效果演示：</h4>
				<ScrollText speed={speed} pauseOnHover={pauseOnHover}>
					{text}
				</ScrollText>
			</div>

			{/* 短文本示例 */}
			<div className="demo-container">
				<h4>短文本（不滚动）示例：</h4>
				<ScrollText>短文本示例</ScrollText>
			</div>
		</div>
	);
};

export default ScrollTextExample;
