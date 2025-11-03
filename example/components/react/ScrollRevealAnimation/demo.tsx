import React, { useState } from 'react';
import ScrollRevealAnimation from './index';

const ScrollRevealAnimationDemo: React.FC = () => {
  const [config, setConfig] = useState({
    elementCount: 60,
    columns: 3,
    elementSize: 200,
    gap: 30,
    animationDuration: 0.5,
    threshold: 0.1,
    rootMargin: '0px',
    enableRandomColors: true,
    animationDelay: 0,
    borderRadius: 10,
    backgroundColor: '#111',
    resetOnExit: true
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
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      borderRadius: '12px',
      minHeight: '1200px',
      position: 'relative'
    }}>
      {/* 装饰性背景 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* 主要效果展示 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ScrollRevealAnimation {...config} />
      </div>
      
      {/* 参数配置面板 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        width: '100%',
        maxWidth: '900px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 1
      }}>
        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            元素数量: {config.elementCount}
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={config.elementCount}
            onChange={(e) => updateConfig('elementCount', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            网格列数: {config.columns}
          </label>
          <input
            type="range"
            min="2"
            max="5"
            value={config.columns}
            onChange={(e) => updateConfig('columns', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            元素尺寸: {config.elementSize}px
          </label>
          <input
            type="range"
            min="100"
            max="300"
            value={config.elementSize}
            onChange={(e) => updateConfig('elementSize', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            元素间距: {config.gap}px
          </label>
          <input
            type="range"
            min="10"
            max="50"
            value={config.gap}
            onChange={(e) => updateConfig('gap', parseInt(e.target.value))}
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
            max="2"
            step="0.1"
            value={config.animationDuration}
            onChange={(e) => updateConfig('animationDuration', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            触发阈值: {config.threshold}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.threshold}
            onChange={(e) => updateConfig('threshold', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            动画延迟: {config.animationDelay}s
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.animationDelay}
            onChange={(e) => updateConfig('animationDelay', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            圆角大小: {config.borderRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={config.borderRadius}
            onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value))}
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
              checked={config.enableRandomColors}
              onChange={(e) => updateConfig('enableRandomColors', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            启用随机颜色
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
              checked={config.resetOnExit}
              onChange={(e) => updateConfig('resetOnExit', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            离开时重置动画
          </label>
        </div>
      </div>

      {/* 预设配置 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            elementCount: 60,
            columns: 3,
            elementSize: 200,
            animationDuration: 0.5,
            threshold: 0.1
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
          经典配置
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            elementCount: 40,
            columns: 4,
            elementSize: 150,
            animationDuration: 0.3,
            threshold: 0.2
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(0, 123, 255, 0.2)',
            border: '1px solid rgba(0, 123, 255, 0.5)',
            borderRadius: '6px',
            color: '#007bff',
            cursor: 'pointer'
          }}
        >
          快速模式
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            elementCount: 80,
            columns: 2,
            elementSize: 250,
            animationDuration: 0.8,
            threshold: 0.05
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
          大尺寸模式
        </button>
      </div>

      {/* 使用说明 */}
      <div style={{
        maxWidth: '600px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        color: '#ccc',
        fontSize: '14px',
        textAlign: 'center',
        zIndex: 1
      }}>
        <p>💡 滚动容器查看动画效果，元素会从不同方向进入视口</p>
        <p>🎨 调整参数可以实时看到效果变化</p>
      </div>
    </div>
  );
};

export default ScrollRevealAnimationDemo;