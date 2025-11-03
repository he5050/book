import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface InfiniteSliderProps {
  images?: string[];
  width?: number;
  height?: number;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  transitionDuration?: number;
  perspective?: number;
  rotationAngle?: number;
  scaleRatio?: number;
  backgroundColor?: string;
  borderRadius?: number;
  showReflection?: boolean;
  shadowIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
  onSlideChange?: (index: number) => void;
}

const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  images = [
    'https://picsum.photos/200/300?random=1',
    'https://picsum.photos/200/300?random=2',
    'https://picsum.photos/200/300?random=3',
    'https://picsum.photos/200/300?random=4',
    'https://picsum.photos/200/300?random=5',
    'https://picsum.photos/200/300?random=6',
    'https://picsum.photos/200/300?random=7'
  ],
  width = 200,
  height = 300,
  autoPlay = false,
  interval = 3000,
  showControls = true,
  transitionDuration = 0.5,
  perspective = 500,
  rotationAngle = 25,
  scaleRatio = 0.8,
  backgroundColor = '#222',
  borderRadius = 0,
  showReflection = true,
  shadowIntensity = 0.5,
  className = '',
  style = {},
  onSlideChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(3); // 中心位置索引
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // 自动播放控制
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, interval);
  }, [interval]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // 下一张
  const nextSlide = useCallback(() => {
    if (isAnimating || !containerRef.current) return;
    
    setIsAnimating(true);
    const items = containerRef.current.querySelectorAll('.slider-item');
    if (items.length > 0) {
      containerRef.current.appendChild(items[0]);
      setCurrentIndex(prev => (prev + 1) % images.length);
      onSlideChange?.(currentIndex);
    }
    
    setTimeout(() => setIsAnimating(false), transitionDuration * 1000);
  }, [isAnimating, transitionDuration, images.length, currentIndex, onSlideChange]);

  // 上一张
  const prevSlide = useCallback(() => {
    if (isAnimating || !containerRef.current) return;
    
    setIsAnimating(true);
    const items = containerRef.current.querySelectorAll('.slider-item');
    if (items.length > 0) {
      containerRef.current.prepend(items[items.length - 1]);
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      onSlideChange?.(currentIndex);
    }
    
    setTimeout(() => setIsAnimating(false), transitionDuration * 1000);
  }, [isAnimating, transitionDuration, images.length, currentIndex, onSlideChange]);

  // 触摸手势处理
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // 自动播放效果
  useEffect(() => {
    if (autoPlay) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [autoPlay, startAutoPlay, stopAutoPlay]);

  // 鼠标悬停暂停自动播放
  const handleMouseEnter = () => {
    if (autoPlay) stopAutoPlay();
  };

  const handleMouseLeave = () => {
    if (autoPlay) startAutoPlay();
  };

  // 容器样式
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    perspective: `${perspective}px`,
    ...style
  };

  // 图片项样式
  const itemStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: `${borderRadius}px`,
    transition: `transform ${transitionDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    boxShadow: `0 0 50px rgba(0,0,0,${shadowIntensity})`,
    WebkitBoxReflect: showReflection ? 'below 1px linear-gradient(transparent, transparent, #0002)' : 'none'
  };

  return (
    <div 
      className={`infinite-slider-container ${className}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        ref={containerRef}
        className="slider-box"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="slider-item"
            style={itemStyle}
          >
            <img 
              src={image} 
              alt={`Slide ${index + 1}`}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {showControls && (
        <div className="slider-controls">
          <button 
            className="control-btn prev-btn"
            onClick={prevSlide}
            disabled={isAnimating}
            aria-label="Previous slide"
          />
          <button 
            className="control-btn next-btn"
            onClick={nextSlide}
            disabled={isAnimating}
            aria-label="Next slide"
          />
        </div>
      )}

      <div className="slider-info">
        <span>当前: {currentIndex + 1} / {images.length}</span>
        <span>自动播放: {autoPlay ? '开启' : '关闭'}</span>
      </div>
    </div>
  );
};

export default InfiniteSlider;