import React, { useState } from 'react';
import AnimatedTextTrail from './index';

const AnimatedTextTrailDemo: React.FC = () => {
  const [config, setConfig] = useState({
    text: 'animate text trail effect',
    fontSize: 2,
    staggerDelay: 0.05,
    animationDuration: 0.3,
    charSpacing: 0.6,
    hueStep: 10,
    textColor: '#00ff9a',
    glowIntensity: 15,
    backgroundColor: '#222222',
    gridSize: '4vh',
    gridColor: '#333333',
    enableGlow: true
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
      minHeight: '1100px'
    }}>
      {/* 主要效果展示 */}
      <AnimatedTextTrail {...config} />
      
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
            文本内容
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
            字体大小: {config.fontSize}em
          </label>
          <input
            type="range"
            min="1"
            max="4"
            step="0.1"
            value={config.fontSize}
            onChange={(e) => updateConfig('fontSize', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            延迟时间: {config.staggerDelay}s
          </label>
          <input
            type="range"
            min="0.01"
            max="0.2"
            step="0.01"
            value={config.staggerDelay}
            onChange={(e) => updateConfig('staggerDelay', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            动画时长: {config.animationDuration}s
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={config.animationDuration}
            onChange={(e) => updateConfig('animationDuration', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            字符间距: {config.charSpacing}em
          </label>
          <input
            type="range"
            min="0.3"
            max="1.2"
            step="0.1"
            value={config.charSpacing}
            onChange={(e) => updateConfig('charSpacing', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            色相步长: {config.hueStep}°
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={config.hueStep}
            onChange={(e) => updateConfig('hueStep', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            文本颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.textColor}
              onChange={(e) => updateConfig('textColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.textColor}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            发光强度: {config.glowIntensity}px
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={config.glowIntensity}
            onChange={(e) => updateConfig('glowIntensity', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
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
            网格颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.gridColor}
              onChange={(e) => updateConfig('gridColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.gridColor}</span>
          </div>
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
              checked={config.enableGlow}
              onChange={(e) => updateConfig('enableGlow', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            启用发光效果
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
            text: 'NEON GLOW EFFECT',
            textColor: '#00ff9a',
            backgroundColor: '#222222',
            gridColor: '#333333'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(0, 255, 154, 0.2)',
            border: '1px solid rgba(0, 255, 154, 0.5)',
            borderRadius: '6px',
            color: '#00ff9a',
            cursor: 'pointer'
          }}
        >
          霓虹主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            text: 'CYBER PUNK STYLE',
            textColor: '#ff0080',
            backgroundColor: '#0a0a0a',
            gridColor: '#1a1a1a'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 0, 128, 0.2)',
            border: '1px solid rgba(255, 0, 128, 0.5)',
            borderRadius: '6px',
            color: '#ff0080',
            cursor: 'pointer'
          }}
        >
          赛博朋克
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            text: 'OCEAN BLUE WAVE',
            textColor: '#00d4ff',
            backgroundColor: '#001122',
            gridColor: '#002244'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(0, 212, 255, 0.2)',
            border: '1px solid rgba(0, 212, 255, 0.5)',
            borderRadius: '6px',
            color: '#00d4ff',
            cursor: 'pointer'
          }}
        >
          海洋主题
        </button>
      </div>
    </div>
  );
};

export default AnimatedTextTrailDemo;