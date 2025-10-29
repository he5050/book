import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface FireRingEffectProps {
  ringSize?: number;
  ringWidth?: number;
  glowColor?: string;
  animationDuration?: number;
  turbulenceFrequency?: number;
  turbulenceOctaves?: number;
  displacementScale?: number;
  blurAmount?: number;
  reflectionOpacity?: number;
  enableReflection?: boolean;
  className?: string;
}

const FireRingEffect: React.FC<FireRingEffectProps> = ({
  ringSize = 500,
  ringWidth = 20,
  glowColor = '#0f0',
  animationDuration = 5,
  turbulenceFrequency = 0.009,
  turbulenceOctaves = 5,
  displacementScale = 30,
  blurAmount = 1,
  reflectionOpacity = 0.2,
  enableReflection = true,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filterId] = useState(`wavy-${Math.random().toString(36).substr(2, 9)}`);

  const ringStyles = {
    '--ring-size': `${ringSize}px`,
    '--ring-width': `${ringWidth}px`,
    '--glow-color': glowColor,
    '--animation-duration': `${animationDuration}s`,
    '--blur-amount': `${blurAmount}px`,
    '--reflection-opacity': reflectionOpacity,
    '--enable-reflection': enableReflection ? 'below 10px linear-gradient(transparent, transparent, #0002)' : 'none'
  } as React.CSSProperties;

  return (
    <div className={`fire-ring-container ${className}`} style={ringStyles}>
      <div className="fire-ring-circle"></div>
      <div className="fire-ring-circle"></div>
      
      <svg ref={svgRef} className="fire-ring-svg">
        <defs>
          <filter id={filterId}>
            <feTurbulence 
              x="0" 
              y="0" 
              baseFrequency={turbulenceFrequency} 
              numOctaves={turbulenceOctaves} 
              seed="2"
            >
              <animate 
                attributeName="baseFrequency"  
                dur="60s" 
                values={`${turbulenceFrequency * 2};${turbulenceFrequency * 0.5};${turbulenceFrequency * 2}`}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={displacementScale}/>
          </filter>
        </defs>
      </svg>
      
      <style>
        {`
          .fire-ring-container .fire-ring-circle {
            filter: url(#${filterId}) blur(var(--blur-amount));
          }
        `}
      </style>
    </div>
  );
};

export default FireRingEffect;