import React, { useState } from 'react';
import MultiRingLoading from './index';

const MultiRingLoadingDemo: React.FC = () => {
  const [config, setConfig] = useState({
    ringSize: 150,
    borderWidth: 4,
    animationDuration: 4,
    ringOverlap: 30,
    ring1Color: '#24ecff',
    ring2Color: '#93ff2d',
    ring3Color: '#ff1d6c',
    ring1BackgroundColor: 'transparent',
    ring2BackgroundColor: 'transparent',
    ring3BackgroundColor: 'transparent',
    glowIntensity: 30,
    backgroundColor: '#111111',
    enableGlow: true,
    enableIcons: true,
    ring3Offset: 66.66
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
      <MultiRingLoading {...config} />
      
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
            圆环尺寸: {config.ringSize}px
          </label>
          <input
            type="range"
            min="80"
            max="250"
            value={config.ringSize}
            onChange={(e) => updateConfig('ringSize', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            边框宽度: {config.borderWidth}px
          </label>
          <input
            type="range"
            min="2"
            max="10"
            value={config.borderWidth}
            onChange={(e) => updateConfig('borderWidth', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            动画时长: {config.animationDuration}s
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={config.animationDuration}
            onChange={(e) => updateConfig('animationDuration', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            重叠距离: {config.ringOverlap}px
          </label>
          <input
            type="range"
            min="10"
            max="60"
            value={config.ringOverlap}
            onChange={(e) => updateConfig('ringOverlap', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            第一环颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.ring1Color}
              onChange={(e) => updateConfig('ring1Color', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.ring1Color}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            第二环颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.ring2Color}
              onChange={(e) => updateConfig('ring2Color', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.ring2Color}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            第三环颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.ring3Color}
              onChange={(e) => updateConfig('ring3Color', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.ring3Color}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            第一环背景色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.ring1BackgroundColor === 'transparent' ? '#000000' : config.ring1BackgroundColor}
              onChange={(e) => updateConfig('ring1BackgroundColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <button
              onClick={() => updateConfig('ring1BackgroundColor', 'transparent')}
              style={{
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#ccc',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              透明
            </button>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            第二环背景色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.ring2BackgroundColor === 'transparent' ? '#000000' : config.ring2BackgroundColor}
              onChange={(e) => updateConfig('ring2BackgroundColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <button
              onClick={() => updateConfig('ring2BackgroundColor', 'transparent')}
              style={{
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#ccc',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              透明
            </button>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            第三环背景色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.ring3BackgroundColor === 'transparent' ? '#000000' : config.ring3BackgroundColor}
              onChange={(e) => updateConfig('ring3BackgroundColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <button
              onClick={() => updateConfig('ring3BackgroundColor', 'transparent')}
              style={{
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#ccc',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              透明
            </button>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            发光强度: {config.glowIntensity}px
          </label>
          <input
            type="range"
            min="10"
            max="80"
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
            第三环偏移: {config.ring3Offset}px
          </label>
          <input
            type="range"
            min="30"
            max="120"
            value={config.ring3Offset}
            onChange={(e) => updateConfig('ring3Offset', parseFloat(e.target.value))}
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
              checked={config.enableGlow}
              onChange={(e) => updateConfig('enableGlow', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            启用发光效果
          </label>
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
              checked={config.enableIcons}
              onChange={(e) => updateConfig('enableIcons', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            显示图标装饰
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
            ring1Color: '#24ecff',
            ring2Color: '#93ff2d',
            ring3Color: '#ff1d6c',
            ring1BackgroundColor: 'transparent',
            ring2BackgroundColor: 'transparent',
            ring3BackgroundColor: 'transparent',
            backgroundColor: '#111111'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(36, 236, 255, 0.2)',
            border: '1px solid rgba(36, 236, 255, 0.5)',
            borderRadius: '6px',
            color: '#24ecff',
            cursor: 'pointer'
          }}
        >
          经典主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            ring1Color: '#ff6b35',
            ring2Color: '#f7931e',
            ring3Color: '#ffcc02',
            ring1BackgroundColor: '#330000',
            ring2BackgroundColor: '#331100',
            ring3BackgroundColor: '#332200',
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
          火焰主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            ring1Color: '#9d4edd',
            ring2Color: '#c77dff',
            ring3Color: '#e0aaff',
            ring1BackgroundColor: '#1a0033',
            ring2BackgroundColor: '#220044',
            ring3BackgroundColor: '#2a0055',
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
            ring1Color: '#ffffff',
            ring2Color: '#ffffff',
            ring3Color: '#ffffff',
            ring1BackgroundColor: '#333333',
            ring2BackgroundColor: '#444444',
            ring3BackgroundColor: '#555555',
            backgroundColor: '#000000'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '6px',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          简约主题
        </button>
      </div>
    </div>
  );
};

export default MultiRingLoadingDemo;