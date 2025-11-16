import React, { useState, useEffect, useMemo } from 'react';
import './index.scss';

interface GridBackgroundProps {
  /** 格子大小（像素） */
  gridSize?: number;
  /** 格子线条颜色 */
  color?: string;
  /** 透明度 (0-1) */
  opacity?: number;
  /** 线条宽度（像素） */
  lineWidth?: number;
  /** 旋转角度（度） */
  rotation?: number;
  /** 缩放比例 */
  scale?: number;
  /** 是否启用动画 */
  animated?: boolean;
  /** 是否响应式调整 */
  responsive?: boolean;
  /** 实现方法类型 */
  method?: 'gradient' | 'image';
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 将十六进制颜色转换为RGBA格式
 */
const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(59, 130, 246, ${opacity})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * 根据屏幕宽度计算响应式格子大小
 */
const calculateResponsiveGridSize = (baseSize: number, screenWidth: number): number => {
  if (screenWidth < 768) return Math.max(baseSize * 0.5, 15);
  if (screenWidth < 1024) return Math.max(baseSize * 0.75, 20);
  return baseSize;
};

const GridBackground: React.FC<GridBackgroundProps> = ({
  gridSize = 40,
  color = '#e5e7eb',
  opacity = 0.5,
  lineWidth = 1,
  rotation = 0,
  scale = 1,
  animated = false,
  responsive = true,
  method = 'gradient',
  className = '',
  style = {},
  children
}) => {
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // 响应式处理
  useEffect(() => {
    if (!responsive || typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive]);

  // 计算实际格子大小
  const actualGridSize = useMemo(() => {
    return responsive ? calculateResponsiveGridSize(gridSize, screenWidth) : gridSize;
  }, [gridSize, screenWidth, responsive]);

  // 生成背景样式
  const backgroundStyle = useMemo(() => {
    const rgba = hexToRgba(color, opacity);
    
    if (method === 'gradient') {
      return {
        backgroundImage: `
          linear-gradient(to right, ${rgba} ${lineWidth}px, transparent ${lineWidth}px),
          linear-gradient(to bottom, ${rgba} ${lineWidth}px, transparent ${lineWidth}px)
        `,
        backgroundSize: `${actualGridSize}px ${actualGridSize}px`
      };
    } else {
      // SVG图片方法
      const svgData = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${actualGridSize}" height="${actualGridSize}" viewBox="0 0 ${actualGridSize} ${actualGridSize}">
          <rect width="${actualGridSize}" height="${actualGridSize}" fill="none" stroke="${color}" stroke-width="${lineWidth}" opacity="${opacity}"/>
        </svg>
      `)}`;
      
      return {
        backgroundImage: `url("${svgData}")`,
        backgroundSize: `${actualGridSize}px ${actualGridSize}px`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'left top'
      };
    }
  }, [color, opacity, lineWidth, actualGridSize, method]);

  // 变换样式
  const transformStyle = useMemo(() => {
    const transforms = [];
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    if (scale !== 1) transforms.push(`scale(${scale})`);
    
    return transforms.length > 0 ? transforms.join(' ') : undefined;
  }, [rotation, scale]);

  // 合并所有样式
  const combinedStyle: React.CSSProperties = {
    ...backgroundStyle,
    transform: transformStyle,
    ...style
  };

  return (
    <div
      className={`grid-background ${animated ? 'animated' : ''} ${method} ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
};

export default GridBackground;