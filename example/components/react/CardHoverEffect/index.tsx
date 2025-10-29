import React, { useState } from 'react';
import './index.scss';

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  link?: string;
}

interface CardHoverEffectProps {
  cards: CardData[];
  cardWidth?: number;
  cardHeight?: number;
  expandedHeight?: number;
  blurAmount?: number;
  borderRadius?: number;
  transitionDuration?: number;
  theme?: 'light' | 'dark' | 'colorful';
  onCardClick?: (id: string) => void;
  className?: string;
}

const CardHoverEffect: React.FC<CardHoverEffectProps> = ({
  cards,
  cardWidth = 300,
  cardHeight = 300,
  expandedHeight = 420,
  blurAmount = 25,
  borderRadius = 40,
  transitionDuration = 0.5,
  theme = 'light',
  onCardClick,
  className = ''
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCardClick = (cardId: string) => {
    onCardClick?.(cardId);
  };

  const getThemeStyles = () => {
    const themes = {
      light: {
        backgroundColor: '#fff',
        textColor: '#333',
        shadowColor: 'rgba(0,0,0,0.25)'
      },
      dark: {
        backgroundColor: '#2a2a2a',
        textColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.4)'
      },
      colorful: {
        backgroundColor: '#ff6b6b',
        textColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.3)'
      }
    };
    
    return themes[theme];
  };

  const themeStyles = getThemeStyles();

  return (
    <div 
      className={`card-hover-container ${className}`}
      style={{
        '--card-width': `${cardWidth}px`,
        '--card-height': `${cardHeight}px`,
        '--expanded-height': `${expandedHeight}px`,
        '--blur-amount': `${blurAmount}px`,
        '--border-radius': `${borderRadius}px`,
        '--transition-duration': `${transitionDuration}s`,
        '--bg-color': themeStyles.backgroundColor,
        '--text-color': themeStyles.textColor,
        '--shadow-color': themeStyles.shadowColor
      } as React.CSSProperties}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${hoveredCard === card.id ? 'hovered' : ''}`}
          style={{ '--img': `url(${card.imageUrl})` } as React.CSSProperties}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick(card.id)}
        >
          <div className="imgBx"></div>
          <div className="content">
            <h3>
              {card.title}<br/>
              <span>{card.subtitle}</span>
            </h3>
            <p>{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardHoverEffect;