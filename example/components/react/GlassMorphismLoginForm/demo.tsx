import React, { useState } from 'react';
import GlassMorphismLoginForm from './index';

const GlassMorphismLoginFormDemo: React.FC = () => {
  const [config, setConfig] = useState({
    formWidth: 432,
    formPadding: 3,
    borderColor: '#ffffff',
    backgroundColor: 'hsla(0, 0%, 10%, 0.1)',
    borderRadius: 1,
    backdropBlur: 8,
    enablePasswordToggle: true,
    enableRememberMe: true,
    enableForgotPassword: true,
    validateOnSubmit: true,
    autoFocus: false,
    backgroundImage: 'https://picsum.photos/1920/1080'
  });

  const [loginData, setLoginData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = async (data: any) => {
    setIsSubmitting(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoginData(data);
      alert('登录成功！数据已提交');
    } catch (error) {
      alert('登录失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '20px',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      minHeight: '1100px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* 主要效果展示 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <GlassMorphismLoginForm 
          {...config}
          onSubmit={handleLogin}
        />
      </div>
      
      {/* 登录成功信息 */}
      {loginData && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#000',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3>登录成功！</h3>
          <p><strong>邮箱:</strong> {loginData.email}</p>
          <p><strong>记住我:</strong> {loginData.rememberMe ? '是' : '否'}</p>
          <button 
            onClick={() => setLoginData(null)}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            关闭
          </button>
        </div>
      )}
      
      {/* 参数配置面板 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        width: '100%',
        maxWidth: '900px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        zIndex: 1
      }}>
        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            表单宽度: {config.formWidth}px
          </label>
          <input
            type="range"
            min="300"
            max="600"
            value={config.formWidth}
            onChange={(e) => updateConfig('formWidth', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            表单内边距: {config.formPadding}rem
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={config.formPadding}
            onChange={(e) => updateConfig('formPadding', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            边框颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.borderColor}
              onChange={(e) => updateConfig('borderColor', e.target.value)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>{config.borderColor}</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            背景颜色
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="color"
              value={config.backgroundColor.replace('hsla(0, 0%, 10%, 0.1)', '#222222')}
              onChange={(e) => updateConfig('backgroundColor', `hsla(0, 0%, 10%, 0.1)`)}
              style={{ width: '50px', height: '30px', border: 'none', borderRadius: '4px' }}
            />
            <span style={{ color: '#ccc', fontSize: '12px' }}>hsla(0, 0%, 10%, 0.1)</span>
          </div>
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            毛玻璃模糊: {config.backdropBlur}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={config.backdropBlur}
            onChange={(e) => updateConfig('backdropBlur', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            圆角大小: {config.borderRadius}rem
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={config.borderRadius}
            onChange={(e) => updateConfig('borderRadius', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div className="config-group">
          <label style={{ 
            color: '#fff', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={config.enablePasswordToggle}
              onChange={(e) => updateConfig('enablePasswordToggle', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            启用密码切换
          </label>
        </div>

        <div className="config-group">
          <label style={{ 
            color: '#fff', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={config.enableRememberMe}
              onChange={(e) => updateConfig('enableRememberMe', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            显示记住我
          </label>
        </div>

        <div className="config-group">
          <label style={{ 
            color: '#fff', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={config.enableForgotPassword}
              onChange={(e) => updateConfig('enableForgotPassword', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            显示忘记密码
          </label>
        </div>

        <div className="config-group">
          <label style={{ 
            color: '#fff', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={config.autoFocus}
              onChange={(e) => updateConfig('autoFocus', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            自动聚焦邮箱
          </label>
        </div>
      </div>

      {/* 预设主题 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            formWidth: 432,
            borderColor: '#ffffff',
            backgroundColor: 'hsla(0, 0%, 10%, 0.1)',
            backdropBlur: 8
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '6px',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          经典主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            formWidth: 500,
            borderColor: '#007bff',
            backgroundColor: 'hsla(200, 10%, 15%, 0.2)',
            backdropBlur: 12
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(0, 123, 255, 0.2)',
            border: '1px solid rgba(0, 123, 255, 0.5)',
            borderRadius: '6px',
            color: '#007bff',
            cursor: 'pointer'
          }}
        >
          蓝色主题
        </button>
        
        <button
          onClick={() => setConfig(prev => ({
            ...prev,
            formWidth: 350,
            borderColor: '#ff6b35',
            backgroundColor: 'hsla(0, 0%, 10%, 0.15)',
            backdropBlur: 6
          }))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 107, 53, 0.2)',
            border: '1px solid rgba(255, 107, 53, 0.5)',
            borderRadius: '6px',
            color: '#ff6b35',
            cursor: 'pointer'
          }}
        >
          橙色主题
        </button>
      </div>
    </div>
  );
};

export default GlassMorphismLoginFormDemo;