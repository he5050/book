import React from 'react';
import FloatingDotsAnimation from './index';

const FloatingDotsAnimationExample: React.FC = () => {
	return (
		<div>
			<h2>动态圆形点动画效果</h2>
			<p>
				这是一个包含多个动态移动的圆形点的动画效果。每个点都有自己的动画，它们在容器内上下移动，并在移动过程中改变色相。
			</p>
			<FloatingDotsAnimation />
		</div>
	);
};

export default FloatingDotsAnimationExample;
