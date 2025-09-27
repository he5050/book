import React, { useState, useEffect } from 'react';

/**
 * LCD数字时钟组件
 * @param {Object} props - 组件属性
 * @param {string} props.format - 时间格式，'12' 或 '24'，默认'24'
 * @param {boolean} props.showSeconds - 是否显示秒，默认true
 * @param {boolean} props.showDate - 是否显示日期，默认false
 * @param {string} props.lcdColor - LCD颜色，默认'#00ff00'
 * @param {string} props.backgroundColor - 背景颜色，默认'#001100'
 * @param {string} props.fontSize - 字体大小，默认'2.5rem'
 * @param {boolean} props.showGrid - 是否显示网格背景，默认true
 */
const LCDClock = ({
  format = '24',
  showSeconds = true,
  showDate = false,
  lcdColor = '#00ff00',
  backgroundColor = '#001100',
  fontSize = '2.5rem',
  showGrid = true,
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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weekday = weekdays[date.getDay()];

    return `${year}-${month}-${day} ${weekday}`;
  };

  const lcdStyle = {
    fontSize,
    fontFamily: '"Courier New", monospace',
    fontWeight: 'bold',
    color: lcdColor,
    backgroundColor,
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    border: `3px solid ${lcdColor}40`,
    boxShadow: `
      inset 0 0 20px ${lcdColor}20,
      0 0 20px ${lcdColor}30
    `,
    letterSpacing: '3px',
    position: 'relative',
    overflow: 'hidden'
  };

  const gridStyle = showGrid ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(${lcdColor}10 1px, transparent 1px),
      linear-gradient(90deg, ${lcdColor}10 1px, transparent 1px)
    `,
    backgroundSize: '4px 4px',
    pointerEvents: 'none'
  } : {};

  return (
    <div className={`lcd-clock ${className}`} style={lcdStyle}>
      {showGrid && <div style={gridStyle}></div>}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {showDate && (
          <div style={{
            fontSize: '0.5em',
            marginBottom: '15px',
            opacity: 0.8,
            letterSpacing: '2px'
          }}>
            {formatDate(time)}
          </div>
        )}
        <div style={{
          textShadow: `0 0 10px ${lcdColor}`,
          filter: 'brightness(1.2)'
        }}>
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default LCDClock;