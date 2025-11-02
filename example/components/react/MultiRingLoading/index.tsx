import React, { useState, useEffect } from 'react';
import './index.scss';

interface MultiRingLoadingProps {
  ringSize?: number;
  borderWidth?: number;
  animationDuration?: number;
  ringOverlap?: number;
  ring1Color?: string;
  ring2Color?: string;
  ring3Color?: string;
  ring1BackgroundColor?: string;
  ring2BackgroundColor?: string;
  ring3BackgroundColor?: string;
  glowIntensity?: number;
  backgroundColor?: string;
  enableGlow?: boolean;
  enableIcons?: boolean;
  ring3Offset?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MultiRingLoading: React.FC<MultiRingLoadingProps> = ({
  ringSize = 150,
  borderWidth = 4,
  animationDuration = 4,
  ringOverlap = 30,
  ring1Color = '#24ecff',
  ring2Color = '#93ff2d',
  ring3Color = '#ff1d6c',
  ring1BackgroundColor = 'transparent',
  ring2BackgroundColor = 'transparent',
  ring3BackgroundColor = 'transparent',
  glowIntensity = 30,
  backgroundColor = '#111111',
  enableGlow = true,
  enableIcons = true,
  ring3Offset = 66.66,
  className = '',
  style = {}
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  // 动态样式计算
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    ...style
  };

  // 圆环基础样式
  const getRingBaseStyle = (): React.CSSProperties => ({
    width: `${ringSize}px`,
    height: `${ringSize}px`,
    margin: `-${ringOverlap}px`,
    animationDuration: `${animationDuration}s`,
    animationPlayState: isAnimating ? 'running' : 'paused'
  });

  // 第一个环样式（青色，顺时针）
  const ring1Style: React.CSSProperties = {
    ...getRingBaseStyle(),
    border: `${borderWidth}px solid ${ring1BackgroundColor}`,
    borderTop: `${borderWidth}px solid ${ring1Color}`,
    filter: enableGlow 
      ? `drop-shadow(0 0 10px ${ring1Color}) drop-shadow(0 0 ${glowIntensity}px ${ring1Color}) drop-shadow(0 0 ${glowIntensity * 1.5}px ${ring1Color})`
      : 'none',
    '--ring-color': ring1Color
  } as React.CSSProperties;

  // 第二个环样式（绿色，逆时针）
  const ring2Style: React.CSSProperties = {
    ...getRingBaseStyle(),
    border: `${borderWidth}px solid ${ring2BackgroundColor}`,
    borderLeft: `${borderWidth}px solid ${ring2Color}`,
    filter: enableGlow 
      ? `drop-shadow(0 0 10px ${ring2Color}) drop-shadow(0 0 ${glowIntensity}px ${ring2Color}) drop-shadow(0 0 ${glowIntensity * 1.5}px ${ring2Color})`
      : 'none',
    animationDelay: '-1s',
    '--ring-color': ring2Color
  } as React.CSSProperties;

  // 第三个环样式（粉色，逆时针）
  const ring3Style: React.CSSProperties = {
    ...getRingBaseStyle(),
    position: 'absolute',
    top: `-${ring3Offset}px`,
    border: `${borderWidth}px solid ${ring3BackgroundColor}`,
    borderLeft: `${borderWidth}px solid ${ring3Color}`,
    filter: enableGlow 
      ? `drop-shadow(0 0 10px ${ring3Color}) drop-shadow(0 0 ${glowIntensity}px ${ring3Color}) drop-shadow(0 0 ${glowIntensity * 1.5}px ${ring3Color})`
      : 'none',
    animationDelay: '-3s',
    '--ring-color': ring3Color
  } as React.CSSProperties;

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
    <div 
      className={`multi-ring-loading-container ${className}`} 
      style={containerStyle}
    >
      <div className="loading-wrapper">
        {/* 第一个环 - 青色顺时针 */}
        <div 
          className={`ring ring-1 ${isAnimating ? 'animating' : 'paused'}`}
          style={ring1Style}
        >
          {enableIcons && (
            <div className="ring-icon ring-icon-1" style={{ color: ring1Color }}>
              ⚡
            </div>
          )}
        </div>

        {/* 第二个环 - 绿色逆时针 */}
        <div 
          className={`ring ring-2 ${isAnimating ? 'animating' : 'paused'}`}
          style={ring2Style}
        >
          {enableIcons && (
            <div className="ring-icon ring-icon-2" style={{ color: ring2Color }}>
              ◆
            </div>
          )}
        </div>

        {/* 第三个环 - 粉色逆时针 */}
        <div 
          className={`ring ring-3 ${isAnimating ? 'animating' : 'paused'}`}
          style={ring3Style}
        >
          {enableIcons && (
            <div className="ring-icon ring-icon-3" style={{ color: ring3Color }}>
              ★
            </div>
          )}
        </div>
      </div>

      {/* 控制面板 */}
      <div className="control-panel">
        <button onClick={toggleAnimation} className="control-button">
          {isAnimating ? '暂停动画' : '开始动画'}
        </button>
      </div>
    </div>
  );
};

export default MultiRingLoading;