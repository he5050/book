import React, { useState, useCallback, useEffect } from 'react';
import './index.scss';

interface GlassMorphismLoginFormProps {
  formWidth?: number;
  formPadding?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  backdropBlur?: number;
  enablePasswordToggle?: boolean;
  enableRememberMe?: boolean;
  enableForgotPassword?: boolean;
  validateOnSubmit?: boolean;
  autoFocus?: boolean;
  backgroundImage?: string;
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => void;
  className?: string;
  style?: React.CSSProperties;
}

const GlassMorphismLoginForm: React.FC<GlassMorphismLoginFormProps> = ({
  formWidth = 432,
  formPadding = 3,
  borderColor = '#ffffff',
  backgroundColor = 'hsla(0, 0%, 10%, 0.1)',
  borderRadius = 1,
  backdropBlur = 8,
  enablePasswordToggle = true,
  enableRememberMe = true,
  enableForgotPassword = true,
  validateOnSubmit = true,
  autoFocus = false,
  backgroundImage = 'https://picsum.photos/1920/1080',
  onSubmit,
  className = '',
  style = {}
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单验证
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = '邮箱不能为空';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email, formData.password]);

  // 处理输入变化
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 实时清除错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 切换密码显示
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateOnSubmit) {
      const isValid = validateForm();
      if (!isValid) {
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit?.(formData);
    } catch (error) {
      setErrors({ submit: '登录失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 键盘事件处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  // 自动聚焦
  useEffect(() => {
    if (autoFocus) {
      const emailInput = document.getElementById('login-email');
      if (emailInput) {
        emailInput.focus();
      }
    }
  }, [autoFocus]);

  // 表单样式
  const formStyle: React.CSSProperties = {
    width: `${formWidth}px`,
    padding: `${formPadding}rem`,
    background: backgroundColor,
    border: `2px solid ${borderColor}`,
    borderRadius: `${borderRadius}rem`,
    backdropFilter: `blur(${backdropBlur}px)`,
    ...style
  };

  return (
    <div className={`glass-morphism-login-container ${className}`}>
      {/* 背景图片 */}
      <img
        src={backgroundImage}
        alt="Login background"
        className="login-background"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://picsum.photos/1920/1080?random=1';
        }}
      />

      {/* 登录表单 */}
      <form className="login-form" style={formStyle} onSubmit={handleSubmit}>
        <h1 className="login-title">登录</h1>

        <div className="login-content">
          {/* 邮箱输入框 */}
          <div className="login-box">
            <i className="bx bx-user login-icon"></i>
            <div className="login-box-input">
              <input
                type="email"
                id="login-email"
                className={`login-input ${errors.email ? 'error' : ''}`}
                placeholder=""
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
              <label htmlFor="login-email" className="login-label">
                邮箱地址
              </label>
            </div>
          </div>

          {/* 密码输入框 */}
          <div className="login-box">
            <i className="bx bx-lock-alt login-icon"></i>
            <div className="login-box-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                className={`login-input ${errors.password ? 'error' : ''}`}
                placeholder=""
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
              <label htmlFor="login-password" className="login-label">
                密码
              </label>
              {enablePasswordToggle && (
                <i
                  className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} login-eye`}
                  onClick={togglePasswordVisibility}
                  title={showPassword ? '隐藏密码' : '显示密码'}
                ></i>
              )}
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        {/* 记住我和忘记密码 */}
        {(enableRememberMe || enableForgotPassword) && (
          <div className="login-check">
            {enableRememberMe && (
              <div className="login-check-group">
                <input
                  type="checkbox"
                  className="login-check-input"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                />
                <label className="login-check-label">记住我</label>
              </div>
            )}

            {enableForgotPassword && (
              <a href="#" className="login-forgot">忘记密码？</a>
            )}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '登录中...' : '登录'}
        </button>

        {/* 注册链接 */}
        <p className="login-register">
          没有账号？<a href="#">注册</a>
        </p>
      </form>
    </div>
  );
};

export default GlassMorphismLoginForm;