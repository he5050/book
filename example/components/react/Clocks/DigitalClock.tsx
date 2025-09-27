import React, { useState, useEffect } from 'react';

/**
 * 数字时钟组件
 * @param {Object} props - 组件属性
 * @param {string} props.format - 时间格式，'12' 或 '24'，默认'24'
 * @param {boolean} props.showSeconds - 是否显示秒，默认true
 * @param {boolean} props.showDate - 是否显示日期，默认false
 * @param {string} props.fontSize - 字体大小，默认'2rem'
 * @param {string} props.fontFamily - 字体，默认'monospace'
 * @param {string} props.color - 文字颜色，默认'#333'
 * @param {string} props.backgroundColor - 背景颜色，默认透明
 * @param {string} props.borderRadius - 圆角，默认'8px'
 * @param {string} props.padding - 内边距，默认'20px'
 */
const DigitalClock = ({
  format = '24',
  showSeconds = true,
  showDate = false,
  fontSize = '2rem',
  fontFamily = 'monospace',
  color = '#333333',
  backgroundColor = 'transparent',
  borderRadius = '8px',
  padding = '20px',
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
      hours = hours ? hours : 12; // 0点显示为12点
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
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];

    return `${year}-${month}-${day} ${weekday}`;
  };

  const clockStyle = {
    fontSize,
    fontFamily,
    color,
    backgroundColor,
    borderRadius,
    padding,
    textAlign: 'center',
    display: 'inline-block',
    minWidth: 'fit-content'
  };

  return (
    <div className={`digital-clock ${className}`} style={clockStyle}>
      {showDate && (
        <div style={{ fontSize: '0.6em', marginBottom: '10px', opacity: 0.8 }}>
          {formatDate(time)}
        </div>
      )}
      <div style={{ fontWeight: 'bold', letterSpacing: '2px' }}>
        {formatTime(time)}
      </div>
    </div>
  );
};

export default DigitalClock;