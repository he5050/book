import React, { useState, useEffect } from 'react';

/**
 * 极简主义时钟组件的属性接口
 */
interface MinimalismClockProps {
  /** 时钟尺寸，默认300px */
  size?: number;
  /** 线条颜色，默认#333 */
  lineColor?: string;
  /** 背景颜色，默认#fff */
  backgroundColor?: string;
  /** 是否显示秒针，默认true */
  showSeconds?: boolean;
  /** 自定义CSS类名 */
  className?: string;
}

/**
 * 极简主义时钟组件
 * 去繁就简，只保留最核心的元素，专注于清晰的线条、开放空间和功能性
 */
const MinimalismClock: React.FC<MinimalismClockProps> = ({
  size = 300,
  lineColor = '#333',
  backgroundColor = '#fff',
  showSeconds = true,
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
    background: backgroundColor
  };

  // 时钟样式
  const clockStyle: React.CSSProperties = {
    width: size - 40,
    height: size - 40,
    position: 'relative',
    borderRadius: '50%',
    background: backgroundColor,
    border: `1px solid ${lineColor}`
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
    zIndex
  });

  // 生成极简刻度 - 只有12、3、6、9点位置
  const generateMarks = (): JSX.Element[] => {
    const marks: JSX.Element[] = [];
    const positions = [0, 3, 6, 9]; // 12, 3, 6, 9点位置

    positions.forEach(pos => {
      const angle = (pos * 30 - 90) * (Math.PI / 180);
      const radius = (size - 40) / 2 - 15;
      const x = (size - 40) / 2 + radius * Math.cos(angle) - 1;
      const y = (size - 40) / 2 + radius * Math.sin(angle) - 1;

      const markStyle: React.CSSProperties = {
        position: 'absolute',
        width: 2,
        height: 2,
        background: lineColor,
        borderRadius: '50%',
        left: x,
        top: y
      };
      marks.push(<div key={`mark-${pos}`} style={markStyle} />);
    });

    return marks;
  };

  return (
    <div className={`minimalism-clock ${className}`} style={containerStyle}>
      <div style={clockStyle}>
        {/* 极简刻度 */}
        {generateMarks()}

        {/* 时针 */}
        <div style={handStyle(hourAngle, 60, 3, '#333', 7)} />

        {/* 分针 */}
        <div style={handStyle(minuteAngle, 80, 2, '#666', 8)} />

        {/* 秒针 */}
        {showSeconds && <div style={handStyle(secondAngle, 90, 1, '#999', 9)} />}
      </div>
    </div>
  );
};

export default MinimalismClock;