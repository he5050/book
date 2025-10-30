import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface BeautifulFlowerConfig {
  flowerCount?: number;
  animationSpeed?: number;
  flowerColors?: string[];
  stemColor?: string;
  grassColor?: string;
  lightColors?: string[];
  enableLights?: boolean;
  enableSwaying?: boolean;
  backgroundDark?: boolean;
  showConfigPanel?: boolean;
  onConfigChange?: (config: Partial<BeautifulFlowerConfig>) => void;
}

const BeautifulFlower: React.FC<BeautifulFlowerConfig> = ({
  flowerCount = 3,
  animationSpeed = 1,
  flowerColors = ['#a7ffee', '#54b8aa'],
  stemColor = '#39c6d6',
  grassColor = '#159faa',
  lightColors = ['#ffff00', '#23f0ff'],
  enableLights = true,
  enableSwaying = true,
  backgroundDark = true,
  showConfigPanel = false,
  onConfigChange
}) => {
  const [internalConfig, setInternalConfig] = useState({
    flowerCount, animationSpeed, flowerColors, stemColor, grassColor,
    lightColors, enableLights, enableSwaying, backgroundDark
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 当外部props变化时，更新内部配置
  useEffect(() => {
    setInternalConfig({
      flowerCount, animationSpeed, flowerColors, stemColor, grassColor,
      lightColors, enableLights, enableSwaying, backgroundDark
    });
  }, [flowerCount, animationSpeed, flowerColors, stemColor, grassColor, lightColors, enableLights, enableSwaying, backgroundDark]);

  // 模拟加载完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 处理配置变化
  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...internalConfig, [key]: value };
    setInternalConfig(newConfig);
    onConfigChange?.({ [key]: value });
  };

  // 生成花朵组件
  const renderFlower = (index: number) => {
    const flowerClass = `flower flower--${index + 1}`;
    const leafsClass = `flower__leafs flower__leafs--${index + 1}`;
    
    return (
      <div key={index} className={flowerClass}>
        <div className={leafsClass}>
          <div className="flower__leaf flower__leaf--1"></div>
          <div className="flower__leaf flower__leaf--2"></div>
          <div className="flower__leaf flower__leaf--3"></div>
          <div className="flower__leaf flower__leaf--4"></div>
          <div className="flower__white-circle"></div>
        </div>
        <div className="flower__line">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
          ))}
        </div>
        {internalConfig.enableLights && Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
        ))}
      </div>
    );
  };

  // 生成草地组件
  const renderGrass = () => (
    <>
      <div className="flower__grass flower__grass--1">
        <div className="flower__grass--top"></div>
        <div className="flower__grass--bottom"></div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i + 1}`}></div>
        ))}
        <div className="flower__grass__overlay"></div>
      </div>
      <div className="flower__grass flower__grass--2">
        <div className="flower__grass--top"></div>
        <div className="flower__grass--bottom"></div>
      </div>
    </>
  );

  // 生成长草组件
  const renderLongGrass = () => (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className={`long-g long-g--${i + 1}`}>
          <div className="leaf leaf--0"></div>
          <div className="leaf leaf--1"></div>
          <div className="leaf leaf--2"></div>
          <div className="leaf leaf--3"></div>
        </div>
      ))}
    </>
  );

  return (
    <div className="beautiful-flower" ref={containerRef}>
      <div 
        className={`flower-container ${!isLoaded ? 'not-loaded' : ''}`}
        style={{
          '--flower-color-1': internalConfig.flowerColors[0],
          '--flower-color-2': internalConfig.flowerColors[1] || internalConfig.flowerColors[0],
          '--stem-color': internalConfig.stemColor,
          '--grass-color': internalConfig.grassColor,
          '--light-color-1': internalConfig.lightColors[0],
          '--light-color-2': internalConfig.lightColors[1] || internalConfig.lightColors[0],
          '--animation-speed': internalConfig.animationSpeed,
          '--bg-color': internalConfig.backgroundDark ? '#000' : '#87ceeb'
        } as React.CSSProperties}
      >
        <div className="night"></div>
        <div className="flowers">
          {Array.from({ length: Math.min(internalConfig.flowerCount, 3) }, (_, i) => renderFlower(i))}
          {renderGrass()}
          <div className="flower__g-long">
            <div className="flower__g-long__top"></div>
            <div className="flower__g-long__bottom"></div>
          </div>
          <div className="flower__g-right flower__g-right--1">
            <div className="leaf"></div>
          </div>
          <div className="flower__g-right flower__g-right--2">
            <div className="leaf"></div>
          </div>
          <div className="flower__g-front">
            <div className="flower__g-front__line">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${i + 1}`}>
                  <div className="flower__g-front__leaf"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flower__g-fr">
            <div className="leaf">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`flower__g-fr__leaf flower__g-fr__leaf--${i + 1}`}></div>
              ))}
            </div>
          </div>
        </div>
        {renderLongGrass()}
      </div>

      {showConfigPanel && (
        <div className="config-panel">
          <h3>配置选项</h3>
          
          <div className="config-item">
            <label>花朵数量: {internalConfig.flowerCount}</label>
            <input
              type="range"
              min="1"
              max="3"
              value={internalConfig.flowerCount}
              onChange={(e) => handleConfigChange('flowerCount', parseInt(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>动画速度: {internalConfig.animationSpeed}x</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={internalConfig.animationSpeed}
              onChange={(e) => handleConfigChange('animationSpeed', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>花朵主色:</label>
            <input
              type="color"
              value={internalConfig.flowerColors[0]}
              onChange={(e) => handleConfigChange('flowerColors', [e.target.value, internalConfig.flowerColors[1] || e.target.value])}
            />
          </div>
          
          <div className="config-item">
            <label>茎干颜色:</label>
            <input
              type="color"
              value={internalConfig.stemColor}
              onChange={(e) => handleConfigChange('stemColor', e.target.value)}
            />
          </div>
          
          <div className="config-item">
            <label>草地颜色:</label>
            <input
              type="color"
              value={internalConfig.grassColor}
              onChange={(e) => handleConfigChange('grassColor', e.target.value)}
            />
          </div>
          
          <div className="config-item">
            <label>光点颜色:</label>
            <input
              type="color"
              value={internalConfig.lightColors[0]}
              onChange={(e) => handleConfigChange('lightColors', [e.target.value, internalConfig.lightColors[1] || e.target.value])}
            />
          </div>
          
          <div className="config-item">
            <label>
              <input
                type="checkbox"
                checked={internalConfig.enableLights}
                onChange={(e) => handleConfigChange('enableLights', e.target.checked)}
              />
              显示光点效果
            </label>
          </div>
          
          <div className="config-item">
            <label>
              <input
                type="checkbox"
                checked={internalConfig.enableSwaying}
                onChange={(e) => handleConfigChange('enableSwaying', e.target.checked)}
              />
              启用摇摆动画
            </label>
          </div>
          
          <div className="config-item">
            <label>
              <input
                type="checkbox"
                checked={internalConfig.backgroundDark}
                onChange={(e) => handleConfigChange('backgroundDark', e.target.checked)}
              />
              深色背景
            </label>
          </div>
          
          <div className="effect-info">
            <div>花朵数量: {internalConfig.flowerCount}</div>
            <div>动画速度: {internalConfig.animationSpeed}x</div>
            <div>加载状态: {isLoaded ? '已完成' : '加载中'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautifulFlower;