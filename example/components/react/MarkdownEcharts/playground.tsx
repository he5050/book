import React, { useState } from 'react';
import MarkdownAI from './MarkdownAI';
import type { ChartConfig } from './MarkdownAI';
import { Button, Input, Space, Tabs, Card, Row, Col, Alert } from 'antd';
import { EditOutlined, EyeOutlined, CodeOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// 完整的演示内容
const fullDemoContent = `# MarkdownAI 完整功能演示 [[1,'这是一个完整的功能演示']]

这个组件完全基于 base.tsx 的实现，并添加了 ECharts 和引用标记支持。

## 代码高亮功能

### JavaScript 示例
\`\`\`javascript
// 数组去重的几种方法
function removeDuplicates(arr) {
  // 方法1: 使用 Set
  return [...new Set(arr)];
}

// 方法2: 使用 filter + indexOf
function removeDuplicatesFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// 使用示例
const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicates(numbers)); // [1, 2, 3, 4, 5]
\`\`\`

### Python 示例 [[2,'Python代码示例']]
\`\`\`python
# Python 数据处理示例
import pandas as pd
import numpy as np

def process_data(data):
    """处理数据的函数"""
    # 去重
    unique_data = list(set(data))
    
    # 排序
    sorted_data = sorted(unique_data)
    
    return sorted_data

# 使用示例
sample_data = [3, 1, 4, 1, 5, 9, 2, 6, 5]
result = process_data(sample_data)
print(f"处理结果: {result}")
\`\`\`

## ECharts 图表展示

### 数据趋势分析 [[3,'数据可视化说明']]

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div id="echarts-container-line-1" style="width: 50%; height: 400px;"></div>
  <div id="echarts-container-bar-2" style="width: 50%; height: 400px;"></div>
</div>

### 数据分布情况
<div id="echarts-container-pie-3" style="width: 100%; height: 400px; margin: 20px 0;"></div>

## 表格展示

| 功能 | 状态 | 说明 | 优先级 |
|------|------|------|--------|
| 代码高亮 | ✅ 完成 | 支持多种语言 | 高 |
| 代码复制 | ✅ 完成 | Popover 提示 | 高 |
| 主题切换 | ✅ 完成 | 明暗主题 | 中 |
| ECharts | ✅ 完成 | 多种图表类型 | 高 |
| 引用标记 | ✅ 完成 | 点击交互 | 中 |

## 列表功能

### 已实现功能
- [x] 基础 Markdown 渲染
- [x] 代码语法高亮
- [x] 代码一键复制（使用 Popover 提示）
- [x] 明暗主题切换
- [x] 表格样式优化
- [x] 链接处理（新窗口打开）
- [x] ECharts 图表支持
- [x] 引用标记处理

### 技术特性
1. **完全基于 base.tsx 实现** [[4,'技术实现说明']]
2. **TypeScript 类型安全**
3. **响应式设计**
4. **性能优化**

## 引用和链接

访问 [GitHub](https://github.com) 查看更多开源项目。

> 这个组件的设计理念是保持简洁的同时提供丰富的功能。
> 
> 所有的交互都经过精心设计，确保用户体验的一致性。

## HTML 标签支持

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
  <h3 style="margin: 0 0 10px 0;">HTML 渲染支持</h3>
  <p style="margin: 0;">支持在 Markdown 中嵌入 HTML 标签，创建更丰富的内容展示效果。</p>
</div>

## 使用说明 [[5,'使用指南']]

1. **代码复制**: 将鼠标悬停在代码块上，点击右上角的复制按钮
2. **主题��换**: 点击灯泡图标切换代码块的明暗主题
3. **引用点击**: 点击蓝色的上标数字查看引用信息
4. **图表交互**: ECharts 图表支持缩放、提示等交互功能

---

*这个演示展示了 MarkdownAI 组件的所有核心功能，完全基于 base.tsx 的设计理念实现。*
`;

// 简单的测试内容
const simpleTestContent = `# 快速测试 [[1,'测试引用功能']]

## 代码高亮测试
\`\`\`javascript
// 测试代码高亮和复制功能
function testFunction() {
  console.log('Hello World!');
  return 'MarkdownAI 组件测试';
}
\`\`\`

## 图表展示测试

### 折线图
<div id="echarts-container-line-1" style="width: 100%; height: 400px;"></div>

### 柱状图  
<div id="echarts-container-bar-2" style="width: 100%; height: 400px;"></div>

### 饼图
<div id="echarts-container-pie-3" style="width: 100%; height: 400px;"></div>

## 表格测试
| 功能 | 状态 | 说明 |
|------|------|------|
| 代码高亮 | ✅ | 支持多种语言 |
| 图表渲染 | ✅ | 自动识别类型 |
| 引用标记 | ✅ | 点击查看详情 |

## 引用标记测试
这是一个包含引用的段落 [[2,'这是第二个引用']]，点击数字可以查看引用信息。
`;

// 外部数据示例组件
const ExternalDataExample: React.FC = () => {
  const [chartConfigs] = useState<ChartConfig[]>([
    {
      id: 'echarts-container-external-line',
      type: 'line',
      data: {
        title: '外部数据驱动的折线图',
        xData: ['周一', '周二', '周三', '周四', '周五'],
        yData: [120, 200, 150, 80, 70],
        color: '#ff6b6b'
      }
    },
    {
      id: 'echarts-container-external-bar',
      type: 'bar',
      data: {
        title: '外部数据驱动的柱状图',
        xData: ['产品A', '产品B', '产品C', '产品D'],
        yData: [300, 400, 200, 500],
        color: '#4ecdc4'
      }
    }
  ]);

  const externalDataContent = `# 外部数据驱动示例

## 通过 chartConfigs 传入数据

### 自定义折线图
<div id="echarts-container-external-line" style="width: 100%; height: 400px;"></div>

### 自定义柱状图
<div id="echarts-container-external-bar" style="width: 100%; height: 400px;"></div>

## 配置代码

\`\`\`typescript
const chartConfigs: ChartConfig[] = [
  {
    id: 'echarts-container-external-line',
    type: 'line',
    data: {
      title: '外部数据驱动的折线图',
      xData: ['周一', '周二', '周三', '周四', '周五'],
      yData: [120, 200, 150, 80, 70],
      color: '#ff6b6b'
    }
  }
];

<MarkdownAI 
  content={content}
  chartConfigs={chartConfigs}
/>
\`\`\`
`;

  return (
    <Card title="外部数据驱动的图表">
      <MarkdownAI 
        content={externalDataContent}
        chartConfigs={chartConfigs}
      />
    </Card>
  );
};

// 无数据状态示例组件
const NoDataExample: React.FC = () => {
  const noDataContent = `# 无数据状态演示

## 没有传入 chartConfigs 的情况

### 折线图容器
<div id="echarts-container-no-data-line" style="width: 100%; height: 300px;"></div>

### 柱状图容器
<div id="echarts-container-no-data-bar" style="width: 100%; height: 300px;"></div>

## 说明

当没有通过 \`chartConfigs\` 或 \`defaultChartOptions\` 传入数据时，图表容器会显示"暂无数据"的占位符。

这种设计让开发者明确知道需要传入数据，避免了意外显示模拟数据的情况。
`;

  const withDataContent = `# 有数据状态对比

### 有数据的折线图
<div id="echarts-container-with-data-line" style="width: 100%; height: 300px;"></div>
`;

  const withDataConfigs: ChartConfig[] = [
    {
      id: 'echarts-container-with-data-line',
      type: 'line',
      data: {
        title: '有数据的图表',
        xData: ['A', 'B', 'C', 'D', 'E'],
        yData: [10, 20, 15, 25, 30],
        color: '#5470c6'
      }
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="❌ 无数据状态" style={{ height: '100%' }}>
            <p>没有传入 <code>chartConfigs</code> 时的效果：</p>
            <MarkdownAI content={noDataContent} />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="✅ 有数据状态" style={{ height: '100%' }}>
            <p>传入了 <code>chartConfigs</code> 时的效果：</p>
            <MarkdownAI 
              content={withDataContent} 
              chartConfigs={withDataConfigs}
            />
          </Card>
        </Col>
      </Row>

      <Card title="代码对比" style={{ marginTop: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <h4>❌ 无数据（会显示占位符）</h4>
            <pre style={{ 
              backgroundColor: '#f6f8fa', 
              padding: '16px', 
              borderRadius: '6px',
              fontSize: '12px'
            }}>
{`// 没有传入数据
<MarkdownAI content={content} />

// 结果：图表显示"暂无数据"占位符`}
            </pre>
          </Col>
          
          <Col span={12}>
            <h4>✅ 有数据（正常显示图表）</h4>
            <pre style={{ 
              backgroundColor: '#f6f8fa', 
              padding: '16px', 
              borderRadius: '6px',
              fontSize: '12px'
            }}>
{`// 传入图表配置
const chartConfigs = [{
  id: 'echarts-container-line-1',
  type: 'line',
  data: {
    title: '标题',
    xData: ['A', 'B', 'C'],
    yData: [10, 20, 15]
  }
}];

<MarkdownAI 
  content={content} 
  chartConfigs={chartConfigs} 
/>`}
            </pre>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// 调试测试示例组件
const DebugExample: React.FC = () => {
  const debugContent = `# 图表调试测试

## 测试说明
这个页面用于调试 ECharts 图表渲染问题。

## 折线图测试
<div id="echarts-container-debug-line" style="width: 100%; height: 300px; border: 2px solid red;"></div>

## 柱状图测试
<div id="echarts-container-debug-bar" style="width: 100%; height: 300px; border: 2px solid blue;"></div>

## 饼图测试
<div id="echarts-container-debug-pie" style="width: 100%; height: 300px; border: 2px solid green;"></div>

## 检查步骤
1. 查看容器是否有彩色边框
2. 打开浏览器开发者工具
3. 检查控制台是否有错误
4. 查看 Elements 面板中的 DOM 结构
`;

  const debugChartConfigs: ChartConfig[] = [
    {
      id: 'echarts-container-debug-line',
      type: 'line',
      data: {
        title: '调试折线图',
        xData: ['1', '2', '3', '4', '5'],
        yData: [10, 20, 15, 25, 30],
        color: '#ff0000'
      }
    },
    {
      id: 'echarts-container-debug-bar',
      type: 'bar',
      data: {
        title: '调试柱状图',
        xData: ['A', 'B', 'C'],
        yData: [100, 200, 150],
        color: '#0000ff'
      }
    },
    {
      id: 'echarts-container-debug-pie',
      type: 'pie',
      data: {
        title: '调试饼图',
        name: '调试数据',
        data: [
          { value: 30, name: '部分1' },
          { value: 40, name: '部分2' },
          { value: 30, name: '部分3' }
        ]
      }
    }
  ];

  React.useEffect(() => {
    console.log('调试组件已挂载');
    
    setTimeout(() => {
      const containers = document.querySelectorAll('[id*="echarts-container-debug"]');
      console.log('找到的调试容器数量:', containers.length);
      containers.forEach((container, index) => {
        console.log(`调试容器 ${index + 1}:`, {
          id: container.id,
          width: container.clientWidth,
          height: container.clientHeight,
          style: (container as HTMLElement).style.cssText
        });
      });
    }, 1000);
  }, []);

  return (
    <div>
      <Alert
        message="调试模式"
        description="这个页面用于调试 ECharts 图表渲染问题。请打开浏览器开发者工具查看控制台输出。"
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />
      
      <Card title="图表调试测试">
        <MarkdownAI 
          content={debugContent} 
          chartConfigs={debugChartConfigs}
        />
      </Card>
    </div>
  );
};

const MarkdownPlayground: React.FC = () => {
  const [content, setContent] = useState(simpleTestContent);
  const [activeTab, setActiveTab] = useState('demo');

  // 为演示提供默认的图表配置
  const defaultDemoChartConfigs: ChartConfig[] = [
    {
      id: 'echarts-container-line-1',
      type: 'line',
      data: {
        title: '网站访问量趋势',
        xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        yData: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1200, 1100, 1350, 1500],
        color: '#5470c6'
      }
    },
    {
      id: 'echarts-container-bar-2',
      type: 'bar',
      data: {
        title: '各部门销售业绩',
        xData: ['技术部', '销售部', '市场部', '运营部', '产品部'],
        yData: [320, 450, 300, 280, 200],
        color: '#91cc75'
      }
    },
    {
      id: 'echarts-container-pie-3',
      type: 'pie',
      data: {
        title: '用户来源分析',
        name: '访问来源',
        data: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' }
        ]
      }
    },
    {
      id: 'echarts-container-line-4',
      type: 'line',
      data: {
        title: '用户增长',
        xData: ['Q1', 'Q2', 'Q3', 'Q4'],
        yData: [1200, 1500, 1800, 2100],
        color: '#fac858'
      }
    },
    {
      id: 'echarts-container-bar-5',
      type: 'bar',
      data: {
        title: '产品销量',
        xData: ['产品A', '产品B', '产品C', '产品D'],
        yData: [300, 400, 200, 500],
        color: '#ee6666'
      }
    }
  ];

  const handleLoadDemo = (demoType: 'simple' | 'full') => {
    if (demoType === 'simple') {
      setContent(simpleTestContent);
    } else {
      setContent(fullDemoContent);
    }
  };

  const handleReset = () => {
    setContent(simpleTestContent);
  };

  const tabItems = [
    {
      key: 'demo',
      label: (
        <span>
          <EyeOutlined />
          完整演示
        </span>
      ),
      children: (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <MarkdownAI 
            content={fullDemoContent} 
            chartConfigs={defaultDemoChartConfigs}
          />
        </div>
      )
    },
    {
      key: 'playground',
      label: (
        <span>
          <EditOutlined />
          交互测试
        </span>
      ),
      children: (
        <div>
          <Card 
            title="Markdown 编辑器" 
            style={{ marginBottom: '20px' }}
            extra={
              <Space>
                <Button size="small" onClick={() => handleLoadDemo('simple')}>
                  加载简单示例
                </Button>
                <Button size="small" onClick={() => handleLoadDemo('full')}>
                  加载完整示例
                </Button>
                <Button size="small" onClick={handleReset}>
                  重置
                </Button>
                <Button 
                  size="small" 
                  type="dashed"
                  onClick={() => {
                    console.log('开始调试图表...');
                    setTimeout(() => {
                      const containers = document.querySelectorAll('[id*="echarts-container"]');
                      console.log('找到图表容器:', containers.length);
                      containers.forEach(c => console.log('容器ID:', c.id, '尺寸:', c.clientWidth, 'x', c.clientHeight));
                    }, 500);
                  }}
                >
                  调试图表
                </Button>
              </Space>
            }
          >
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在这里输入 Markdown 内容..."
              style={{ 
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '14px',
                minHeight: '300px'
              }}
            />
          </Card>
          
          <Card title="实时预览">
            <div style={{ 
              border: '1px solid #f0f0f0', 
              borderRadius: '6px',
              backgroundColor: '#fff'
            }}>
              <MarkdownAI 
                content={content} 
                chartConfigs={defaultDemoChartConfigs}
              />
            </div>
          </Card>
        </div>
      )
    },
    {
      key: 'external',
      label: (
        <span>
          <CodeOutlined />
          外部数据
        </span>
      ),
      children: (
        <ExternalDataExample />
      )
    },
    {
      key: 'nodata',
      label: (
        <span>
          <CodeOutlined />
          无数据状态
        </span>
      ),
      children: (
        <NoDataExample />
      )
    },
    {
      key: 'debug',
      label: (
        <span>
          <CodeOutlined />
          调试测试
        </span>
      ),
      children: (
        <DebugExample />
      )
    },
    {
      key: 'usage',
      label: (
        <span>
          <CodeOutlined />
          使用说明
        </span>
      ),
      children: (
        <Card>
          <div style={{ lineHeight: '1.8' }}>
            <h3>组件特性</h3>
            <ul>
              <li><strong>完全基于 base.tsx</strong>: 保持与原有代码块组件的一致性</li>
              <li><strong>代码高亮</strong>: 支持多种编程语言的语法高亮</li>
              <li><strong>代码复制</strong>: 使用 Popover 显示复制成功提示</li>
              <li><strong>主题切换</strong>: 支持明暗主题切换</li>
              <li><strong>ECharts 支持</strong>: 自动渲染图表容器</li>
              <li><strong>引用标记</strong>: 支持 [[数字,'描述']] 格式</li>
            </ul>

            <h3>基本使用</h3>
            <pre style={{ 
              backgroundColor: '#f6f8fa', 
              padding: '16px', 
              borderRadius: '6px',
              overflow: 'auto'
            }}>
{`import MarkdownAI from './MarkdownAI';

const App = () => {
  const content = \`
# 标题
这是内容 [[1,'引用说明']]

\\\`\\\`\\\`javascript
console.log('Hello World!');
\\\`\\\`\\\`

<div id="echarts-container-line-1" style="width: 100%; height: 400px;"></div>
  \`;

  return <MarkdownAI content={content} />;
};`}
            </pre>

            <h3>外部数据驱动</h3>
            <pre style={{ 
              backgroundColor: '#f6f8fa', 
              padding: '16px', 
              borderRadius: '6px',
              overflow: 'auto'
            }}>
{`import MarkdownAI, { ChartConfig } from './MarkdownAI';

const App = () => {
  const chartConfigs: ChartConfig[] = [
    {
      id: 'echarts-container-sales',
      type: 'line',
      data: {
        title: '销售数据',
        xData: ['1月', '2月', '3月', '4月'],
        yData: [1200, 1500, 1800, 1600],
        color: '#ff6b6b'
      }
    },
    {
      id: 'echarts-container-custom',
      option: {
        // 完整的 ECharts 配置
        title: { text: '自定义图表' },
        xAxis: { type: 'category', data: ['A', 'B', 'C'] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [10, 20, 30] }]
      }
    }
  ];

  const content = \`
# 外部数据示例
<div id="echarts-container-sales" style="width: 100%; height: 400px;"></div>
<div id="echarts-container-custom" style="width: 100%; height: 400px;"></div>
  \`;

  return (
    <MarkdownAI 
      content={content}
      chartConfigs={chartConfigs}
    />
  );
};`}
            </pre>

            <h3>ECharts 图表类型</h3>
            <ul>
              <li><code>echarts-container-line-*</code> 或包含 <code>1</code>: 折线图</li>
              <li><code>echarts-container-bar-*</code> 或包含 <code>2</code>: 柱状图</li>
              <li><code>echarts-container-pie-*</code> 或包含 <code>3</code>: 饼图</li>
            </ul>

            <h3>引用标记格式</h3>
            <p>使用 <code>[[数字,'描述']]</code> 格式创建可点击的引用标记。</p>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>MarkdownAI 组件演示平台</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          基于 base.tsx 实现的 AI 对话 Markdown 渲染组件
        </p>
      </div>

      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default MarkdownPlayground;