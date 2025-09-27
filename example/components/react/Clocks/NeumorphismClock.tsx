import React, { useState, useEffect } from 'react';

/**
 * 新拟物化时钟组件的属性接口
 */
interface NeumorphismClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 基础颜色，默认#e0e5ec */
  baseColor?: string;
  /** 阴影强度，默认1 */
  shadowIntensity?: number;
  /** 边框圆角，默认50% */
  borderRadius?: string;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 新拟物化时钟组件
 * 柔和的阴影和高光营造立体感，元素看起来像是从背景中挤压出来的
 */
const NeumorphismClock: React.FC<NeumorphismClockProps> = ({
  size = 300,
  baseColor = '#e0e5ec',
  shadowIntensity = 1,
  borderRadius = '50%',
  className = ''
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 计算指针角度
  const secondAngle = (time.getSeconds() * 6) - 90;
  const minuteAngle = (time.getMinutes() * 6 + time.getSeconds() * 0.1) - 90;
  const hourAngle = ((time.getHours() % 12) * 30 + time.getMinutes() * 0.5) - 90;

  // 计算阴影颜色
  const getDarkShadow = (intensity: number): string => {
    const opacity = 0.2 * intensity;
    return `rgba(163, 177, 198, ${opacity})`;
  };

  const getLightShadow = (intensity: number): string => {
    const opacity = 0.8 * intensity;
    return `rgba(255, 255, 255, ${opacity})`;
  };

  // 容器样式
  const containerStyle: React.CSSProperties = {
    padding: 10,
    display: 'inline-block',
    background: baseColor
  };

  // 时钟样式
  const clockStyle: React.CSSProperties = {
    width: size - 20,
    height: size - 20,
    position: 'relative',
    borderRadius,
    background: baseColor,
    boxShadow: `
      ${20 * shadowIntensity}px ${20 * shadowIntensity}px ${40 * shadowIntensity}px ${getDarkShadow(shadowIntensity)},
      -${20 * shadowIntensity}px -${20 * shadowIntensity}px ${40 * shadowIntensity}px ${getLightShadow(shadowIntensity)}
    `
  };

  // 内层时钟样式
  const innerClockStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    left: '15px',
    right: '15px',
    bottom: '15px',
    borderRadius,
    background: baseColor,
    boxShadow: `
      inset ${10 * shadowIntensity}px ${10 * shadowIntensity}px ${20 * shadowIntensity}px ${getDarkShadow(shadowIntensity)},
      inset -${10 * shadowIntensity}px -${10 * shadowIntensity}px ${20 * shadowIntensity}px ${getLightShadow(shadowIntensity)}
    `
  };

  // 指针样式生成函数
  const handStyle = (angle: number, length: number, width: number, zIndex: number): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: length,
    height: width,
    background: baseColor,
    transformOrigin: '0 50%',
    transform: `translate(0, -50%) rotate(${angle}deg)`,
    borderRadius: `0 ${width / 2}px ${width / 2}px 0`,
    zIndex,
    boxShadow: `
      ${2 * shadowIntensity}px ${2 * shadowIntensity}px ${4 * shadowIntensity}px ${getDarkShadow(shadowIntensity)},
      -${1 * shadowIntensity}px -${1 * shadowIntensity}px ${2 * shadowIntensity}px ${getLightShadow(shadowIntensity)}
    `
  });

  // 中心点样式
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    background: baseColor,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: `
      ${3 * shadowIntensity}px ${3 * shadowIntensity}px ${6 * shadowIntensity}px ${getDarkShadow(shadowIntensity)},
      -${3 * shadowIntensity}px -${3 * shadowIntensity}px ${6 * shadowIntensity}px ${getLightShadow(shadowIntensity)}
    `
  };

  // 生成时钟刻度
  const generateMarks = (): JSX.Element[] => {
    const marks: JSX.Element[] = [];

    // 小时刻度
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const markStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 4,
        height: 16,
        background: baseColor,
        transformOrigin: '50% 0',
        transform: `translate(-50%, -${(size - 20) / 2 - 20}px) rotate(${angle}deg)`,
        borderRadius: '2px',
        boxShadow: `
          ${1 * shadowIntensity}px ${1 * shadowIntensity}px ${2 * shadowIntensity}px ${getDarkShadow(shadowIntensity)},
          -${1 * shadowIntensity}px -${1 * shadowIntensity}px ${2 * shadowIntensity}px ${getLightShadow(shadowIntensity)}
        `
      };
      marks.push(<div key={`hour-${i}`} style={markStyle} />);
    }

    return marks;
  };

  // 生成数字
  const generateNumbers = (): JSX.Element[] => {
    const numbers: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = (size - 20) / 2 - 35;
      const x = (size - 20) / 2 + radius * Math.cos(angle) - 15;
      const y = (size - 20) / 2 + radius * Math.sin(angle) - 15;

      const numberStyle: React.CSSProperties = {
        position: 'absolute',
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#8e9aaf',
        left: x,
        top: y,
        textShadow: `
          1px 1px 2px #ffffff,
          -1px -1px 2px #a3b1c6
        `
      };

      numbers.push(
        <div key={i} style={numberStyle}>
          {i}
        </div>
      );
    }
    return numbers;
  };

  return (
    <div className={`neumorphism-clock ${className}`} style={containerStyle}>
      <div style={clockStyle}>
        {/* 内层圆 */}
        <div style={innerClockStyle} />

        {/* 刻度 */}
        {generateMarks()}

        {/* 数字 */}
        {generateNumbers()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 70, 6, 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 95, 4, 8)} />

        {/* 秒针 */}
        <div style={{
          ...handStyle(secondAngle, 105, 2, 9),
          background: '#ff6b6b',
          boxShadow: `
            1px 1px 2px #a3b1c6,
            -1px -1px 2px #ffffff
          `
        }} />

        {/* 中心点 */}
        <div style={centerStyle} />
      </div>
    </div>
  );
};

export default NeumorphismClock;