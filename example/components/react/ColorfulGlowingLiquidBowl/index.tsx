import React, { useState, useEffect } from 'react';
import './index.scss';

interface ColorfulGlowingLiquidBowlProps {
  size?: number;
  liquidColor?: string;
  animationDuration?: number;
  swingAngle?: number;
  liquidSwingAngle?: number;
  glowIntensity?: number;
  backgroundColor?: string;
  enableColorRotation?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ColorfulGlowingLiquidBowl: React.FC<ColorfulGlowingLiquidBowlProps> = ({
  size = 300,
  liquidColor = '#41c1fb',
  animationDuration = 5,
  swingAngle = 15,
  liquidSwingAngle = 20,
  glowIntensity = 80,
  backgroundColor = '#121212',
  enableColorRotation = true,
  className = '',
  style = {}
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  // 动态样式计算
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    ...style
  };

  const bowlStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${animationDuration}s`,
    '--swing-angle': `${swingAngle}deg`,
    '--color-rotation': enableColorRotation ? '360deg' : '0deg'
  } as React.CSSProperties;

  const liquidStyle: React.CSSProperties = {
    background: liquidColor,
    filter: `drop-shadow(0 0 ${glowIntensity}px ${liquidColor})`,
    animationDuration: `${animationDuration}s`,
    '--liquid-swing-angle': `${liquidSwingAngle}deg`
  } as React.CSSProperties;

  const liquidSurfaceStyle: React.CSSProperties = {
    background: adjustBrightness(liquidColor, -20),
    filter: `drop-shadow(0 0 ${glowIntensity}px ${liquidColor})`
  };

  const shadowStyle: React.CSSProperties = {
    top: `calc(50% + ${size / 2}px)`,
    width: `${size}px`
  };

  // 颜色亮度调整函数
  function adjustBrightness(color: string, percent: number): string {
    // 简单的颜色调整，实际项目中可以使用更完善的颜色处理库
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    return color;
  }

  // 动画控制
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      // 可以在这里添加响应式逻辑
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`colorful-glowing-liquid-bowl-container ${className}`} style={containerStyle}>
      <section className="liquid-bowl-section">
        <div className="shadow" style={shadowStyle}></div>
        <div 
          className={`bowl ${isAnimating ? 'animating' : 'paused'}`} 
          style={bowlStyle}
        >
          <div className="liquid" style={liquidStyle}>
            <div className="liquid-surface" style={liquidSurfaceStyle}></div>
          </div>
        </div>
      </section>
      
      {/* 控制面板 */}
      <div className="control-panel">
        <button onClick={toggleAnimation} className="control-button">
          {isAnimating ? '暂停动画' : '开始动画'}
        </button>
      </div>
    </div>
  );
};

export default ColorfulGlowingLiquidBowl;