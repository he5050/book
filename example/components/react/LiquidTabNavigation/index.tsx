import React, { useState, useCallback, useRef, useEffect } from 'react';
import './index.scss';

interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  href?: string;
  active?: boolean;
}

interface NavigationTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  shadowColor: string;
  activeTextColor: string;
}

interface LiquidTabNavigationProps {
  items?: NavigationItem[];
  theme?: 'blue' | 'purple' | 'green' | 'custom';
  customTheme?: NavigationTheme;
  navWidth?: number;
  itemHeight?: number;
  itemGap?: number;
  borderRadius?: number;
  translateDistance?: number;
  transitionDuration?: number;
  iconSize?: string;
  shadowBlur?: number;
  position?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onItemClick?: (itemId: string) => void;
  onActiveChange?: (activeId: string) => void;
}

const defaultItems: NavigationItem[] = [
  { id: 'home', icon: '🏠', label: '首页', active: true },
  { id: 'profile', icon: '👤', label: '个人' },
  { id: 'messages', icon: '💬', label: '消息' },
  { id: 'camera', icon: '📷', label: '相机' },
  { id: 'settings', icon: '⚙️', label: '设置' }
];

const themes: Record<string, NavigationTheme> = {
  blue: {
    primaryColor: '#00a2ea',
    backgroundColor: '#223f4d',
    textColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.25)',
    activeTextColor: '#00a2ea'
  },
  purple: {
    primaryColor: '#8b5cf6',
    backgroundColor: '#1e1b4b',
    textColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.25)',
    activeTextColor: '#8b5cf6'
  },
  green: {
    primaryColor: '#10b981',
    backgroundColor: '#064e3b',
    textColor: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.25)',
    activeTextColor: '#10b981'
  }
};

const LiquidTabNavigation: React.FC<LiquidTabNavigationProps> = ({
  items = defaultItems,
  theme = 'blue',
  customTheme,
  navWidth = 80,
  itemHeight = 60,
  itemGap = 10,
  borderRadius = 80,
  translateDistance = 35,
  transitionDuration = 0.5,
  iconSize = '1.75em',
  shadowBlur = 10,
  position = 'left',
  className = '',
  style = {},
  onItemClick,
  onActiveChange
}) => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(items);
  const [config, setConfig] = useState({
    navWidth,
    itemHeight,
    itemGap,
    borderRadius,
    translateDistance,
    transitionDuration,
    iconSize,
    shadowBlur
  });
  const [currentTheme, setCurrentTheme] = useState(theme);
  
  const navigationRef = useRef<HTMLDivElement>(null);

  const activeTheme = customTheme || themes[currentTheme];

  const handleItemClick = useCallback((itemId: string) => {
    setNavigationItems(prev => prev.map(item => ({
      ...item,
      active: item.id === itemId
    })));
    
    onItemClick?.(itemId);
    onActiveChange?.(itemId);
  }, [onItemClick, onActiveChange]);

  const updateConfig = useCallback((newConfig: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<NavigationItem>) => {
    setNavigationItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  }, []);

  const addItem = useCallback(() => {
    const newId = `item-${Date.now()}`;
    const newItem: NavigationItem = {
      id: newId,
      icon: '➕',
      label: '新项目',
      active: false
    };
    setNavigationItems(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setNavigationItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const containerStyle = {
    '--primary-color': activeTheme.primaryColor,
    '--background-color': activeTheme.backgroundColor,
    '--text-color': activeTheme.textColor,
    '--shadow-color': activeTheme.shadowColor,
    '--active-text-color': activeTheme.activeTextColor,
    '--nav-width': `${config.navWidth}px`,
    '--item-height': `${config.itemHeight}px`,
    '--item-gap': `${config.itemGap}px`,
    '--border-radius': `${config.borderRadius}px`,
    '--translate-distance': `${config.translateDistance}px`,
    '--transition-duration': `${config.transitionDuration}s`,
    '--icon-size': config.iconSize,
    '--shadow-blur': `${config.shadowBlur}px`,
    ...style
  } as React.CSSProperties;

  return (
    <div className={`liquid-tab-navigation-container ${className}`} style={containerStyle}>
      {/* 配置面板 */}
      <div className="liquid-config-panel">
        <div className="config-section">
          <h4>导航配置</h4>
          <div className="config-row">
            <div className="config-item">
              <label>导航宽度: {config.navWidth}px</label>
              <input
                type="range"
                min="60"
                max="120"
                value={config.navWidth}
                onChange={(e) => updateConfig({ navWidth: Number(e.target.value) })}
              />
            </div>
            
            <div className="config-item">
              <label>项目高度: {config.itemHeight}px</label>
              <input
                type="range"
                min="40"
                max="80"
                value={config.itemHeight}
                onChange={(e) => updateConfig({ itemHeight: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="config-row">
            <div className="config-item">
              <label>外移距离: {config.translateDistance}px</label>
              <input
                type="range"
                min="20"
                max="60"
                value={config.translateDistance}
                onChange={(e) => updateConfig({ translateDistance: Number(e.target.value) })}
              />
            </div>
            
            <div className="config-item">
              <label>动画时长: {config.transitionDuration}s</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={config.transitionDuration}
                onChange={(e) => updateConfig({ transitionDuration: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="config-row">
            <div className="config-item">
              <label>主题</label>
              <select 
                value={currentTheme} 
                onChange={(e) => setCurrentTheme(e.target.value as any)}
              >
                <option value="blue">蓝色主题</option>
                <option value="purple">紫色主题</option>
                <option value="green">绿色主题</option>
              </select>
            </div>
            
            <div className="config-item">
              <label>圆角: {config.borderRadius}px</label>
              <input
                type="range"
                min="20"
                max="100"
                value={config.borderRadius}
                onChange={(e) => updateConfig({ borderRadius: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="config-section">
          <h4>导航项管理</h4>
          <div className="items-manager">
            {navigationItems.map((item) => (
              <div key={item.id} className="item-editor">
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => updateItem(item.id, { icon: e.target.value })}
                  placeholder="图标"
                  style={{ width: '50px' }}
                />
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  placeholder="标签"
                />
                <button 
                  onClick={() => handleItemClick(item.id)}
                  className={item.active ? 'active' : ''}
                >
                  {item.active ? '✓' : '○'}
                </button>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                  disabled={navigationItems.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addItem} className="add-btn">
              ➕ 添加项目
            </button>
          </div>
        </div>
      </div>

      {/* 导航组件 */}
      <div className="liquid-navigation-wrapper">
        <div 
          ref={navigationRef}
          className={`liquid-navigation ${position}`}
        >
          <ul>
            {navigationItems.map((item) => (
              <li 
                key={item.id}
                className={item.active ? 'active' : ''}
                onClick={() => handleItemClick(item.id)}
              >
                <a href={item.href || '#'} onClick={(e) => e.preventDefault()}>
                  <span className="icon">
                    {item.icon}
                  </span>
                  <span className="label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiquidTabNavigation;