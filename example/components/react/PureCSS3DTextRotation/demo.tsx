import React, { useState } from 'react';
import PureCSS3DTextRotation from './index';

const PureCSS3DTextRotationDemo: React.FC = () => {
  const [config, setConfig] = useState({
    text: 'Html Css',
    layerCount: 24,
    fontSize: 8,
    animationDuration: 24,
    rotationStep: 15,
    perspective: 1000,
    primaryColor: '#00ffff',
    secondaryColor: '#7fffd4',
    backgroundColor: '#000000',
    strokeWidth: 2,
    enableShadow: true
  });

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '20px',
      padding: '20px',
      background: '#1a1a1a',
      borderRadius: '12px',
      minHeight: '1000px'
    }}>
      {/* 主要效果展示 */}
      <PureCSS3DTextRotation {...config} />
      
      {/* 参数配置面板 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        width: '100%',
        maxWidth: '900px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            文字内容
          </label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => updateConfig('text', e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #444',
              background: '#333',
              color: '#fff'
            }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            文字层数: {config.layerCount}
          </label>
          <input
            type="range"
            min="12"
            max="36"
            value={config.layerCount}
            onChange={(e) => updateConfig('layerCount', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            字体大小: {config.fontSize}em
          </label>
          <input
            type="range"
            min="4"
            max="12"
            step="0.5"
            value={config.fontSize}
            onChange={(e) => updateConfig('fontSize', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            动画时长: {config.animationDuration}s
          </label>
          <input
            type="range"
            min="10"
            max="60"
            value={config.animationDuration}
            onChange={(e) => updateConfig('animationDuration', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            旋转步长: {config.rotationStep}°
          </label>
          <input
            type="range"
            min="10"
            max="30"
            value={config.rotationStep}
            onChange={(e) => updateConfig('rotationStep', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            透视距离: {config.perspective}px
          </label>
          <input
            type="range"
            min="500"
            max="2000"
            value={config.perspective}
            onChange={(e) => updateConfig('perspective', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            主要颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.primaryColor}
              onChange={(e) => updateConfig('primaryColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.primaryColor}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            次要颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.secondaryColor}
              onChange={(e) => updateConfig('secondaryColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.secondaryColor}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            背景颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => updateConfig('backgroundColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.backgroundColor}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            描边宽度: {config.strokeWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={config.strokeWidth}
            onChange={(e) => updateConfig('strokeWidth', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ 
            color: '#fff', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={config.enableShadow}
              onChange={(e) => updateConfig('enableShadow', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            启用文字阴影
          </label>
        </div>
      </div>

      {/* 预设主题 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            text: 'Html Css',
            primaryColor: '#00ffff',
            secondaryColor: '#7fffd4',
            backgroundColor: '#000000'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(0, 255, 255, 0.2)',
            border: '1px solid rgba(0, 255, 255, 0.5)',
            borderRadius: '6px',
            color: '#00ffff',
            cursor: 'pointer'
          }}
        >
          青色主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            text: 'CREATIVE',
            primaryColor: '#9d4edd',
            secondaryColor: '#c77dff',
            backgroundColor: '#10002b'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(157, 78, 221, 0.2)',
            border: '1px solid rgba(157, 78, 221, 0.5)',
            borderRadius: '6px',
            color: '#9d4edd',
            cursor: 'pointer'
          }}
        >
          紫色主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            text: 'FUTURE',
            primaryColor: '#ff6b35',
            secondaryColor: '#f7931e',
            backgroundColor: '#1a0000'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 107, 53, 0.2)',
            border: '1px solid rgba(255, 107, 53, 0.5)',
            borderRadius: '6px',
            color: '#ff6b35',
            cursor: 'pointer'
          }}
        >
          橙色主题
        </button>
      </div>
    </div>
  );
};

export default PureCSS3DTextRotationDemo;