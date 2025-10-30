import React, { useState } from 'react';
import BeautifulFlower from './index';
import './demo.scss';

/**
 * 精美的花朵儿动画演示页面
 * 展示花朵生长动画的各种配置和使用方式
 */
export const BeautifulFlowerDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'custom'>('basic');
  const [config, setConfig] = useState({
    flowerCount: 3,
    animationSpeed: 1,
    flowerColors: ['#a7ffee', '#54b8aa'],
    stemColor: '#39c6d6',
    grassColor: '#159faa',
    lightColors: ['#ffff00', '#23f0ff'],
    enableLights: true,
    enableSwaying: true,
    backgroundDark: true
  });

  const presetConfigs = {
    spring: {
      flowerColors: ['#ffb3d9', '#ff80cc'],
      stemColor: '#7ed321',
      grassColor: '#4caf50',
      lightColors: ['#ffd93d', '#ff6b35'],
      backgroundDark: false,
      title: '春天花园'
    },
    summer: {
      flowerColors: ['#ffd93d', '#ff6b35'],
      stemColor: '#4caf50',
      grassColor: '#8bc34a',
      lightColors: ['#ffeb3b', '#ff9800'],
      backgroundDark: false,
      title: '夏日阳光'
    },
    autumn: {
      flowerColors: ['#ff8c42', '#ff3c38'],
      stemColor: '#8bc34a',
      grassColor: '#689f38',
      lightColors: ['#ff5722', '#ff9800'],
      backgroundDark: false,
      title: '秋日暖阳'
    },
    night: {
      flowerColors: ['#e1f5fe', '#b3e5fc'],
      stemColor: '#607d8b',
      grassColor: '#455a64',
      lightColors: ['#00bcd4', '#03a9f4'],
      backgroundDark: true,
      title: '夜晚花园'
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
    setConfig(prev => ({
      ...prev,
      flowerColors: presetConfig.flowerColors,
      stemColor: presetConfig.stemColor,
      grassColor: presetConfig.grassColor,
      lightColors: presetConfig.lightColors,
      backgroundDark: presetConfig.backgroundDark
    }));
  };

  const handleEffectChange = (newConfig: any) => {
    console.log('花朵动画配置变化:', newConfig);
  };

  return (
    <div className="beautiful-flower-demo">
      <div className="demo-header">
        <h1>精美的花朵儿动画演示</h1>
        <p>纯CSS实现的精美花朵生长动画效果，包含花朵绽放、草叶摇摆、光点飞舞等多种动画元素</p>
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
                    borderColor: preset.flowerColors[0],
                    color: preset.flowerColors[0] 
                  }}
                >
                  {preset.title}
                </button>
              ))}
            </div>
            <div className="demo-showcase">
              <BeautifulFlower
                {...config}
                showConfigPanel={true}
                onConfigChange={(newConfig) => {
                  setConfig(prev => ({ ...prev, ...newConfig }));
                }}
              />
            </div>
            <div className="usage-tip">
              <p>🌸 观看花朵从萌芽到绽放的完整生长过程</p>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="advanced-demo">
            <h2>高级配置</h2>
            <div className="config-grid">
              <div className="config-section">
                <h3>花朵设置</h3>
                <div className="config-item">
                  <label>花朵数量: {config.flowerCount}</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={config.flowerCount}
                    onChange={(e) => handleConfigChange('flowerCount', parseInt(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>动画速度: {config.animationSpeed}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={config.animationSpeed}
                    onChange={(e) => handleConfigChange('animationSpeed', parseFloat(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>花朵主色:</label>
                  <input
                    type="color"
                    value={config.flowerColors[0]}
                    onChange={(e) => handleConfigChange('flowerColors', [e.target.value, config.flowerColors[1]])}
                  />
                </div>
              </div>

              <div className="config-section">
                <h3>植物设置</h3>
                <div className="config-item">
                  <label>茎干颜色:</label>
                  <input
                    type="color"
                    value={config.stemColor}
                    onChange={(e) => handleConfigChange('stemColor', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>草地颜色:</label>
                  <input
                    type="color"
                    value={config.grassColor}
                    onChange={(e) => handleConfigChange('grassColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="config-section">
                <h3>效果设置</h3>
                <div className="config-item">
                  <label>光点颜色:</label>
                  <input
                    type="color"
                    value={config.lightColors[0]}
                    onChange={(e) => handleConfigChange('lightColors', [e.target.value, config.lightColors[1]])}
                  />
                </div>
                <div className="config-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={config.enableLights}
                      onChange={(e) => handleConfigChange('enableLights', e.target.checked)}
                    />
                    显示光点效果
                  </label>
                </div>
                <div className="config-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={config.backgroundDark}
                      onChange={(e) => handleConfigChange('backgroundDark', e.target.checked)}
                    />
                    深色背景
                  </label>
                </div>
              </div>
            </div>
            
            <div className="demo-showcase">
              <BeautifulFlower
                {...config}
                showConfigPanel={true}
                onConfigChange={(newConfig) => {
                  setConfig(prev => ({ ...prev, ...newConfig }));
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="custom-demo">
            <h2>自定义设置</h2>
            <div className="demo-showcase">
              <BeautifulFlower
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

export default BeautifulFlowerDemo;