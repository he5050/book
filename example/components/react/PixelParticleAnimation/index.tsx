import React, { useRef, useEffect, useState } from 'react';
import './index.scss';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface PixelParticleAnimationProps {
  width?: number;
  height?: number;
  particleCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

const PixelParticleAnimation: React.FC<PixelParticleAnimationProps> = ({
  width = 600,
  height = 600,
  particleCount = 1000,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  // 创建粒子
  const createParticle = (): Particle => {
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    switch (edge) {
      case 0: // 顶部
        x = Math.random() * width;
        y = 0;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 2 + 0.5;
        break;
      case 1: // 右侧
        x = width;
        y = Math.random() * height;
        vx = -(Math.random() * 2 + 0.5);
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // 底部
        x = Math.random() * width;
        y = height;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 2 + 0.5);
        break;
      default: // 左侧
        x = 0;
        y = Math.random() * height;
        vx = Math.random() * 2 + 0.5;
        vy = (Math.random() - 0.5) * 2;
        break;
    }

    return {
      x,
      y,
      vx,
      vy,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      size: Math.random() * 3 + 1,
      hue: Math.random() * 360
    };
  };

  // 初始化粒子
  const initParticles = () => {
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle());
    }
  };

  // 更新粒子
  const updateParticles = () => {
    const particles = particlesRef.current;
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life++;

      // 添加重力效果
      particle.vy += 0.02;

      // 边界检测和重生
      if (
        particle.x < -10 || 
        particle.x > width + 10 || 
        particle.y < -10 || 
        particle.y > height + 10 ||
        particle.life > particle.maxLife
      ) {
        particles[i] = createParticle();
      }
    }
  };

  // 渲染粒子
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      const alpha = Math.max(0, 1 - particle.life / particle.maxLife);
      const centerX = width / 2;
      const centerY = height / 2;
      
      // 计算距离中心的距离，用于颜色渐变
      const distanceFromCenter = Math.sqrt(
        Math.pow(particle.x - centerX, 2) + Math.pow(particle.y - centerY, 2)
      );
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const distanceRatio = distanceFromCenter / maxDistance;
      
      // 根据距离和生命周期调整颜色
      const hue = (particle.hue + distanceRatio * 120) % 360;
      const saturation = 70 + distanceRatio * 30;
      const lightness = 50 + (1 - distanceRatio) * 30;
      
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      
      // 绘制像素点
      const pixelSize = Math.max(1, particle.size * alpha);
      ctx.fillRect(
        Math.floor(particle.x), 
        Math.floor(particle.y), 
        pixelSize, 
        pixelSize
      );
    });
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles();
    renderParticles(ctx);

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // 切换动画状态
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  // 重置动画
  const resetAnimation = () => {
    initParticles();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    initParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [width, height, particleCount]);

  useEffect(() => {
    if (isAnimating) {
      animate();
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  return (
    <div 
      className={`pixel-particle-animation ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="particle-canvas"
        width={width}
        height={height}
      />
      <div className="controls">
        <button onClick={toggleAnimation} className="control-btn">
          {isAnimating ? '暂停' : '播放'}
        </button>
        <button onClick={resetAnimation} className="control-btn">
          重置
        </button>
      </div>
    </div>
  );
};

export default PixelParticleAnimation;