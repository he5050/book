import React, { useState } from 'react';
import './index.scss';

interface CardData {
	id: string;
	icon: string;
	title: string;
	subtitle: string;
	color: string;
}

interface SciFiCardHoverProps {
	cards?: CardData[];
	cardWidth?: number;
	cardHeight?: number;
	className?: string;
	style?: React.CSSProperties;
	onCardClick?: (cardId: string) => void;
}

const defaultCards: CardData[] = [
	{ id: '1', icon: '🎨', title: '01', subtitle: 'Design', color: '#f00' },
	{ id: '2', icon: '💻', title: '02', subtitle: 'Code', color: '#0f0' },
	{ id: '3', icon: '🚀', title: '03', subtitle: 'Launch', color: '#f0f' }
];

const SciFiCardHover: React.FC<SciFiCardHoverProps> = ({
	cards = defaultCards,
	cardWidth = 240,
	cardHeight = 320,
	className = '',
	style = {},
	onCardClick
}) => {
	const [currentCards, setCurrentCards] = useState<CardData[]>(cards);
	const [config, setConfig] = useState({
		cardWidth,
		cardHeight
	});

	const handleCardClick = (cardId: string) => {
		onCardClick?.(cardId);
	};

	const updateConfig = (newConfig: Partial<typeof config>) => {
		setConfig(prev => ({ ...prev, ...newConfig }));
	};

	const updateCard = (cardId: string, updates: Partial<CardData>) => {
		setCurrentCards(prev =>
			prev.map(card => (card.id === cardId ? { ...card, ...updates } : card))
		);
	};

	return (
		<div className={`sci-fi-card-hover-container ${className}`} style={style}>
			{/* 配置面板 */}
			<div className="sci-fi-config-panel">
				<div className="config-row">
					<div className="config-item">
						<label>卡片宽度: {config.cardWidth}px</label>
						<input
							type="range"
							min="200"
							max="300"
							value={config.cardWidth}
							onChange={e => updateConfig({ cardWidth: Number(e.target.value) })}
						/>
					</div>

					<div className="config-item">
						<label>卡片高度: {config.cardHeight}px</label>
						<input
							type="range"
							min="280"
							max="400"
							value={config.cardHeight}
							onChange={e => updateConfig({ cardHeight: Number(e.target.value) })}
						/>
					</div>
				</div>
			</div>

			{/* 卡片容器 */}
			<div className="sci-fi-cards-container">
				{currentCards.map(card => (
					<div
						key={card.id}
						className="sci-fi-card"
						style={
							{
								width: `${config.cardWidth}px`,
								height: `${config.cardHeight}px`,
								'--clr': card.color
							} as React.CSSProperties
						}
						onClick={() => handleCardClick(card.id)}
					>
						<div className="card-icon">{card.icon}</div>
						<h2>
							{card.title}
							<small>{card.subtitle}</small>
						</h2>
						<div className="clip">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				))}
			</div>

			{/* 卡片编辑面板 */}
			<div className="card-edit-panel">
				<h4>编辑卡片</h4>
				{currentCards.map(card => (
					<div key={card.id} className="card-editor">
						<div className="editor-row">
							<label>{card.subtitle}</label>
							<input
								type="text"
								value={card.title}
								onChange={e => updateCard(card.id, { title: e.target.value })}
								placeholder="主标题"
							/>
							<input
								type="text"
								value={card.subtitle}
								onChange={e => updateCard(card.id, { subtitle: e.target.value })}
								placeholder="副标题"
							/>
							<input
								type="text"
								value={card.icon}
								onChange={e => updateCard(card.id, { icon: e.target.value })}
								placeholder="图标"
								style={{ width: '60px' }}
							/>
							<input
								type="color"
								value={card.color}
								onChange={e => updateCard(card.id, { color: e.target.value })}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SciFiCardHover;
