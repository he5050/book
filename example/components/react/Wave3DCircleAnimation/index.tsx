import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface Wave3DConfig {
  circleCount: number;
  containerSize: number;
  borderWidth: number;
  spacing: number;
  animationDuration: number;
  delayStep: number;
  perspective: number;
  rotateX: number;
  zDistance: number;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  dashColor: string;
}

interface Wave3DCircleAnimationProps {
  config?: Partial<Wave3DConfig>;
  className?: string;
  style?: React.CSSProperties;
}

const defaultConfig: Wave3DConfig = {
  circleCount: 15,
  containerSize: 450,
  borderWidth: 15,
  spacing: 15,
  animationDuration: 4.5,
  delayStep: 0.13,
  perspective: 500,
  rotateX: 60,
  zDistance: 150,
  primaryColor: '#ffffff',
  accentColor: '#21e8a5',
  backgroundColor: '#156408',
  dashColor: '#156408'
};

const Wave3DCircleAnimation: React.FC<Wave3DCircleAnimationProps> = ({
  config = {},
  className = '',
  style = {}
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const containerRef = useRef<HTMLDivElement>(null);

  const generateCircles = () => {
    return Array.from({ length: finalConfig.circleCount }, (_, index) => ({
      id: index,
      cssVariable: index,
      delay: index * -finalConfig.delayStep,
      inset: index * finalConfig.spacing
    }));
  };

  const circles = generateCircles();

  const containerStyle: React.CSSProperties = {
    width: finalConfig.containerSize,
    height: finalConfig.containerSize,
    transform: `perspective(${finalConfig.perspective}px) rotateX(${finalConfig.rotateX}deg)`,
    '--border-width': `${finalConfig.borderWidth}px`,
    '--spacing': `${finalConfig.spacing}px`,
    '--animation-duration': `${finalConfig.animationDuration}s`,
    '--delay-step': `${finalConfig.delayStep}s`,
    '--z-distance': `${finalConfig.zDistance}px`,
    '--primary-color': finalConfig.primaryColor,
    '--accent-color': finalConfig.accentColor,
    '--dash-color': finalConfig.dashColor,
    backgroundColor: finalConfig.backgroundColor,
    ...style
  } as React.CSSProperties & Record<string, string>;

  return (
    <div 
      ref={containerRef}
      className={`wave-3d-loader ${className}`}
      style={containerStyle}
    >
      {circles.map(circle => (
        <span
          key={circle.id}
          className="wave-circle"
          style={{
            '--i': circle.cssVariable,
            animationDelay: `${circle.delay}s`
          } as React.CSSProperties & { '--i': number }}
        />
      ))}
    </div>
  );
};

const Wave3DDemo: React.FC = () => {
  const [config, setConfig] = useState<Wave3DConfig>(defaultConfig);
  const [isPlaying, setIsPlaying] = useState(true);

  const updateConfig = (key: keyof Wave3DConfig, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const presetThemes = [
    { 
      name: 'Ocean', 
      primaryColor: '#00bcd4', 
      accentColor: '#4fc3f7', 
      backgroundColor: '#0d47a1',
      dashColor: '#0d47a1'
    },
    { 
      name: 'Fire', 
      primaryColor: '#ff5722', 
      accentColor: '#ffab40', 
      backgroundColor: '#bf360c',
      dashColor: '#bf360c'
    },
    { 
      name: 'Forest', 
      primaryColor: '#4caf50', 
      accentColor: '#81c784', 
      backgroundColor: '#1b5e20',
      dashColor: '#1b5e20'
    },
    { 
      name: 'Purple', 
      primaryColor: '#9c27b0', 
      accentColor: '#ba68c8', 
      backgroundColor: '#4a148c',
      dashColor: '#4a148c'
    }
  ];

  const applyTheme = (theme: typeof presetThemes[0]) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: theme.primaryColor,
      accentColor: theme.accentColor,
      backgroundColor: theme.backgroundColor,
      dashColor: theme.dashColor
    }));
  };

  return (
    <div className="wave-3d-demo">
      <div className="demo-container">
        <div className="preview-section">
          <h3>效果预览</h3>
          <div className="preview-area">
            <Wave3DCircleAnimation 
              config={{
                ...config,
                animationDuration: isPlaying ? config.animationDuration : 0
              }}
            />
          </div>
          <div className="animation-controls">
            <button onClick={toggleAnimation} className="control-btn">
              {isPlaying ? '暂停动画' : '播放动画'}
            </button>
          </div>
        </div>

        <div className="controls-section">
          <h3>参数配置</h3>
          
          <div className="controls-grid">
            <div className="control-group">
              <label>圆环数量: {config.circleCount}</label>
              <input
                type="range"
                min="5"
                max="30"
                value={config.circleCount}
                onChange={(e) => updateConfig('circleCount', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>容器尺寸: {config.containerSize}px</label>
              <input
                type="range"
                min="200"
                max="800"
                value={config.containerSize}
                onChange={(e) => updateConfig('containerSize', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>边框宽度: {config.borderWidth}px</label>
              <input
                type="range"
                min="5"
                max="30"
                value={config.borderWidth}
                onChange={(e) => updateConfig('borderWidth', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>圆环间距: {config.spacing}px</label>
              <input
                type="range"
                min="10"
                max="50"
                value={config.spacing}
                onChange={(e) => updateConfig('spacing', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>动画时长: {config.animationDuration}s</label>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={config.animationDuration}
                onChange={(e) => updateConfig('animationDuration', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>延迟步长: {config.delayStep}s</label>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.01"
                value={config.delayStep}
                onChange={(e) => updateConfig('delayStep', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>透视距离: {config.perspective}px</label>
              <input
                type="range"
                min="300"
                max="1000"
                value={config.perspective}
                onChange={(e) => updateConfig('perspective', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>X轴旋转: {config.rotateX}°</label>
              <input
                type="range"
                min="30"
                max="90"
                value={config.rotateX}
                onChange={(e) => updateConfig('rotateX', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Z轴距离: {config.zDistance}px</label>
              <input
                type="range"
                min="50"
                max="300"
                value={config.zDistance}
                onChange={(e) => updateConfig('zDistance', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>主圆环颜色:</label>
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig('primaryColor', e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>装饰圆环颜色:</label>
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => updateConfig('accentColor', e.target.value)}
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
          </div>

          <div className="control-group">
            <label>预设主题:</label>
            <div className="theme-buttons">
              {presetThemes.map(theme => (
                <button
                  key={theme.name}
                  className="theme-btn"
                  style={{ backgroundColor: theme.primaryColor }}
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
{`<Wave3DCircleAnimation 
  config={{
    circleCount: ${config.circleCount},
    containerSize: ${config.containerSize},
    borderWidth: ${config.borderWidth},
    spacing: ${config.spacing},
    animationDuration: ${config.animationDuration},
    delayStep: ${config.delayStep},
    perspective: ${config.perspective},
    rotateX: ${config.rotateX},
    zDistance: ${config.zDistance},
    primaryColor: "${config.primaryColor}",
    accentColor: "${config.accentColor}",
    backgroundColor: "${config.backgroundColor}"
  }}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default Wave3DDemo;