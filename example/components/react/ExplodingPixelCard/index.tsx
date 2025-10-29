import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface ExplodingCardConfig {
  pixelSize: number;
  cardWidth: number;
  cardHeight: number;
  scatterRange: number;
  animationDuration: number;
  maxDelay: number;
  themeColor: string;
  backgroundColor: string;
  textColor: string;
  borderOpacity: number;
  titleSize: string;
  contentPadding: number;
}

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  link?: string;
}

interface ExplodingPixelCardProps {
  config?: Partial<ExplodingCardConfig>;
  data: CardData;
  className?: string;
  style?: React.CSSProperties;
  onCardClick?: (data: CardData) => void;
}

const defaultConfig: ExplodingCardConfig = {
  pixelSize: 20,
  cardWidth: 300,
  cardHeight: 400,
  scatterRange: 100,
  animationDuration: 0.5,
  maxDelay: 0.5,
  themeColor: '#ff5722',
  backgroundColor: '#333333',
  textColor: '#ffffff',
  borderOpacity: 0.25,
  titleSize: '6em',
  contentPadding: 20
};

const ExplodingPixelCard: React.FC<ExplodingPixelCardProps> = ({
  config = {},
  data,
  className = '',
  style = {},
  onCardClick
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const cardRef = useRef<HTMLDivElement>(null);
  const pixelContainerRef = useRef<HTMLDivElement>(null);
  

  const generatePixelGrid = () => {
    if (!pixelContainerRef.current || !cardRef.current) return;

    const container = pixelContainerRef.current;
    container.innerHTML = '';

    const { pixelSize, scatterRange, maxDelay } = finalConfig;
    const cardWidth = cardRef.current.offsetWidth;
    const cardHeight = cardRef.current.offsetHeight;
    
    const cols = Math.floor(cardWidth / pixelSize);
    const rows = Math.floor(cardHeight / pixelSize);
    
    const fragment = document.createDocumentFragment();
    
    for(let row = 0; row < rows; row++){
      for(let col = 0; col < cols; col++){
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        
        // 设置位置
        pixel.style.left = `${col * pixelSize}px`;
        pixel.style.top = `${row * pixelSize}px`;
        
        // 随机爆炸参数
        const tx = (Math.random() - 0.5) * scatterRange;
        const ty = (Math.random() - 0.5) * scatterRange;
        const delay = Math.random() * maxDelay;
        
        pixel.style.setProperty('--tx', `${tx}px`);
        pixel.style.setProperty('--ty', `${ty}px`);
        pixel.style.transitionDelay = `${delay}s`;
        
        fragment.appendChild(pixel);
      }
    }
    
    container.appendChild(fragment);
  };

  useEffect(() => {
    generatePixelGrid();
    
    const handleResize = () => {
      generatePixelGrid();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [finalConfig]);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(data);
    } else if (data.link) {
      window.open(data.link, '_blank');
    }
  };

  const cardStyle: React.CSSProperties = {
    width: finalConfig.cardWidth,
    height: finalConfig.cardHeight,
    backgroundColor: finalConfig.backgroundColor,
    color: finalConfig.textColor,
    ...style
  };

  const cssVariables = {
    '--clr': finalConfig.themeColor,
    '--border-opacity': finalConfig.borderOpacity.toString(),
    '--title-size': finalConfig.titleSize,
    '--content-padding': `${finalConfig.contentPadding}px`,
    '--animation-duration': `${finalConfig.animationDuration}s`
  } as React.CSSProperties;

  const combinedStyle = { ...cardStyle, ...cssVariables };

  return (
    <div
      ref={cardRef}
      className={`exploding-card ${className}`}
      style={combinedStyle}
      onClick={handleCardClick}
    >
      <div ref={pixelContainerRef} className="pixel-container"></div>
      
      <h2 className="card-title">{data.title}</h2>
      
      <div className="card-content">
        <h3>{data.subtitle}</h3>
        <p>{data.content}</p>
        {data.link && (
          <a href={data.link} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        )}
      </div>
    </div>
  );
};

const ExplodingPixelCardDemo: React.FC = () => {
  const [config, setConfig] = useState<ExplodingCardConfig>(defaultConfig);
  const [selectedCard, setSelectedCard] = useState<string>('card1');

  const updateConfig = (key: keyof ExplodingCardConfig, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  const themePresets = [
    { name: 'Fire', themeColor: '#ff5722', backgroundColor: '#333333' },
    { name: 'Ocean', themeColor: '#03a9f4', backgroundColor: '#1a1a2e' },
    { name: 'Forest', themeColor: '#4caf50', backgroundColor: '#2d2d2d' },
    { name: 'Purple', themeColor: '#9c27b0', backgroundColor: '#1a1a1a' },
    { name: 'Gold', themeColor: '#ffc107', backgroundColor: '#2c2c2c' }
  ];

  const applyTheme = (theme: typeof themePresets[0]) => {
    setConfig(prev => ({
      ...prev,
      themeColor: theme.themeColor,
      backgroundColor: theme.backgroundColor
    }));
  };

  const cardData = [
    {
      id: '01',
      title: '01',
      subtitle: '春日感怀',
      content: '东风拂柳意悠悠，桃李争妍映画楼。蝶舞翩跹寻艳影，莺啼婉转绕芳洲。时光易逝空嗟叹，壮志难酬独倚愁。且借春光添逸兴，诗心一片付东流。',
      link: '#'
    },
    {
      id: '02',
      title: '02',
      subtitle: '秋山行',
      content: '秋山寂寂入幽遐，霜染枫林似锦霞。怪石嶙峋依曲径，寒溪澄澈绕蒹葭。遥闻古寺钟声远，近见归巢倦鸟斜。心醉此中尘念息，愿随落日卧烟沙。',
      link: '#'
    }
  ];

  const handleCardClick = (data: CardData) => {
    console.log('Card clicked:', data);
  };

  return (
    <div className="exploding-card-demo">
      <div className="demo-container">
        <div className="preview-section">
          <h3>效果预览</h3>
          <div className="preview-area">
            <div className="cards-container">
              {cardData.map(card => (
                <ExplodingPixelCard
                  key={card.id}
                  config={config}
                  data={card}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="controls-section">
          <h3>参数配置</h3>
          
          <div className="controls-grid">
            <div className="control-group">
              <label>像素大小: {config.pixelSize}px</label>
              <input
                type="range"
                min="10"
                max="40"
                value={config.pixelSize}
                onChange={(e) => updateConfig('pixelSize', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>卡片宽度: {config.cardWidth}px</label>
              <input
                type="range"
                min="200"
                max="500"
                value={config.cardWidth}
                onChange={(e) => updateConfig('cardWidth', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>卡片高度: {config.cardHeight}px</label>
              <input
                type="range"
                min="250"
                max="600"
                value={config.cardHeight}
                onChange={(e) => updateConfig('cardHeight', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>散落范围: {config.scatterRange}px</label>
              <input
                type="range"
                min="50"
                max="200"
                value={config.scatterRange}
                onChange={(e) => updateConfig('scatterRange', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>动画时长: {config.animationDuration}s</label>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.1"
                value={config.animationDuration}
                onChange={(e) => updateConfig('animationDuration', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>最大延迟: {config.maxDelay}s</label>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.1"
                value={config.maxDelay}
                onChange={(e) => updateConfig('maxDelay', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>主题颜色:</label>
              <input
                type="color"
                value={config.themeColor}
                onChange={(e) => updateConfig('themeColor', e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>背景颜色:</label>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>文字颜色:</label>
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => updateConfig('textColor', e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>边框透明度: {config.borderOpacity}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.borderOpacity}
                onChange={(e) => updateConfig('borderOpacity', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>内容边距: {config.contentPadding}px</label>
              <input
                type="range"
                min="10"
                max="40"
                value={config.contentPadding}
                onChange={(e) => updateConfig('contentPadding', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <label>预设主题:</label>
            <div className="theme-buttons">
              {themePresets.map(theme => (
                <button
                  key={theme.name}
                  className="theme-btn"
                  style={{ backgroundColor: theme.themeColor }}
                  onClick={() => applyTheme(theme)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-actions">
            <button onClick={resetConfig} className="reset-btn">
              重置配置
            </button>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h3>当前配置代码</h3>
        <pre className="code-block">
{`<ExplodingPixelCard 
  config={{
    pixelSize: ${config.pixelSize},
    cardWidth: ${config.cardWidth},
    cardHeight: ${config.cardHeight},
    scatterRange: ${config.scatterRange},
    animationDuration: ${config.animationDuration},
    maxDelay: ${config.maxDelay},
    themeColor: "${config.themeColor}",
    backgroundColor: "${config.backgroundColor}",
    textColor: "${config.textColor}",
    borderOpacity: ${config.borderOpacity},
    contentPadding: ${config.contentPadding}
  }}
  data={{
    id: "01",
    title: "01",
    subtitle: "春日感怀",
    content: "东风拂柳意悠悠...",
    link: "#"
  }}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default ExplodingPixelCardDemo;