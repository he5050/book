import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface LightShadowTextConfig {
  text?: string;
  fontSize?: number;
  textColor?: string;
  shadowLayers?: number;
  shadowColor?: string;
  lightSize?: number;
  lightColor?: string;
  showLight?: boolean;
  sensitivity?: number;
  showConfigPanel?: boolean;
  onConfigChange?: (config: Partial<LightShadowTextConfig>) => void;
}

const LightShadowText: React.FC<LightShadowTextConfig> = ({
  text = "Shadow",
  fontSize = 6, // 调整默认字体大小适应容器
  textColor = "#fff",
  shadowLayers = 200,
  shadowColor = "rgba(33,33,33,1)",
  lightSize = 50,
  lightColor = "#fff",
  showLight = true,
  sensitivity = 1,
  showConfigPanel = false,
  onConfigChange
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [textShadow, setTextShadow] = useState('');
  const [internalConfig, setInternalConfig] = useState({
    text, fontSize, textColor, shadowLayers, shadowColor, 
    lightSize, lightColor, showLight, sensitivity
  });
  
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 当外部props变化时，更新内部配置
  useEffect(() => {
    setInternalConfig({
      text, fontSize, textColor, shadowLayers, shadowColor,
      lightSize, lightColor, showLight, sensitivity
    });
  }, [text, fontSize, textColor, shadowLayers, shadowColor, lightSize, lightColor, showLight, sensitivity]);

  // 生成阴影字符串
  const generateShadow = useCallback((mouseX: number, mouseY: number) => {
    if (!textRef.current || !containerRef.current) return '';

    const containerRect = containerRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    
    // 计算相对于容器的鼠标位置
    const relativeMouseX = mouseX - containerRect.left;
    const relativeMouseY = mouseY - containerRect.top;
    
    // 计算文本中心点（相对于容器）
    const textCenterX = (textRect.left - containerRect.left) + textRect.width / 2;
    const textCenterY = (textRect.top - containerRect.top) + textRect.height / 2;
    
    // 计算距离向量
    const distanceX = (relativeMouseX - textCenterX) * internalConfig.sensitivity;
    const distanceY = (relativeMouseY - textCenterY) * internalConfig.sensitivity;
    
    let shadowString = '';
    
    for (let i = 0; i < internalConfig.shadowLayers; i++) {
      const shadowX = -distanceX * (i / internalConfig.shadowLayers);
      const shadowY = -distanceY * (i / internalConfig.shadowLayers);
      const opacity = Math.max(0, 1 - (i / (internalConfig.shadowLayers / 2)));
      
      if (i > 0) shadowString += ', ';
      
      // 解析shadowColor并应用透明度
      const color = internalConfig.shadowColor.includes('rgba') 
        ? internalConfig.shadowColor.replace(/[\d.]+\)$/, `${opacity})`)
        : internalConfig.shadowColor.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
      
      shadowString += `${shadowX}px ${shadowY}px 0 ${color}`;
    }
    
    return shadowString;
  }, [internalConfig]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // 计算相对于容器的鼠标位置
    const relativeX = mouseX - containerRect.left;
    const relativeY = mouseY - containerRect.top;
    
    // 光源位置使用相对坐标
    setMousePos({ x: relativeX, y: relativeY });
    
    // 阴影计算使用全局坐标
    const shadow = generateShadow(mouseX, mouseY);
    setTextShadow(shadow);
  }, [generateShadow]);

  // 移除节流，确保实时跟随
  const throttledMouseMove = useCallback((event: MouseEvent) => {
    handleMouseMove(event);
  }, [handleMouseMove]);

  useEffect(() => {
    // 监听全局鼠标移动事件，确保光源跟随准确
    document.addEventListener('mousemove', throttledMouseMove);
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
    };
  }, [throttledMouseMove]);

  // 处理配置变化
  const handleConfigChange = useCallback((key: string, value: any) => {
    const newConfig = { ...internalConfig, [key]: value };
    setInternalConfig(newConfig);
    
    // 重新生成阴影
    const shadow = generateShadow(mousePos.x, mousePos.y);
    setTextShadow(shadow);
    
    // 触发外部回调
    onConfigChange?.({ [key]: value });
  }, [internalConfig, mousePos, generateShadow, onConfigChange]);

  return (
    <div className="light-shadow-text" ref={containerRef}>
      <div 
        className="text-element"
        ref={textRef}
        style={{
          fontSize: `${internalConfig.fontSize}em`,
          color: internalConfig.textColor,
          textShadow: textShadow
        }}
      >
        {internalConfig.text}
      </div>
      
      {internalConfig.showLight && (
        <div 
          className="light-source"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            width: `${internalConfig.lightSize}px`,
            height: `${internalConfig.lightSize}px`,
            background: internalConfig.lightColor,
            boxShadow: `
              0 0 15px ${internalConfig.lightColor},
              0 0 50px ${internalConfig.lightColor},
              0 0 100px ${internalConfig.lightColor},
              0 0 200px ${internalConfig.lightColor},
              0 0 300px ${internalConfig.lightColor}
            `
          }}
        />
      )}

      {showConfigPanel && (
        <div className="config-panel">
          <h3>配置选项</h3>
          
          <div className="config-item">
            <label>文本内容:</label>
            <input
              type="text"
              value={internalConfig.text}
              onChange={(e) => handleConfigChange('text', e.target.value)}
            />
          </div>
          
          <div className="config-item">
            <label>字体大小: {internalConfig.fontSize}em</label>
            <input
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={internalConfig.fontSize}
              onChange={(e) => handleConfigChange('fontSize', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>阴影层数: {internalConfig.shadowLayers}</label>
            <input
              type="range"
              min="50"
              max="500"
              value={internalConfig.shadowLayers}
              onChange={(e) => handleConfigChange('shadowLayers', parseInt(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>敏感度: {internalConfig.sensitivity}</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={internalConfig.sensitivity}
              onChange={(e) => handleConfigChange('sensitivity', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>文字颜色:</label>
            <input
              type="color"
              value={internalConfig.textColor}
              onChange={(e) => handleConfigChange('textColor', e.target.value)}
            />
          </div>
          
          <div className="config-item">
            <label>光源颜色:</label>
            <input
              type="color"
              value={internalConfig.lightColor}
              onChange={(e) => handleConfigChange('lightColor', e.target.value)}
            />
          </div>
          
          <div className="config-item">
            <label>光源大小: {internalConfig.lightSize}px</label>
            <input
              type="range"
              min="20"
              max="100"
              value={internalConfig.lightSize}
              onChange={(e) => handleConfigChange('lightSize', parseInt(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>
              <input
                type="checkbox"
                checked={internalConfig.showLight}
                onChange={(e) => handleConfigChange('showLight', e.target.checked)}
              />
              显示光源
            </label>
          </div>
          
          <div className="effect-info">
            <div>鼠标位置: ({Math.round(mousePos.x)}, {Math.round(mousePos.y)})</div>
            <div>阴影层数: {internalConfig.shadowLayers}</div>
            <div>当前敏感度: {internalConfig.sensitivity}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightShadowText;