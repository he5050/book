import React, { useState } from 'react';
import CircularImageRotation from './index';

const CircularImageRotationDemo: React.FC = () => {
  const [config, setConfig] = useState({
    imageCount: 8,
    containerSize: 300,
    imageSize: 80,
    rotationRadius: 190,
    animationDuration: 15,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#222222',
    enableHoverPause: true,
    clockwise: true,
    autoGenerate: true
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
      background: '#222',
      borderRadius: '12px',
      minHeight: '1200px'
    }}>
      {/* 主要效果展示 */}
      <CircularImageRotation {...config} />
      
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
            图片数量: {config.imageCount}
          </label>
          <input
            type="range"
            min="4"
            max="12"
            value={config.imageCount}
            onChange={(e) => updateConfig('imageCount', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            容器尺寸: {config.containerSize}px
          </label>
          <input
            type="range"
            min="200"
            max="400"
            value={config.containerSize}
            onChange={(e) => updateConfig('containerSize', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            图片尺寸: {config.imageSize}px
          </label>
          <input
            type="range"
            min="40"
            max="120"
            value={config.imageSize}
            onChange={(e) => updateConfig('imageSize', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            旋转半径: {config.rotationRadius}px
          </label>
          <input
            type="range"
            min="100"
            max="250"
            value={config.rotationRadius}
            onChange={(e) => updateConfig('rotationRadius', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            动画时长: {config.animationDuration}s
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={config.animationDuration}
            onChange={(e) => updateConfig('animationDuration', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            边框宽度: {config.borderWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="8"
            value={config.borderWidth}
            onChange={(e) => updateConfig('borderWidth', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
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
              checked={config.enableHoverPause}
              onChange={(e) => updateConfig('enableHoverPause', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            悬停暂停动画
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
              checked={config.clockwise}
              onChange={(e) => updateConfig('clockwise', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            顺时针旋转
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
              checked={config.autoGenerate}
              onChange={(e) => updateConfig('autoGenerate', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            自动生成图片
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
          onClick={() => setConfig(prev => ({
            ...prev,
            imageCount: 8,
            containerSize: 300,
            imageSize: 80,
            animationDuration: 15,
            borderColor: '#ffffff',
            backgroundColor: '#222222'
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
            imageCount: 6,
            containerSize: 250,
            imageSize: 60,
            animationDuration: 10,
            borderColor: '#00d4ff',
            backgroundColor: '#001122'
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
          快速模式
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            imageCount: 12,
            containerSize: 350,
            imageSize: 50,
            animationDuration: 25,
            borderColor: '#ff6b35',
            backgroundColor: '#330000'
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
          密集模式
        </button>
      </div>
    </div>
  );
};

export default CircularImageRotationDemo;