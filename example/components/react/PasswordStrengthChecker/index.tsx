import React, { useState, useCallback, useRef, useEffect } from 'react';
import './index.scss';

interface PasswordStrengthConfig {
  placeholder?: string;
  weakThreshold?: number;
  mediumThreshold?: number;
  weakColor?: string;
  mediumColor?: string;
  strongColor?: string;
  maxLength?: number;
  showText?: boolean;
  showConfigPanel?: boolean;
  onStrengthChange?: (strength: StrengthResult) => void;
  onConfigChange?: (config: Partial<PasswordStrengthConfig>) => void;
}

interface StrengthResult {
  level: 'weak' | 'medium' | 'strong';
  color: string;
  text: string;
  degree: number;
  score: number;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthConfig> = ({
  placeholder = "Enter your password",
  weakThreshold = 4,
  mediumThreshold = 8,
  weakColor = "#ff2c1c",
  mediumColor = "#ff9800",
  strongColor = "#12ff12",
  maxLength = 12,
  showText = true,
  showConfigPanel = false,
  onStrengthChange,
  onConfigChange
}) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<StrengthResult>({
    level: 'weak',
    color: weakColor,
    text: 'Weak',
    degree: 0,
    score: 0
  });

  // 内部配置状态（当showConfigPanel为true时使用）
  const [internalConfig, setInternalConfig] = useState({
    weakThreshold,
    mediumThreshold,
    maxLength,
    weakColor,
    mediumColor,
    strongColor
  });

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const strengthIndicatorsRef = useRef<HTMLDivElement[]>([]);

  // 当外部props变化时，更新内部配置
  useEffect(() => {
    setInternalConfig({
      weakThreshold,
      mediumThreshold,
      maxLength,
      weakColor,
      mediumColor,
      strongColor
    });
  }, [weakThreshold, mediumThreshold, maxLength, weakColor, mediumColor, strongColor]);

  // 计算密码强度
  const calculateStrength = useCallback((pwd: string): StrengthResult => {
    const currentConfig = showConfigPanel ? internalConfig : {
      weakThreshold, mediumThreshold, maxLength, weakColor, mediumColor, strongColor
    };
    
    const length = Math.min(pwd.length, currentConfig.maxLength);
    const degree = length * 30;
    
    let level: 'weak' | 'medium' | 'strong';
    let color: string;
    let text: string;
    let score: number;

    if (length <= currentConfig.weakThreshold) {
      level = 'weak';
      color = currentConfig.weakColor;
      text = 'Weak';
      score = (length / currentConfig.weakThreshold) * 33;
    } else if (length <= currentConfig.mediumThreshold) {
      level = 'medium';
      color = currentConfig.mediumColor;
      text = 'Medium';
      score = 33 + ((length - currentConfig.weakThreshold) / (currentConfig.mediumThreshold - currentConfig.weakThreshold)) * 34;
    } else {
      level = 'strong';
      color = currentConfig.strongColor;
      text = 'Strong';
      score = 67 + ((length - currentConfig.mediumThreshold) / (currentConfig.maxLength - currentConfig.mediumThreshold)) * 33;
    }

    return { level, color, text, degree, score: Math.min(100, score) };
  }, [showConfigPanel, internalConfig, weakThreshold, mediumThreshold, maxLength, weakColor, mediumColor, strongColor]);

  // 处理密码输入
  const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    
    const newStrength = calculateStrength(newPassword);
    setStrength(newStrength);
    
    // 更新视觉效果
    strengthIndicatorsRef.current.forEach((indicator) => {
      if (indicator) {
        indicator.style.background = `conic-gradient(${newStrength.color} ${newStrength.degree}deg, #1115 ${newStrength.degree}deg)`;
      }
    });

    // 触发回调
    onStrengthChange?.(newStrength);
  }, [calculateStrength, onStrengthChange]);

  // 处理配置变化
  const handleInternalConfigChange = useCallback((key: string, value: any) => {
    const newConfig = { ...internalConfig, [key]: value };
    setInternalConfig(newConfig);
    
    // 重新计算当前密码的强度
    const newStrength = calculateStrength(password);
    setStrength(newStrength);
    
    // 更新视觉效果
    strengthIndicatorsRef.current.forEach((indicator) => {
      if (indicator) {
        indicator.style.background = `conic-gradient(${newStrength.color} ${newStrength.degree}deg, #1115 ${newStrength.degree}deg)`;
      }
    });

    // 触发外部回调
    onConfigChange?.({ [key]: value });
    onStrengthChange?.(newStrength);
  }, [internalConfig, password, calculateStrength, onConfigChange, onStrengthChange]);

  // 设置引用
  const setStrengthIndicatorRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) {
      strengthIndicatorsRef.current[index] = el;
    }
  }, []);

  return (
    <div className="password-strength-checker">
      <div className="password-box">
        <h2>
          Password Strength
          {showText && (
            <span 
              id="strength-text" 
              style={{ color: strength.color }}
            >
              {strength.text}
            </span>
          )}
        </h2>
        
        <input
          ref={passwordInputRef}
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder={placeholder}
          maxLength={maxLength * 2} // 允许更长输入但只计算到maxLength
          className="password-input"
        />
        
        {/* 强度指示器 */}
        <div 
          className="password-strength-indicator"
          ref={(el) => setStrengthIndicatorRef(el, 0)}
        />
        <div 
          className="password-strength-indicator blur-1"
          ref={(el) => setStrengthIndicatorRef(el, 1)}
        />
        <div 
          className="password-strength-indicator blur-2"
          ref={(el) => setStrengthIndicatorRef(el, 2)}
        />
      </div>
      
      {/* 配置面板 */}
      {showConfigPanel && (
        <div className="config-panel">
          <h3>配置选项</h3>
          <div className="config-item">
            <label>弱密码阈值: {internalConfig.weakThreshold}</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={internalConfig.weakThreshold}
              onChange={(e) => handleInternalConfigChange('weakThreshold', parseInt(e.target.value))}
            />
          </div>
          <div className="config-item">
            <label>中等密码阈值: {internalConfig.mediumThreshold}</label>
            <input 
              type="range" 
              min="5" 
              max="20" 
              value={internalConfig.mediumThreshold}
              onChange={(e) => handleInternalConfigChange('mediumThreshold', parseInt(e.target.value))}
            />
          </div>
          <div className="config-item">
            <label>最大长度: {internalConfig.maxLength}</label>
            <input 
              type="range" 
              min="8" 
              max="30" 
              value={internalConfig.maxLength}
              onChange={(e) => handleInternalConfigChange('maxLength', parseInt(e.target.value))}
            />
          </div>
          <div className="config-item">
            <label>弱密码颜色:</label>
            <input 
              type="color" 
              value={internalConfig.weakColor}
              onChange={(e) => handleInternalConfigChange('weakColor', e.target.value)}
            />
          </div>
          <div className="config-item">
            <label>中等密码颜色:</label>
            <input 
              type="color" 
              value={internalConfig.mediumColor}
              onChange={(e) => handleInternalConfigChange('mediumColor', e.target.value)}
            />
          </div>
          <div className="config-item">
            <label>强密码颜色:</label>
            <input 
              type="color" 
              value={internalConfig.strongColor}
              onChange={(e) => handleInternalConfigChange('strongColor', e.target.value)}
            />
          </div>
          <div className="strength-info">
            <div>当前强度: {strength.level}</div>
            <div>强度分数: {Math.round(strength.score)}/100</div>
            <div>密码长度: {password.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthChecker;