import React, { useState } from 'react';
import ThreeDGlassCard from './index';
import './demo.scss';

const ThreeDGlassCardDemo: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [config, setConfig] = useState({
    max: 25,
    speed: 400,
    glare: true,
    maxGlare: 1,
    scale: 1.1
  });

  const sampleCards = [
    {
      id: '1',
      title: 'Card One',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil quas reprehenderit porro in, accusantium unde, blanditiis soluta dolorum tempora eum ab voluptates?',
      imageUrl: 'https://picsum.photos/seed/card1/300/260'
    },
    {
      id: '2',
      title: 'Card Two',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil quas reprehenderit porro in, accusantium unde, blanditiis soluta dolorum tempora eum ab voluptates?',
      imageUrl: 'https://picsum.photos/seed/card2/300/260'
    },
    {
      id: '3',
      title: 'Card Three',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil quas reprehenderit porro in, accusantium unde, blanditiis soluta dolorum tempora eum ab voluptates?',
      imageUrl: 'https://picsum.photos/seed/card3/300/260'
    }
  ];

  const handleCardClick = (card: any) => {
    console.log('Card clicked:', card.title);
    alert(`You clicked on: ${card.title}`);
  };

  const handleTiltChange = (values: any) => {
    // console.log('Tilt values:', values);
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>3D玻璃形态卡片悬停效果演示</h1>
        <p>鼠标悬停在卡片上体验3D旋转和玻璃态效果</p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label>主题切换:</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark')}
          >
            <option value="light">浅色主题</option>
            <option value="dark">深色主题</option>
          </select>
        </div>

        <div className="control-group">
          <label>最大旋转角度: {config.max}°</label>
          <input
            type="range"
            min="10"
            max="45"
            value={config.max}
            onChange={(e) => handleConfigChange('max', parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>动画速度: {config.speed}ms</label>
          <input
            type="range"
            min="200"
            max="800"
            value={config.speed}
            onChange={(e) => handleConfigChange('speed', parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>悬停缩放: {config.scale}</label>
          <input
            type="range"
            min="1.0"
            max="1.5"
            step="0.1"
            value={config.scale}
            onChange={(e) => handleConfigChange('scale', parseFloat(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.glare}
              onChange={(e) => handleConfigChange('glare', e.target.checked)}
            />
            启用眩光效果
          </label>
        </div>
      </div>

      <div className="demo-cards">
        {sampleCards.map((card, index) => (
          <ThreeDGlassCard
            key={card.id}
            data={card}
            theme={selectedTheme}
            tiltConfig={{
              max: config.max,
              speed: config.speed,
              glare: config.glare,
              maxGlare: config.maxGlare,
              scale: config.scale
            }}
            onCardClick={handleCardClick}
            onTiltChange={handleTiltChange}
          />
        ))}
      </div>

      <div className="demo-info">
        <h3>效果特点</h3>
        <ul>
          <li>✅ 鼠标跟随3D旋转效果</li>
          <li>✅ 玻璃态半透明质感</li>
          <li>✅ 实时参数配置</li>
          <li>✅ 主题切换支持</li>
          <li>✅ 响应式设计</li>
          <li>✅ 眩光效果</li>
        </ul>
      </div>
    </div>
  );
};

export default ThreeDGlassCardDemo;