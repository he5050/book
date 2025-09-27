import React, { useState, useEffect } from 'react';

/**
 * 模拟时钟组件
 * @param {Object} props - 组件属性
 * @param {number} props.size - 时钟大小，默认200px
 * @param {string} props.backgroundColor - 背景颜色，默认白色
 * @param {string} props.borderColor - 边框颜色，默认黑色
 * @param {string} props.hourHandColor - 时针颜色，默认黑色
 * @param {string} props.minuteHandColor - 分针颜色，默认黑色
 * @param {string} props.secondHandColor - 秒针颜色，默认红色
 * @param {boolean} props.showNumbers - 是否显示数字，默认true
 * @param {boolean} props.showTicks - 是否显示刻度，默认true
 */
const AnalogClock = ({
  size = 200,
  backgroundColor = '#ffffff',
  borderColor = '#333333',
  hourHandColor = '#333333',
  minuteHandColor = '#333333',
  secondHandColor = '#ff0000',
  showNumbers = true,
  showTicks = true,
  className = ''
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // 计算指针角度
  const hourAngle = (hours * 30) + (minutes * 0.5) - 90;
  const minuteAngle = (minutes * 6) - 90;
  const secondAngle = (seconds * 6) - 90;

  const radius = size / 2;
  const center = radius;

  // 生成数字位置
  const generateNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = center + (radius - 25) * Math.cos(angle);
      const y = center + (radius - 25) * Math.sin(angle);
      numbers.push(
        <text
          key={i}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size / 12}
          fill={borderColor}
          fontWeight="bold"
        >
          {i}
        </text>
      );
    }
    return numbers;
  };

  // 生成刻度
  const generateTicks = () => {
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isHour = i % 5 === 0;
      const tickLength = isHour ? 15 : 8;
      const tickWidth = isHour ? 2 : 1;

      const x1 = center + (radius - tickLength) * Math.cos(angle);
      const y1 = center + (radius - tickLength) * Math.sin(angle);
      const x2 = center + (radius - 5) * Math.cos(angle);
      const y2 = center + (radius - 5) * Math.sin(angle);

      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={borderColor}
          strokeWidth={tickWidth}
        />
      );
    }
    return ticks;
  };

  const clockStyle = {
    width: size,
    height: size,
    backgroundColor,
    borderRadius: '50%',
    border: `3px solid ${borderColor}`,
    position: 'relative'
  };

  return (
    <div className={`analog-clock ${className}`} style={clockStyle}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* 刻度 */}
        {showTicks && generateTicks()}

        {/* 数字 */}
        {showNumbers && generateNumbers()}

        {/* 时针 */}
        <line
          x1={center}
          y1={center}
          x2={center + (radius * 0.5) * Math.cos(hourAngle * Math.PI / 180)}
          y2={center + (radius * 0.5) * Math.sin(hourAngle * Math.PI / 180)}
          stroke={hourHandColor}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* 分针 */}
        <line
          x1={center}
          y1={center}
          x2={center + (radius * 0.7) * Math.cos(minuteAngle * Math.PI / 180)}
          y2={center + (radius * 0.7) * Math.sin(minuteAngle * Math.PI / 180)}
          stroke={minuteHandColor}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* 秒针 */}
        <line
          x1={center}
          y1={center}
          x2={center + (radius * 0.8) * Math.cos(secondAngle * Math.PI / 180)}
          y2={center + (radius * 0.8) * Math.sin(secondAngle * Math.PI / 180)}
          stroke={secondHandColor}
          strokeWidth={1}
          strokeLinecap="round"
        />

        {/* 中心圆点 */}
        <circle
          cx={center}
          cy={center}
          r={6}
          fill={borderColor}
        />
      </svg>
    </div>
  );
};

export default AnalogClock;