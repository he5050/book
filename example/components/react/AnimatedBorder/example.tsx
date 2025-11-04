import React, { useState } from 'react';
import AnimatedBorder from './index';

const AnimatedBorderExample: React.FC = () => {
  const [config, setConfig] = useState({
    color: '#0f0',
    speed: 1,
    count: 4,
    gap: 38,
    size: 100,
    showContent: true
  });

  const [customContent, setCustomContent] = useState(['C', 'S', 'S', '❤']);

  const colorOptions = [
    { label: '绿色', value: '#0f0' },
    { label: '蓝色', value: '#4a90e2' },
    { label: '红色', value: '#ff6b6b' },
    { label: '紫色', value: '#9b59b6' },
    { label: '橙色', value: '#f39c12' },
    { label: '青色', value: '#1abc9c' }
  ];

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...customContent];
    newContent[index] = value;
    setCustomContent(newContent);
  };

  return (
    <div className="animated-border-demo">
      <div className="demo-container">
        <AnimatedBorder
          {...config}
          content={customContent}
        />
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>边框颜色:</label>
          <div className="color-options">
            {colorOptions.map(option => (
              <button
                key={option.value}
                className={`color-btn ${config.color === option.value ? 'active' : ''}`}
                style={{ backgroundColor: option.value }}
                onClick={() => setConfig(prev => ({ ...prev, color: option.value }))}
                title={option.label}
              />
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>动画速度: {config.speed}x</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={config.speed}
            onChange={(e) => setConfig(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
          />
        </div>

        <div className="control-group">
          <label>元素数量: {config.count}</label>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={config.count}
            onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) }))}
          />
        </div>

        <div className="control-group">
          <label>元素间距: {config.gap}px</label>
          <input
            type="range"
            min="10"
            max="80"
            step="2"
            value={config.gap}
            onChange={(e) => setConfig(prev => ({ ...prev, gap: parseInt(e.target.value) }))}
          />
        </div>

        <div className="control-group">
          <label>元素尺寸: {config.size}px</label>
          <input
            type="range"
            min="60"
            max="150"
            step="5"
            value={config.size}
            onChange={(e) => setConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.showContent}
              onChange={(e) => setConfig(prev => ({ ...prev, showContent: e.target.checked }))}
            />
            显示内容
          </label>
        </div>

        {config.showContent && (
          <div className="control-group">
            <label>自定义内容:</label>
            <div className="content-inputs">
              {Array.from({ length: config.count }, (_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={2}
                  value={customContent[index] || ''}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  placeholder={`内容${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animated-border-demo {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .demo-container {
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;
        }

        .controls {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .control-group {
          margin-bottom: 20px;
        }

        .control-group:last-child {
          margin-bottom: 0;
        }

        .control-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .control-group input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #ddd;
          outline: none;
          -webkit-appearance: none;
        }

        .control-group input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4a90e2;
          cursor: pointer;
        }

        .control-group input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4a90e2;
          cursor: pointer;
          border: none;
        }

        .color-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-btn {
          width: 30px;
          height: 30px;
          border: 2px solid transparent;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-btn:hover {
          transform: scale(1.1);
        }

        .color-btn.active {
          border-color: #333;
          transform: scale(1.1);
        }

        .content-inputs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .content-inputs input {
          width: 60px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
        }

        .control-group input[type="checkbox"] {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBorderExample;