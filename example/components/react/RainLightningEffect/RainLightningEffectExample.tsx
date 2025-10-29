import React from 'react';
import RainLightningEffect from './index';

const RainLightningEffectExample: React.FC = () => {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: '20px'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>
        雨和闪电动画效果示例
      </h2>
      <RainLightningEffect
        rainInterval={20}
        cloudWidth={320}
        cloudHeight={100}
        dropLifetime={2000}
        lightningInterval={2000}
        dropColor="#05a2eb"
        cloudColor="#484f59"
        backgroundColor="#1b1b1b"
        maxDropWidth={5}
        maxDropHeight={50}
        lightningEnabled={true}
      />
    </div>
  );
};

export default RainLightningEffectExample;