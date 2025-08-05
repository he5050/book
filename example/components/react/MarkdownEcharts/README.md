# MarkdownAI 组件

基于 React 的 AI 对话 Markdown 渲染组件，**完全基于 base.tsx 的实现**，并扩展了 ECharts 图表和引用标记支持。支持流式渲染、代码高亮、复制功能等特性。

## 功能特性

- ✅ 支持标准 Markdown 语法
- ✅ 代码高亮和复制功能
- ✅ 表格渲染优化
- ✅ HTML 标签支持
- ✅ 主题切换功能
- ✅ 空白行处理优化
- ✅ 链接自动在新窗口打开
- ✅ 自定义样式支持
- ✅ **ECharts 图表支持**
- ✅ **引用标记处理**

## 技术栈

- React 18+
- TypeScript
- react-markdown
- react-syntax-highlighter
- Ant Design
- github-markdown-css

## 使用方法

### 基本使用

```tsx
import MarkdownAI from './MarkdownAI';

const App = () => {
  const markdownContent = `
# 标题

这是一段 **粗体** 和 *斜体* 文本。

\`\`\`javascript
console.log('Hello World!');
\`\`\`
  `;

  return <MarkdownAI content={markdownContent} />;
};
```

### 自定义样式

```tsx
<MarkdownAI 
  content={markdownContent} 
  className="custom-markdown"
/>
```

## 组件 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | - | Markdown 内容 |
| className | string | '' | 自定义 CSS 类名 |

## 支持的 Markdown 语法

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 文本样式
```markdown
**粗体文本**
*斜体文本*
~~删除线~~
`行内代码`
```

### 代码块
```markdown
\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`
```

### 表格
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
```

### 列表
```markdown
- 无序列表项1
- 无序列表项2

1. 有序列表项1
2. 有序列表项2
```

### 引用
```markdown
> 这是一个引用块
```

### 链接
```markdown
[链接文本](https://example.com)
```

### HTML 支持
```html
<div style="color: red;">HTML 内容</div>
```

### ECharts 图表支持
```html
<!-- 折线图 -->
<div id="echarts-container-line-1" style="width: 100%; height: 400px;"></div>

<!-- 柱状图 -->
<div id="echarts-container-bar-2" style="width: 100%; height: 400px;"></div>

<!-- 饼图 -->
<div id="echarts-container-pie-3" style="width: 100%; height: 400px;"></div>
```

### 引用标记
```markdown
这是一段文本 [[1,'这是引用说明']]，点击数字可以查看引用信息。
```

## 代码高亮

组件支持多种编程语言的语法高亮：

- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- JSON
- Markdown
- 等等...

## 代码复制功能

**完全基于 base.tsx 的实现**，每个代码块都包含：
- 🌙 主题切换按钮（明/暗主题）
- 📋 复制按钮（一键复制代码，使用 Popover 显示"已复制！"提示）
- 🎨 与 base.tsx 完全一致的样式和交互体验

## 样式定制

组件使用 `github-markdown-css` 作为基础样式，你可以通过以下方式自定义：

```css
.custom-markdown {
  /* 自定义样式 */
}

.custom-markdown .markdown-body {
  /* 覆盖默认样式 */
}
```

## 文件结构

```
MarkdownEcharts/
├── MarkdownAI.tsx      # 主组件（基于 base.tsx 实现）
├── base.tsx            # 基础代码块组件（参考实现）
├── echarts.tsx         # ECharts 集成示例
├── playground.tsx      # 综合演示平台（包含完整演示、交互测试、使用说明）
└── README.md           # 说明文档
```

## 演示平台

使用 `playground.tsx` 可以体验组件的所有功能：

- **完整演示**: 展示所有功能特性的静态演示
- **交互测试**: 实时编辑和预览 Markdown 内容
- **使用说明**: 详细的使用指南和 API 说明

## 设计理念

MarkdownAI 组件的核心设计理念是：

1. **完全基于 base.tsx**: 保持与原有代码块组件的一致性
2. **渐进式增强**: 在不破坏原有功能的基础上添加新特性
3. **用户体验一致**: 所有交互保持统一的视觉和操作体验
4. **类型安全**: 完整的 TypeScript 支持

## 注意事项

1. 确保安装了所有必要的依赖包
2. HTML 标签支持需要谨慎使用，避免 XSS 攻击
3. 大量内容渲染时注意性能优化
4. 代码块主题切换是独立的，每个代码块都有自己的主题状态

## ECharts 图表功能

### 支持的图表类型

组件会根据容器 ID 自动识别图表类型：

- **折线图**: ID 包含 `line` 或 `1`
- **柱状图**: ID 包含 `bar` 或 `2` 
- **饼图**: ID 包含 `pie` 或 `3`

### 使用方法

```html
<!-- 在 Markdown 中直接使用 HTML 标签 -->
<div id="echarts-container-line-1" style="width: 100%; height: 400px;"></div>
```

### 引用标记功能

支持 `[[数字,'描述']]` 格式的引用标记：

```markdown
这是一段包含引用的文本 [[1,'重要说明']]。
```

点击引用数字会触发事件，可以用于显示详细信息或跳转到相关内容。

## 依赖包

```json
{
  "react": "^18.0.0",
  "react-markdown": "^8.0.0",
  "remark-gfm": "^3.0.0",
  "rehype-raw": "^6.0.0",
  "react-syntax-highlighter": "^15.0.0",
  "react-copy-to-clipboard": "^5.0.0",
  "antd": "^5.0.0",
  "github-markdown-css": "^5.0.0",
  "echarts": "^5.0.0"
}
```