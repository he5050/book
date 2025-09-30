import * as React from 'react';
import './index.scss';

interface CardFlip3DProps {
	frontIcon?: string;
	frontTitle?: string;
	frontContent?: string;
	backTitle?: string;
	backContent?: string;
}

const CardFlip3D: React.FC<CardFlip3DProps> = ({
	frontIcon = '💡',
	frontTitle = '创意设计',
	frontContent = '探索无限创意可能性',
	backTitle = '创意解决方案',
	backContent = '我们提供独特的设计思路和创意解决方案，帮助您的项目脱颖而出。'
}) => {
	return (
		<div className="card-flip-3d">
			<div className="card">
				<div className="card-inner">
					<div className="card-face card-front shine-effect">
						<div className="card-icon">{frontIcon}</div>
						<div className="card-title">{frontTitle}</div>
						<div className="card-content">{frontContent}</div>
					</div>
					<div className="card-face card-back">
						<div className="card-title">{backTitle}</div>
						<div className="card-content">{backContent}</div>
						<button className="card-button">了解更多</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardFlip3D;
