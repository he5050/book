import React, { useState, useCallback } from 'react';
import './index.scss';

interface CardData {
  id: string;
  icon: string;
  text: string;
  rotation: number;
  color?: string;
}

interface GlassTheme {
  backgroundColor: string;
  cardOverlay: string;
  borderColor: string;
  textColor: string;
  shadowColor: string;
}

interface GlassCardHoverProps {
  cards?: CardData[];
  cardWidth?: number;
  cardHeight?: number;
  blurAmount?: number;
  overlayColor?: string;
  borderColor?: string;
  shadowColor?: string;
  transitionDuration?: number;
  expandMargin?: number;
  overlapMargin?: number;
  theme?: 'dark' | 'light' | 'custom';
  customTheme?: GlassTheme;
  className?: string;
  style?: React.CSSProperties;
  onCardClick?: (cardId: string) => void;
  onCardHover?: (cardId: string | null) => void;
}

const defaultCards: CardData[] = [
  { id: '1', icon: '✏️', text: 'Design', rotation: -15 },
  { id: '2', icon: '💻', text: 'Code', rotation: 5 },
  { id: '3', icon: '🚀', text: 'Launch', rotation: 25 },
  { id: '4', icon: '💰', text: 'Earn', rotation: -15 }
];

const themes: Record<string, GlassTheme> = {
  dark: {
    backgroundColor: '#0f222f',
    cardOverlay: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.25)'
  },
  light: {
    backgroundColor: '#f0f8ff',
    cardOverlay: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    textColor: '#333',
    shadowColor: 'rgba(0, 0, 0, 0.15)'
  }
};

const GlassCardHover: React.FC<GlassCardHoverProps> = ({
  cards = defaultCards,
  cardWidth = 200,
  cardHeight = 240,
  blurAmount = 10,
  overlayColor,
  borderColor,
  shadowColor,
  transitionDuration = 0.5,
  expandMargin = 20,
  overlapMargin = -45,
  theme = 'dark',
  customTheme,
  className = '',
  style = {},
  onCardClick,
  onCardHover
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentCards, setCurrentCards] = useState<CardData[]>(cards);
  const [config, setConfig] = useState({
    cardWidth,
    cardHeight,
    blurAmount,
    transitionDuration,
    expandMargin,
    overlapMargin
  });

  const currentTheme = customTheme || themes[theme];

  const handleCardClick = useCallback((cardId: string) => {
    onCardClick?.(cardId);
  }, [onCardClick]);

  const handleContainerHover = useCallback((isHovering: boolean) => {
    const cardId = isHovering ? 'container' : null;
    setHoveredCard(cardId);
    onCardHover?.(cardId);
  }, [onCardHover]);

  const updateConfig = useCallback((newConfig: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<CardData>) => {
    setCurrentCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    ));
  }, []);

  const containerStyle = {
    backgroundColor: currentTheme.backgroundColor,
    ...style
  };

  const cardStyle = {
    width: `${config.cardWidth}px`,
    height: `${config.cardHeight}px`,
    background: `linear-gradient(${overlayColor || currentTheme.cardOverlay}, transparent)`,
    border: `1px solid ${borderColor || currentTheme.borderColor}`,
    boxShadow: `0 25px 25px ${shadowColor || currentTheme.shadowColor}`,
    backdropFilter: `blur(${config.blurAmount}px)`,
    transition: `${config.transitionDuration}s`,
    color: currentTheme.textColor
  };

  return (
    <div className={`glass-card-hover-container ${className}`} style={containerStyle}>
      {/* 配置面板 */}
      <div className="glass-config-panel">
        <div className="config-row">
          <div className="config-item">
            <label>卡片宽度: {config.cardWidth}px</label>
            <input
              type="range"
              min="150"
              max="300"
              value={config.cardWidth}
              onChange={(e) => updateConfig({ cardWidth: Number(e.target.value) })}
            />
          </div>
          
          <div className="config-item">
            <label>卡片高度: {config.cardHeight}px</label>
            <input
              type="range"
              min="200"
              max="350"
              value={config.cardHeight}
              onChange={(e) => updateConfig({ cardHeight: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="config-row">
          <div className="config-item">
            <label>模糊程度: {config.blurAmount}px</label>
            <input
              type="range"
              min="0"
              max="20"
              value={config.blurAmount}
              onChange={(e) => updateConfig({ blurAmount: Number(e.target.value) })}
            />
          </div>
          
          <div className="config-item">
            <label>动画时长: {config.transitionDuration}s</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={config.transitionDuration}
              onChange={(e) => updateConfig({ transitionDuration: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="config-row">
          <div className="config-item">
            <label>展开间距: {config.expandMargin}px</label>
            <input
              type="range"
              min="10"
              max="50"
              value={config.expandMargin}
              onChange={(e) => updateConfig({ expandMargin: Number(e.target.value) })}
            />
          </div>
          
          <div className="config-item">
            <label>重叠间距: {config.overlapMargin}px</label>
            <input
              type="range"
              min="-80"
              max="-10"
              value={config.overlapMargin}
              onChange={(e) => updateConfig({ overlapMargin: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="config-row">
          <div className="config-item">
            <label>主题</label>
            <select 
              value={theme} 
              onChange={(e) => {
                // 这里可以通过props传递主题变化
                console.log('Theme changed:', e.target.value);
              }}
            >
              <option value="dark">深色主题</option>
              <option value="light">浅色主题</option>
            </select>
          </div>
        </div>
      </div>

      {/* 卡片容器 */}
      <div 
        className="glass-cards-container"
        onMouseEnter={() => handleContainerHover(true)}
        onMouseLeave={() => handleContainerHover(false)}
        style={{
          '--expand-margin': `${config.expandMargin}px`,
          '--overlap-margin': `${config.overlapMargin}px`
        } as React.CSSProperties}
      >
        {currentCards.map((card) => (
          <div
            key={card.id}
            className="glass-card"
            style={{
              ...cardStyle,
              '--rotation': `${card.rotation}deg`,
              transform: `rotate(${card.rotation}deg)`
            } as React.CSSProperties}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-icon">
              {card.icon}
            </div>
            <div className="card-text" data-text={card.text}>
              {card.text}
            </div>
          </div>
        ))}
      </div>

      {/* 卡片编辑面板 */}
      <div className="card-edit-panel">
        <h4>编辑卡片</h4>
        {currentCards.map((card) => (
          <div key={card.id} className="card-editor">
            <div className="editor-row">
              <label>{card.text}</label>
              <input
                type="text"
                value={card.text}
                onChange={(e) => updateCard(card.id, { text: e.target.value })}
                placeholder="卡片文本"
              />
              <input
                type="text"
                value={card.icon}
                onChange={(e) => updateCard(card.id, { icon: e.target.value })}
                placeholder="图标"
                style={{ width: '60px' }}
              />
              <input
                type="range"
                min="-45"
                max="45"
                value={card.rotation}
                onChange={(e) => updateCard(card.id, { rotation: Number(e.target.value) })}
                title={`旋转角度: ${card.rotation}°`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlassCardHover;