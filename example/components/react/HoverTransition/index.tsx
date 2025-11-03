import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface HoverTransitionProps {
  items?: Array<string | number>;
  itemWidth?: number;
  itemHeight?: number;
  backgroundColor?: string;
  hoverColor?: string;
  transitionDuration?: number;
  rotationAngle?: number;
  scaleRatio?: number;
  hoverScale?: number;
  perspective?: number;
  borderWidth?: number;
  borderColor?: string;
  showReflection?: boolean;
  shadowIntensity?: number;
  fontSize?: string;
  enableKeyboard?: boolean;
  enableTouch?: boolean;
  autoResetDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  onHover?: (index: number, item: string | number) => void;
  onLeave?: () => void;
}

const HoverTransition: React.FC<HoverTransitionProps> = ({
  items = [1, 2, 3, 4, 5, 6],
  itemWidth = 80,
  itemHeight = 80,
  backgroundColor = '#fff',
  hoverColor = '#9cdb28',
  transitionDuration = 0.5,
  rotationAngle = 45,
  scaleRatio = 0.95,
  hoverScale = 1.5,
  perspective = 500,
  borderWidth = 2,
  borderColor = '#0005',
  showReflection = true,
  shadowIntensity = 0.25,
  fontSize = '2.5em',
  enableKeyboard = false,
  enableTouch = true,
  autoResetDelay = 2000,
  className = '',
  style = {},
  onHover,
  onLeave
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout>();

  // 检测触摸设备
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  // 键盘导航
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex(prev => {
            const newIndex = Math.max(0, prev - 1);
            handleHover(newIndex);
            return newIndex;
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex(prev => {
            const newIndex = Math.min(items.length - 1, prev + 1);
            handleHover(newIndex);
            return newIndex;
          });
          break;
        case 'Escape':
          setFocusedIndex(-1);
          handleLeave();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, items.length]);

  // 悬停处理
  const handleHover = useCallback((index: number) => {
    setHoveredIndex(index);
    onHover?.(index, items[index]);

    // 清除自动重置定时器
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
  }, [items, onHover]);

  // 离开处理
  const handleLeave = useCallback(() => {
    setHoveredIndex(-1);
    setFocusedIndex(-1);
    onLeave?.();

    // 清除自动重置定时器
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
  }, [onLeave]);

  // 鼠标事件
  const handleMouseOver = (index: number) => {
    if (!isTouchDevice || !enableTouch) {
      handleHover(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice || !enableTouch) {
      handleLeave();
    }
  };

  // 触摸事件
  const handleTouchStart = (index: number) => {
    if (isTouchDevice && enableTouch) {
      handleHover(index);
      
      // 设置自动重置
      resetTimeoutRef.current = setTimeout(() => {
        handleLeave();
      }, autoResetDelay);
    }
  };

  // 获取元素状态类名
  const getItemClassName = (index: number): string => {
    const baseClass = 'hover-item';
    const classes = [baseClass];

    if (hoveredIndex !== -1) {
      if (index < hoveredIndex) {
        classes.push('prev');
      } else if (index === hoveredIndex) {
        classes.push('hovered');
      } else {
        classes.push('next');
      }
    }

    if (focusedIndex === index) {
      classes.push('focused');
    }

    return classes.join(' ');
  };

  // 容器样式
  const containerStyle: React.CSSProperties = {
    perspective: `${perspective}px`,
    ...style
  };

  // 单个项目样式
  const getItemStyle = (index: number): React.CSSProperties => {
    const isHovered = hoveredIndex === index;
    
    return {
      width: `${itemWidth}px`,
      height: `${itemHeight}px`,
      backgroundColor: isHovered ? hoverColor : backgroundColor,
      borderWidth: `${borderWidth}px`,
      borderColor,
      fontSize,
      transition: `all ${transitionDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      WebkitBoxReflect: showReflection ? 'below 1px linear-gradient(transparent, #0002)' : 'none',
      color: isHovered ? '#fff' : '#000'
    };
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`hover-transition-container ${className}`}
      style={containerStyle}
      tabIndex={enableKeyboard ? 0 : -1}
    >
      <div className="hover-items-wrapper">
        {items.map((item, index) => (
          <div
            key={index}
            className={getItemClassName(index)}
            style={getItemStyle(index)}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart(index)}
            role="button"
            tabIndex={enableKeyboard ? 0 : -1}
            aria-label={`Item ${item}`}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* 状态指示器 */}
      <div className="status-indicator">
        <div className="status-item">
          <span>悬停索引: {hoveredIndex >= 0 ? hoveredIndex : '无'}</span>
        </div>
        <div className="status-item">
          <span>当前项目: {hoveredIndex >= 0 ? items[hoveredIndex] : '无'}</span>
        </div>
        <div className="status-item">
          <span>设备类型: {isTouchDevice ? '触摸设备' : '鼠标设备'}</span>
        </div>
        {enableKeyboard && (
          <div className="status-item">
            <span>键盘导航: 启用 (←→ 方向键, ESC 退出)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoverTransition;