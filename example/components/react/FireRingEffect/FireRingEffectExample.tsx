import React from 'react';
import FireRingEffect from './index';

const FireRingEffectExample: React.FC = () => {
  return (
    <div style={{ 
      background: '#000', 
      padding: '40px 20px', 
      textAlign: 'center',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h2 style={{ color: '#fff', marginBottom: '30px' }}>
        CSS火环效果示例
      </h2>
      <FireRingEffect
        ringSize={350}
        ringWidth={18}
        glowColor="#0f0"
        animationDuration={5}
        turbulenceFrequency={0.009}
        turbulenceOctaves={5}
        displacementScale={30}
        blurAmount={1}
        enableReflection={true}
      />
    </div>
  );
};

export default FireRingEffectExample;