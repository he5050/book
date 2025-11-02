import React, { useState } from 'react';
import ColorfulGlowingLiquidBowl from './index';

const ColorfulGlowingLiquidBowlDemo: React.FC = () => {
  const [config, setConfig] = useState({
    size: 300,
    liquidColor: '#41c1fb',
    animationDuration: 5,
    swingAngle: 15,
    liquidSwingAngle: 20,
    glowIntensity: 80,
    backgroundColor: '#121212',
    enableColorRotation: true
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
      minHeight: '900px'
    }}>
      {/* 主要效果展示 */}
      <ColorfulGlowingLiquidBowl {...config} />
      
      {/* 参数配置面板 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        width: '100%',
        maxWidth: '800px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            尺寸: {config.size}px
          </label>
          <input
            type="range"
            min="150"
            max="400"
            value={config.size}
            onChange={(e) => updateConfig('size', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            动画时长: {config.animationDuration}s
          </label>
          <input
            type="range"
            min="2"
            max="10"
            step="0.5"
            value={config.animationDuration}
            onChange={(e) => updateConfig('animationDuration', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            摇摆角度: {config.swingAngle}°
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={config.swingAngle}
            onChange={(e) => updateConfig('swingAngle', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            液体晃动角度: {config.liquidSwingAngle}°
          </label>
          <input
            type="range"
            min="10"
            max="40"
            value={config.liquidSwingAngle}
            onChange={(e) => updateConfig('liquidSwingAngle', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            发光强度: {config.glowIntensity}px
          </label>
          <input
            type="range"
            min="20"
            max="150"
            value={config.glowIntensity}
            onChange={(e) => updateConfig('glowIntensity', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            液体颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.liquidColor}
              onChange={(e) => updateConfig('liquidColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.liquidColor}</span>
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
              checked={config.enableColorRotation}
              onChange={(e) => updateConfig('enableColorRotation', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            启用色相旋转
          </label>
        </div>
      </div>

      {/* 预设配置 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setConfig({
            size: 300,
            liquidColor: '#41c1fb',
            animationDuration: 5,
            swingAngle: 15,
            liquidSwingAngle: 20,
            glowIntensity: 80,
            backgroundColor: '#121212',
            enableColorRotation: true
          })}
          style={{
            padding: '8px 16px',
            background: 'rgba(65, 193, 251, 0.2)',
            border: '1px solid rgba(65, 193, 251, 0.5)',
            borderRadius: '6px',
            color: '#41c1fb',
            cursor: 'pointer'
          }}
        >
          默认配置
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            liquidColor: '#ff6b6b',
            animationDuration: 3,
            swingAngle: 25,
            glowIntensity: 120
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid rgba(255, 107, 107, 0.5)',
            borderRadius: '6px',
            color: '#ff6b6b',
            cursor: 'pointer'
          }}
        >
          火焰模式
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            liquidColor: '#4ecdc4',
            animationDuration: 7,
            swingAngle: 8,
            glowIntensity: 60,
            enableColorRotation: false
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(78, 205, 196, 0.2)',
            border: '1px solid rgba(78, 205, 196, 0.5)',
            borderRadius: '6px',
            color: '#4ecdc4',
            cursor: 'pointer'
          }}
        >
          平静模式
        </button>
      </div>
    </div>
  );
};

export default ColorfulGlowingLiquidBowlDemo;