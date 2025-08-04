import { useEffect, useState, useCallback } from 'react';

// 报告类型定义
interface Report {
  type: string;
  url: string;
  body: any;
  timestamp: number;
}

// 自定义 Hook：useReportingObserver
export const useReportingObserver = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 检查浏览器支持
    if (typeof ReportingObserver === 'undefined') {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const observer = new ReportingObserver((reportList) => {
      const newReports: Report[] = reportList.getReports().map(report => ({
        type: report.type,
        url: report.url,
        body: report.body,
        timestamp: Date.now(),
      }));

      setReports(prev => [...newReports, ...prev].slice(0, 20)); // 只保留最近20个报告
    }, {
      buffered: true, // 获取缓冲的报告
    });

    observer.observe();

    return () => {
      observer.disconnect();
    };
  }, []);

  return { reports, isSupported };
};

// 报告列表组件
const ReportList = ({ reports }: { reports: Report[] }) => {
  const getReportColor = (type: string) => {
    switch (type) {
      case 'deprecation': return '#FF9800';
      case 'intervention': return '#f44336';
      case 'csp-violation': return '#9C27B0';
      case 'feature-policy-violation': return '#3F51B5';
      default: return '#666';
    }
  };

  const getReportDescription = (type: string) => {
    switch (type) {
      case 'deprecation': return '弃用警告';
      case 'intervention': return '浏览器干预';
      case 'csp-violation': return 'CSP 违规';
      case 'feature-policy-violation': return '功能策略违规';
      default: return '其他报告';
    }
  };

  if (reports.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666', 
        fontStyle: 'italic',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        暂无报告记录
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px', 
      border: '1px solid #e9ecef',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      {reports.map((report, index) => (
        <div
          key={index}
          style={{
            padding: '15px',
            borderBottom: index < reports.length - 1 ? '1px solid #e9ecef' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getReportColor(report.type),
                marginRight: '8px',
              }}
            />
            <strong style={{ color: getReportColor(report.type) }}>
              {getReportDescription(report.type)}
            </strong>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>
              {new Date(report.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>URL:</strong> {report.url}
          </div>
          
          <div style={{ fontSize: '12px', color: '#666' }}>
            <details>
              <summary style={{ cursor: 'pointer', marginBottom: '5px' }}>
                查看详细信息
              </summary>
              <pre style={{ 
                backgroundColor: 'white', 
                padding: '10px', 
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '11px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(report.body, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
};

// 测试触发器组件
const ReportTriggers = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev
    ].slice(0, 5));
  };

  // 触发弃用警告
  const triggerDeprecation = () => {
    try {
      // 使用已弃用的 API
      (document as any).webkitHidden; // 已弃用的属性
      addTestResult('尝试触发弃用警告 (webkitHidden)');
    } catch (error) {
      addTestResult('弃用警告触发失败');
    }
  };

  // 触发 CSP 违规 (需要设置 CSP 头)
  const triggerCSPViolation = () => {
    try {
      // 尝试执行内联脚本 (如果有 CSP 限制会触发违规)
      const script = document.createElement('script');
      script.innerHTML = 'console.log("inline script");';
      document.head.appendChild(script);
      document.head.removeChild(script);
      addTestResult('尝试触发 CSP 违规 (内联脚本)');
    } catch (error) {
      addTestResult('CSP 违规触发失败');
    }
  };

  // 触发功能策略违规
  const triggerFeaturePolicyViolation = () => {
    try {
      // 尝试访问受限制的功能
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
        addTestResult('尝试触发功能策略违规 (地理位置)');
      }
    } catch (error) {
      addTestResult('功能策略违规触发失败');
    }
  };

  // 触发浏览器干预
  const triggerIntervention = () => {
    try {
      // 创建大量的定时器 (可能触发浏览器干预)
      const timers: number[] = [];
      for (let i = 0; i < 1000; i++) {
        timers.push(window.setTimeout(() => {}, 1));
      }
      // 清理定时器
      timers.forEach(timer => clearTimeout(timer));
      addTestResult('尝试触发浏览器干预 (大量定时器)');
    } catch (error) {
      addTestResult('浏览器干预触发失败');
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '15px', 
      borderRadius: '8px', 
      border: '1px solid #e9ecef' 
    }}>
      <h4 style={{ margin: '0 0 15px 0' }}>报告触发测试</h4>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <button
          onClick={triggerDeprecation}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          触发弃用警告
        </button>
        
        <button
          onClick={triggerCSPViolation}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          触发 CSP 违规
        </button>
        
        <button
          onClick={triggerFeaturePolicyViolation}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3F51B5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          触发功能策略违规
        </button>
        
        <button
          onClick={triggerIntervention}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          触发浏览器干预
        </button>
      </div>

      {testResults.length > 0 && (
        <div>
          <h5 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>测试日志:</h5>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '10px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '12px',
            maxHeight: '150px',
            overflow: 'auto'
          }}>
            {testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '3px', color: '#666' }}>
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 浏览器支持检测组件
const BrowserSupport = ({ isSupported }: { isSupported: boolean }) => {
  return (
    <div style={{ 
      backgroundColor: isSupported ? '#e8f5e8' : '#ffebee', 
      padding: '15px', 
      borderRadius: '8px', 
      border: `1px solid ${isSupported ? '#4CAF50' : '#f44336'}`,
      marginBottom: '20px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: isSupported ? '#4CAF50' : '#f44336' }}>
        浏览器支持状态
      </h4>
      <p style={{ margin: 0, fontSize: '14px' }}>
        {isSupported ? (
          <>
            ✅ 当前浏览器支持 ReportingObserver API
          </>
        ) : (
          <>
            ❌ 当前浏览器不支持 ReportingObserver API
            <br />
            <small style={{ color: '#666' }}>
              请使用 Chrome 69+, Firefox 70+, 或其他支持的现代浏览器
            </small>
          </>
        )}
      </p>
    </div>
  );
};

// 使用说明组件
const UsageGuide = () => {
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '15px', 
      borderRadius: '8px', 
      border: '1px solid #e9ecef' 
    }}>
      <h4 style={{ margin: '0 0 15px 0' }}>使用说明</h4>
      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <p><strong>ReportingObserver</strong> 用于监听浏览器生成的各种报告，包括：</p>
        <ul style={{ marginLeft: '20px' }}>
          <li><strong>弃用警告 (Deprecation):</strong> 使用已弃用的 Web API 时的警告</li>
          <li><strong>浏览器干预 (Intervention):</strong> 浏览器为了用户体验而阻止某些操作</li>
          <li><strong>CSP 违规 (CSP Violation):</strong> 违反内容安全策略的行为</li>
          <li><strong>功能策略违规 (Feature Policy Violation):</strong> 违反功能策略的行为</li>
        </ul>
        
        <p><strong>注意事项：</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>ReportingObserver 是相对较新的 API，浏览器支持有限</li>
          <li>某些报告类型需要特定的服务器配置才能触发</li>
          <li>在生产环境中，建议将报告发送到监控服务进行分析</li>
        </ul>
      </div>
    </div>
  );
};

const ReportingObserverDemo = () => {
  const { reports, isSupported } = useReportingObserver();

  return (
    <div style={{ padding: '20px' }}>
      <h2>ReportingObserver 示例</h2>
      
      <BrowserSupport isSupported={isSupported} />
      
      {isSupported ? (
        <>
          <section style={{ marginBottom: '30px' }}>
            <h3>报告触发测试</h3>
            <p>点击下方按钮尝试触发不同类型的报告：</p>
            <ReportTriggers />
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h3>报告列表</h3>
            <p>以下是捕获到的浏览器报告：</p>
            <ReportList reports={reports} />
          </section>
        </>
      ) : (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ color: '#666' }}>功能不可用</h3>
          <p style={{ color: '#666' }}>
            当前浏览器不支持 ReportingObserver API，无法演示相关功能。
          </p>
        </div>
      )}

      <section style={{ marginBottom: '30px' }}>
        <UsageGuide />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>使用场景说明</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>代码质量监控：</strong>监控弃用 API 的使用，及时更新代码</li>
            <li><strong>安全监控：</strong>监控 CSP 违规，发现潜在的安全问题</li>
            <li><strong>性能监控：</strong>监控浏览器干预，了解性能优化建议</li>
            <li><strong>合规检查：</strong>监控功能策略违规，确保符合隐私规范</li>
            <li><strong>错误收集：</strong>收集浏览器报告，发送到错误监控平台</li>
            <li><strong>开发调试：</strong>在开发阶段发现和修复潜在问题</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ReportingObserverDemo;