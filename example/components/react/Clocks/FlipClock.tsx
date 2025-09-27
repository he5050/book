import React, { useState, useEffect } from 'react';

/**
 * 翻页时钟组件
 * @param {Object} props - 组件属性
 * @param {string} props.format - 时间格式，'12' 或 '24'，默认'24'
 * @param {boolean} props.showSeconds - 是否显示秒，默认true
 * @param {string} props.cardColor - 卡片颜色，默认'#333'
 * @param {string} props.textColor - 文字颜色，默认'#fff'
 * @param {string} props.fontSize - 字体大小，默认'2rem'
 * @param {number} props.cardWidth - 卡片宽度，默认60px
 * @param {number} props.cardHeight - 卡片高度，默认80px
 */
const FlipClock = ({
  format = '24',
  showSeconds = true,
  cardColor = '#333333',
  textColor = '#ffffff',
  fontSize = '2rem',
  cardWidth = 60,
  cardHeight = 80,
  className = ''
}) => {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevTime(time);
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const getTimeValues = (date) => {
    let hours = date.getHours();
    if (format === '12') {
      hours = hours % 12;
      hours = hours ? hours : 12;
    }
    return {
      hours: formatNumber(hours),
      minutes: formatNumber(date.getMinutes()),
      seconds: formatNumber(date.getSeconds())
    };
  };

  const currentTime = getTimeValues(time);
  const previousTime = getTimeValues(prevTime);

  const FlipCard = ({ current, previous, isFlipping }) => {
    const cardStyle = {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: cardColor,
      color: textColor,
      fontSize,
      fontFamily: 'monospace',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      position: 'relative',
      margin: '0 4px',
      overflow: 'hidden',
      perspective: '1000px'
    };

    const flipStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backfaceVisibility: 'hidden',
      transition: 'transform 0.6s ease-in-out',
      transformStyle: 'preserve-3d'
    };

    const frontStyle = {
      ...flipStyle,
      transform: isFlipping ? 'rotateX(-90deg)' : 'rotateX(0deg)',
      backgroundColor: cardColor
    };

    const backStyle = {
      ...flipStyle,
      transform: isFlipping ? 'rotateX(0deg)' : 'rotateX(90deg)',
      backgroundColor: cardColor
    };

    return (
      <div style={cardStyle}>
        <div style={frontStyle}>
          {previous}
        </div>
        <div style={backStyle}>
          {current}
        </div>
      </div>
    );
  };

  const Separator = () => (
    <div style={{
      fontSize,
      color: textColor,
      fontWeight: 'bold',
      margin: '0 8px',
      fontFamily: 'monospace'
    }}>
      :
    </div>
  );

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
  };

  return (
    <div className={`flip-clock ${className}`} style={containerStyle}>
      <FlipCard
        current={currentTime.hours}
        previous={previousTime.hours}
        isFlipping={currentTime.hours !== previousTime.hours}
      />
      <Separator />
      <FlipCard
        current={currentTime.minutes}
        previous={previousTime.minutes}
        isFlipping={currentTime.minutes !== previousTime.minutes}
      />
      {showSeconds && (
        <>
          <Separator />
          <FlipCard
            current={currentTime.seconds}
            previous={previousTime.seconds}
            isFlipping={currentTime.seconds !== previousTime.seconds}
          />
        </>
      )}
    </div>
  );
};

export default FlipClock;