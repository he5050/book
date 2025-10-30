import React, { useState } from 'react';
import LightShadowText from './index';
import './demo.scss';

/**
 * 光影文本阴影动画演示页面
 * 展示光影文本效果的各种配置和使用方式
 */
export const LightShadowTextDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'custom'>('basic');
  const [config, setConfig] = useState({
    text: "Shadow",
    fontSize: 6, // 调整默认字体大小
    textColor: "#fff",
    shadowLayers: 200,
    shadowColor: "rgba(33,33,33,1)",
    lightSize: 50,
    lightColor: "#fff",
    showLight: true,
    sensitivity: 1
  });

  const presetConfigs = {
    classic: {
      text: "SHADOW",
      fontSize: 6, // 调整适应容器
      textColor: "#fff",
      shadowLayers: 200,
      shadowColor: "rgba(33,33,33,1)",
      lightColor: "#fff",
      sensitivity: 1,
      title: '经典效果'
    },
    neon: {
      text: "NEON",
      fontSize: 5.5,
      textColor: "#00ff88",
      shadowLayers: 150,
      shadowColor: "rgba(0,255,136,1)",
      lightColor: "#00ff88",
      sensitivity: 1.5,
      title: '霓虹效果'
    },
    fire: {
      text: "FIRE",
      fontSize: 6.5,
      textColor: "#ff4444",
      shadowLayers: 180,
      shadowColor: "rgba(255,68,68,1)",
      lightColor: "#ff6b35",
      sensitivity: 1.2,
      title: '火焰效果'
    },
    ice: {
      text: "ICE",
      fontSize: 7,
      textColor: "#4dd0e1",
      shadowLayers: 220,
      shadowColor: "rgba(77,208,225,1)",
      lightColor: "#81d4fa",
      sensitivity: 0.8,
      title: '冰霜效果'
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyPreset = (preset: keyof typeof presetConfigs) => {
    const presetConfig = presetConfigs[preset];
    setConfig({
      text: presetConfig.text,
      fontSize: presetConfig.fontSize,
      textColor: presetConfig.textColor,
      shadowLayers: presetConfig.shadowLayers,
      shadowColor: presetConfig.shadowColor,
      lightSize: config.lightSize,
      lightColor: presetConfig.lightColor,
      showLight: config.showLight,
      sensitivity: presetConfig.sensitivity
    });
  };

  const handleEffectChange = (newConfig: any) => {
    console.log('光影效果变化:', newConfig);
  };

  return (
    <div className="light-shadow-text-demo">
      <div className="demo-header">
        <h1>光影文本阴影动画演示</h1>
        <p>跟随鼠标移动的动态光影文本效果，创造逼真的光照投影动画</p>
      </div>

      <div className="demo-tabs">
        <button 
          className={activeTab === 'basic' ? 'active' : ''}
          onClick={() => setActiveTab('basic')}
        >
          基础演示
        </button>
        <button 
          className={activeTab === 'advanced' ? 'active' : ''}
          onClick={() => setActiveTab('advanced')}
        >
          高级配置
        </button>
        <button 
          className={activeTab === 'custom' ? 'active' : ''}
          onClick={() => setActiveTab('custom')}
        >
          自定义设置
        </button>
      </div>

      <div className="demo-content">
        {activeTab === 'basic' && (
          <div className="basic-demo">
            <h2>基础演示</h2>
            <div className="preset-buttons">
              {Object.entries(presetConfigs).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as keyof typeof presetConfigs)}
                  className="preset-btn"
                  style={{ 
                    borderColor: preset.textColor,
                    color: preset.textColor 
                  }}
                >
                  {preset.title}
                </button>
              ))}
            </div>
            <div className="demo-showcase">
              <LightShadowText
                {...config}
                onConfigChange={handleEffectChange}
              />
            </div>
            <div className="usage-tip">
              <p>💡 移动鼠标查看光影效果变化</p>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="advanced-demo">
            <h2>高级配置</h2>
            <div className="config-grid">
              <div className="config-section">
                <h3>文本设置</h3>
                <div className="config-item">
                  <label>文本内容:</label>
                  <input
                    type="text"
                    value={config.text}
                    onChange={(e) => handleConfigChange('text', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>字体大小: {config.fontSize}em</label>
                  <input
                    type="range"
                    min="2"
                    max="12" 
                    step="0.5"
                    value={config.fontSize}
                    onChange={(e) => handleConfigChange('fontSize', parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>文字颜色:</label>
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => handleConfigChange('textColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="config-section">
                <h3>阴影设置</h3>
                <div className="config-item">
                  <label>阴影层数: {config.shadowLayers}</label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={config.shadowLayers}
                    onChange={(e) => handleConfigChange('shadowLayers', parseInt(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>敏感度: {config.sensitivity}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={config.sensitivity}
                    onChange={(e) => handleConfigChange('sensitivity', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="config-section">
                <h3>光源设置</h3>
                <div className="config-item">
                  <label>光源颜色:</label>
                  <input
                    type="color"
                    value={config.lightColor}
                    onChange={(e) => handleConfigChange('lightColor', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>光源大小: {config.lightSize}px</label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={config.lightSize}
                    onChange={(e) => handleConfigChange('lightSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={config.showLight}
                      onChange={(e) => handleConfigChange('showLight', e.target.checked)}
                    />
                    显示光源
                  </label>
                </div>
              </div>
            </div>
            
            <div className="demo-showcase">
              <LightShadowText
                {...config}
                onConfigChange={handleEffectChange}
              />
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="custom-demo">
            <h2>自定义设置</h2>
            <div className="demo-showcase">
              <LightShadowText
                {...config}
                showConfigPanel={true}
                onConfigChange={(newConfig) => {
                  setConfig(prev => ({ ...prev, ...newConfig }));
                }}
              />
            </div>

            <div className="config-export">
              <h3>配置导出</h3>
              <pre className="config-code">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LightShadowTextDemo;