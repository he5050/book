import React, { useState, useEffect } from 'react';
import './index.scss';

interface WaterDropConfig {
  size: number;
  shadowIntensity: number;
  highlightSize: number;
  blurRadius: number;
  backgroundColor: string;
  shadowColor: string;
}

interface ColorTheme {
  background: string;
  shadowColor: string;
  highlightColor: string;
}

interface WaterDropProps {
  config?: Partial<WaterDropConfig>;
  theme?: string;
  className?: string;
  style?: React.CSSProperties;
}

const themes: Record<string, ColorTheme> = {
  classic: {
    background: 'linear-gradient(135deg,#fff,#eff0f4)',
    shadowColor: 'rgba(0,0,0,0.1)',
    highlightColor: '#ffffff'
  },
  ocean: {
    background: 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
    shadowColor: 'rgba(33,150,243,0.2)',
    highlightColor: '#ffffff'
  },
  sunset: {
    background: 'linear-gradient(135deg,#fff3e0,#ffcc02)',
    shadowColor: 'rgba(255,152,0,0.2)',
    highlightColor: '#ffffff'
  },
  dark: {
    background: 'linear-gradient(135deg,#2c2c2c,#1a1a1a)',
    shadowColor: 'rgba(255,255,255,0.1)',
    highlightColor: 'rgba(255,255,255,0.3)'
  }
};

const defaultConfig: WaterDropConfig = {
  size: 200,
  shadowIntensity: 0.1,
  highlightSize: 15,
  blurRadius: 5,
  backgroundColor: '#eff0f4',
  shadowColor: 'rgba(0,0,0,0.1)'
};

const WaterDrop: React.FC<WaterDropProps> = ({
  config = {},
  theme = 'classic',
  className = '',
  style = {}
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const currentTheme = themes[theme] || themes.classic;

  const dropStyle: React.CSSProperties = {
    width: finalConfig.size,
    height: finalConfig.size,
    background: currentTheme.background,
    boxShadow: `
      inset ${finalConfig.highlightSize}px ${finalConfig.highlightSize}px 20px rgba(0,0,0,${finalConfig.shadowIntensity * 0.5}),
      10px 15px 20px ${currentTheme.shadowColor},
      inset -${finalConfig.highlightSize}px -${finalConfig.highlightSize}px 20px ${currentTheme.highlightColor}
    `,
    ...style
  };

  const highlightStyle: React.CSSProperties = {
    inset: finalConfig.highlightSize,
    boxShadow: `inset 10px 10px 10px ${currentTheme.highlightColor}`,
    filter: `blur(${finalConfig.blurRadius}px)`
  };

  return (
    <div className={`water-drop-container ${className}`}>
      <div 
        className="water-drop" 
        style={dropStyle}
      >
        <div 
          className="water-drop-highlight" 
          style={highlightStyle}
        />
      </div>
    </div>
  );
};

const WaterDropDemo: React.FC = () => {
  const [config, setConfig] = useState<WaterDropConfig>(defaultConfig);
  const [selectedTheme, setSelectedTheme] = useState('classic');

  const updateConfig = (key: keyof WaterDropConfig, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    setSelectedTheme('classic');
  };

  return (
    <div className="water-drop-demo">
      <div className="demo-container">
        <div className="preview-section">
          <h3>效果预览</h3>
          <div className="preview-area">
            <WaterDrop 
              config={config} 
              theme={selectedTheme}
            />
          </div>
        </div>

        <div className="controls-section">
          <h3>参数配置</h3>
          
          <div className="control-group">
            <label>主题选择:</label>
            <select 
              value={selectedTheme} 
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              {Object.keys(themes).map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>尺寸: {config.size}px</label>
            <input
              type="range"
              min="50"
              max="400"
              value={config.size}
              onChange={(e) => updateConfig('size', Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>阴影强度: {config.shadowIntensity}</label>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.01"
              value={config.shadowIntensity}
              onChange={(e) => updateConfig('shadowIntensity', Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>高光大小: {config.highlightSize}px</label>
            <input
              type="range"
              min="5"
              max="50"
              value={config.highlightSize}
              onChange={(e) => updateConfig('highlightSize', Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>模糊半径: {config.blurRadius}px</label>
            <input
              type="range"
              min="2"
              max="15"
              value={config.blurRadius}
              onChange={(e) => updateConfig('blurRadius', Number(e.target.value))}
            />
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
{`<WaterDrop 
  config={{
    size: ${config.size},
    shadowIntensity: ${config.shadowIntensity},
    highlightSize: ${config.highlightSize},
    blurRadius: ${config.blurRadius}
  }}
  theme="${selectedTheme}"
/>`}
        </pre>
      </div>
    </div>
  );
};

export default WaterDropDemo;