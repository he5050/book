import React, { useState, useEffect } from 'react';

/**
 * 新野兽主义时钟组件的属性接口
 */
interface NeoBrutalismClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 主要颜色，默认#ffff00 */
  primaryColor?: string;
  /** 边框宽度，默认4px */
  borderWidth?: number;
  /** 阴影偏移，默认8px */
  shadowOffset?: number;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 新野兽主义时钟组件
 * 大胆的色彩和强烈的对比，原始的设计风格，拥抱最小样式和粗糙视觉
 */
const NeoBrutalismClock: React.FC<NeoBrutalismClockProps> = ({
  size = 300,
  primaryColor = '#ffff00',
  borderWidth = 4,
  shadowOffset = 8,
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
    padding: 20,
    display: 'inline-block',
    background: '#fff'
  };

  // 时钟样式
  const clockStyle: React.CSSProperties = {
    width: size - 40,
    height: size - 40,
    position: 'relative',
    borderRadius: '50%',
    background: primaryColor,
    border: `${borderWidth}px solid #000`,
    boxShadow: `${shadowOffset}px ${shadowOffset}px 0 #000`
  };

  // 内层彩色圆环样式
  const innerRingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    left: '15px',
    right: '15px',
    bottom: '15px',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)',
    border: `${borderWidth}px solid #000`
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
    border: `2px solid #000`,
    zIndex
  });

  // 中心点样式
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    background: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    border: `${borderWidth}px solid #000`,
    boxShadow: `${shadowOffset / 2}px ${shadowOffset / 2}px 0 #000`
  };

  // 生成时钟刻度 - 使用方块
  const generateMarks = (): JSX.Element[] => {
    const marks: JSX.Element[] = [];

    // 小时刻度
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = (size - 40) / 2 - 25;
      const x = (size - 40) / 2 + radius * Math.cos(angle) - 6;
      const y = (size - 40) / 2 + radius * Math.sin(angle) - 6;

      const markStyle: React.CSSProperties = {
        position: 'absolute',
        width: 12,
        height: 12,
        background: '#000',
        left: x,
        top: y,
        transform: `rotate(${i * 30}deg)`
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
      const radius = (size - 40) / 2 - 45;
      const x = (size - 40) / 2 + radius * Math.cos(angle) - 15;
      const y = (size - 40) / 2 + radius * Math.sin(angle) - 15;

      const numberStyle: React.CSSProperties = {
        position: 'absolute',
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000',
        left: x,
        top: y,
        background: '#fff',
        border: '2px solid #000',
        fontFamily: 'Arial Black, sans-serif'
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
    <div className={`neo-brutalism-clock ${className}`} style={containerStyle}>
      <div style={clockStyle}>
        {/* 内层彩色圆环 */}
        <div style={innerRingStyle} />

        {/* 刻度 */}
        {generateMarks()}

        {/* 数字 */}
        {generateNumbers()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 70, 8, '#000', 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 90, 6, '#000', 8)} />

        {/* 秒针 */}
        <div style={handStyle(secondAngle, 100, 3, '#ff0000', 9)} />

        {/* 中心点 */}
        <div style={centerStyle} />
      </div>
    </div>
  );
};

export default NeoBrutalismClock;