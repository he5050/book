import React, { useState } from 'react';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import FlipClock from './FlipClock';
import NeonClock from './NeonClock';
import LCDClock from './LCDClock';
import BinaryClock from './BinaryClock';

/**
 * 时钟组件演示页面
 */
const ClockDemo = () => {
  const [selectedClock, setSelectedClock] = useState('analog');

  const clockTypes = [
    { id: 'analog', name: '模拟时钟', component: AnalogClock },
    { id: 'digital', name: '数字时钟', component: DigitalClock },
    { id: 'flip', name: '翻页时钟', component: FlipClock },
    { id: 'neon', name: '霓虹时钟', component: NeonClock },
    { id: 'lcd', name: 'LCD时钟', component: LCDClock },
    { id: 'binary', name: '二进制时钟', component: BinaryClock }
  ];

  const renderClockWithProps = (ClockComponent, clockId) => {
    const commonProps = { className: 'demo-clock' };

    switch (clockId) {
      case 'analog':
        return <ClockComponent {...commonProps} size={250} />;
      case 'digital':
        return <ClockComponent {...commonProps} showDate={true} fontSize="2.5rem" />;
      case 'flip':
        return <ClockComponent {...commonProps} cardWidth={70} cardHeight={90} />;
      case 'neon':
        return <ClockComponent {...commonProps} neonColor="#ff00ff" />;
      case 'lcd':
        return <ClockComponent {...commonProps} showDate={true} />;
      case 'binary':
        return <ClockComponent {...commonProps} />;
      default:
        return <ClockComponent {...commonProps} />;
    }
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  };

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '10px'
  };

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? '#fff' : '#333',
    boxShadow: isActive ? '0 4px 8px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
  });

  const clockDisplayStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    backgroundColor: selectedClock === 'neon' || selectedClock === 'lcd' || selectedClock === 'binary' ? '#000' : '#f8f9fa',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
  };

  const selectedClockType = clockTypes.find(type => type.id === selectedClock);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>时钟组件演示</h1>
        <p>展示各种风格的时钟组件，每个组件都支持自定义配置</p>
      </div>

      <div style={tabsStyle}>
        {clockTypes.map(type => (
          <button
            key={type.id}
            style={tabStyle(selectedClock === type.id)}
            onClick={() => setSelectedClock(type.id)}
          >
            {type.name}
          </button>
        ))}
      </div>

      <div style={clockDisplayStyle}>
        {selectedClockType && renderClockWithProps(selectedClockType.component, selectedClock)}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center', color: '#666' }}>
        <p>当前显示: <strong>{selectedClockType?.name}</strong></p>
        <p>所有时钟组件都支持丰富的自定义属性配置</p>
      </div>
    </div>
  );
};

export default ClockDemo;