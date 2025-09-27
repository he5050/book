import React, { useState, useEffect } from 'react';

/**
 * 扁平化设计时钟组件的属性接口
 */
interface FlatDesignClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 背景颜色，默认#2196F3 */
  backgroundColor?: string;
  /** 强调色，默认#ffcd50 */
  accentColor?: string;
  /** 是否显示刻度，默认true */
  showTicks?: boolean;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 扁平化设计时钟组件
 * 简洁明快，去除多余装饰元素，使用纯色和清晰的形状
 */
const FlatDesignClock: React.FC<FlatDesignClockProps> = ({
  size = 300,
  backgroundColor = '#2196F3',
  accentColor = '#ffcd50',
  showTicks = true,
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

  // 容器样式
  const containerStyle: React.CSSProperties = {
    padding: 10,
    display: 'inline-block'
  };

  // 时钟样式
  const clockStyle: React.CSSProperties = {
    width: size - 20,
    height: size - 20,
    position: 'relative',
    borderRadius: '50%',
    background: backgroundColor,
    border: 'none',
    boxShadow: 'none'
  };

  // 指针样式生成函数
  const handStyle = (angle: number, length: number, width: number, color: string, zIndex: number): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: length,
    height: width,
    background: color,
    transformOrigin: '0 50%',
    transform: `translate(0, -50%) rotate(${angle}deg)`,
    borderRadius: `0 ${width / 2}px ${width / 2}px 0`,
    zIndex
  });

  // 中心点样式
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 16,
    height: 16,
    background: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10
  };

  // 生成时钟刻度
  const generateMarks = (): JSX.Element[] => {
    if (!showTicks) return [];

    const marks: JSX.Element[] = [];

    // 小时刻度
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const markStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 3,
        height: 15,
        background: '#fff',
        transformOrigin: '50% 0',
        transform: `translate(-50%, -${(size - 20) / 2 - 10}px) rotate(${angle}deg)`,
        borderRadius: '2px'
      };
      marks.push(<div key={`hour-${i}`} style={markStyle} />);
    }

    // 分钟刻度
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        const angle = i * 6;
        const markStyle: React.CSSProperties = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1,
          height: 8,
          background: 'rgba(255,255,255,0.7)',
          transformOrigin: '50% 0',
          transform: `translate(-50%, -${(size - 20) / 2 - 10}px) rotate(${angle}deg)`
        };
        marks.push(<div key={`minute-${i}`} style={markStyle} />);
      }
    }

    return marks;
  };

  // 生成数字
  const generateNumbers = (): JSX.Element[] => {
    const numbers: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = (size - 20) / 2 - 25;
      const x = (size - 20) / 2 + radius * Math.cos(angle) - 20;
      const y = (size - 20) / 2 + radius * Math.sin(angle) - 20;

      const numberStyle: React.CSSProperties = {
        position: 'absolute',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#555',
        left: x,
        top: y
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
    <div className={`flat-design-clock ${className}`} style={containerStyle}>
      <div style={clockStyle}>
        {/* 刻度 */}
        {generateMarks()}

        {/* 数字 */}
        {generateNumbers()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 70, 6, '#555', 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 95, 4, '#777', 8)} />

        {/* 秒针 */}
        <div style={handStyle(secondAngle, 110, 2, accentColor, 9)} />

        {/* 中心点 */}
        <div style={centerStyle} />
      </div>
    </div>
  );
};

export default FlatDesignClock;