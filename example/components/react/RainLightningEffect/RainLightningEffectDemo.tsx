import React, { useState } from 'react';
import RainLightningEffect from './index';

const RainLightningEffectDemo: React.FC = () => {
  const [rainInterval, setRainInterval] = useState(20);
  const [cloudWidth, setCloudWidth] = useState(320);
  const [cloudHeight, setCloudHeight] = useState(100);
  const [dropLifetime, setDropLifetime] = useState(2000);
  const [lightningInterval, setLightningInterval] = useState(2000);
  const [dropColor, setDropColor] = useState('#05a2eb');
  const [cloudColor, setCloudColor] = useState('#484f59');
  const [backgroundColor, setBackgroundColor] = useState('#1b1b1b');
  const [maxDropWidth, setMaxDropWidth] = useState(5);
  const [maxDropHeight, setMaxDropHeight] = useState(50);
  const [lightningEnabled, setLightningEnabled] = useState(true);

  const presetWeathers = [
    { name: '小雨', interval: 50, lightning: false, bgColor: '#2a2a2a' },
    { name: '中雨', interval: 20, lightning: true, bgColor: '#1b1b1b' },
    { name: '大雨', interval: 10, lightning: true, bgColor: '#0f0f0f' },
    { name: '暴雨', interval: 5, lightning: true, bgColor: '#000000' }
  ];

  const applyPreset = (preset: typeof presetWeathers[0]) => {
    setRainInterval(preset.interval);
    setLightningEnabled(preset.lightning);
    setBackgroundColor(preset.bgColor);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>雨和闪电动画效果</h1>
      
      {/* 天气预设 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px'
      }}>
        <h3>天气预设</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {presetWeathers.map(preset => (
            <button 
              key={preset.name}
              onClick={() => applyPreset(preset)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 参数配置面板 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div>
          <label>雨滴间隔: {rainInterval}ms</label>
          <input 
            type="range" 
            min="5" 
            max="100" 
            value={rainInterval} 
            onChange={(e) => setRainInterval(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>云朵宽度: {cloudWidth}px</label>
          <input 
            type="range" 
            min="200" 
            max="400" 
            value={cloudWidth} 
            onChange={(e) => setCloudWidth(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>云朵高度: {cloudHeight}px</label>
          <input 
            type="range" 
            min="60" 
            max="150" 
            value={cloudHeight} 
            onChange={(e) => setCloudHeight(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>雨滴寿命: {dropLifetime}ms</label>
          <input 
            type="range" 
            min="1000" 
            max="5000" 
            step="100" 
            value={dropLifetime} 
            onChange={(e) => setDropLifetime(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>闪电间隔: {lightningInterval}ms</label>
          <input 
            type="range" 
            min="500" 
            max="5000" 
            step="100" 
            value={lightningInterval} 
            onChange={(e) => setLightningInterval(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>雨滴颜色: </label>
          <input 
            type="color" 
            value={dropColor} 
            onChange={(e) => setDropColor(e.target.value)}
          />
        </div>
        
        <div>
          <label>云朵颜色: </label>
          <input 
            type="color" 
            value={cloudColor} 
            onChange={(e) => setCloudColor(e.target.value)}
          />
        </div>
        
        <div>
          <label>背景颜色: </label>
          <input 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        
        <div>
          <label>雨滴最大宽度: {maxDropWidth}px</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={maxDropWidth} 
            onChange={(e) => setMaxDropWidth(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>雨滴最大高度: {maxDropHeight}px</label>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={maxDropHeight} 
            onChange={(e) => setMaxDropHeight(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={lightningEnabled} 
              onChange={(e) => setLightningEnabled(e.target.checked)}
            />
            启用闪电效果
          </label>
        </div>
      </div>

      {/* 效果展示 */}
      <div style={{ 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <RainLightningEffect
          rainInterval={rainInterval}
          cloudWidth={cloudWidth}
          cloudHeight={cloudHeight}
          dropLifetime={dropLifetime}
          lightningInterval={lightningInterval}
          dropColor={dropColor}
          cloudColor={cloudColor}
          backgroundColor={backgroundColor}
          maxDropWidth={maxDropWidth}
          maxDropHeight={maxDropHeight}
          lightningEnabled={lightningEnabled}
        />
      </div>

      {/* 参数说明 */}
      <div style={{ marginTop: '30px' }}>
        <h3>参数说明</h3>
        <ul>
          <li><strong>雨滴间隔</strong>: 控制雨滴生成的频率，数值越小雨越密</li>
          <li><strong>云朵宽度/高度</strong>: 控制云朵的尺寸大小</li>
          <li><strong>雨滴寿命</strong>: 控制雨滴从生成到消失的时间</li>
          <li><strong>闪电间隔</strong>: 控制闪电发光的频率</li>
          <li><strong>雨滴颜色</strong>: 自定义雨滴的颜色</li>
          <li><strong>云朵颜色</strong>: 自定义云朵的颜色</li>
          <li><strong>背景颜色</strong>: 自定义整体背景颜色</li>
          <li><strong>雨滴最大宽度/高度</strong>: 控制雨滴的尺寸范围</li>
          <li><strong>启用闪电效果</strong>: 开关闪电发光动画</li>
        </ul>
      </div>
    </div>
  );
};

export default RainLightningEffectDemo;