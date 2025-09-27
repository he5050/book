import React, { useState, useEffect } from 'react';

/**
 * 拟物化设计时钟组件的属性接口
 */
interface SkeuomorphismClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 主要颜色，默认#f5f5f5 */
  primaryColor?: string;
  /** 次要颜色，默认#e0e0e0 */
  secondaryColor?: string;
  /** 是否显示数字，默认true */
  showNumbers?: boolean;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 拟物化设计时钟组件
 * 模拟真实物理对象的外观和质感，使用阴影、纹理和深度创造熟悉的触感界面
 */
const SkeuomorphismClock: React.FC<SkeuomorphismClockProps> = ({
  size = 300,
  primaryColor = '#f5f5f5',
  secondaryColor = '#e0e0e0',
  showNumbers = true,
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
  const secondAngle = (time.getSeconds() * 6) - 90; // 每秒6度
  const minuteAngle = (time.getMinutes() * 6 + time.getSeconds() * 0.1) - 90; // 每分钟6度
  const hourAngle = ((time.getHours() % 12) * 30 + time.getMinutes() * 0.5) - 90; // 每小时30度

  // 时钟容器样式
  const clockStyle: React.CSSProperties = {
    width: size,
    height: size,
    position: 'relative',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    boxShadow: `
      rgba(0, 0, 0, 0.07) 0px 1px 2px,
      rgba(0, 0, 0, 0.07) 0px 2px 4px,
      rgba(0, 0, 0, 0.07) 0px 4px 8px,
      rgba(0, 0, 0, 0.07) 0px 8px 16px,
      rgba(0, 0, 0, 0.07) 0px 16px 32px,
      rgba(0, 0, 0, 0.07) 0px 32px 64px,
      0 2px 5px rgba(0, 0, 0, 0.3)
    `,
    border: '8px solid #fff'
  };

  // 时钟表面样式
  const clockFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    boxShadow: `
      0 0 10px rgba(0, 0, 0, 0.2),
      inset 0 0 20px rgba(0, 0, 0, 0.1),
      0 2px 5px rgba(0, 0, 0, 0.3)
    `
  };

  // 反光效果样式
  const reflectionStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '30%',
    height: '30%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
    filter: 'blur(2px)'
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
    zIndex,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  });

  // 中心点样式
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    background: '#333',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  };

  // 中心点内部样式
  const centerInnerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    background: '#666',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)'
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
        height: 20,
        background: '#333',
        transformOrigin: '50% 0',
        transform: `translate(-50%, -${size / 2 - 15}px) rotate(${angle}deg)`,
        borderRadius: '2px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
      };
      marks.push(<div key={`hour-${i}`} style={markStyle} />);
    }

    // 分钟刻度
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) { // 跳过小时刻度位置
        const angle = i * 6;
        const markStyle: React.CSSProperties = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1,
          height: 8,
          background: '#666',
          transformOrigin: '50% 0',
          transform: `translate(-50%, -${size / 2 - 15}px) rotate(${angle}deg)`,
          borderRadius: '1px'
        };
        marks.push(<div key={`minute-${i}`} style={markStyle} />);
      }
    }

    return marks;
  };

  // 生成数字
  const generateNumbers = (): JSX.Element[] => {
    if (!showNumbers) return [];

    const numbers: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = size / 2 - 30;
      const x = size / 2 + radius * Math.cos(angle) - 20;
      const y = size / 2 + radius * Math.sin(angle) - 20;

      const numberStyle: React.CSSProperties = {
        position: 'absolute',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
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
    <div className={`skeuomorphism-clock ${className}`} style={clockStyle}>
      <div style={clockFaceStyle}>
        {/* 反光效果 */}
        <div style={reflectionStyle} />

        {/* 刻度 */}
        {generateMarks()}

        {/* 数字 */}
        {generateNumbers()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 75, 8, '#333', 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 105, 6, '#444', 8)} />

        {/* 秒针 */}
        <div style={handStyle(secondAngle, 115, 2, '#c00', 9)} />

        {/* 中心点 */}
        <div style={centerStyle}>
          <div style={centerInnerStyle} />
        </div>
      </div>
    </div>
  );
};

export default SkeuomorphismClock;