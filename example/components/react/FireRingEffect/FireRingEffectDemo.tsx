import React, { useState } from 'react';
import FireRingEffect from './index';

const FireRingEffectDemo: React.FC = () => {
  const [ringSize, setRingSize] = useState(400);
  const [ringWidth, setRingWidth] = useState(20);
  const [glowColor, setGlowColor] = useState('#0f0');
  const [animationDuration, setAnimationDuration] = useState(5);
  const [turbulenceFrequency, setTurbulenceFrequency] = useState(0.009);
  const [turbulenceOctaves, setTurbulenceOctaves] = useState(5);
  const [displacementScale, setDisplacementScale] = useState(30);
  const [blurAmount, setBlurAmount] = useState(1);
  const [reflectionOpacity, setReflectionOpacity] = useState(0.2);
  const [enableReflection, setEnableReflection] = useState(true);

  const presetColors = [
    { name: '绿色火焰', value: '#0f0' },
    { name: '蓝色火焰', value: '#00f' },
    { name: '红色火焰', value: '#f00' },
    { name: '橙色火焰', value: '#ff6600' },
    { name: '紫色火焰', value: '#9900ff' },
    { name: '青色火焰', value: '#00ffff' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CSS火环效果</h1>
      
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
          <label>火环大小: {ringSize}px</label>
          <input 
            type="range" 
            min="200" 
            max="600" 
            value={ringSize} 
            onChange={(e) => setRingSize(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>环宽度: {ringWidth}px</label>
          <input 
            type="range" 
            min="5" 
            max="50" 
            value={ringWidth} 
            onChange={(e) => setRingWidth(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>发光颜色: </label>
          <select 
            value={glowColor} 
            onChange={(e) => setGlowColor(e.target.value)}
          >
            {presetColors.map(color => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>动画时长: {animationDuration}s</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.5" 
            value={animationDuration} 
            onChange={(e) => setAnimationDuration(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>波浪频率: {turbulenceFrequency}</label>
          <input 
            type="range" 
            min="0.001" 
            max="0.05" 
            step="0.001" 
            value={turbulenceFrequency} 
            onChange={(e) => setTurbulenceFrequency(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>噪声层数: {turbulenceOctaves}</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={turbulenceOctaves} 
            onChange={(e) => setTurbulenceOctaves(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>扭曲强度: {displacementScale}</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={displacementScale} 
            onChange={(e) => setDisplacementScale(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>模糊程度: {blurAmount}px</label>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5" 
            value={blurAmount} 
            onChange={(e) => setBlurAmount(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>反射透明度: {reflectionOpacity}</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={reflectionOpacity} 
            onChange={(e) => setReflectionOpacity(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={enableReflection} 
              onChange={(e) => setEnableReflection(e.target.checked)}
            />
            启用反射效果
          </label>
        </div>
      </div>

      {/* 效果展示 */}
      <div style={{ 
        background: '#000', 
        padding: '40px 20px', 
        borderRadius: '8px',
        textAlign: 'center',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <FireRingEffect
          ringSize={ringSize}
          ringWidth={ringWidth}
          glowColor={glowColor}
          animationDuration={animationDuration}
          turbulenceFrequency={turbulenceFrequency}
          turbulenceOctaves={turbulenceOctaves}
          displacementScale={displacementScale}
          blurAmount={blurAmount}
          reflectionOpacity={reflectionOpacity}
          enableReflection={enableReflection}
        />
      </div>

      {/* 参数说明 */}
      <div style={{ marginTop: '30px' }}>
        <h3>参数说明</h3>
        <ul>
          <li><strong>火环大小</strong>: 控制整个火环的外径尺寸</li>
          <li><strong>环宽度</strong>: 控制圆环边框的粗细</li>
          <li><strong>发光颜色</strong>: 选择火环的发光颜色主题</li>
          <li><strong>动画时长</strong>: 控制一个完整动画周期的时间</li>
          <li><strong>波浪频率</strong>: 控制SVG扭曲效果的频率</li>
          <li><strong>噪声层数</strong>: 控制波浪扭曲的复杂程度</li>
          <li><strong>扭曲强度</strong>: 控制波浪扭曲的幅度</li>
          <li><strong>模糊程度</strong>: 控制整体的模糊效果强度</li>
          <li><strong>反射透明度</strong>: 控制地面反射的透明度</li>
          <li><strong>启用反射效果</strong>: 开关地面反射效果</li>
        </ul>
      </div>
    </div>
  );
};

export default FireRingEffectDemo;