import React, { useState, useCallback, useRef, useEffect } from 'react';
import './index.scss';

interface WaveContainer {
  id: string;
  color: string;
  size: number;
  active: boolean;
}

interface WaveTheme {
  name: string;
  primaryColor: string;
  waveColor: string;
  backgroundColor: string;
  innerColor: string;
}

interface AnimatedWaveBorderProps {
  containers?: WaveContainer[];
  primaryColor?: string;
  waveColor?: string;
  containerSize?: number;
  waveHeight?: number;
  waveWidth?: number;
  animationSpeed?: number;
  borderRadius?: number;
  innerPadding?: number;
  waveOpacity?: number;
  animationDirection?: 'normal' | 'reverse' | 'alternate';
  theme?: 'ocean' | 'sunset' | 'forest' | 'night' | 'custom';
  customTheme?: WaveTheme;
  className?: string;
  style?: React.CSSProperties;
  onContainerClick?: (containerId: string) => void;
}

const defaultContainers: WaveContainer[] = [
  { id: 'container1', color: '#2196f3', size: 360, active: true },
  { id: 'container2', color: '#ff5566', size: 360, active: true }
];

const waveThemes: Record<string, WaveTheme> = {
  ocean: {
    name: '海洋',
    primaryColor: '#2196f3',
    waveColor: '#1976d2',
    backgroundColor: '#e3f2fd',
    innerColor: 'rgba(33, 150, 243, 0.1)'
  },
  sunset: {
    name: '日落',
    primaryColor: '#ff5722',
    waveColor: '#d84315',
    backgroundColor: '#fbe9e7',
    innerColor: 'rgba(255, 87, 34, 0.1)'
  },
  forest: {
    name: '森林',
    primaryColor: '#4caf50',
    waveColor: '#2e7d32',
    backgroundColor: '#e8f5e8',
    innerColor: 'rgba(76, 175, 80, 0.1)'
  },
  night: {
    name: '夜空',
    primaryColor: '#9c27b0',
    waveColor: '#6a1b9a',
    backgroundColor: '#f3e5f5',
    innerColor: 'rgba(156, 39, 176, 0.1)'
  }
};

