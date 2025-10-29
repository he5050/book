import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface ParticleConfig {
  particleSize: [number, number];
  moveRange: number;
  duration: [number, number];
  particleColor: string;
  glowColor: string;
  frequency: number;
  maxParticles: number;
  speed: number;
  particleCount: [number, number];
  opacity: [number, number];
  blur: number;
}

interface ParticleBackgroundProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  config?: Partial<ParticleConfig>;
  onParticleCreate?: (count: number) => void;
  onConfigChange?: (config: ParticleConfig) => void;
}

interface Particle {
  id: string;
  element: HTMLDivElement;
  startTime: number;
  duration: number;
}

const defaultConfig: ParticleConfig = {
  particleSize: [2, 8],
  moveRange: 400,
  duration: [2, 5],
  particleColor: '#ffffff',
  glowColor: '#1235f4',
  frequency: 1,
  maxParticles: 100,
  speed: 1,
  particleCount: [1, 3],
  opacity: [0.8, 1],
  blur: 0
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  width = 600,
  height = 400,
  className = '',
  style = {},
  config = {},
  onParticleCreate,
  onConfigChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Map<string, Particle>>(new Map());
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  
  const [particleCount, setParticleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ParticleConfig>({ ...defaultConfig, ...config });
  
  const finalConfig = currentConfig;

  // 创建粒子
  const createParticle = useCallback((x: number, y: number) => {
    if (!containerRef.current || particlesRef.current.size >= finalConfig.maxParticles) {
      return;
    }

    // 根据配置创建多个粒子
    const particleCountToCreate = Math.floor(
      Math.random() * (finalConfig.particleCount[1] - finalConfig.particleCount[0] + 1) + finalConfig.particleCount[0]
    );

    for (let i = 0; i < particleCountToCreate; i++) {
      const particle = document.createElement('div');
      const particleId = `particle-${Date.now()}-${Math.random()}-${i}`;
      
      particle.className = 'particle-background-particle';
      
      // 设置粒子位置（添加一些随机偏移）
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      particle.style.left = `${x + offsetX}px`;
      particle.style.top = `${y + offsetY}px`;
      
      // 随机移动方向（考虑速度因子）
      const moveX = (Math.random() - 0.5) * finalConfig.moveRange * finalConfig.speed;
      const moveY = (Math.random() - 0.5) * finalConfig.moveRange * finalConfig.speed;
      
      particle.style.setProperty('--move-x', `${moveX}px`);
      particle.style.setProperty('--move-y', `${moveY}px`);
      
      // 随机大小
      const size = Math.random() * (finalConfig.particleSize[1] - finalConfig.particleSize[0]) + finalConfig.particleSize[0];
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // 随机动画时长（考虑速度因子）
      const baseDuration = Math.random() * (finalConfig.duration[1] - finalConfig.duration[0]) + finalConfig.duration[0];
      const duration = baseDuration / finalConfig.speed;
      particle.style.animationDuration = `${duration}s`;
      
      // 随机透明度
      const opacity = Math.random() * (finalConfig.opacity[1] - finalConfig.opacity[0]) + finalConfig.opacity[0];
      particle.style.opacity = opacity.toString();
      
      // 设置颜色和效果
      particle.style.backgroundColor = finalConfig.particleColor;
      particle.style.boxShadow = `
        inset 0 0 2px #121212,
        0 0 5px ${finalConfig.glowColor},
        0 0 10px ${finalConfig.glowColor}
      `;
      
      // 设置模糊效果
      if (finalConfig.blur > 0) {
        particle.style.filter = `blur(${finalConfig.blur}px)`;
      }
      
      containerRef.current.appendChild(particle);
      
      const particleData: Particle = {
        id: particleId,
        element: particle,
        startTime: Date.now(),
        duration: duration * 1000
      };
      
      particlesRef.current.set(particleId, particleData);
      setParticleCount(prev => prev + 1);
      onParticleCreate?.(particlesRef.current.size);
      
      // 设置自动清理
      setTimeout(() => {
        if (particlesRef.current.has(particleId)) {
          const particleData = particlesRef.current.get(particleId);
          if (particleData && particleData.element.parentNode) {
            particleData.element.remove();
          }
          particlesRef.current.delete(particleId);
          setParticleCount(prev => Math.max(0, prev - 1));
        }
      }, duration * 1000);
    }
  }, [finalConfig, onParticleCreate]);

  // 节流的鼠标移动处理
  const throttledMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 计算移动距离
    const distance = Math.sqrt(
      Math.pow(x - lastMousePos.current.x, 2) + 
      Math.pow(y - lastMousePos.current.y, 2)
    );
    
    // 根据移动距离和频率创建粒子
    if (distance > 5) {
      for (let i = 0; i < finalConfig.frequency; i++) {
        createParticle(x, y);
      }
      lastMousePos.current = { x, y };
    }
  }, [createParticle, finalConfig.frequency]);

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<ParticleConfig>) => {
    const updatedConfig = { ...currentConfig, ...newConfig };
    setCurrentConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
  }, [currentConfig, onConfigChange]);

  // 清理所有粒子
  const clearAllParticles = useCallback(() => {
    particlesRef.current.forEach(particle => {
      if (particle.element.parentNode) {
        particle.element.remove();
      }
    });
    particlesRef.current.clear();
    setParticleCount(0);
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      clearAllParticles();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [clearAllParticles]);

  return (
    <div className={`particle-background-container ${className}`}>
      <div className="particle-background-controls">
        <div className="control-group">
          <label>粒子数量: {particleCount}/{finalConfig.maxParticles}</label>
        </div>
        <div className="control-group">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`toggle-btn ${isActive ? 'active' : ''}`}
          >
            {isActive ? '暂停效果' : '启动效果'}
          </button>
          <button onClick={clearAllParticles} className="clear-btn">
            清除粒子
          </button>
        </div>
      </div>

      {/* 配置面板 */}
      <div className="particle-config-panel">
        <div className="config-row">
          <div className="config-item">
            <label>粒子大小: {finalConfig.particleSize[0]}-{finalConfig.particleSize[1]}px</label>
            <div className="range-inputs">
              <input
                type="range"
                min="1"
                max="20"
                value={finalConfig.particleSize[0]}
                onChange={(e) => updateConfig({ 
                  particleSize: [Number(e.target.value), finalConfig.particleSize[1]] 
                })}
              />
              <input
                type="range"
                min="1"
                max="20"
                value={finalConfig.particleSize[1]}
                onChange={(e) => updateConfig({ 
                  particleSize: [finalConfig.particleSize[0], Number(e.target.value)] 
                })}
              />
            </div>
          </div>

          <div className="config-item">
            <label>粒子数量: {finalConfig.particleCount[0]}-{finalConfig.particleCount[1]}</label>
            <div className="range-inputs">
              <input
                type="range"
                min="1"
                max="10"
                value={finalConfig.particleCount[0]}
                onChange={(e) => updateConfig({ 
                  particleCount: [Number(e.target.value), finalConfig.particleCount[1]] 
                })}
              />
              <input
                type="range"
                min="1"
                max="10"
                value={finalConfig.particleCount[1]}
                onChange={(e) => updateConfig({ 
                  particleCount: [finalConfig.particleCount[0], Number(e.target.value)] 
                })}
              />
            </div>
          </div>
        </div>

        <div className="config-row">
          <div className="config-item">
            <label>速度: {finalConfig.speed.toFixed(1)}x</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={finalConfig.speed}
              onChange={(e) => updateConfig({ speed: Number(e.target.value) })}
            />
          </div>

          <div className="config-item">
            <label>频率: {finalConfig.frequency}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={finalConfig.frequency}
              onChange={(e) => updateConfig({ frequency: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="config-row">
          <div className="config-item">
            <label>粒子颜色</label>
            <input
              type="color"
              value={finalConfig.particleColor}
              onChange={(e) => updateConfig({ particleColor: e.target.value })}
            />
          </div>

          <div className="config-item">
            <label>发光颜色</label>
            <input
              type="color"
              value={finalConfig.glowColor}
              onChange={(e) => updateConfig({ glowColor: e.target.value })}
            />
          </div>

          <div className="config-item">
            <label>模糊: {finalConfig.blur}px</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={finalConfig.blur}
              onChange={(e) => updateConfig({ blur: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="config-row">
          <div className="config-item">
            <label>透明度: {finalConfig.opacity[0].toFixed(1)}-{finalConfig.opacity[1].toFixed(1)}</label>
            <div className="range-inputs">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={finalConfig.opacity[0]}
                onChange={(e) => updateConfig({ 
                  opacity: [Number(e.target.value), finalConfig.opacity[1]] 
                })}
              />
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={finalConfig.opacity[1]}
                onChange={(e) => updateConfig({ 
                  opacity: [finalConfig.opacity[0], Number(e.target.value)] 
                })}
              />
            </div>
          </div>

          <div className="config-item">
            <label>最大粒子数: {finalConfig.maxParticles}</label>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={finalConfig.maxParticles}
              onChange={(e) => updateConfig({ maxParticles: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className={`particle-background-canvas ${isActive ? 'active' : ''}`}
        style={{ width, height, ...style }}
        onMouseMove={isActive ? throttledMouseMove : undefined}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        <div className="canvas-hint">
          {isActive ? '移动鼠标创建粒子效果' : '鼠标悬停启动效果'}
        </div>
      </div>
    </div>
  );
};

export default ParticleBackground;