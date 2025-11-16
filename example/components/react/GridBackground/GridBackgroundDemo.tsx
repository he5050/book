import React, { useState } from 'react';
import GridBackground from './index';
import './index.scss';

interface DemoConfig {
  gridSize: number;
  color: string;
  opacity: number;
  lineWidth: number;
  rotation: number;
  scale: number;
  animated: boolean;
  responsive: boolean;
  method: 'gradient' | 'image';
}

const GridBackgroundDemo: React.FC = () => {
  const [config, setConfig] = useState<DemoConfig>({
    gridSize: 40,
    color: '#3b82f6',
    opacity: 0.15,
    lineWidth: 1,
    rotation: 0,
    scale: 1,
    animated: false,
    responsive: true,
    method: 'gradient'
  });

  const updateConfig = (key: keyof DemoConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const presets = [
    {
      name: '默认样式',
      config: {
        gridSize: 40,
        color: '#e5e7eb',
        opacity: 0.5,
        lineWidth: 1,
        rotation: 0,
        scale: 1,
        animated: false,
        responsive: true,
        method: 'gradient' as const
      }
    },
    {
      name: '蓝色倾斜',
      config: {
        gridSize: 50,
        color: '#3b82f6',
        opacity: 0.1,
        lineWidth: 1,
        rotation: -3,
        scale: 1.2,
        animated: false,
        responsive: true,
        method: 'gradient' as const
      }
    },
    {
      name: '动态效果',
      config: {
        gridSize: 30,
        color: '#10b981',
        opacity: 0.2,
        lineWidth: 1,
        rotation: 0,
        scale: 1,
        animated: true,
        responsive: true,
        method: 'gradient' as const
      }
    },
    {
      name: '精细网格',
      config: {
        gridSize: 20,
        color: '#f59e0b',
        opacity: 0.25,
        lineWidth: 1,
        rotation: 0,
        scale: 1,
        animated: false,
        responsive: true,
        method: 'image' as const
      }
    }
  ];

  return (
    <div className="grid-background-demo">
      {/* 方法选择 */}
      <div className="method-tabs">
        <button
          className={`tab ${config.method === 'gradient' ? 'active' : ''}`}
          onClick={() => updateConfig('method', 'gradient')}
        >
          CSS渐变方法
        </button>
        <button
          className={`tab ${config.method === 'image' ? 'active' : ''}`}
          onClick={() => updateConfig('method', 'image')}
        >
          SVG图片方法
        </button>
      </div>

      {/* 预设样式 */}
      <div className="controls-panel">
        <div className="control-group">
          <label>预设样式</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => setConfig(preset.config)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 效果演示 */}
      <div className="demo-container">
        <div className="demo-header">
          实时效果预览 - {config.method === 'gradient' ? 'CSS渐变' : 'SVG图片'}方法
        </div>
        <div className="demo-content">
          <GridBackground {...config}>
            <div className="demo-text">
              <div>CSS重复格子背景</div>
              <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.7 }}>
                格子大小: {config.gridSize}px | 透明度: {config.opacity}
              </div>
            </div>
          </GridBackground>
        </div>
      </div>

      {/* 参数控制面板 */}
      <div className="controls-panel">
        <div className="control-row">
          <div className="control-group">
            <label>
              格子大小
              <span className="value-display">{config.gridSize}px</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={config.gridSize}
              onChange={(e) => updateConfig('gridSize', parseInt(e.target.value))}
            />
          </div>
          
          <div className="control-group">
            <label>
              透明度
              <span className="value-display">{config.opacity}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.opacity}
              onChange={(e) => updateConfig('opacity', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <label>线条颜色</label>
            <input
              type="color"
              value={config.color}
              onChange={(e) => updateConfig('color', e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label>
              线条宽度
              <span className="value-display">{config.lineWidth}px</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={config.lineWidth}
              onChange={(e) => updateConfig('lineWidth', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <label>
              旋转角度
              <span className="value-display">{config.rotation}°</span>
            </label>
            <input
              type="range"
              min="-45"
              max="45"
              value={config.rotation}
              onChange={(e) => updateConfig('rotation', parseInt(e.target.value))}
            />
          </div>
          
          <div className="control-group">
            <label>
              缩放比例
              <span className="value-display">{config.scale}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={config.scale}
              onChange={(e) => updateConfig('scale', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="animated"
                checked={config.animated}
                onChange={(e) => updateConfig('animated', e.target.checked)}
              />
              <label htmlFor="animated">启用动画效果</label>
            </div>
          </div>
          
          <div className="control-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="responsive"
                checked={config.responsive}
                onChange={(e) => updateConfig('responsive', e.target.checked)}
              />
              <label htmlFor="responsive">响应式调整</label>
            </div>
          </div>
        </div>
      </div>

      {/* 代码示例 */}
      <div className="demo-container">
        <div className="demo-header">代码示例</div>
        <div style={{ padding: '16px', background: '#f8f9fa', fontSize: '12px', fontFamily: 'monospace' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`<GridBackground
  gridSize={${config.gridSize}}
  color="${config.color}"
  opacity={${config.opacity}}
  lineWidth={${config.lineWidth}}
  rotation={${config.rotation}}
  scale={${config.scale}}
  animated={${config.animated}}
  responsive={${config.responsive}}
  method="${config.method}"
>
  <div>你的内容</div>
</GridBackground>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GridBackgroundDemo;