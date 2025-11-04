import React, { useState, useEffect } from 'react';
import './index.scss';

interface AnimatedBorderProps {
  /** 边框颜色 */
  color?: string;
  /** 动画速度倍数 */
  speed?: number;
  /** 元素数量 */
  count?: number;
  /** 元素间距 */
  gap?: number;
  /** 元素尺寸 */
  size?: number;
  /** 是否显示内容 */
  showContent?: boolean;
  /** 自定义内容 */
  content?: string[];
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  color = '#0f0',
  speed = 1,
  count = 4,
  gap = 38,
  size = 100,
  showContent = true,
  content = ['C', 'S', 'S', '❤'],
  className = '',
  style = {}
}) => {
  const [animationDuration, setAnimationDuration] = useState(4);

  useEffect(() => {
    setAnimationDuration(4 / speed);
  }, [speed]);

  const containerStyle = {
    '--border-color': color,
    '--animation-duration': `${animationDuration}s`,
    '--element-gap': `${gap}px`,
    '--element-size': `${size}px`,
    ...style
  } as React.CSSProperties;

  const renderElements = (withContent: boolean) => {
    return Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="animated-border__item"
        style={{ '--i': index } as React.CSSProperties}
      >
        {withContent && showContent && (
          <span className="animated-border__content">
            <b>{content[index] || ''}</b>
          </span>
        )}
      </div>
    ));
  };

  return (
    <div className={`animated-border-container ${className}`} style={containerStyle}>
      <div className="animated-border animated-border--top">
        {renderElements(true)}
      </div>
      <div className="animated-border animated-border--bottom">
        {renderElements(false)}
      </div>
    </div>
  );
};

export default AnimatedBorder;