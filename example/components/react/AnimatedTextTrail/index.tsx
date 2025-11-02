import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './index.scss';

interface AnimatedTextTrailProps {
  text?: string;
  fontSize?: number;
  staggerDelay?: number;
  animationDuration?: number;
  charSpacing?: number;
  hueStep?: number;
  textColor?: string;
  glowIntensity?: number;
  backgroundColor?: string;
  gridSize?: string;
  gridColor?: string;
  enableGlow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedTextTrail: React.FC<AnimatedTextTrailProps> = ({
  text = 'animate text trail effect',
  fontSize = 2,
  staggerDelay = 0.05,
  animationDuration = 0.3,
  charSpacing = 0.6,
  hueStep = 10,
  textColor = '#00ff9a',
  glowIntensity = 15,
  backgroundColor = '#222222',
  gridSize = '4vh',
  gridColor = '#333333',
  enableGlow = true,
  className = '',
  style = {}
}) => {
  const [isActive, setIsActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // 动态样式计算
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
    backgroundSize: `${gridSize} ${gridSize}`,
    '--text-color': textColor,
    '--glow-intensity': `${glowIntensity}px`,
    '--font-size': `${fontSize}em`,
    '--char-spacing': `${charSpacing}em`,
    ...style
  } as React.CSSProperties;

  // 创建文本字符元素
  const createTextElements = () => {
    if (!cursorRef.current) return;
    
    // 清空现有元素
    cursorRef.current.innerHTML = '';
    
    // 与原始效果一致，循环到 textContent.length（包含最后一个字符）
    for (let i = 0; i <= text.length; i++) {
      const span = document.createElement('span');
      span.classList.add('text-char');
      span.style.setProperty('--i', (i + 1).toString());
      span.style.left = `${i * charSpacing}em`;
      span.textContent = text[i] || ''; // 防止undefined
      span.style.filter = `hue-rotate(${i * hueStep}deg)`;
      
      if (!enableGlow) {
        span.style.textShadow = 'none';
      }
      
      cursorRef.current.appendChild(span);
    }
  };

  // 鼠标移动处理
  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive || !containerRef.current) return;
    
    // 获取容器的边界信息
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 使用容器内的相对坐标
    gsap.to('.text-char', {
      x: x,
      y: y,
      stagger: staggerDelay
    });
  };

  // 移除节流，与原始效果保持一致
  const throttledMouseMove = useRef<((e: MouseEvent) => void) | null>(null);

  useEffect(() => {
    throttledMouseMove.current = handleMouseMove;
  }, [isActive, staggerDelay]);

  // 初始化和清理
  useEffect(() => {
    createTextElements();
    
    const container = containerRef.current;
    const handleMove = throttledMouseMove.current;
    
    if (handleMove && isActive && container) {
      container.addEventListener('mousemove', handleMove);
    }
    
    return () => {
      if (handleMove && container) {
        container.removeEventListener('mousemove', handleMove);
      }
      if (animationRef.current) {
        animationRef.current.kill();
      }
      gsap.killTweensOf('.text-char');
    };
  }, [text, charSpacing, hueStep, enableGlow, isActive]);

  // 动画控制
  const toggleAnimation = () => {
    setIsActive(!isActive);
  };

  // 重置位置
  const resetPosition = () => {
    gsap.set('.text-char', {
      x: 0,
      y: 0
    });
  };

  return (
    <div 
      className={`animated-text-trail-container ${className}`} 
      style={containerStyle}
      ref={containerRef}
    >
      <div 
        className="cursor" 
        ref={cursorRef}
      />
      
      {/* 控制面板 */}
      <div className="control-panel">
        <button onClick={toggleAnimation} className="control-button">
          {isActive ? '暂停跟随' : '开始跟随'}
        </button>
        <button onClick={resetPosition} className="control-button">
          重置位置
        </button>
      </div>
      
      {/* 提示信息 */}
      <div className="hint-text">
        移动鼠标体验文本轨迹效果
      </div>
    </div>
  );
};

export default AnimatedTextTrail;