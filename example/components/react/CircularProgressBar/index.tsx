import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface CircularProgressBarProps {
  progress?: number;
  color?: string;
  size?: number;
  animationSpeed?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  centerColor?: string;
  borderColor?: string;
  textColor?: string;
  showPercentage?: boolean;
  title?: string;
  enableAnimation?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress = 0,
  color = '#ff2972',
  size = 200,
  animationSpeed = 50,
  strokeWidth = 5,
  backgroundColor = '#222',
  centerColor = '#333',
  borderColor = '#4d4c51',
  textColor = '#ffffff',
  showPercentage = true,
  title = '',
  enableAnimation = true,
  className = '',
  style = {}
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 动画控制
  const startAnimation = () => {
    if (!enableAnimation) {
      setCurrentProgress(progress);
      return;
    }

    setIsAnimating(true);
    setCurrentProgress(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 1;
      if (current > progress) {
        clearInterval(intervalRef.current!);
        setIsAnimating(false);
        return;
      }
      setCurrentProgress(current);
    }, animationSpeed);
  };

  // 重置动画
  const resetAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentProgress(0);
    setIsAnimating(false);
  };

  // 当进度值改变时重新开始动画
  useEffect(() => {
    if (enableAnimation) {
      startAnimation();
    } else {
      setCurrentProgress(progress);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [progress, enableAnimation, animationSpeed]);

  // 计算样式
  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    background: `conic-gradient(${color} 0% ${currentProgress}%, ${backgroundColor} 0%)`,
    ...style
  };

  const centerStyle: React.CSSProperties = {
    width: `${size * 0.6}px`,
    height: `${size * 0.6}px`,
    background: centerColor,
    border: `${strokeWidth * 3}px solid ${borderColor}`
  };

  const numberStyle: React.CSSProperties = {
    color: textColor,
    fontSize: `${size * 0.15}px`
  };

  const titleStyle: React.CSSProperties = {
    color: textColor,
    fontSize: `${size * 0.08}px`
  };

  return (
    <div className={`circular-progress-bar-container ${className}`}>
      <div 
        className="progress-circle"
        style={containerStyle}
      >
        {/* 内层遮罩 */}
        <div 
          className="inner-mask"
          style={{
            inset: `${strokeWidth}px`,
            background: backgroundColor,
            opacity: 0.8
          }}
        />
        
        {/* 中心装饰 */}
        <div 
          className="center-decoration"
          style={centerStyle}
        />

        {/* 进度数字 */}
        {showPercentage && (
          <div className="progress-number" style={numberStyle}>
            {currentProgress}<span>%</span>
          </div>
        )}

        {/* 标题 */}
        {title && (
          <div className="progress-title" style={titleStyle}>
            {title}
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="control-buttons">
        <button 
          onClick={startAnimation}
          disabled={isAnimating}
          className="control-button start-button"
        >
          {isAnimating ? '动画中...' : '开始动画'}
        </button>
        <button 
          onClick={resetAnimation}
          className="control-button reset-button"
        >
          重置
        </button>
      </div>
    </div>
  );
};

export default CircularProgressBar;