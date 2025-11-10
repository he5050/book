import React, { useState, useEffect } from 'react';
import './index.scss';

interface ModernCSSShowcaseProps {
  primaryColor?: string;
  animationDuration?: number;
  borderRadius?: number;
  spacing?: number;
  fontSize?: number;
  gridColumns?: number;
  gridGap?: number;
  easing?: string;
  hoverScale?: number;
  transitionDuration?: number;
  theme?: 'light' | 'dark';
}

interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const ModernCSSShowcase: React.FC<ModernCSSShowcaseProps> = ({
  primaryColor = '#3498db',
  animationDuration = 300,
  borderRadius = 8,
  spacing = 16,
  fontSize = 16,
  gridColumns = 3,
  gridGap = 20,
  easing = 'ease-out',
  hoverScale = 1.05,
  transitionDuration = 200,
  theme = 'light'
}) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // 模拟数据加载
  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCards: CardData[] = [
        {
          id: 1,
          title: 'Flexbox 布局技巧',
          description: '掌握现代CSS布局的核心技术，实现完美的响应式设计',
          image: `https://picsum.photos/300/200?random=1`,
          category: 'layout'
        },
        {
          id: 2,
          title: 'Grid 网格系统',
          description: '使用CSS Grid创建复杂而灵活的网格布局',
          image: `https://picsum.photos/300/200?random=2`,
          category: 'layout'
        },
        {
          id: 3,
          title: 'CSS 动画效果',
          description: '创建流畅的动画和过渡效果，提升用户体验',
          image: `https://picsum.photos/300/200?random=3`,
          category: 'animation'
        },
        {
          id: 4,
          title: '响应式设计',
          description: '适配各种设备尺寸的现代响应式设计方案',
          image: `https://picsum.photos/300/200?random=4`,
          category: 'responsive'
        },
        {
          id: 5,
          title: 'CSS 变量应用',
          description: '使用CSS自定义属性创建可维护的样式系统',
          image: `https://picsum.photos/300/200?random=5`,
          category: 'variables'
        },
        {
          id: 6,
          title: '性能优化技巧',
          description: '提升CSS性能，优化渲染和动画效果',
          image: `https://picsum.photos/300/200?random=6`,
          category: 'performance'
        }
      ];
      
      setCards(mockCards);
      setLoading(false);
    };

    loadCards();
  }, []);

  // 过滤卡片
  const filteredCards = activeFilter === 'all' 
    ? cards 
    : cards.filter(card => card.category === activeFilter);

  // 动态样式
  const cssVariables = {
    '--primary-color': primaryColor,
    '--animation-duration': `${animationDuration}ms`,
    '--border-radius': `${borderRadius}px`,
    '--spacing': `${spacing}px`,
    '--font-size': `${fontSize}px`,
    '--grid-columns': gridColumns,
    '--grid-gap': `${gridGap}px`,
    '--easing': easing,
    '--hover-scale': hoverScale,
    '--transition-duration': `${transitionDuration}ms`
  } as React.CSSProperties;

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'layout', label: '布局' },
    { key: 'animation', label: '动画' },
    { key: 'responsive', label: '响应式' },
    { key: 'variables', label: '变量' },
    { key: 'performance', label: '性能' }
  ];

  return (
    <div 
      className={`modern-css-showcase ${theme}`}
      style={cssVariables}
    >
      {/* 头部区域 */}
      <header className="showcase-header">
        <h1 className="showcase-title">现代CSS技巧展示</h1>
        <p className="showcase-subtitle">探索CSS的强大功能和最佳实践</p>
        
        {/* 主题切换按钮 */}
        <div className="theme-controls">
          <button 
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => {}}
          >
            🌞 浅色
          </button>
          <button 
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => {}}
          >
            🌙 深色
          </button>
        </div>
      </header>

      {/* 过滤器 */}
      <nav className="filter-nav">
        {categories.map(category => (
          <button
            key={category.key}
            className={`filter-btn ${activeFilter === category.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(category.key)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      {/* 加载状态 */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      )}

      {/* 卡片网格 */}
      {!loading && (
        <main className="cards-grid">
          {filteredCards.map((card, index) => (
            <article 
              key={card.id} 
              className="card"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="card-image">
                <img src={card.image} alt={card.title} loading="lazy" />
                <div className="card-overlay">
                  <span className="card-category">{card.category}</span>
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                
                <div className="card-actions">
                  <button className="btn-primary">查看详情</button>
                  <button className="btn-secondary">收藏</button>
                </div>
              </div>
            </article>
          ))}
        </main>
      )}

      {/* 特效演示区域 */}
      <section className="effects-demo">
        <h2>CSS特效演示</h2>
        
        <div className="demo-grid">
          {/* 渐变按钮 */}
          <div className="demo-item">
            <h3>渐变按钮</h3>
            <button className="gradient-btn">点击我</button>
          </div>
          
          {/* 3D卡片 */}
          <div className="demo-item">
            <h3>3D翻转卡片</h3>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <p>悬停翻转</p>
                </div>
                <div className="flip-card-back">
                  <p>背面内容</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 脉冲动画 */}
          <div className="demo-item">
            <h3>脉冲动画</h3>
            <div className="pulse-circle"></div>
          </div>
          
          {/* 文字效果 */}
          <div className="demo-item">
            <h3>文字特效</h3>
            <div className="text-effect">CSS Magic</div>
          </div>
        </div>
      </section>

      {/* 布局演示 */}
      <section className="layout-demo">
        <h2>布局技巧演示</h2>
        
        {/* Flexbox演示 */}
        <div className="layout-example">
          <h3>Flexbox 完美居中</h3>
          <div className="flex-center-demo">
            <div className="centered-content">完美居中</div>
          </div>
        </div>
        
        {/* Grid演示 */}
        <div className="layout-example">
          <h3>Grid 自适应布局</h3>
          <div className="grid-demo">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div key={num} className="grid-item">
                项目 {num}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 性能指标 */}
      <footer className="performance-info">
        <div className="perf-metrics">
          <div className="metric">
            <span className="metric-label">CSS变量</span>
            <span className="metric-value">{Object.keys(cssVariables).length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">动画元素</span>
            <span className="metric-value">{filteredCards.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">响应式断点</span>
            <span className="metric-value">3</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernCSSShowcase;