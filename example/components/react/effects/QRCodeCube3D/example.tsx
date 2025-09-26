import React from 'react';
import QRCodeCube3D from './index';

const QRCodeCube3DExample: React.FC = () => {
  return (
    <div style={{
      padding: '50px',
      background: '#000',
      minHeight: '400px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <QRCodeCube3D />
    </div>
  );
};

export default QRCodeCube3DExample;