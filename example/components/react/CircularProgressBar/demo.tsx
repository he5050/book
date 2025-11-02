import React, { useState } from 'react';
import CircularProgressBar from './index';

const CircularProgressBarDemo: React.FC = () => {
  const [config, setConfig] = useState({
    progress: 84,
    color: '#ff2972',
    size: 200,
    animationSpeed: 50,
    strokeWidth: 5,
    backgroundColor: '#222',
    centerColor: '#333',
    borderColor: '#4d4c51',
    textColor: '#ffffff',
    showPercentage: true,
    title: 'HTML',
    enableAnimation: true
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
      background: '#363636',
      borderRadius: '12px',
      minHeight: '1100px'
    }}>
      {/* 主要效果展示 */}
      <CircularProgressBar {...config} />
      
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
            进度值: {config.progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={config.progress}
            onChange={(e) => updateConfig('progress', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            圆形尺寸: {config.size}px
          </label>
          <input
            type="range"
            min="100"
            max="300"
            value={config.size}
            onChange={(e) => updateConfig('size', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            动画速度: {config.animationSpeed}ms
          </label>
          <input
            type="range"
            min="10"
            max="200"
            value={config.animationSpeed}
            onChange={(e) => updateConfig('animationSpeed', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
      {config.strokeWidth}px
          </label>
          <input
            type="range"
            min="2"
            max="15"
            value={config.strokeWidth}
            onChange={(e) => updateConfig('strokeWidth', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            进度条颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.color}
              onChange={(e) => updateConfig('color', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.color}</span>
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
            中心颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.centerColor}
              onChange={(e) => updateConfig('centerColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.centerColor}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            边框颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.borderColor}
              onChange={(e) => updateConfig('borderColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.borderColor}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            文字颜色
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
            标题文本
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => updateConfig('title', e.target.value)}
            placeholder="输入标题..."
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '14px'
            }}
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
              checked={config.showPercentage}
              onChange={(e) => updateConfig('showPercentage', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            显示百分比
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
              checked={config.enableAnimation}
              onChange={(e) => updateConfig('enableAnimation', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            启用动画效果
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
            progress: 84,
            color: '#ff2972',
            backgroundColor: '#222',
            centerColor: '#333',
            borderColor: '#4d4c51',
            title: 'HTML'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 41, 114, 0.2)',
            border: '1px solid rgba(255, 41, 114, 0.5)',
            borderRadius: '6px',
            color: '#ff2972',
            cursor: 'pointer'
          }}
        >
          经典主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            progress: 75,
            color: '#00d4ff',
            backgroundColor: '#001122',
            centerColor: '#002244',
            borderColor: '#003366',
            title: 'CSS'
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
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            progress: 92,
            color: '#04fc43',
            backgroundColor: '#001100',
            centerColor: '#002200',
            borderColor: '#003300',
            title: 'JavaScript'
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(4, 252, 67, 0.2)',
            border: '1px solid rgba(4, 252, 67, 0.5)',
            borderRadius: '6px',
            color: '#04fc43',
            cursor: 'pointer'
          }}
        >
          绿色主题
        </button>
      </div>
    </div>
  );
};

export default CircularProgressBarDemo;