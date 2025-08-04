import { useEffect, useState, useCallback, useRef } from 'react';

// 性能指标类型定义
interface PerformanceMetrics {
  navigation?: PerformanceNavigationTiming;
  paint?: { fcp?: number; lcp?: number };
  resources: PerformanceResourceTiming[];
  longTasks: any[]; // 使用 any 类型，因为 PerformanceLongTaskTiming 可能不被所有浏览器支持
  layoutShifts: { count: number; score: number };
}

// 自定义 Hook：usePerformanceObserver
const usePerformanceObserver = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    resources: [],
    longTasks: [],
    layoutShifts: { count: 0, score: 0 },
  });
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // 检查浏览器支持
    if (typeof PerformanceObserver === 'undefined') {
      setIsSupported(false);
      return;
    }

    const observers: PerformanceObserver[] = [];

    try {
      // 监控导航性能
      const navObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (entries.length > 0) {
          setMetrics(prev => ({ ...prev, navigation: entries[0] }));
        }
      });
      navObserver.observe({ entryTypes: ['navigation'], buffered: true });
      observers.push(navObserver);
    } catch (error) {
      console.warn('Navigation performance observation not supported:', error);
    }

    try {
      // 监控渲染性能 (FCP, LCP)
      const paintObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByType('paint');
        const paintMetrics: { fcp?: number; lcp?: number } = {};
        
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            paintMetrics.fcp = entry.startTime;
          } else if (entry.name === 'largest-contentful-paint') {
            paintMetrics.lcp = entry.startTime;
          }
        });
        
        setMetrics(prev => ({ 
          ...prev, 
          paint: { ...prev.paint, ...paintMetrics }
        }));
      });
      paintObserver.observe({ entryTypes: ['paint'], buffered: true });
      observers.push(paintObserver);
    } catch (error) {
      console.warn('Paint performance observation not supported:', error);
    }

    try {
      // 监控资源加载
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByType('resource') as PerformanceResourceTiming[];
        setMetrics(prev => ({
          ...prev,
          resources: [...prev.resources, ...entries].slice(-20) // 只保留最近20个
        }));
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      observers.push(resourceObserver);
    } catch (error) {
      console.warn('Resource performance observation not supported:', error);
    }

    // 监控长任务
    try {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByType('longtask');
        setMetrics(prev => ({
          ...prev,
          longTasks: [...prev.longTasks, ...entries].slice(-10) // 只保留最近10个
        }));
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Long task observation not supported:', error);
    }

    try {
      // 监控布局偏移
      let clsScore = 0;
      let clsCount = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByType('layout-shift');
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            clsCount++;
          }
        });
        setMetrics(prev => ({
          ...prev,
          layoutShifts: { count: clsCount, score: clsScore }
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'], buffered: true });
      observers.push(clsObserver);
    } catch (error) {
      console.warn('Layout shift observation not supported:', error);
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return { metrics, isSupported };
};

// 导航性能组件
const NavigationMetrics = ({ navigation }: { navigation?: PerformanceNavigationTiming }) => {
  if (!navigation) return <div>加载中...</div>;

  const metrics = [
    { label: 'DNS 查询', value: navigation.domainLookupEnd - navigation.domainLookupStart },
    { label: 'TCP 连接', value: navigation.connectEnd - navigation.connectStart },
    { label: '请求响应', value: navigation.responseEnd - navigation.requestStart },
    { label: 'DOM 解析', value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart },
    { label: '页面加载', value: navigation.loadEventEnd - navigation.loadEventStart },
    { label: '总耗时', value: navigation.loadEventEnd - navigation.fetchStart },
  ];

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <h4 style={{ margin: '0 0 15px 0' }}>导航性能指标</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        {metrics.map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
              {Math.round(value)}ms
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 渲染性能组件
const PaintMetrics = ({ paint }: { paint?: { fcp?: number; lcp?: number } }) => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <h4 style={{ margin: '0 0 15px 0' }}>渲染性能指标</h4>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196F3' }}>
            {paint?.fcp ? Math.round(paint.fcp) : '-'}ms
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>首次内容绘制 (FCP)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>
            {paint?.lcp ? Math.round(paint.lcp) : '-'}ms
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>最大内容绘制 (LCP)</div>
        </div>
      </div>
    </div>
  );
};

// 资源加载组件
const ResourceMetrics = ({ resources }: { resources: PerformanceResourceTiming[] }) => {
  const slowResources = resources
    .filter(resource => resource.duration > 100)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <h4 style={{ margin: '0 0 15px 0' }}>资源加载性能 (慢资源 Top 5)</h4>
      {slowResources.length === 0 ? (
        <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>暂无慢加载资源</p>
      ) : (
        <div style={{ fontSize: '12px' }}>
          {slowResources.map((resource, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '5px 0',
              borderBottom: index < slowResources.length - 1 ? '1px solid #eee' : 'none'
            }}>
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {resource.name.split('/').pop() || resource.name}
              </div>
              <div style={{ marginLeft: '10px' }}>
                <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                  {Math.round(resource.duration)}ms
                </span>
                <span style={{ color: '#666', marginLeft: '5px' }}>
                  ({resource.initiatorType})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 长任务监控组件
const LongTaskMetrics = ({ longTasks }: { longTasks: any[] }) => {
  const totalBlockingTime = longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0);

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <h4 style={{ margin: '0 0 15px 0' }}>长任务监控</h4>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
            {longTasks.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>长任务数量</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
            {Math.round(totalBlockingTime)}ms
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>总阻塞时间</div>
        </div>
      </div>
      
      {longTasks.length > 0 && (
        <div style={{ fontSize: '12px' }}>
          <strong>最近的长任务：</strong>
          {longTasks.slice(-3).map((task, index) => (
            <div key={index} style={{ 
              padding: '3px 0',
              color: '#666'
            }}>
              耗时 {Math.round(task.duration)}ms (开始于 {Math.round(task.startTime)}ms)
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 性能测试组件
const PerformanceTest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLongTask = () => {
    setIsLoading(true);
    // 模拟长任务
    setTimeout(() => {
      const start = performance.now();
      let sum = 0;
      for (let i = 0; i < 10000000; i++) {
        sum += Math.random();
      }
      const end = performance.now();
      console.log(`模拟长任务完成，耗时: ${end - start}ms, 结果: ${sum}`);
      setIsLoading(false);
    }, 100);
  };

  const loadImages = () => {
    setIsLoading(true);
    const promises = Array.from({ length: 5 }, (_, i) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = `https://picsum.photos/200/200?random=${Date.now()}-${i}`;
      });
    });

    Promise.all(promises).then(() => {
      setIsLoading(false);
    });
  };

  const triggerLayoutShift = () => {
    const element = document.createElement('div');
    element.style.cssText = `
      position: absolute;
      top: 50px;
      left: 50px;
      width: 100px;
      height: 100px;
      background: red;
      z-index: 1000;
    `;
    document.body.appendChild(element);

    setTimeout(() => {
      element.style.top = '150px';
      element.style.left = '150px';
    }, 100);

    setTimeout(() => {
      document.body.removeChild(element);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <h4 style={{ margin: '0 0 15px 0' }}>性能测试工具</h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={simulateLongTask}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          模拟长任务
        </button>
        
        <button
          onClick={loadImages}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          加载图片资源
        </button>
        
        <button
          onClick={triggerLayoutShift}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          触发布局偏移
        </button>
      </div>
      
      {isLoading && (
        <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          执行中...
        </div>
      )}
    </div>
  );
};

const PerformanceObserverDemo = () => {
  const { metrics, isSupported } = usePerformanceObserver();

  if (!isSupported) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>PerformanceObserver 示例</h2>
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          border: '1px solid #f44336',
          color: '#d32f2f'
        }}>
          <h3>浏览器不支持</h3>
          <p>当前浏览器不支持 PerformanceObserver API，无法演示相关功能。</p>
          <p>请使用 Chrome 52+, Firefox 57+, 或 Safari 11+ 浏览器。</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>PerformanceObserver 示例</h2>
      
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '15px', 
        borderRadius: '8px', 
        border: '1px solid #4CAF50',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
          ✅ 浏览器支持 PerformanceObserver API
        </h4>
        <p style={{ margin: 0, fontSize: '14px' }}>
          正在实时监控页面性能指标...
        </p>
      </div>
      
      <section style={{ marginBottom: '30px' }}>
        <NavigationMetrics navigation={metrics.navigation} />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <PaintMetrics paint={metrics.paint} />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <ResourceMetrics resources={metrics.resources} />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <LongTaskMetrics longTasks={metrics.longTasks} />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>布局偏移 (CLS)</h4>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>
                {metrics.layoutShifts.count}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>偏移次数</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>
                {metrics.layoutShifts.score.toFixed(4)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>CLS 得分</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <PerformanceTest />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>使用场景说明</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>性能监控：</strong>实时收集页面性能数据，发送到监控平台</li>
            <li><strong>用户体验优化：</strong>监控 Core Web Vitals 指标 (FCP, LCP, CLS)</li>
            <li><strong>资源优化：</strong>识别加载缓慢的资源，进行针对性优化</li>
            <li><strong>性能预算：</strong>设置性能阈值，超出时进行告警</li>
            <li><strong>A/B 测试：</strong>对比不同版本的性能表现</li>
            <li><strong>问题诊断：</strong>识别长任务和性能瓶颈</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PerformanceObserverDemo;