import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

// 混合模式选项
export type BlendMode = 
  | 'plus-lighter' 
  | 'screen' 
  | 'overlay' 
  | 'color-dodge' 
  | 'hard-light' 
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'multiply'
  | 'normal';

// 动画状态
export type AnimationState = 'playing' | 'paused' | 'stopped';

interface D3LoaderSpinnerProps {
  /** 旋转器尺寸 (px) */
  size?: number;
  /** 容器背景色 */
  backgroundColor?: string;
  /** 渐变主色调 */
  primaryColor?: string;
  /** 渐变副色调 */
  secondaryColor?: string;
  /** 动画持续时间 (秒) */
  animationDuration?: number;
  /** 自定义CSS类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 混合模式 */
  blendMode?: BlendMode;
  /** 是否显示进度条 */
  showProgress?: boolean;
  /** 进度值 (0-100) */
  progress?: number;
  /** 动画状态控制 */
  animationState?: AnimationState;
  /** 动画状态变化回调 */
  onAnimationStateChange?: (state: AnimationState) => void;
  /** 进度变化回调 */
  onProgressChange?: (progress: number) => void;
  /** 是否启用点击控制 */
  enableClickControl?: boolean;
  /** 渐变方向角度 */
  gradientAngle?: number;
  /** 光晕强度 (0-100) */
  blurIntensity?: number;
}

/**
 * 3D加载旋转器组件 - 增强版
 * 
 * 特点：
 * - 使用CSS3阴影和渐变创建立体效果
 * - 双层旋转动画营造深度感
 * - 支持多种混合模式和自定义颜色
 * - 动画播放/暂停控制
 * - 加载进度显示功能
 * - 点击交互控制
 */
const D3LoaderSpinner: React.FC<D3LoaderSpinnerProps> = ({
  size = 300,
  backgroundColor = '#c9d5e0',
  primaryColor = '#2196f3',
  secondaryColor = '#e91e63',
  animationDuration = 2,
  className = '',
  style = {},
  blendMode = 'plus-lighter',
  showProgress = false,
  progress = 0,
  animationState = 'playing',
  onAnimationStateChange,
  onProgressChange,
  enableClickControl = false,
  gradientAngle = 45,
  blurIntensity = 20
}) => {
  // 内部状态管理
  const [internalAnimationState, setInternalAnimationState] = useState<AnimationState>(animationState);
  const [internalProgress, setInternalProgress] = useState(progress);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 动态计算内圆的inset值，保持比例
  const circleInset = Math.max(20, size * 0.117);
  
  // 进度自动递增逻辑
  useEffect(() => {
    if (showProgress && !progress && internalAnimationState === 'playing') {
      intervalRef.current = setInterval(() => {
        setInternalProgress(prev => {
          const newProgress = prev >= 100 ? 0 : prev + 1;
          onProgressChange?.(newProgress);
          return newProgress;
        });
      }, animationDuration * 20); // 调整递增速度

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [showProgress, progress, internalAnimationState, animationDuration, onProgressChange]);

  // 同步外部progress
  useEffect(() => {
    if (progress !== undefined) {
      setInternalProgress(progress);
    }
  }, [progress]);

  // 同步外部animationState
  useEffect(() => {
    setInternalAnimationState(animationState);
  }, [animationState]);

  // 点击控制处理
  const handleClick = useCallback(() => {
    if (!enableClickControl) return;
    
    const newState = internalAnimationState === 'playing' ? 'paused' : 'playing';
    setInternalAnimationState(newState);
    onAnimationStateChange?.(newState);
  }, [enableClickControl, internalAnimationState, onAnimationStateChange]);

  // 创建CSS变量对象
  const cssVariables = {
    '--spinner-size': `${size}px`,
    '--spinner-bg': backgroundColor,
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--animation-duration': `${animationDuration}s`,
    '--circle-inset': `${circleInset}px`,
    '--blend-mode': blendMode,
    '--gradient-angle': `${gradientAngle}deg`,
    '--blur-intensity': `${blurIntensity}px`,
    '--progress': `${internalProgress}%`,
    ...style
  } as React.CSSProperties;

  // 动画类名
  const animationClass = internalAnimationState === 'paused' ? 'paused' : 
                        internalAnimationState === 'stopped' ? 'stopped' : '';

  return (
    <div 
      ref={wrapperRef}
      className={`d3-loader-spinner-wrapper ${className} ${animationClass}`}
      style={cssVariables}
      onClick={handleClick}
      role={enableClickControl ? 'button' : undefined}
      tabIndex={enableClickControl ? 0 : undefined}
      title={enableClickControl ? `点击${internalAnimationState === 'playing' ? '暂停' : '播放'}动画` : undefined}
    >
      <div 
        className="loader" 
        style={{ 
          width: size,
          height: size,
          background: backgroundColor
        }}
      >
        <div 
          className="circle"
          style={{ inset: circleInset }}
        >
          <div 
            className="gradient-circle"
            style={{ 
              background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`,
              animationDuration: `${animationDuration}s`
            }}
          />
          <div 
            className="blur-circle"
            style={{ 
              background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`,
              animationDuration: `${animationDuration}s`,
              filter: `blur(${blurIntensity}px)`,
              mixBlendMode: blendMode as any
            }}
          />
        </div>

        {/* 进度显示 */}
        {showProgress && (
          <>
            {/* 进度环 */}
            <div className="progress-ring">
              <svg width={size} height={size} className="progress-svg">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={(size - 20) / 2}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={(size - 20) / 2}
                  stroke={primaryColor}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.PI * (size - 20)} ${Math.PI * (size - 20)}`}
                  strokeDashoffset={`${Math.PI * (size - 20) * (1 - internalProgress / 100)}`}
                  className="progress-circle"
                />
              </svg>
            </div>
            
            {/* 进度文本 */}
            <div className="progress-text">
              <span className="progress-number">{Math.round(internalProgress)}</span>
              <span className="progress-percent">%</span>
            </div>
          </>
        )}

        {/* 控制状态指示器 */}
        {enableClickControl && (
          <div className="control-indicator">
            {internalAnimationState === 'paused' && (
              <div className="pause-icon">⏸</div>
            )}
            {internalAnimationState === 'playing' && (
              <div className="play-icon">▶</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default D3LoaderSpinner;