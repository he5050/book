import React from 'react';
import './index.scss';

interface FlipCard3DProps {
	frontTitle?: string;
	frontContent?: string;
	backTitle?: string;
	backContent?: string;
}

const FlipCard3D: React.FC<FlipCard3DProps> = ({
	frontTitle = '前',
	frontContent = '鼠标移入',
	backTitle = '后',
	backContent = '鼠标移出'
}) => {
	return (
		<div className="flip-card-3d">
			<div className="myCard">
				<div className="innerCard">
					<div className="frontSide">
						<p className="title">{frontTitle}</p>
						<p>{frontContent}</p>
					</div>
					<div className="backSide">
						<p className="title">{backTitle}</p>
						<p>{backContent}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FlipCard3D;
