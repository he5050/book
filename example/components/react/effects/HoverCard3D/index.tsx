import * as React from 'react';
import './index.scss';

interface HoverCard3DProps {
	icon?: string;
	title?: string;
	content?: string;
}

const HoverCard3D: React.FC<HoverCard3DProps> = ({
	icon = 'fas fa-rocket',
	title = '创新技术',
	content = '采用前沿技术栈，打造高性能、高可用的现代化应用解决方案。'
}) => {
	return (
		<div className="hover-card-3d">
			<div className="card">
				<div className="card-glare"></div>
				<div className="card-icon">
					<i className={icon}></i>
				</div>
				<h3 className="card-title">{title}</h3>
				<p className="card-content">{content}</p>
				<button className="card-button">探索更多</button>
			</div>
		</div>
	);
};

export default HoverCard3D;
