import React from 'react';
import './index.scss';

interface FloatingCard3DProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}

const FloatingCard3D: React.FC<FloatingCard3DProps> = ({
  title = "3D悬浮卡片",
  subtitle = "Floating Card",
  description = "这是一个具有3D效果的悬浮卡片，带有发光边框和旋转动画",
  imageUrl = "https://picsum.photos/300/200?random=floating"
}) => {
  return (
    <div className="floating-card-3d">
      <div className="card-container">
        <div className="card">
          <div className="card-inner">
            <div className="card-front">
              <div className="card-image">
                <img src={imageUrl} alt={title} />
              </div>
              <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-subtitle">{subtitle}</p>
                <p className="card-description">{description}</p>
              </div>
            </div>
            <div className="card-back">
              <div className="card-back-content">
                <h3>背面内容</h3>
                <p>这是卡片的背面，展示更多详细信息</p>
                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-number">100+</span>
                    <span className="stat-label">用户</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">4.8</span>
                    <span className="stat-label">评分</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCard3D;