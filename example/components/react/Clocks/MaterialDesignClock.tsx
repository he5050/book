import React, { useState, useEffect } from 'react';

/**
 * 材料设计时钟组件的属性接口
 */
interface MaterialDesignClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 主要颜色，默认#4CAF50 */
  primaryColor?: string;
  /** 阴影层级，默认4 */
  elevation?: number;
  /** 是否启用涟漪效果，默认false */
  rippleEffect?: boolean;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 材料设计时钟组件
 * Google的设计语言，强调层次和动效，使用分层元素和一致的阴影
 */
const MaterialDesignClock: React.FC<MaterialDesignClockProps> = ({
  size = 300,
  primaryColor = '#4CAF50',
  elevation = 4,
  rippleEffect = false,
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

  // 根据elevation计算阴影
  const getElevationShadow = (level: number): string => {
    const shadows = [
      'none',
      '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
    ];
    return shadows[Math.min(level, shadows.length - 1)];
  };

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
    background: primaryColor,
    boxShadow: getElevationShadow(elevation)
  };

  // 内层时钟样式
  const innerClockStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    right: '10px',
    bottom: '10px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  });

  // 中心点样式
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 18,
    height: 18,
    background: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
        height: 18,
        background: '#fff',
        transformOrigin: '50% 0',
        transform: `translate(-50%, -${(size - 20) / 2 - 15}px) rotate(${angle}deg)`,
        borderRadius: '2px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
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
      const radius = (size - 20) / 2 - 30;
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
        color: '#fff',
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
    <div className={`material-design-clock ${className}`} style={containerStyle}>
      <div style={clockStyle}>
        {/* 内层圆 */}
        <div style={innerClockStyle} />

        {/* 刻度 */}
        {generateMarks()}

        {/* 数字 */}
        {generateNumbers()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 65, 6, '#fff', 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 90, 4, '#fff', 8)} />

        {/* 秒针 */}
        <div style={handStyle(secondAngle, 100, 2, '#FF5722', 9)} />

        {/* 中心点 */}
        <div style={centerStyle} />
      </div>
    </div>
  );
};

export default MaterialDesignClock;