import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface RainLightningEffectProps {
  rainInterval?: number;
  cloudWidth?: number;
  cloudHeight?: number;
  dropLifetime?: number;
  lightningInterval?: number;
  dropColor?: string;
  cloudColor?: string;
  backgroundColor?: string;
  maxDropWidth?: number;
  maxDropHeight?: number;
  lightningEnabled?: boolean;
  className?: string;
}

const RainLightningEffect: React.FC<RainLightningEffectProps> = ({
  rainInterval = 20,
  cloudWidth = 320,
  cloudHeight = 100,
  dropLifetime = 2000,
  lightningInterval = 2000,
  dropColor = '#05a2eb',
  cloudColor = '#484f59',
  backgroundColor = '#1b1b1b',
  maxDropWidth = 5,
  maxDropHeight = 50,
  lightningEnabled = true,
  className = ''
}) => {
  const cloudRef = useRef<HTMLDivElement>(null);
  const rainTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(true);

  const createRainDrop = () => {
    if (!cloudRef.current || !isActive) return;

    const drop = document.createElement('div');
    const left = Math.floor(Math.random() * (cloudWidth - 10));
    const width = Math.random() * maxDropWidth;
    const height = Math.random() * maxDropHeight;
    const duration = Math.random() * 0.5;

    drop.classList.add('rain-drop');
    drop.style.left = left + 'px';
    drop.style.width = (0.5 + width) + 'px';
    drop.style.height = (0.5 + height) + 'px';
    drop.style.backgroundColor = dropColor;
    drop.style.animationDuration = (1 + duration) + 's';

    cloudRef.current.appendChild(drop);

    setTimeout(() => {
      if (cloudRef.current && cloudRef.current.contains(drop)) {
        cloudRef.current.removeChild(drop);
      }
    }, dropLifetime);
  };

  useEffect(() => {
    if (isActive) {
      rainTimerRef.current = setInterval(createRainDrop, rainInterval);
    } else {
      if (rainTimerRef.current) {
        clearInterval(rainTimerRef.current);
      }
    }

    return () => {
      if (rainTimerRef.current) {
        clearInterval(rainTimerRef.current);
      }
    };
  }, [isActive, rainInterval, cloudWidth, maxDropWidth, maxDropHeight, dropColor, dropLifetime]);

  const containerStyles = {
    '--cloud-width': `${cloudWidth}px`,
    '--cloud-height': `${cloudHeight}px`,
    '--cloud-color': cloudColor,
    '--bg-color': backgroundColor,
    '--lightning-interval': `${lightningInterval}ms`,
    '--lightning-enabled': lightningEnabled ? 'running' : 'paused'
  } as React.CSSProperties;

  return (
    <div 
      className={`rain-lightning-container ${className}`} 
      style={containerStyles}
    >
      <div className="rain-container">
        <div 
          ref={cloudRef} 
          className={`rain-cloud ${lightningEnabled ? 'lightning-enabled' : ''}`}
        ></div>
      </div>
    </div>
  );
};

export default RainLightningEffect;