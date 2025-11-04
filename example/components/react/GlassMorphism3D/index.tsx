import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface GlassMorphism3DProps {
  /** 加载器尺寸 */
  size?: number;
  /** 动画速度倍数 */
  speed?: number;
  /** 主要渐变色 */
  primaryColor?: string;
  /** 次要渐变色 */
  secondaryColor?: string;
  /** 玻璃背景透明度 */
  glassOpacity?: number;
  /** 边框透明度 */
  borderOpacity?: number;
  /** 背景模糊强度 */
  blurIntensity?: number;
  /** 边框宽度 */
  borderWidth?: number;
  /** X轴初始旋转角度 */
  rotateX?: number;
  /** Z轴初始旋转角度 */
  rotateZ?: number;
  /** Z轴位移距离 */
  translateZ?: number;
  /** 悬停旋转角度 */
  hoverRotation?: number;
  /** 是否启用动画 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 点击回调 */
  onClick?: () => void;
}

const GlassMorphism3D: React.FC<GlassMorphism3DProps> = ({
  size = 300,
  speed = 1,
  primaryColor = '#ff0080',
  secondaryColor = '#ff8c00',
  glassOpacity = 0.05,
  borderOpacity = 0.25,
  blurIntensity = 24,
  borderWidth = 2,
  rotateX = 35,
  rotateZ = 345,
  translateZ = 90,
  hoverRotation = 360,
  animated = true,
  className = '',
  style = {},
  onClick
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 性能优化：可见性检测
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 动态CSS变量
  const cssVariables = {
    '--loader-size': `${size}px`,
    '--animation-duration': `${4 / speed}s`,
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--glass-opacity': glassOpacity,
    '--border-opacity': borderOpacity,
    '--blur-intensity': `${blurIntensity}px`,
    '--border-width': `${borderWidth}px`,
    '--rotate-x': `${rotateX}deg`,
    '--rotate-z': `${rotateZ}deg`,
    '--translate-z': `${translateZ}px`,
    '--hover-rotation': `${hoverRotation}deg`,
    '--glass-bg': `rgba(255, 255, 255, ${glassOpacity})`,
    '--glass-border': `rgba(255, 255, 255, ${borderOpacity})`,
    '--gradient': `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
    ...style
  } as React.CSSProperties;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div className={`glass-morphism-3d-container ${className}`} style={cssVariables}>
      <div
        ref={loaderRef}
        className={`glass-loader ${animated && isVisible ? 'animated' : ''} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="progressbar"
        aria-label="加载中"
      >
        <span className="glass-panel"></span>
        <i className="inner-element"></i>
      </div>
    </div>
  );
};

export default GlassMorphism3D;