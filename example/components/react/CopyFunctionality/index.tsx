import React, { useState, useCallback, useRef } from 'react';
import './index.scss';

interface CopyConfig {
  text: string;
  method: 'auto' | 'modern' | 'legacy' | 'rich';
  showFeedback: boolean;
  timeout: number;
  supportHtml: boolean;
  supportImage: boolean;
}

interface CopyFunctionalityProps {
  className?: string;
  style?: React.CSSProperties;
}

const CopyFunctionality: React.FC<CopyFunctionalityProps> = ({
  className = '',
  style = {}
}) => {
  const [config, setConfig] = useState<CopyConfig>({
    text: 'Hello, 这是一个复制功能演示！',
    method: 'auto',
    showFeedback: true,
    timeout: 3000,
    supportHtml: false,
    supportImage: false
  });

  const [feedback, setFeedback] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const [isSupported, setIsSupported] = useState<{
    modern: boolean;
    legacy: boolean;
  }>({
    modern: false,
    legacy: false
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  // 检测浏览器支持情况
  const detectSupport = useCallback(async () => {
    const modernSupport = !!(navigator.clipboard && window.isSecureContext);
    const legacySupport = !!document.execCommand;
    
    setIsSupported({
      modern: modernSupport,
      legacy: legacySupport
    });
  }, []);

  React.useEffect(() => {
    detectSupport();
  }, [detectSupport]);

  // 显示反馈信息
  const showFeedback = useCallback((message: string, type: 'success' | 'error') => {
    if (!config.showFeedback) return;
    
    setFeedback({ show: true, message, type });
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, config.timeout);
  }, [config.showFeedback, config.timeout]);

  // 传统复制方法
  const copyTextFallback = useCallback(async (text: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const success = document.execCommand('copy');
        resolve(success);
      } catch (err) {
        console.error('复制失败', err);
        resolve(false);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }, []);

  // 现代复制方法
  const copyTextModern = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('复制失败：', err);
      return false;
    }
  }, []);

  // 复制HTML内容
  const copyHtml = useCallback(async (html: string): Promise<boolean> => {
    try {
      // 同时复制HTML和纯文本格式，提高兼容性
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
      
      const data = [new ClipboardItem({ 
        'text/html': htmlBlob,
        'text/plain': textBlob
      })];
      
      await navigator.clipboard.write(data);
      return true;
    } catch (err) {
      console.error('复制HTML失败：', err);
      // 降级到纯文本复制
      try {
        await navigator.clipboard.writeText(html.replace(/<[^>]*>/g, ''));
        return true;
      } catch (fallbackErr) {
        console.error('降级复制也失败：', fallbackErr);
        return false;
      }
    }
  }, []);

  // 复制图片
  const copyImage = useCallback(async (): Promise<boolean> => {
    try {
      // 创建一个简单的Canvas图片
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法获取Canvas上下文');
      }
      
      // 绘制一个简单的图片
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(0, 0, 200, 100);
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('复制的图片示例', 100, 55);
      
      // 转换为Blob
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(false);
            return;
          }
          
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve(true);
          } catch (err) {
            console.error('复制图片失败：', err);
            resolve(false);
          }
        }, 'image/png');
      });
    } catch (err) {
      console.error('生成图片失败：', err);
      return false;
    }
  }, []);

  // 主复制函数
  const handleCopy = useCallback(async () => {
    let success = false;
    let method = config.method;

    try {
      if (method === 'auto') {
        // 自动选择最佳方案
        if (isSupported.modern) {
          method = 'modern';
        } else if (isSupported.legacy) {
          method = 'legacy';
        } else {
          showFeedback('当前环境不支持复制功能', 'error');
          return;
        }
      }

      switch (method) {
        case 'modern':
          if (!isSupported.modern) {
            showFeedback('当前环境不支持现代复制API', 'error');
            return;
          }
          success = await copyTextModern(config.text);
          break;

        case 'legacy':
          if (!isSupported.legacy) {
            showFeedback('当前环境不支持传统复制方法', 'error');
            return;
          }
          success = await copyTextFallback(config.text);
          break;

        case 'rich':
          if (!isSupported.modern) {
            showFeedback('富文本复制需要现代浏览器支持', 'error');
            return;
          }
          
          if (config.supportHtml && config.supportImage) {
            // 同时支持HTML和图片时，优先复制HTML
            const html = `<b style="color: red">${config.text}</b>`;
            success = await copyHtml(html);
          } else if (config.supportHtml) {
            const html = `<b style="color: red">${config.text}</b>`;
            success = await copyHtml(html);
          } else if (config.supportImage) {
            success = await copyImage();
          } else {
            // 如果都没选择，默认复制文本
            success = await copyTextModern(config.text);
          }
          break;

        default:
          showFeedback('未知的复制方法', 'error');
          return;
      }

      if (success) {
        showFeedback('复制成功！', 'success');
      } else {
        showFeedback('复制失败，请重试', 'error');
      }
    } catch (error) {
      console.error('复制过程中发生错误:', error);
      showFeedback('复制失败，请重试', 'error');
    }
  }, [config, isSupported, copyTextModern, copyTextFallback, copyHtml, copyImage, showFeedback]);

  // 更新配置
  const updateConfig = useCallback((key: keyof CopyConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className={`copy-functionality-container ${className}`} style={style}>
      <div className="copy-functionality">
        <h3>前端复制功能演示</h3>
        
        {/* 浏览器支持状态 */}
        <div className="support-status">
          <h4>浏览器支持状态</h4>
          <div className="status-items">
            <span className={`status-item ${isSupported.modern ? 'supported' : 'not-supported'}`}>
              现代API: {isSupported.modern ? '✅' : '❌'}
            </span>
            <span className={`status-item ${isSupported.legacy ? 'supported' : 'not-supported'}`}>
              传统方法: {isSupported.legacy ? '✅' : '❌'}
            </span>
          </div>
        </div>

        {/* 配置面板 */}
        <div className="config-panel">
          <h4>配置选项</h4>
          
          <div className="config-item">
            <label>复制内容:</label>
            <textarea
              value={config.text}
              onChange={(e) => updateConfig('text', e.target.value)}
              placeholder="输入要复制的内容..."
            />
          </div>

          <div className="config-item">
            <label>复制方法:</label>
            <select
              value={config.method}
              onChange={(e) => updateConfig('method', e.target.value)}
            >
              <option value="auto">自动选择</option>
              <option value="modern">现代API</option>
              <option value="legacy">传统方法</option>
              <option value="rich">富文本/图片</option>
            </select>
          </div>

          <div className="config-item">
            <label>
              <input
                type="checkbox"
                checked={config.showFeedback}
                onChange={(e) => updateConfig('showFeedback', e.target.checked)}
              />
              显示反馈信息
            </label>
          </div>

          <div className="config-item">
            <label>反馈显示时长 (ms):</label>
            <input
              type="number"
              value={config.timeout}
              onChange={(e) => updateConfig('timeout', parseInt(e.target.value))}
              min="1000"
              max="10000"
              step="500"
            />
          </div>

          {config.method === 'rich' && (
            <>
              <div className="config-item">
                <label>
                  <input
                    type="checkbox"
                    checked={config.supportHtml}
                    onChange={(e) => updateConfig('supportHtml', e.target.checked)}
                  />
                  支持HTML复制
                </label>
              </div>

              <div className="config-item">
                <label>
                  <input
                    type="checkbox"
                    checked={config.supportImage}
                    onChange={(e) => updateConfig('supportImage', e.target.checked)}
                  />
                  支持图片复制
                </label>
              </div>
            </>
          )}
        </div>

        {/* 复制按钮 */}
        <div className="copy-actions">
          <button
            className="copy-btn"
            onClick={handleCopy}
            disabled={!config.text.trim()}
          >
            {config.method === 'rich' && config.supportImage && !config.supportHtml ? '复制图片' : 
             config.method === 'rich' && config.supportHtml ? '复制HTML' : '复制内容'}
          </button>
        </div>

        {/* 反馈信息 */}
        {feedback.show && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        {/* 使用说明 */}
        <div className="usage-info">
          <h4>使用说明</h4>
          <ul>
            <li><strong>自动选择</strong>: 优先使用现代API，降级到传统方法</li>
            <li><strong>现代API</strong>: 使用 navigator.clipboard，需要HTTPS环境</li>
            <li><strong>传统方法</strong>: 使用 execCommand，兼容性最好但已废弃</li>
            <li><strong>富文本/图片</strong>: 支持复制HTML格式和图片内容</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CopyFunctionality;