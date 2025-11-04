import React, { useState } from 'react';
import TypingAnimation from './index';
import './index.scss';

const TypingAnimationExample: React.FC = () => {
  const [config, setConfig] = useState({
    texts: [
      "欢迎来到打字效果演示",
      "这是一个炫酷的文本动画",
      "支持自定义配置参数",
      "让我们开始探索吧！"
    ],
    typingSpeed: 150,
    deletingSpeed: 75,
    delayBetweenTexts: 2000,
    showCursor: true,
    cursorChar: "|",
    loop: true
  });

  const [customTexts, setCustomTexts] = useState(config.texts.join('\n'));

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTextsChange = (value: string) => {
    setCustomTexts(value);
    const textsArray = value.split('\n').filter(text => text.trim() !== '');
    if (textsArray.length > 0) {
      handleConfigChange('texts', textsArray);
    }
  };

  return (
    <div className="typing-animation-demo">
      <h1 className="demo-title">打字效果动画</h1>
      
      <div className="typing-demo-section">
        <h3>效果演示</h3>
        <TypingAnimation
          texts={config.texts}
          typingSpeed={config.typingSpeed}
          deletingSpeed={config.deletingSpeed}
          delayBetweenTexts={config.delayBetweenTexts}
          showCursor={config.showCursor}
          cursorChar={config.cursorChar}
          loop={config.loop}
        />
      </div>

      <div className="controls-section">
        <h3>参数配置</h3>
        
        <div className="control-group">
          <label>打字速度 (毫秒)</label>
          <input
            type="range"
            min="50"
            max="500"
            value={config.typingSpeed}
            onChange={(e) => handleConfigChange('typingSpeed', Number(e.target.value))}
          />
          <div className="range-value">{config.typingSpeed}ms</div>
        </div>

        <div className="control-group">
          <label>删除速度 (毫秒)</label>
          <input
            type="range"
            min="25"
            max="250"
            value={config.deletingSpeed}
            onChange={(e) => handleConfigChange('deletingSpeed', Number(e.target.value))}
          />
          <div className="range-value">{config.deletingSpeed}ms</div>
        </div>

        <div className="control-group">
          <label>文本间停留时间 (毫秒)</label>
          <input
            type="range"
            min="500"
            max="5000"
            value={config.delayBetweenTexts}
            onChange={(e) => handleConfigChange('delayBetweenTexts', Number(e.target.value))}
          />
          <div className="range-value">{config.delayBetweenTexts}ms</div>
        </div>

        <div className="control-group">
          <label>光标字符</label>
          <input
            type="text"
            value={config.cursorChar}
            onChange={(e) => handleConfigChange('cursorChar', e.target.value)}
            placeholder="输入光标字符"
            maxLength={3}
          />
        </div>

        <div className="control-group">
          <label>自定义文本 (每行一个)</label>
          <textarea
            value={customTexts}
            onChange={(e) => handleTextsChange(e.target.value)}
            placeholder="每行输入一个文本内容"
            rows={4}
          />
        </div>

        <div className="control-group">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="showCursor"
              checked={config.showCursor}
              onChange={(e) => handleConfigChange('showCursor', e.target.checked)}
            />
            <label htmlFor="showCursor">显示光标</label>
          </div>
        </div>

        <div className="control-group">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="loop"
              checked={config.loop}
              onChange={(e) => handleConfigChange('loop', e.target.checked)}
            />
            <label htmlFor="loop">循环播放</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingAnimationExample;