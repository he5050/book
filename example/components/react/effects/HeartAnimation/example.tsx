import React from 'react';
import HeartAnimation from './index';

const HeartAnimationExample: React.FC = () => {
	return (
		<div style={{ height: '100vh' }}>
			<HeartAnimation particleCount={500} duration={3} velocity={100} size={35} color="#FF69B4" />
		</div>
	);
};

export default HeartAnimationExample;
