import { useEffect, useRef, useState, useCallback } from 'react';

// 自定义 Hook：useResizeObserver
export const useResizeObserver = (
  callback: (entry: ResizeObserverEntry) => void
) => {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      entries.forEach(callback);
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [callback]);

  return targetRef;
};

// 尺寸信息显示组件
const SizeTracker = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [contentBoxSize, setContentBoxSize] = useState({ width: 0, height: 0 });
  const [borderBoxSize, setBorderBoxSize] = useState({ width: 0, height: 0 });

  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    setSize({ width: Math.round(width), height: Math.round(height) });

    // 获取更详细的尺寸信息
    if (entry.contentBoxSize && entry.contentBoxSize[0]) {
      const contentBox = entry.contentBoxSize[0];
      setContentBoxSize({
        width: Math.round(contentBox.inlineSize),
        height: Math.round(contentBox.blockSize),
      });
    }

    if (entry.borderBoxSize && entry.borderBoxSize[0]) {
      const borderBox = entry.borderBoxSize[0];
      setBorderBoxSize({
        width: Math.round(borderBox.inlineSize),
        height: Math.round(borderBox.blockSize),
      });
    }
  }, []);

  const targetRef = useResizeObserver(handleResize);

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div
        ref={targetRef}
        style={{
          width: '300px',
          height: '200px',
          border: '10px solid #4CAF50',
          padding: '20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          resize: 'both',
          overflow: 'auto',
          minWidth: '200px',
          minHeight: '150px',
        }}
      >
        <h4 style={{ margin: '0 0 10px 0' }}>可调整大小的区域</h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          拖拽右下角调整大小
        </p>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>尺寸信息</h4>
        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
          <div><strong>Content Rect:</strong> {size.width} × {size.height}</div>
          <div><strong>Content Box:</strong> {contentBoxSize.width} × {contentBoxSize.height}</div>
          <div><strong>Border Box:</strong> {borderBoxSize.width} × {borderBoxSize.height}</div>
        </div>
      </div>
    </div>
  );
};

// 响应式布局组件
const ResponsiveLayout = () => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [layout, setLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    const width = entry.contentRect.width;
    setContainerWidth(Math.round(width));

    if (width < 480) {
      setLayout('mobile');
    } else if (width < 768) {
      setLayout('tablet');
    } else {
      setLayout('desktop');
    }
  }, []);

  const targetRef = useResizeObserver(handleResize);

  const getLayoutStyles = () => {
    switch (layout) {
      case 'mobile':
        return {
          flexDirection: 'column' as const,
          gap: '10px',
          backgroundColor: '#ffebee',
        };
      case 'tablet':
        return {
          flexDirection: 'row' as const,
          flexWrap: 'wrap' as const,
          gap: '15px',
          backgroundColor: '#e8f5e8',
        };
      default:
        return {
          flexDirection: 'row' as const,
          gap: '20px',
          backgroundColor: '#e3f2fd',
        };
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        容器宽度: {containerWidth}px | 当前布局: <strong>{layout}</strong>
      </div>
      
      <div
        ref={targetRef}
        style={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          resize: 'horizontal',
          overflow: 'auto',
          minWidth: '300px',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            ...getLayoutStyles(),
          }}
        >
          <div style={{
            flex: layout === 'mobile' ? 'none' : '1',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
            minHeight: '100px',
          }}>
            <h5 style={{ margin: '0 0 10px 0' }}>内容区域 1</h5>
            <p style={{ margin: 0, fontSize: '14px' }}>
              这是第一个内容区域，会根据容器大小调整布局。
            </p>
          </div>
          
          <div style={{
            flex: layout === 'mobile' ? 'none' : '1',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
            minHeight: '100px',
          }}>
            <h5 style={{ margin: '0 0 10px 0' }}>内容区域 2</h5>
            <p style={{ margin: 0, fontSize: '14px' }}>
              这是第二个内容区域，布局会响应容器尺寸变化。
            </p>
          </div>
          
          <div style={{
            flex: layout === 'mobile' ? 'none' : '1',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
            minHeight: '100px',
          }}>
            <h5 style={{ margin: '0 0 10px 0' }}>内容区域 3</h5>
            <p style={{ margin: 0, fontSize: '14px' }}>
              这是第三个内容区域，支持移动端、平板和桌面布局。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 图表自适应组件
const AdaptiveChart = () => {
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    setChartSize({ width: Math.round(width), height: Math.round(height) });
    
    // 根据容器大小调整数据点数量
    const pointCount = Math.max(5, Math.floor(width / 50));
    setDataPoints(Array.from({ length: pointCount }, () => Math.random() * 100));
  }, []);

  const targetRef = useResizeObserver(handleResize);

  const generatePath = () => {
    if (dataPoints.length === 0 || chartSize.width === 0) return '';
    
    const padding = 20;
    const chartWidth = chartSize.width - padding * 2;
    const chartHeight = chartSize.height - padding * 2;
    
    const stepX = chartWidth / (dataPoints.length - 1);
    
    let path = '';
    dataPoints.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + (chartHeight - (point / 100) * chartHeight);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        图表尺寸: {chartSize.width} × {chartSize.height} | 数据点: {dataPoints.length}
      </div>
      
      <div
        ref={targetRef}
        style={{
          width: '100%',
          height: '300px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          resize: 'both',
          overflow: 'hidden',
          minWidth: '200px',
          minHeight: '150px',
        }}
      >
        {chartSize.width > 0 && chartSize.height > 0 && (
          <svg width={chartSize.width} height={chartSize.height}>
            {/* 网格线 */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* 数据线 */}
            <path
              d={generatePath()}
              fill="none"
              stroke="#4CAF50"
              strokeWidth="2"
            />
            
            {/* 数据点 */}
            {dataPoints.map((point, index) => {
              const padding = 20;
              const chartWidth = chartSize.width - padding * 2;
              const chartHeight = chartSize.height - padding * 2;
              const stepX = chartWidth / (dataPoints.length - 1);
              const x = padding + index * stepX;
              const y = padding + (chartHeight - (point / 100) * chartHeight);
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#4CAF50"
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

const ResizeObserverDemo = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>ResizeObserver 示例</h2>
      
      <section style={{ marginBottom: '40px' }}>
        <h3>1. 元素尺寸监控</h3>
        <p>实时监控元素尺寸变化：</p>
        <SizeTracker />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>2. 响应式布局</h3>
        <p>根据容器尺寸自动调整布局：</p>
        <ResponsiveLayout />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>3. 自适应图表</h3>
        <p>图表根据容器大小自动调整：</p>
        <AdaptiveChart />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>使用场景说明</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>响应式组件：</strong>根据容器大小调整组件布局和样式</li>
            <li><strong>图表库：</strong>图表组件根据容器尺寸自动重绘</li>
            <li><strong>虚拟滚动：</strong>计算可视区域大小，优化长列表渲染</li>
            <li><strong>文本截断：</strong>根据容器宽度动态截断文本</li>
            <li><strong>网格布局：</strong>根据容器大小调整网格列数</li>
            <li><strong>媒体查询替代：</strong>基于容器而非视口的响应式设计</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ResizeObserverDemo;