import React from 'react';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import FlipClock from './FlipClock';
import NeonClock from './NeonClock';
import LCDClock from './LCDClock';
import BinaryClock from './BinaryClock';

// 演示用的组件示例
export const AnalogClockDemo = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>模拟时钟</h3>
    <AnalogClock
      size={250}
      backgroundColor="#f8f9fa"
      hourHandColor="#007bff"
      minuteHandColor="#6c757d"
      secondHandColor="#dc3545"
      showNumbers={true}
      showTicks={true}
    />
    <p>传统的指针式时钟，支持自定义颜色和大小</p>
  </div>
);

export const DigitalClockDemo = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>数字时钟</h3>
    <DigitalClock
      format="24"
      showSeconds={true}
      showDate={true}
      fontSize="2.5rem"
      color="#2c3e50"
      backgroundColor="#ecf0f1"
      borderRadius="15px"
      padding="30px"
    />
    <p>简洁的数字显示，支持12/24小时制</p>
  </div>
);

export const FlipClockDemo = () => (
  <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#2c3e50' }}>
    <h3 style={{ color: 'white' }}>翻页时钟</h3>
    <FlipClock
      format="24"
      showSeconds={true}
      cardColor="#34495e"
      textColor="#ecf0f1"
      cardWidth={80}
      cardHeight={100}
      fontSize="2.5rem"
    />
    <p style={{ color: 'white' }}>具有翻页动画效果的数字时钟</p>
  </div>
);

export const NeonClockDemo = () => (
  <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#000' }}>
    <h3 style={{ color: '#00ffff' }}>霓虹时钟</h3>
    <NeonClock
      format="24"
      showSeconds={true}
      neonColor="#00ffff"
      backgroundColor="#000"
      fontSize="3rem"
      glowIntensity={25}
      animated={true}
    />
    <p style={{ color: '#00ffff' }}>霓虹灯发光效果，支持动画闪烁</p>
  </div>
);

export const LCDClockDemo = () => (
  <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#001100' }}>
    <h3 style={{ color: '#00ff00' }}>LCD时钟</h3>
    <LCDClock
      format="24"
      showSeconds={true}
      showDate={true}
      lcdColor="#00ff00"
      backgroundColor="#001100"
      fontSize="2.5rem"
      showGrid={true}
    />
    <p style={{ color: '#00ff00' }}>模拟LCD显示屏效果，带网格背景</p>
  </div>
);

export const BinaryClockDemo = () => (
  <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#000' }}>
    <h3 style={{ color: '#00ff00' }}>二进制时钟</h3>
    <BinaryClock
      onColor="#00ff00"
      offColor="#333"
      backgroundColor="#000"
      dotSize={25}
      spacing={8}
      showLabels={true}
      showSeconds={true}
    />
    <p style={{ color: '#00ff00' }}>以二进制形式显示时间，极客风格</p>
  </div>
);

// 综合演示组件
export const AllClocksDemo = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px'
  }}>
    <AnalogClockDemo />
    <DigitalClockDemo />
    <FlipClockDemo />
    <NeonClockDemo />
    <LCDClockDemo />
    <BinaryClockDemo />
  </div>
);

export default AllClocksDemo;