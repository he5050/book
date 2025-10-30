import React, { useEffect, useRef, useState, useCallback } from 'react';
import './index.scss';

interface CardData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface TiltConfig {
  max?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
  perspective?: number;
  scale?: number;
  reverse?: boolean;
  axis?: 'x' | 'y' | null;
  reset?: boolean;
}

interface ThreeDGlassCardProps {
  data: CardData;
  tiltConfig?: TiltConfig;
  theme?: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
  onCardClick?: (card: CardData) => void;
  onTiltChange?: (values: any) => void;
}

const ThreeDGlassCard: React.FC<ThreeDGlassCardProps> = ({
  data,
  tiltConfig = {},
  theme = 'light',
  className = '',
  style = {},
  onCardClick,
  onTiltChange
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  // 默认配置
  const defaultConfig = {
    max: 25,
    speed: 400,
    glare: true,
    maxGlare: 1,
    perspective: 1000,
    scale: 1.1,
    reverse: false,
    axis: null,
    reset: true,
    ...tiltConfig
  };

  // 图片加载完成处理
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // 点击事件处理
  const handleCardClick = () => {
    onCardClick?.(data);
  };

  // 计算3D变换
  const calculateTransform = useCallback((clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    const rotateX = (defaultConfig.reverse ? 1 : -1) * (deltaY / (rect.height / 2)) * defaultConfig.max;
    const rotateY = (defaultConfig.reverse ? -1 : 1) * (deltaX / (rect.width / 2)) * defaultConfig.max;
    
    const tiltX = defaultConfig.axis === 'y' ? 0 : rotateX;
    const tiltY = defaultConfig.axis === 'x' ? 0 : rotateY;
    
    return `perspective(${defaultConfig.perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${defaultConfig.scale}, ${defaultConfig.scale}, ${defaultConfig.scale})`;
  }, [defaultConfig]);

  // 鼠标移动事件处理
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!cardRef.current) return;
    
    const newTransform = calculateTransform(event.clientX, event.clientY, cardRef.current);
    setTransform(newTransform);
    
    // 更新眩光
    if (defaultConfig.glare) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
      );
      const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
      const opacity = (1 - distance / maxDistance) * defaultConfig.maxGlare;
      setGlareOpacity(Math.max(0, Math.min(1, opacity)));
    }
    
    // 触发倾斜变化事件
    onTiltChange?.({
      tiltX: (defaultConfig.axis === 'y' ? 0 : (event.clientX - (cardRef.current.getBoundingClientRect().left + cardRef.current.offsetWidth / 2)) / (cardRef.current.offsetWidth / 2) * defaultConfig.max),
      tiltY: (defaultConfig.axis === 'x' ? 0 : (event.clientY - (cardRef.current.getBoundingClientRect().top + cardRef.current.offsetHeight / 2)) / (cardRef.current.offsetHeight / 2) * defaultConfig.max),
      percentageX: ((event.clientX - cardRef.current.getBoundingClientRect().left) / cardRef.current.offsetWidth) * 100,
      percentageY: ((event.clientY - cardRef.current.getBoundingClientRect().top) / cardRef.current.offsetHeight) * 100
    });
  }, [calculateTransform, defaultConfig, onTiltChange]);

  // 鼠标离开事件处理
  const handleMouseLeave = useCallback(() => {
    setTransform(`perspective(${defaultConfig.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlareOpacity(0);
    
    if (defaultConfig.reset) {
      onTiltChange?.({
        tiltX: 0,
        tiltY: 0,
        percentageX: 50,
        percentageY: 50
      });
    }
  }, [defaultConfig, onTiltChange]);

  // 添加事件监听器
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    cardElement.addEventListener('mousemove', handleMouseMove);
    cardElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cardElement.removeEventListener('mousemove', handleMouseMove);
      cardElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={cardRef}
      className={`three-d-glass-card ${theme} ${className}`}
      style={{
        width: '300px',
        height: '260px',
        transform: transform,
        transition: `transform ${defaultConfig.speed}ms ease`,
        ...style
      }}
      onClick={handleCardClick}
    >
      {/* 眩光效果 */}
      {defaultConfig.glare && (
        <div
          className="glare-effect"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(ellipse at center, rgba(255,255,255,${glareOpacity * 0.8}) 0%, rgba(255,255,255,0) 70%)`,
            transform: 'rotate(180deg) translate(-50%, -50%)',
            transition: 'opacity 0.1s ease'
          }}
        />
      )}
      
      {/* 卡片容器 */}
      <div className="card-container">
        {/* 图片区域 */}
        <div className="img-bx">
          <img
            src={data.imageUrl}
            alt={data.title}
            onLoad={handleImageLoad}
            className={`card-image ${isLoaded ? 'loaded' : ''}`}
          />
        </div>

        {/* 内容区域 */}
        <div className="content">
          <h2 className="card-title">{data.title}</h2>
          <p className="card-description">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDGlassCard;