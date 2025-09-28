import React from 'react';
import WaveAnimation from './components/WaveAnimation';

const WaveAnimationExample = () => {
	return (
		<div>
			<h1>水波动画示例</h1>
			<p>这是一个可自定义参数的水波动画效果组件，可以调整颜色、波浪数量、动画速度等参数。</p>
			<WaveAnimation />
		</div>
	);
};

export default WaveAnimationExample;
