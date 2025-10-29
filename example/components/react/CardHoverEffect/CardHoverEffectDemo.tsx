import React, { useState } from 'react';
import CardHoverEffect from './index';

const CardHoverEffectDemo: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'colorful'>('light');
  const [cardWidth, setCardWidth] = useState(300);
  const [cardHeight, setCardHeight] = useState(300);
  const [expandedHeight, setExpandedHeight] = useState(420);
  const [blurAmount, setBlurAmount] = useState(25);
  const [borderRadius, setBorderRadius] = useState(40);
  const [transitionDuration, setTransitionDuration] = useState(0.5);

  const sampleCards = [
    {
      id: '1',
      title: 'New Design',
      subtitle: '2 Hours ago',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere consequuntur magni assumenda distinctio nobis inventore iure?',
      imageUrl: 'https://picsum.photos/300/260?random=1'
    },
    {
      id: '2',
      title: 'CSS Only',
      subtitle: '5 Hours ago',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere consequuntur magni assumenda distinctio nobis inventore iure?',
      imageUrl: 'https://picsum.photos/300/260?random=2'
    }
  ];

  const handleCardClick = (id: string) => {
    alert(`Card ${id} clicked!`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>卡片设计带悬停效果</h1>
      
      {/* 参数配置面板 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div>
          <label>主题: </label>
          <select 
            value={selectedTheme} 
            onChange={(e) => setSelectedTheme(e.target.value as any)}
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="colorful">彩色</option>
          </select>
        </div>
        
        <div>
          <label>卡片宽度: {cardWidth}px</label>
          <input 
            type="range" 
            min="200" 
            max="500" 
            value={cardWidth} 
            onChange={(e) => setCardWidth(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>卡片高度: {cardHeight}px</label>
          <input 
            type="range" 
            min="200" 
            max="400" 
            value={cardHeight} 
            onChange={(e) => setCardHeight(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>展开高度: {expandedHeight}px</label>
          <input 
            type="range" 
            min="300" 
            max="500" 
            value={expandedHeight} 
            onChange={(e) => setExpandedHeight(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>模糊程度: {blurAmount}px</label>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={blurAmount} 
            onChange={(e) => setBlurAmount(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>圆角半径: {borderRadius}px</label>
          <input 
            type="range" 
            min="10" 
            max="60" 
            value={borderRadius} 
            onChange={(e) => setBorderRadius(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>动画时长: {transitionDuration}s</label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1" 
            value={transitionDuration} 
            onChange={(e) => setTransitionDuration(Number(e.target.value))}
          />
        </div>
      </div>

      {/* 效果展示 */}
      <div style={{ 
        background: selectedTheme === 'dark' ? '#333' : '#f0f0f0', 
        padding: '40px 20px', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <CardHoverEffect
          cards={sampleCards}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          expandedHeight={expandedHeight}
          blurAmount={blurAmount}
          borderRadius={borderRadius}
          transitionDuration={transitionDuration}
          theme={selectedTheme}
          onCardClick={handleCardClick}
        />
      </div>

      {/* 参数说明 */}
      <div style={{ marginTop: '30px' }}>
        <h3>参数说明</h3>
        <ul>
          <li><strong>主题</strong>: 切换浅色、深色、彩色三种主题样式</li>
          <li><strong>卡片宽度</strong>: 控制卡片的宽度，影响整体布局</li>
          <li><strong>卡片高度</strong>: 控制卡片的初始高度</li>
          <li><strong>展开高度</strong>: 控制悬停时卡片展开的高度</li>
          <li><strong>模糊程度</strong>: 控制背景图片的模糊程度，0为完全清晰</li>
          <li><strong>圆角半径</strong>: 控制卡片的圆角大小</li>
          <li><strong>动画时长</strong>: 控制所有动画的持续时间</li>
        </ul>
      </div>
    </div>
  );
};

export default CardHoverEffectDemo;