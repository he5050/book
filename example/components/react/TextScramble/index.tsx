import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface TextScrambleProps {
  /** 要显示的文本 */
  text: string;
  /** 随机字符集 */
  randomChars?: string;
  /** 动画速度（毫秒） */
  speed?: number;
  /** 迭代步长控制 */
  iterationStep?: number;
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'auto' | 'manual';
  /** 恢复方向 */
  direction?: 'left-to-right' | 'right-to-left' | 'random';
  /** 是否保留空格 */
  preserveSpaces?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 动画开始回调 */
  onAnimationStart?: () => void;
  /** 动画结束回调 */
  onAnimationEnd?: () => void;
  /** 手动触发控制 */
  shouldScramble?: boolean;
}

const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  randomChars = '!@#$%^&*()_+-<>?',
  speed = 50,
  iterationStep = 1/3,
  trigger = 'hover',
  direction = 'left-to-right',
  preserveSpaces = true,
  className = '',
  style = {},
  onAnimationStart,
  onAnimationEnd,
  shouldScramble = false
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLSpanElement>(null);
  const iterationsRef = useRef(0);

  // 生成随机字符
  const getRandomChar = useCallback(() => {
    return randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }, [randomChars]);

  // 根据方向和进度生成打乱文本
  const generateScrambledText = useCallback((progress: number) => {
    return text.split('').map((char, index) => {
      // 保留空格
      if (preserveSpaces && char === ' ') return char;
      
      let shouldRestore = false;
      
      switch (direction) {
        case 'left-to-right':
          shouldRestore = index < progress;
          break;
        case 'right-to-left':
          shouldRestore = index >= text.length - progress;
          break;
        case 'random':
          shouldRestore = Math.random() < progress / text.length;
          break;
      }
      
      return shouldRestore ? char : getRandomChar();
    }).join('');
  }, [text, direction, preserveSpaces, getRandomChar]);

  // 执行打乱动画
  const scramble = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    iterationsRef.current = 0;
    onAnimationStart?.();
    
    intervalRef.current = setInterval(() => {
      const scrambledText = generateScrambledText(iterationsRef.current);
      setDisplayText(scrambledText);
      
      if (iterationsRef.current >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
        setIsAnimating(false);
        onAnimationEnd?.();
      }
      
      iterationsRef.current += iterationStep;
    }, speed);
  }, [isAnimating, text, speed, iterationStep, generateScrambledText, onAnimationStart, onAnimationEnd]);

  // 停止动画
  const stopScramble = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayText(text);
    setIsAnimating(false);
  }, [text]);

  // 处理手动触发
  useEffect(() => {
    if (trigger === 'manual' && shouldScramble) {
      scramble();
    }
  }, [shouldScramble, trigger, scramble]);

  // 处理自动触发
  useEffect(() => {
    if (trigger === 'auto') {
      const autoInterval = setInterval(scramble, 3000);
      return () => clearInterval(autoInterval);
    }
  }, [trigger, scramble]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 更新显示文本当原文本改变时
  useEffect(() => {
    if (!isAnimating) {
      setDisplayText(text);
    }
  }, [text, isAnimating]);

  // 事件处理器
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      scramble();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      scramble();
    }
  };

  return (
    <span
      ref={elementRef}
      className={`text-scramble ${isAnimating ? 'animating' : ''} ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      data-original={text}
    >
      {displayText}
    </span>
  );
};

export default TextScramble;