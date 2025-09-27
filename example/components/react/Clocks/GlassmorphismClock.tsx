import React, { useState, useEffect } from 'react';

/**
 * 玻璃拟态时钟组件的属性接口
 */
interface GlassmorphismClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 玻璃颜色，默认rgba(255,255,255,0.1) */
  glassColor?: string;
  /** 模糊强度，默认10px */
  blurIntensity?: number;
  /** 边框透明度，默认0.2 */
  borderOpacity?: number;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 玻璃拟态时钟组件
 * 透明玻璃质感，模糊背景效果，营造出磨砂玻璃的视觉效果
 */
const GlassmorphismClock: React.FC<GlassmorphismClockProps> = ({
  size = 300,
  glassColor = 'rgba(255,255,255,0.1)',
  blurIntensity = 10,
  borderOpacity = 0.2,
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px'
  };

  // 时钟样式
  const clockStyle: React.CSSProperties = {
    width: size - 40,
    height: size - 40,
    position: 'relative',
    borderRadius: '50%',
    background: glassColor,
    backdropFilter: `blur(${blurIntensity}px)`,
    border: `1px solid rgba(255,255,255,${borderOpacity})`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  };

  // 指针样式生成函数
  const handStyle = (angle: number, length: number, width: number, opacity: number, zIndex: number): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: length,
    height: width,
    background: `rgba(255, 255, 255, ${opacity})`,
    transformOrigin: '0 50%',
    transform: `translate(0, -50%) rotate(${angle}deg)`,
    borderRadius: `0 ${width / 2}px ${width / 2}px 0`,
    zIndex,
    backdropFilter: 'blur(2px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  // 中心点样式
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 16,
    height: 16,
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    backdropFilter: 'blur(2px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
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
        width: 3,
        height: 15,
        background: 'rgba(255, 255, 255, 0.6)',
        transformOrigin: '50% 0',
        transform: `translate(-50%, -${(size - 40) / 2 - 15}px) rotate(${angle}deg)`,
        borderRadius: '2px',
        backdropFilter: 'blur(1px)'
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
          background: 'rgba(255, 255, 255, 0.3)',
          transformOrigin: '50% 0',
          transform: `translate(-50%, -${(size - 40) / 2 - 15}px) rotate(${angle}deg)`
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
      const radius = (size - 40) / 2 - 30;
      const x = (size - 40) / 2 + radius * Math.cos(angle) - 15;
      const y = (size - 40) / 2 + radius * Math.sin(angle) - 15;

      const numberStyle: React.CSSProperties = {
        position: 'absolute',
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.9)',
        left: x,
        top: y,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      };

      numbers.push(
        <div key={i} style={numberStyle}>
          {i}
        </div>
      );
    }
    return numbers;
  };

  // 生成装饰圆点
  const generateDecorationDots = (): JSX.Element[] => {
    const dots: JSX.Element[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = i * 45;
      const radius = (size - 40) / 2 - 5;
      const x = (size - 40) / 2 + radius * Math.cos(angle * Math.PI / 180) - 2;
      const y = (size - 40) / 2 + radius * Math.sin(angle * Math.PI / 180) - 2;

      const dotStyle: React.CSSProperties = {
        position: 'absolute',
        width: 4,
        height: 4,
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '50%',
        left: x,
        top: y,
        animation: `float-${i} 3s ease-in-out infinite`,
        animationDelay: `${i * 0.2}s`
      };

      dots.push(<div key={`dot-${i}`} style={dotStyle} />);
    }
    return dots;
  };

  return (
    <div className={`glassmorphism-clock ${className}`} style={containerStyle}>
      <style>
        {`
          @keyframes float-0, @keyframes float-1, @keyframes float-2, @keyframes float-3,
          @keyframes float-4, @keyframes float-5, @keyframes float-6, @keyframes float-7 {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-5px); opacity: 0.8; }
          }
          @keyframes float-1 { 0%, 100% { transform: translateY(-2px); opacity: 0.5; } 50% { transform: translateY(-7px); opacity: 0.9; } }
          @keyframes float-2 { 0%, 100% { transform: translateY(-1px); opacity: 0.3; } 50% { transform: translateY(-6px); opacity: 0.7; } }
          @keyframes float-3 { 0%, 100% { transform: translateY(-3px); opacity: 0.6; } 50% { transform: translateY(-8px); opacity: 1.0; } }
          @keyframes float-4 { 0%, 100% { transform: translateY(-2px); opacity: 0.4; } 50% { transform: translateY(-7px); opacity: 0.8; } }
          @keyframes float-5 { 0%, 100% { transform: translateY(-1px); opacity: 0.5; } 50% { transform: translateY(-6px); opacity: 0.9; } }
          @keyframes float-6 { 0%, 100% { transform: translateY(-4px); opacity: 0.3; } 50% { transform: translateY(-9px); opacity: 0.7; } }
          @keyframes float-7 { 0%, 100% { transform: translateY(-2px); opacity: 0.6; } 50% { transform: translateY(-7px); opacity: 1.0; } }
        `}
      </style>

      <div style={clockStyle}>
        {/* 装饰圆点 */}
        {generateDecorationDots()}

        {/* 刻度 */}
        {generateMarks()}

        {/* 数字 */}
        {generateNumbers()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 65, 5, 0.9, 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 85, 3, 0.8, 8)} />

        {/* 秒针 */}
        <div style={{
          ...handStyle(secondAngle, 95, 1, 1, 9),
          background: 'rgba(255, 255, 255, 1)'
        }} />

        {/* 中心点 */}
        <div style={centerStyle} />
      </div>
    </div>
  );
};

export default GlassmorphismClock;