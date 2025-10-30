import React, { useState } from 'react';
import PasswordStrengthChecker from './index';
import './demo.scss';

/**
 * 密码强度检查器演示页面
 * 展示密码强度检查器的各种配置和使用方式
 */
export const PasswordStrengthCheckerDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'custom'>('basic');
  const [config, setConfig] = useState({
    placeholder: "Enter your password",
    weakThreshold: 4,
    mediumThreshold: 8,
    weakColor: "#ff2c1c",
    mediumColor: "#ff9800",
    strongColor: "#12ff12",
    maxLength: 12,
    showText: true
  });

  const presetConfigs = {
    basic: {
      placeholder: "Enter your password",
      weakThreshold: 4,
      mediumThreshold: 8,
      weakColor: "#ff2c1c",
      mediumColor: "#ff9800",
      strongColor: "#12ff12",
      maxLength: 12,
      showText: true,
      title: '基础配置'
    },
    strict: {
      placeholder: "Create a strong password",
      weakThreshold: 6,
      mediumThreshold: 10,
      weakColor: "#e74c3c",
      mediumColor: "#f39c12",
      strongColor: "#27ae60",
      maxLength: 16,
      showText: true,
      title: '严格模式'
    },
    colorful: {
      placeholder: "输入密码",
      weakThreshold: 3,
      mediumThreshold: 6,
      weakColor: "#ff6b6b",
      mediumColor: "#4ecdc4",
      strongColor: "#45b7d1",
      maxLength: 20,
      showText: true,
      title: '彩色主题'
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
      placeholder: presetConfig.placeholder,
      weakThreshold: presetConfig.weakThreshold,
      mediumThreshold: presetConfig.mediumThreshold,
      weakColor: presetConfig.weakColor,
      mediumColor: presetConfig.mediumColor,
      strongColor: presetConfig.strongColor,
      maxLength: presetConfig.maxLength,
      showText: presetConfig.showText
    });
  };

  const handleStrengthChange = (strength: any) => {
    console.log('密码强度变化:', strength);
  };

  return (
    <div className="password-strength-checker-demo">
      <div className="demo-header">
        <h1>密码强度检查器演示</h1>
        <p>实时检测密码强度的可视化组件，支持多种配置选项</p>
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
                >
                  {preset.title}
                </button>
              ))}
            </div>
            <div className="demo-showcase">
              <PasswordStrengthChecker
                {...config}
                showConfigPanel={true}
                onStrengthChange={handleStrengthChange}
                onConfigChange={(newConfig) => {
                  setConfig(prev => ({ ...prev, ...newConfig }));
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="advanced-demo">
            <h2>高级配置</h2>
            <div className="config-grid">
              <div className="config-section">
                <h3>阈值设置</h3>
                <div className="config-item">
                  <label>弱密码阈值: {config.weakThreshold}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={config.weakThreshold}
                    onChange={(e) => handleConfigChange('weakThreshold', parseInt(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>中等密码阈值: {config.mediumThreshold}</label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={config.mediumThreshold}
                    onChange={(e) => handleConfigChange('mediumThreshold', parseInt(e.target.value))}
                  />
                </div>
                <div className="config-item">
                  <label>最大长度: {config.maxLength}</label>
                  <input
                    type="range"
                    min="8"
                    max="30"
                    value={config.maxLength}
                    onChange={(e) => handleConfigChange('maxLength', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="config-section">
                <h3>颜色设置</h3>
                <div className="config-item">
                  <label>弱密码颜色:</label>
                  <input
                    type="color"
                    value={config.weakColor}
                    onChange={(e) => handleConfigChange('weakColor', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>中等密码颜色:</label>
                  <input
                    type="color"
                    value={config.mediumColor}
                    onChange={(e) => handleConfigChange('mediumColor', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>强密码颜色:</label>
                  <input
                    type="color"
                    value={config.strongColor}
                    onChange={(e) => handleConfigChange('strongColor', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="demo-showcase">
              <PasswordStrengthChecker
                {...config}
                showConfigPanel={true}
                onStrengthChange={handleStrengthChange}
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
            <div className="custom-config">
              <div className="config-item">
                <label>占位符文本:</label>
                <input
                  type="text"
                  value={config.placeholder}
                  onChange={(e) => handleConfigChange('placeholder', e.target.value)}
                />
              </div>
              <div className="config-item">
                <label>
                  <input
                    type="checkbox"
                    checked={config.showText}
                    onChange={(e) => handleConfigChange('showText', e.target.checked)}
                  />
                  显示强度文本
                </label>
              </div>
            </div>
            
            <div className="demo-showcase">
              <PasswordStrengthChecker
                {...config}
                showConfigPanel={true}
                onStrengthChange={handleStrengthChange}
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

export default PasswordStrengthCheckerDemo;