const AnimatedWaveBorder: React.FC<AnimatedWaveBorderProps> = ({
  containers = defaultContainers,
  primaryColor = '#2196f3',
  waveColor = '#333',
  containerSize = 360,
  waveHeight = 15,
  waveWidth = 40,
  animationSpeed = 0.5,
  borderRadius = 10,
  innerPadding = 30,
  waveOpacity = 0.8,
  animationDirection = 'normal',
  theme = 'ocean',
  customTheme,
  className = '',
  style = {},
  onContainerClick
}) => {
  const [waveContainers, setWaveContainers] = useState<WaveContainer[]>(containers);
  const [config, setConfig] = useState({
    containerSize,
    waveHeight,
    waveWidth,
    animationSpeed,
    borderRadius,
    innerPadding,
    waveOpacity
  });
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTheme = customTheme || waveThemes[currentTheme];

  const handleContainerClick = useCallback((containerId: string) => {
    onContainerClick?.(containerId);
  }, [onContainerClick]);

  const updateConfig = useCallback((newConfig: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const updateContainer = useCallback((id: string, updates: Partial<WaveContainer>) => {
    setWaveContainers(prev => prev.map(container => 
      container.id === id ? { ...container, ...updates } : container
    ));
  }, []);

  const addContainer = useCallback(() => {
    const newId = `container-${Date.now()}`;
    const colors = ['#2196f3', '#ff5566', '#4caf50', '#ff9800', '#9c27b0'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newContainer: WaveContainer = {
      id: newId,
      color: randomColor,
      size: config.containerSize,
      active: true
    };
    
    setWaveContainers(prev => [...prev, newContainer]);
  }, [config.containerSize]);

  const removeContainer = useCallback((id: string) => {
    setWaveContainers(prev => prev.filter(container => container.id !== id));
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsAnimationPaused(prev => !prev);
  }, []);

  const containerStyle = {
    '--wave-color': waveColor,
    '--wave-height': `${config.waveHeight}px`,
    '--wave-width': `${config.waveWidth}px`,
    '--animation-speed': `${config.animationSpeed}s`,
    '--border-radius': `${config.borderRadius}px`,
    '--inner-padding': `${config.innerPadding}px`,
    '--wave-opacity': config.waveOpacity,
    '--animation-direction': animationDirection,
    '--animation-play-state': isAnimationPaused ? 'paused' : 'running',
    ...style
  } as React.CSSProperties;

  return (
    <div className={`animated-wave-border-container ${className}`} style={containerStyle}>
      {/* 配置面板 */}
      <div className="wave-config-panel">
        <div className="config-section">
          <h4>波浪配置</h4>
          <div className="config-row">
            <div className="config-item">
              <label>容器尺寸: {config.containerSize}px</label>
              <input
                type="range"
                min="200"
                max="500"
                value={config.containerSize}
                onChange={(e) => updateConfig({ containerSize: Number(e.target.value) })}
              />
            </div>
            
            <div className="config-item">
              <label>波浪高度: {config.waveHeight}px</label>
              <input
                type="range"
                min="5"
                max="30"
                value={config.waveHeight}
                onChange={(e) => updateConfig({ waveHeight: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="config-row">
            <div className="config-item">
              <label>波浪宽度: {config.waveWidth}px</label>
              <input
                type="range"
                min="20"
                max="80"
                value={config.waveWidth}
                onChange={(e) => updateConfig({ waveWidth: Number(e.target.value) })}
              />
            </div>
            
            <div className="config-item">
              <label>动画速度: {config.animationSpeed}s</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={config.animationSpeed}
                onChange={(e) => updateConfig({ animationSpeed: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="config-row">
            <div className="config-item">
              <label>透明度: {config.waveOpacity.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={config.waveOpacity}
                onChange={(e) => updateConfig({ waveOpacity: Number(e.target.value) })}
              />
            </div>
            
            <div className="config-item">
              <label>主题</label>
              <select 
                value={currentTheme} 
                onChange={(e) => setCurrentTheme(e.target.value as any)}
              >
                <option value="ocean">海洋</option>
                <option value="sunset">日落</option>
                <option value="forest">森林</option>
                <option value="night">夜空</option>
              </select>
            </div>
          </div>

          <div className="config-row">
            <div className="config-item">
              <button onClick={toggleAnimation} className="control-btn">
                {isAnimationPaused ? '▶️ 播放' : '⏸️ 暂停'}
              </button>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h4>容器管理</h4>
          <div className="containers-manager">
            {waveContainers.map((container) => (
              <div key={container.id} className="container-editor">
                <input
                  type="color"
                  value={container.color}
                  onChange={(e) => updateContainer(container.id, { color: e.target.value })}
                />
                <input
                  type="range"
                  min="200"
                  max="400"
                  value={container.size}
                  onChange={(e) => updateContainer(container.id, { size: Number(e.target.value) })}
                  title={`尺寸: ${container.size}px`}
                />
                <button 
                  onClick={() => updateContainer(container.id, { active: !container.active })}
                  className={container.active ? 'active' : ''}
                >
                  {container.active ? '✓' : '○'}
                </button>
                <button 
                  onClick={() => removeContainer(container.id)}
                  className="remove-btn"
                  disabled={waveContainers.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addContainer} className="add-btn">
              ➕ 添加容器
            </button>
          </div>
        </div>
      </div>

      {/* 波浪容器展示 */}
      <div 
        ref={containerRef}
        className="wave-containers-display"
        style={{ backgroundColor: activeTheme.backgroundColor }}
      >
        {waveContainers.map((container) => (
          <div
            key={container.id}
            className={`wave-box ${container.active ? 'active' : ''}`}
            style={{
              '--clr': container.color,
              '--container-size': `${container.size}px`,
              width: `${container.size}px`,
              height: `${container.size}px`
            } as React.CSSProperties}
            onClick={() => handleContainerClick(container.id)}
          >
            <span style={{ '--i': 0 } as React.CSSProperties}></span>
            <span style={{ '--i': 1 } as React.CSSProperties}></span>
            <span style={{ '--i': 2 } as React.CSSProperties}></span>
            <span style={{ '--i': 3 } as React.CSSProperties}></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedWaveBorder;