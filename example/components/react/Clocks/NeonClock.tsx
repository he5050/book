import React, { useState, useEffect } from 'react';

/**
 * 霓虹时钟组件
 * @param {Object} props - 组件属性
 * @param {string} props.format - 时间格式，'12' 或 '24'，默认'24'
 * @param {boolean} props.showSeconds - 是否显示秒，默认true
 * @param {string} props.neonColor - 霓虹颜色，默认'#00ffff'
 * @param {string} props.backgroundColor - 背景颜色，默认'#000'
 * @param {string} props.fontSize - 字体大小，默认'3rem'
 * @param {number} props.glowIntensity - 发光强度，默认20
 * @param {boolean} props.animated - 是否启用动画效果，默认true
 */
const NeonClock = ({
  format = '24',
  showSeconds = true,
  neonColor = '#00ffff',
  backgroundColor = '#000000',
  fontSize = '3rem',
  glowIntensity = 20,
  animated = true,
  className = ''
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    let timeString = '';

    if (format === '12') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      timeString = `${hours.toString().padStart(2, '0')}:${minutes}`;
      if (showSeconds) {
        timeString += `:${seconds}`;
      }
      timeString += ` ${ampm}`;
    } else {
      timeString = `${hours.toString().padStart(2, '0')}:${minutes}`;
      if (showSeconds) {
        timeString += `:${seconds}`;
      }
    }

    return timeString;
  };

  const neonStyle = {
    fontSize,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: neonColor,
    textAlign: 'center',
    padding: '40px',
    backgroundColor,
    borderRadius: '15px',
    textShadow: `
      0 0 5px ${neonColor},
      0 0 10px ${neonColor},
      0 0 15px ${neonColor},
      0 0 ${glowIntensity}px ${neonColor},
      0 0 ${glowIntensity * 1.5}px ${neonColor},
      0 0 ${glowIntensity * 2}px ${neonColor}
    `,
    boxShadow: `
      inset 0 0 ${glowIntensity}px ${neonColor}40,
      0 0 ${glowIntensity}px ${neonColor}40
    `,
    border: `2px solid ${neonColor}`,
    letterSpacing: '4px',
    animation: animated ? 'neonFlicker 2s infinite alternate' : 'none'
  };

  const keyframes = `
    @keyframes neonFlicker {
      0%, 100% {
        text-shadow:
          0 0 5px ${neonColor},
          0 0 10px ${neonColor},
          0 0 15px ${neonColor},
          0 0 ${glowIntensity}px ${neonColor},
          0 0 ${glowIntensity * 1.5}px ${neonColor},
          0 0 ${glowIntensity * 2}px ${neonColor};
      }
      50% {
        text-shadow:
          0 0 2px ${neonColor},
          0 0 5px ${neonColor},
          0 0 8px ${neonColor},
          0 0 ${glowIntensity * 0.7}px ${neonColor},
          0 0 ${glowIntensity}px ${neonColor},
          0 0 ${glowIntensity * 1.3}px ${neonColor};
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className={`neon-clock ${className}`} style={neonStyle}>
        {formatTime(time)}
      </div>
    </>
  );
};

export default NeonClock;