import React from 'react';
import './index.scss';

interface QRCodeCube3DProps {
  size?: number;
  animationDuration?: number;
}

const QRCodeCube3D: React.FC<QRCodeCube3DProps> = ({
  size = 243,
  animationDuration = 15
}) => {
  return (
    <div className="qr-code-cube-3d">
      <div
        className="cube"
        style={{
          '--s': `${size}px`,
          '--hs': `${size / 2}px`,
          '--animation-duration': `${animationDuration}s`
        } as React.CSSProperties}
      >
        <div className="side"></div>
        <div className="side"></div>
        <div className="side"></div>
        <div className="side"></div>
        <div className="side"></div>
        <div className="side"></div>
      </div>
    </div>
  );
};

export default QRCodeCube3D;