import React from 'react';
import './index.scss';

interface CardProps {
	index: number;
	color: string;
	imageSrc: string;
}

const Card: React.FC<CardProps> = ({ index, color, imageSrc }) => {
	return (
		<div
			className="card"
			style={{ '--index': index, '--color-card': color } as React.CSSProperties}
		>
			<div className="img">
				<img src={imageSrc} alt={`Card ${index}`} />
			</div>
		</div>
	);
};

const ThreeDRotatingAlbum: React.FC = () => {
	// 定义卡片数据
	const cards = [
		{ index: 0, color: '142, 249, 252', imageSrc: 'https://picsum.photos/150/200?random=1' },
		{ index: 1, color: '142, 252, 204', imageSrc: 'https://picsum.photos/150/200?random=2' },
		{ index: 2, color: '142, 252, 157', imageSrc: 'https://picsum.photos/150/200?random=3' },
		{ index: 3, color: '215, 252, 142', imageSrc: 'https://picsum.photos/150/200?random=4' },
		{ index: 4, color: '252, 252, 142', imageSrc: 'https://picsum.photos/150/200?random=5' },
		{ index: 5, color: '252, 208, 142', imageSrc: 'https://picsum.photos/150/200?random=6' },
		{ index: 6, color: '252, 142, 142', imageSrc: 'https://picsum.photos/150/200?random=7' },
		{ index: 7, color: '252, 142, 239', imageSrc: 'https://picsum.photos/150/200?random=8' },
		{ index: 8, color: '204, 142, 252', imageSrc: 'https://picsum.photos/150/200?random=9' },
		{ index: 9, color: '142, 202, 252', imageSrc: 'https://picsum.photos/150/200?random=10' }
	];

	return (
		<div className="three-d-rotating-album">
			<div className="wrapper">
				<div className="inner" style={{ '--quantity': cards.length } as React.CSSProperties}>
					{cards.map(card => (
						<Card key={card.index} index={card.index} color={card.color} imageSrc={card.imageSrc} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ThreeDRotatingAlbum;
