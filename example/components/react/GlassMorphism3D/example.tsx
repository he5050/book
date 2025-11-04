import React, { useState } from 'react';
import GlassMorphism3D from './index';

const GlassMorphism3DExample: React.FC = () => {
  const [config, setConfig] = useState({
    size: 300,
    speed: 1,
    primaryColor: '#ff0080',
    secondaryColor: '#ff8c00',
    glassOpacity: 0.05,
    borderOpacity: 0.25,
    blurIntensity: 24,
    borderWidth: 2,
    rotateX: 35,
    rotateZ: 345,
    translateZ: 90,
    hoverRotation: 360,
    animated: true
  });

  const colorPresets = [
    { name: '经典渐变', primary: '#ff0080', secondary: '#ff8c00' },
    { name: '蓝色科技', primary: '#4a90e2', secondary: '#1abc9c' },
    { name: '紫色梦幻', primary: '#9b59b6', secondary: '#e74c3c' },
    { name: '绿色自然', primary: '#2ecc71', secondary: '#f1c40f' },
    { name: '橙色活力', primary: '#f39c12', secondary: '#e67e22' },
    { name: '粉色浪漫', primary: '#ff6b9d', secondary: '#ffd93d' }
  ];

  const handlePresetChange = (preset: typeof colorPresets[0]) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
  };

  const handleConfigChange = (key: keyof typeof config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-morphism-3d-demo">
      <div className="demo-container">
        <GlassMorphism3D
          {...config}
          onClick={() => console.log('3D玻璃态加载器被点击')}
        />
      </div>
      
      <div className="controls">
        <div className="control-section">
          <h3>基础配置</h3>
          
          <div className="control-group">
            <label>尺寸: {config.size}px</label>
            <input
              type="range"
              min="150"
              max="400"
              step="10"
              value={config.size}
              onChange={(e) => handleConfigChange('size', parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>动画速度: {config.speed}x</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={config.speed}
              onChange={(e) => handleConfigChange('speed', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={config.animated}
                onChange={(e) => handleConfigChange('animated', e.target.checked)}
              />
              启用动画
            </label>
          </div>
        </div>

        <div className="control-section">
          <h3>颜色主题</h3>
          <div className="color-presets">
            {colorPresets.map((preset, index) => (
              <button
                key={index}
                className={`preset-btn ${
                  config.primaryColor === preset.primary ? 'active' : ''
                }`}
                onClick={() => handlePresetChange(preset)}
                style={{
                  background: `linear-gradient(45deg, ${preset.primary}, ${preset.secondary})`
                }}
                title={preset.name}
              >
                {preset.name}
              </button>
            ))}
          </div>
          
          <div className="color-inputs">
            <div className="control-group">
              <label>主色调</label>
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
              />
            </div>
            <div className="control-group">
              <label>次色调</label>
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="control-section">
          <h3>玻璃态效果</h3>
          
          <div className="control-group">
            <label>玻璃透明度: {(config.glassOpacity * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.01"
              value={config.glassOpacity}
              onChange={(e) => handleConfigChange('glassOpacity', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>边框透明度: {(config.borderOpacity * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={config.borderOpacity}
              onChange={(e) => handleConfigChange('borderOpacity', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>模糊强度: {config.blurIntensity}px</label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={config.blurIntensity}
              onChange={(e) => handleConfigChange('blurIntensity', parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>边框宽度: {config.borderWidth}px</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={config.borderWidth}
              onChange={(e) => handleConfigChange('borderWidth', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="control-section">
          <h3>3D变换</h3>
          
          <div className="control-group">
            <label>X轴旋转: {config.rotateX}°</label>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={config.rotateX}
              onChange={(e) => handleConfigChange('rotateX', parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Z轴初始角度: {config.rotateZ}°</label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={config.rotateZ}
              onChange={(e) => handleConfigChange('rotateZ', parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Z轴位移: {config.translateZ}px</label>
            <input
              type="range"
              min="30"
              max="150"
              step="10"
              value={config.translateZ}
              onChange={(e) => handleConfigChange('translateZ', parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>悬停旋转: {config.hoverRotation}°</label>
            <input
              type="range"
              min="90"
              max="720"
              step="90"
              value={config.hoverRotation}
              onChange={(e) => handleConfigChange('hoverRotation', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-morphism-3d-demo {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .demo-container {
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;
        }

        .controls {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .control-section {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #dee2e6;
        }

        .control-section:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }

        .control-section h3 {
          margin: 0 0 15px 0;
          color: #495057;
          font-size: 16px;
          font-weight: 600;
        }

        .control-group {
          margin-bottom: 15px;
        }

        .control-group:last-child {
          margin-bottom: 0;
        }

        .control-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #6c757d;
          font-size: 14px;
        }

        .control-group input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #dee2e6;
          outline: none;
          -webkit-appearance: none;
        }

        .control-group input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #007bff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .control-group input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #007bff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .color-presets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          margin-bottom: 15px;
        }

        .preset-btn {
          padding: 8px 12px;
          border: 2px solid transparent;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .preset-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .preset-btn.active {
          border-color: #fff;
          box-shadow: 0 0 0 2px #007bff;
        }

        .color-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .color-inputs input[type="color"] {
          width: 100%;
          height: 40px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
        }

        .control-group input[type="checkbox"] {
          margin-right: 8px;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .controls {
            padding: 15px;
          }
          
          .color-presets {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }
          
          .color-inputs {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GlassMorphism3DExample;