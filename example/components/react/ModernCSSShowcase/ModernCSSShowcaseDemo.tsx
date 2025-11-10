import React, { useState } from 'react';
import ModernCSSShowcase from './index';

const ModernCSSShowcaseDemo: React.FC = () => {
  const [config, setConfig] = useState({
    primaryColor: '#3498db',
    animationDuration: 300,
    borderRadius: 8,
    spacing: 16,
    fontSize: 16,
    gridColumns: 3,
    gridGap: 20,
    easing: 'ease-out',
    hoverScale: 1.05,
    transitionDuration: 200,
    theme: 'light' as 'light' | 'dark'
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="modern-css-showcase-demo">
      {/* 配置面板 */}
      <div className="config-panel">
        <h3>配置参数</h3>
        
        <div className="config-grid">
          {/* 颜色配置 */}
          <div className="config-group">
            <h4>颜色设置</h4>
            <div className="config-item">
              <label>主色调</label>
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
              />
            </div>
          </div>
          
          {/* 动画配置 */}
          <div className="config-group">
            <h4>动画设置</h4>
            <div className="config-item">
              <label>动画时长 (ms)</label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={config.animationDuration}
                onChange={(e) => handleConfigChange('animationDuration', Number(e.target.value))}
              />
              <span>{config.animationDuration}ms</span>
            </div>
            
            <div className="config-item">
              <label>悬停缩放</label>
              <input
                type="range"
                min="1"
                max="1.2"
                step="0.01"
                value={config.hoverScale}
                onChange={(e) => handleConfigChange('hoverScale', Number(e.target.value))}
              />
              <span>{config.hoverScale}</span>
            </div>
            
            <div className="config-item">
              <label>过渡时间 (ms)</label>
              <input
                type="range"
                min="100"
                max="500"
                step="25"
                value={config.transitionDuration}
                onChange={(e) => handleConfigChange('transitionDuration', Number(e.target.value))}
              />
              <span>{config.transitionDuration}ms</span>
            </div>
            
            <div className="config-item">
              <label>缓动函数</label>
              <select
                value={config.easing}
                onChange={(e) => handleConfigChange('easing', e.target.value)}
              >
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="linear">linear</option>
              </select>
            </div>
          </div>
          
          {/* 布局配置 */}
          <div className="config-group">
            <h4>布局设置</h4>
            <div className="config-item">
              <label>网格列数</label>
              <input
                type="range"
                min="1"
                max="4"
                value={config.gridColumns}
                onChange={(e) => handleConfigChange('gridColumns', Number(e.target.value))}
              />
              <span>{config.gridColumns}</span>
            </div>
            
            <div className="config-item">
              <label>网格间距 (px)</label>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={config.gridGap}
                onChange={(e) => handleConfigChange('gridGap', Number(e.target.value))}
              />
              <span>{config.gridGap}px</span>
            </div>
            
            <div className="config-item">
              <label>圆角大小 (px)</label>
              <input
                type="range"
                min="0"
                max="20"
                value={config.borderRadius}
                onChange={(e) => handleConfigChange('borderRadius', Number(e.target.value))}
              />
              <span>{config.borderRadius}px</span>
            </div>
            
            <div className="config-item">
              <label>基础间距 (px)</label>
              <input
                type="range"
                min="8"
                max="32"
                step="2"
                value={config.spacing}
                onChange={(e) => handleConfigChange('spacing', Number(e.target.value))}
              />
              <span>{config.spacing}px</span>
            </div>
          </div>
          
          {/* 字体配置 */}
          <div className="config-group">
            <h4>字体设置</h4>
            <div className="config-item">
              <label>基础字体大小 (px)</label>
              <input
                type="range"
                min="12"
                max="20"
                value={config.fontSize}
                onChange={(e) => handleConfigChange('fontSize', Number(e.target.value))}
              />
              <span>{config.fontSize}px</span>
            </div>
          </div>
          
          {/* 主题配置 */}
          <div className="config-group">
            <h4>主题设置</h4>
            <div className="config-switches">
              <button
                className={`theme-switch ${config.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleConfigChange('theme', 'light')}
              >
                🌞 浅色主题
              </button>
              <button
                className={`theme-switch ${config.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleConfigChange('theme', 'dark')}
              >
                🌙 深色主题
              </button>
            </div>
          </div>
        </div>
        
        {/* 重置按钮 */}
        <div className="config-actions">
          <button
            className="reset-btn"
            onClick={() => setConfig({
              primaryColor: '#3498db',
              animationDuration: 300,
              borderRadius: 8,
              spacing: 16,
              fontSize: 16,
              gridColumns: 3,
              gridGap: 20,
              easing: 'ease-out',
              hoverScale: 1.05,
              transitionDuration: 200,
              theme: 'light'
            })}
          >
            重置配置
          </button>
        </div>
      </div>

      {/* 组件展示 */}
      <div className="showcase-container">
        <ModernCSSShowcase {...config} />
      </div>

      {/* 使用说明 */}
      <div className="usage-guide">
        <h4>使用说明</h4>
        <ul>
          <li>调整上方配置参数可以实时看到效果变化</li>
          <li>支持颜色、动画、布局、字体等多维度自定义</li>
          <li>展示了现代CSS的核心技巧和最佳实践</li>
          <li>包含Flexbox、Grid、动画、响应式等技术</li>
          <li>所有效果都使用纯CSS实现，性能优异</li>
          <li>支持浅色和深色两种主题模式</li>
        </ul>
      </div>
    </div>
  );
};

export default ModernCSSShowcaseDemo;