import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface PixelButtonConfig {
  pixelSize: number;
  buttonWidth: number;
  buttonHeight: number;
  pixelColor: string;
  scatterRange: number;
  animationDuration: number;
  maxDelay: number;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
}

interface PixelButtonEffectProps {
  config?: Partial<PixelButtonConfig>;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const defaultConfig: PixelButtonConfig = {
  pixelSize: 10,
  buttonWidth: 180,
  buttonHeight: 60,
  pixelColor: '#ff5722',
  scatterRange: 100,
  animationDuration: 0.5,
  maxDelay: 0.5,
  buttonText: 'Hover Me',
  backgroundColor: '#333333',
  textColor: '#ffffff'
};

const PixelButtonEffect: React.FC<PixelButtonEffectProps> = ({
  config = {},
  className = '',
  style = {},
  onClick
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const generatePixelGrid = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const { pixelSize, buttonWidth, buttonHeight, pixelColor, scatterRange, maxDelay } = finalConfig;
    
    const cols = Math.floor(buttonWidth / pixelSize);
    const rows = Math.floor(buttonHeight / pixelSize);
    
    const fragment = document.createDocumentFragment();
    
    for(let row = 0; row < rows; row++){
      for(let col = 0; col < cols; col++){
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        
        // 设置位置
        pixel.style.left = `${col * pixelSize}px`;
        pixel.style.top = `${row * pixelSize}px`;
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        
        // 设置颜色
        pixel.style.backgroundColor = pixelColor;
        
        // 随机散落参数
        const tx = (Math.random() - 0.5) * scatterRange;
        const ty = (Math.random() - 0.5) * scatterRange;
        const delay = Math.random() * maxDelay;
        
        pixel.style.setProperty('--tx', `${tx}px`);
        pixel.style.setProperty('--ty', `${ty}px`);
        pixel.style.transitionDelay = `${delay}s`;
        pixel.style.transitionDuration = `${finalConfig.animationDuration}s`;
        
        fragment.appendChild(pixel);
      }
    }
    
    container.appendChild(fragment);
  };

  useEffect(() => {
    generatePixelGrid();
  }, [finalConfig]);

  const buttonStyle: React.CSSProperties = {
    width: finalConfig.buttonWidth,
    height: finalConfig.buttonHeight,
    backgroundColor: finalConfig.backgroundColor,
    color: finalConfig.textColor,
    ...style
  };

  return (
    <button
      ref={buttonRef}
      className={`pixel-button ${className} ${isHovered ? 'hovered' : ''}`}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span className="button-text">{finalConfig.buttonText}</span>
      <div ref={containerRef} className="pixel-container"></div>
    </button>
  );
};

const PixelButtonDemo: React.FC = () => {
  const [config, setConfig] = useState<PixelButtonConfig>(defaultConfig);

  const updateConfig = (key: keyof PixelButtonConfig, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  const presetThemes = [
    { name: 'Fire', pixelColor: '#ff5722', backgroundColor: '#333333' },
    { name: 'Ocean', pixelColor: '#03a9f4', backgroundColor: '#1a237e' },
    { name: 'Forest', pixelColor: '#4caf50', backgroundColor: '#2e7d32' },
    { name: 'Sunset', pixelColor: '#ff9800', backgroundColor: '#e65100' }
  ];

  const applyTheme = (theme: typeof presetThemes[0]) => {
    setConfig(prev => ({
      ...prev,
      pixelColor: theme.pixelColor,
      backgroundColor: theme.backgroundColor
    }));
  };

  return (
    <div className="pixel-button-demo">
      <div className="demo-container">
        <div className="preview-section">
          <h3>效果预览</h3>
          <div className="preview-area">
            <PixelButtonEffect 
              config={config}
              onClick={() => console.log('Button clicked!')}
            />
          </div>
        </div>

        <div className="controls-section">
          <h3>参数配置</h3>
          
          <div className="controls-grid">
            <div className="control-group">
              <label>按钮文字:</label>
              <input
                type="text"
                value={config.buttonText}
                onChange={(e) => updateConfig('buttonText', e.target.value)}
                placeholder="输入按钮文字"
              />
            </div>

            <div className="control-group">
              <label>像素大小: {config.pixelSize}px</label>
              <input
                type="range"
                min="5"
                max="20"
                value={config.pixelSize}
                onChange={(e) => updateConfig('pixelSize', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>按钮宽度: {config.buttonWidth}px</label>
              <input
                type="range"
                min="120"
                max="300"
                value={config.buttonWidth}
                onChange={(e) => updateConfig('buttonWidth', Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>按钮高度: {config.buttonHeight}px</label>
              <input
                type="range"
                min="40"
                max="100"
                value={config.buttonHeight}
                onChange={(e) => updateConfig('buttonHeight', Number(e.target.value))}
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
              <label>像素颜色:</label>
              <input
                type="color"
                value={config.pixelColor}
                onChange={(e) => updateConfig('pixelColor', e.target.value)}
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
          </div>

          <div className="control-group">
            <label>预设主题:</label>
            <div className="theme-buttons">
              {presetThemes.map(theme => (
                <button
                  key={theme.name}
                  className="theme-btn"
                  style={{ backgroundColor: theme.pixelColor }}
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
{`<PixelButtonEffect 
  config={{
    pixelSize: ${config.pixelSize},
    buttonWidth: ${config.buttonWidth},
    buttonHeight: ${config.buttonHeight},
    pixelColor: "${config.pixelColor}",
    scatterRange: ${config.scatterRange},
    animationDuration: ${config.animationDuration},
    maxDelay: ${config.maxDelay},
    buttonText: "${config.buttonText}",
    backgroundColor: "${config.backgroundColor}",
    textColor: "${config.textColor}"
  }}
  onClick={() => console.log('Button clicked!')}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default PixelButtonDemo;