import React, { useState } from 'react';
import MarkdownAI from './MarkdownAI';
import { Button, Input, Space, Tabs, Card } from 'antd';
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
const simpleTestContent = `# 快速测试 [[1,'测试引用']]

## 代码测试
\`\`\`javascript
console.log('Hello World!');
\`\`\`

## 图表测试
<div id="echarts-container-line-1" style="width: 100%; height: 300px;"></div>

## 表格测试
| 列1 | 列2 |
|-----|-----|
| 数据1 | 数据2 |
`;

const MarkdownPlayground: React.FC = () => {
  const [content, setContent] = useState(simpleTestContent);
  const [activeTab, setActiveTab] = useState('demo');

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
          <MarkdownAI content={fullDemoContent} />
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
              <MarkdownAI content={content} />
            </div>
          </Card>
        </div>
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

            <h3>使用方法</h3>
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