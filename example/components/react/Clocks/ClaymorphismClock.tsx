import React, { useState, useEffect } from 'react';

/**
 * 粘土拟态时钟组件的属性接口
 */
interface ClaymorphismClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 粘土颜色，默认#ddbea9 */
  clayColor?: string;
  /** 柔软度，默认1 */
  softness?: number;
  /** 纹理强度，默认0.5 */
  texture?: number;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 粘土拟态时钟组件
 * 柔软的粘土质感，温暖的色调，厚实圆润的边缘和柔和的阴影
 */
const ClaymorphismClock: React.FC<ClaymorphismClockProps> = ({
  size = 300,
  clayColor = '#ddbea9',
  softness = 1,
  texture = 0.5,
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

  // 计算柔和的阴影
  const getSoftShadow = (intensity: number): string => {
    return `0 ${8 * intensity}px ${16 * intensity}px rgba(0,0,0,0.1), 0 ${4 * intensity}px ${8 * intensity}px rgba(0,0,0,0.06)`;
  };

  // 容器样式
  const containerStyle: React.CSSProperties = {
    padding: 20,
    display: 'inline-block',
    background: `linear-gradient(135deg, ${clayColor} 0%, #cb997e 100%)`,
    borderRadius: '30px'
  };

  // 时钟样式
  const clockStyle: React.CSSProperties = {
    width: size - 40,
    height: size - 40,
    position: 'relative',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${clayColor} 0%, #b7b7a4 100%)`,
    boxShadow: getSoftShadow(softness),
    border: '3px solid rgba(255,255,255,0.3)'
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
    borderRadius: `${width}px`,
    zIndex,
    boxShadow: `0 ${2 * softness}px ${4 * softness}px rgba(0,0,0,0.2)`
  });

  // 中心点样式
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 24,
    height: 24,
    background: `linear-gradient(135deg, #a5a58d 0%, #6f7364 100%)`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: getSoftShadow(softness)
  };

  // 生成时钟刻度 - 使用小圆点
  const generateMarks = (): JSX.Element[] => {
    const marks: JSX.Element[] = [];

    // 小时刻度
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = (size - 40) / 2 - 20;
      const x = (size - 40) / 2 + radius * Math.cos(angle) - 4;
      const y = (size - 40) / 2 + radius * Math.sin(angle) - 4;

      const markStyle: React.CSSProperties = {
        position: 'absolute',
        width: 8,
        height: 8,
        background: '#6f7364',
        borderRadius: '50%',
        left: x,
        top: y,
        boxShadow: `0 ${1 * softness}px ${2 * softness}px rgba(0,0,0,0.2)`
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
      const radius = (size - 40) / 2 - 35;
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
        color: '#6f7364',
        left: x,
        top: y,
        textShadow: '0 2px 4px rgba(255,255,255,0.8)'
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
    <div className={`claymorphism-clock ${className}`} style={containerStyle}>
      <div style={clockStyle}>
        {/* 刻度 */}
        {generateMarks()}

        {/* 数字 */}
        {generateNumbers()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 70, 8, '#8fbc8f', 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 90, 6, '#9acd32', 8)} />

        {/* 秒针 */}
        <div style={handStyle(secondAngle, 100, 3, '#ff6b6b', 9)} />

        {/* 中心点 */}
        <div style={centerStyle} />
      </div>
    </div>
  );
};

export default ClaymorphismClock;