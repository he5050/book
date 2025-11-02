import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface PureCSS3DTextRotationProps {
  text?: string;
  layerCount?: number;
  fontSize?: number;
  animationDuration?: number;
  rotationStep?: number;
  perspective?: number;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  enableShadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PureCSS3DTextRotation: React.FC<PureCSS3DTextRotationProps> = ({
  text = 'Html Css',
  layerCount = 24,
  fontSize = 8,
  animationDuration = 24,
  rotationStep = 15,
  perspective = 1000,
  primaryColor = '#00ffff',
  secondaryColor = '#7fffd4',
  backgroundColor = '#000000',
  strokeWidth = 2,
  enableShadow = true,
  className = '',
  style = {}
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 动态样式计算
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    ...style
  };

  const boxStyle: React.CSSProperties = {
    perspective: `${perspective}px`,
    transformStyle: 'preserve-3d'
  };

  const animationStyle: React.CSSProperties = {
    animationDuration: `${animationDuration}s`,
    animationPlayState: isAnimating ? 'running' : 'paused'
  };

  // 生成文字层级
  const renderTextLayers = () => {
    const layers = [];
    for (let i = 1; i <= layerCount; i++) {
      const layerStyle: React.CSSProperties = {
        '--i': i,
        '--rotation-step': `${rotationStep}deg`,
        '--font-size': `${fontSize}em`,
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
        '--stroke-width': `${strokeWidth}px`,
        '--text-shadow': enableShadow ? '0 0 50px rgba(0,0,0,0.5)' : 'none'
      } as React.CSSProperties;

      layers.push(
        <span
          key={i}
          className="text-layer"
          style={layerStyle}
          data-text={text}
        />
      );
    }
    return layers;
  };

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
      className={`pure-css-3d-text-rotation-container ${className}`} 
      style={containerStyle}
      ref={containerRef}
    >
      <div className="text-3d-box" style={boxStyle}>
        <div 
          className={`text-animation-wrapper ${isAnimating ? 'animating' : 'paused'}`}
          style={animationStyle}
        >
          {renderTextLayers()}
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

export default PureCSS3DTextRotation;