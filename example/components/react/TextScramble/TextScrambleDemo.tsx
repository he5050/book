import React, { useState } from 'react';
import TextScramble from './index';
import './index.scss';

interface DemoConfig {
  text: string;
  randomChars: string;
  speed: number;
  iterationStep: number;
  trigger: 'hover' | 'click' | 'auto' | 'manual';
  direction: 'left-to-right' | 'right-to-left' | 'random';
  preserveSpaces: boolean;
}

const TextScrambleDemo: React.FC = () => {
  const [config, setConfig] = useState<DemoConfig>({
    text: 'Hover To Scramble Me',
    randomChars: '!@#$%^&*()_+-<>?',
    speed: 50,
    iterationStep: 0.33,
    trigger: 'hover',
    direction: 'left-to-right',
    preserveSpaces: true
  });

  const [manualTrigger, setManualTrigger] = useState(false);

  const updateConfig = (key: keyof DemoConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const triggerManualScramble = () => {
    setManualTrigger(true);
    setTimeout(() => setManualTrigger(false), 100);
  };

  const presets = [
    {
      name: '经典效果',
      config: {
        text: 'Classic Scramble',
        randomChars: '!@#$%^&*()_+-<>?',
        speed: 50,
        iterationStep: 0.33,
        trigger: 'hover' as const,
        direction: 'left-to-right' as const,
        preserveSpaces: true
      }
    },
    {
      name: '二进制风格',
      config: {
        text: 'Binary Style',
        randomChars: '01',
        speed: 30,
        iterationStep: 0.25,
        trigger: 'hover' as const,
        direction: 'random' as const,
        preserveSpaces: true
      }
    },
    {
      name: '快速打乱',
      config: {
        text: 'Fast Scramble',
        randomChars: '█▓▒░',
        speed: 20,
        iterationStep: 0.5,
        trigger: 'click' as const,
        direction: 'right-to-left' as const,
        preserveSpaces: true
      }
    },
    {
      name: '自动循环',
      config: {
        text: 'Auto Loop',
        randomChars: '◆◇◈◉',
        speed: 80,
        iterationStep: 0.2,
        trigger: 'auto' as const,
        direction: 'left-to-right' as const,
        preserveSpaces: true
      }
    }
  ];

  const demoTexts = [
    'Home',
    'About',
    'Services',
    'Portfolio',
    'Contact Us',
    'Get Started',
    'Learn More',
    'Join Now'
  ];

  return (
    <div className="text-scramble-demo">
      <div className="demo-header">
        <h2>Text Scramble Effect</h2>
        <p>Interactive demonstration of text scrambling animation</p>
      </div>

      {/* 预设样式 */}
      <div className="preset-buttons">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => setConfig(preset.config)}
            className={JSON.stringify(config) === JSON.stringify(preset.config) ? 'active' : ''}
          >
        {preset.name}
          </button>
        ))}
      </div>

      {/* 实时预览 */}
      <div className="live-preview">
        <div className="preview-text">
          <TextScramble
            {...config}
            shouldScramble={config.trigger === 'manual' ? manualTrigger : undefined}
          />
        </div>
        <div className="preview-hint">
          {config.trigger === 'hover' && '鼠标悬停触发'}
          {config.trigger === 'click' && '点击触发'}
          {config.trigger === 'auto' && '自动循环播放'}
          {config.trigger === 'manual' && '手动控制'}
        </div>
      </div>

      {/* 参数控制面板 */}
      <div className="controls-panel">
        <div className="panel-title">参数配置</div>
        
        <div className="control-group">
          <label>显示文本</label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => updateConfig('text', e.target.value)}
            placeholder="输入要显示的文本"
          />
        </div>

        <div className="control-group">
          <label>随机字符集</label>
          <input
            type="text"
            value={config.randomChars}
            onChange={(e) => updateConfig('randomChars', e.target.value)}
            placeholder="输入随机字符"
          />
        </div>

        <div className="control-row">
          <div className="control-group">
            <label>
              动画速度
              <span className="value-display">{config.speed}ms</span>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={config.speed}
              onChange={(e) => updateConfig('speed', parseInt(e.target.value))}
            />
          </div>
          
          <div className="control-group">
            <label>
              迭代步长
              <span className="value-display">{config.iterationStep}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={config.iterationStep}
              onChange={(e) => updateConfig('iterationStep', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <label>触发方式</label>
            <select
              value={config.trigger}
              onChange={(e) => updateConfig('trigger', e.target.value)}
            >
              <option value="hover">悬停触发</option>
              <option value="click">点击触发</option>
              <option value="auto">自动循环</option>
              <option value="manual">手动控制</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>恢复方向</label>
            <select
              value={config.direction}
              onChange={(e) => updateConfig('direction', e.target.value)}
            >
              <option value="left-to-right">从左到右</option>
              <option value="right-to-left">从右到左</option>
              <option value="random">随机</option>
            </select>
          </div>
        </div>

        <div className="control-group">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="preserveSpaces"
              checked={config.preserveSpaces}
              onChange={(e) => updateConfig('preserveSpaces', e.target.checked)}
            />
            <label htmlFor="preserveSpaces">保留空格字符</label>
          </div>
        </div>

        {config.trigger === 'manual' && (
          <div className="control-group">
            <button
              onClick={triggerManualScramble}
              style={{
                width: '100%',
                padding: '10px',
                background: '#69ff41',
                border: 'none',
                borderRadius: '4px',
                color: '#1a1a1a',
                fontFamily: 'Courier New, monospace',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              触发动画
            </button>
          </div>
        )}
      </div>

      {/* 示例展示 */}
      <div className="demo-section">
        <div className="section-title">导航菜单示例</div>
        {demoTexts.map((text, index) => (
          <div key={index} className="demo-item">
            <div className="item-title">菜单项 {index + 1}</div>
            <div className="item-content">
              <TextScramble
                text={text}
                randomChars={config.randomChars}
                speed={config.speed}
                trigger="hover"
                direction="left-to-right"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 代码示例 */}
      <div className="code-example">
        <div className="code-title">代码示例</div>
        <pre>
{`<TextScramble
  text="${config.text}"
  randomChars="${config.randomChars}"
  speed={${config.speed}}
  iterationStep={${config.iterationStep}}
  trigger="${config.trigger}"
  direction="${config.direction}"
  preserveSpaces={${config.preserveSpaces}}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default TextScrambleDemo;