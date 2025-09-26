import React from 'react';
import FloatingCard3D from './index';

const FloatingCard3DExample: React.FC = () => {
  return (
    <div style={{
      padding: '50px',
      background: '#000',
      minHeight: '400px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <FloatingCard3D />
    </div>
  );
};

export default FloatingCard3DExample;