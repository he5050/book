import React, { useState, useEffect } from 'react';

/**
 * 二进制时钟组件
 * @param {Object} props - 组件属性
 * @param {string} props.onColor - 亮起的颜色，默认'#00ff00'
 * @param {string} props.offColor - 熄灭的颜色，默认'#333333'
 * @param {string} props.backgroundColor - 背景颜色，默认'#000000'
 * @param {number} props.dotSize - 点的大小，默认20px
 * @param {number} props.spacing - 点之间的间距，默认5px
 * @param {boolean} props.showLabels - 是否显示标签，默认true
 * @param {boolean} props.showSeconds - 是否显示秒，默认true
 */
const BinaryClock = ({
  onColor = '#00ff00',
  offColor = '#333333',
  backgroundColor = '#000000',
  dotSize = 20,
  spacing = 5,
  showLabels = true,
  showSeconds = true,
  className = ''
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 将数字转换为二进制数组
  const toBinary = (num, bits = 4) => {
    return num.toString(2).padStart(bits, '0').split('').map(bit => bit === '1');
  };

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // 分解时分秒为十位和个位
  const hourTens = Math.floor(hours / 10);
  const hourOnes = hours % 10;
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;
  const secondTens = Math.floor(seconds / 10);
  const secondOnes = seconds % 10;

  // 转换为二进制
  const binaryData = [
    { value: hourTens, bits: 2, label: 'H1' },
    { value: hourOnes, bits: 4, label: 'H2' },
    { value: minuteTens, bits: 3, label: 'M1' },
    { value: minuteOnes, bits: 4, label: 'M2' }
  ];

  if (showSeconds) {
    binaryData.push(
      { value: secondTens, bits: 3, label: 'S1' },
      { value: secondOnes, bits: 4, label: 'S2' }
    );
  }

  const BinaryColumn = ({ value, bits, label }) => {
    const binary = toBinary(value, bits);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: `0 ${spacing}px`
      }}>
        {showLabels && (
          <div style={{
            color: onColor,
            fontSize: '12px',
            fontFamily: 'monospace',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            {label}
          </div>
        )}
        {binary.map((bit, index) => (
          <div
            key={index}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: bit ? onColor : offColor,
              margin: `${spacing / 2}px 0`,
              boxShadow: bit ? `0 0 10px ${onColor}` : 'none',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
        {showLabels && (
          <div style={{
            color: onColor,
            fontSize: '14px',
            fontFamily: 'monospace',
            marginTop: '10px',
            fontWeight: 'bold'
          }}>
            {value}
          </div>
        )}
      </div>
    );
  };

  const clockStyle = {
    backgroundColor,
    padding: '30px',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `2px solid ${onColor}40`,
    boxShadow: `0 0 20px ${onColor}20`
  };

  const separatorStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: `0 ${spacing * 2}px`
  };

  const SeparatorDots = () => (
    <div style={separatorStyle}>
      {showLabels && <div style={{ height: '22px' }} />}
      <div style={{
        width: dotSize / 2,
        height: dotSize / 2,
        borderRadius: '50%',
        backgroundColor: onColor,
        margin: `${spacing}px 0`,
        boxShadow: `0 0 5px ${onColor}`
      }} />
      <div style={{
        width: dotSize / 2,
        height: dotSize / 2,
        borderRadius: '50%',
        backgroundColor: onColor,
        margin: `${spacing}px 0`,
        boxShadow: `0 0 5px ${onColor}`
      }} />
      {showLabels && <div style={{ height: '24px' }} />}
    </div>
  );

  return (
    <div className={`binary-clock ${className}`} style={clockStyle}>
      <BinaryColumn value={hourTens} bits={2} label="H1" />
      <BinaryColumn value={hourOnes} bits={4} label="H2" />
      <SeparatorDots />
      <BinaryColumn value={minuteTens} bits={3} label="M1" />
      <BinaryColumn value={minuteOnes} bits={4} label="M2" />
      {showSeconds && (
        <>
          <SeparatorDots />
          <BinaryColumn value={secondTens} bits={3} label="S1" />
          <BinaryColumn value={secondOnes} bits={4} label="S2" />
        </>
      )}
    </div>
  );
};

export default BinaryClock;