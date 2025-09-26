# 卡片时钟演示页面使用指南

## 📖 概述

`CardClockDemo.tsx` 是一个完整的交互式演示页面，展示了现代卡片时钟组件的所有功能和配置选项。

## 🎯 演示页面特性

### 1. 三个主要标签页

#### 📊 基础示例
- **简洁时钟**：仅显示时间，适合空间有限的场景
- **标准时钟**：显示日期、时间和星期，常用配置
- **完整信息时钟**：显示所有可用信息，功能最全

#### ⚙️ 高级配置
- **自定义日期示例**：展示特定日期显示（如圣诞节）
- **年月格式示例**：仅显示年月信息
- **主题对比**：不同主题的视觉效果对比

#### 🎛️ 自定义配置
- **实时配置面板**：可视化配置所有选项
- **实时预览**：配置修改即时生效
- **代码生成**：自动生成对应的JSX代码

### 2. 交互式配置面板

#### 📅 日期格式配置
```tsx
// 可配置的选项
{
  showFullDate: boolean,    // 显示完整日期 (yyyy-mm-dd)
  showYearMonth: boolean,   // 显示年月 (YYYY-MM)
  showTime: boolean,        // 显示时分秒
  showWeekday: boolean,     // 显示星期几
  showWeekNumber: boolean,  // 显示当前周数
}
```

#### 🗓️ 自定义日期输入
- 支持 `yyyy-mm-dd` 格式（如：2024-12-25）
- 支持 `YYYY-MM` 格式（如：2024-03）
- 留空则显示实时时间

#### 🎨 主题选择
- **浅色主题**：适合明亮环境
- **深色主题**：适合暗色环境
- **渐变主题**：视觉效果最佳

### 3. 代码生成功能

演示页面会根据当前配置自动生成对应的JSX代码：

```tsx
<CardClock
  customDate="2024-12-25"  // 如果设置了自定义日期
  theme="gradient"
  title="自定义配置时钟"
  animated={true}
  formatOptions={{
    showFullDate: true,
    showTime: true,
    showWeekday: true,
  }}
/>
```

## 🚀 使用方法

### 1. 直接使用演示页面

```tsx
import React from 'react';
import CardClockDemo from './CardClockDemo';

function App() {
  return (
    <div className="App">
      <CardClockDemo />
    </div>
  );
}

export default App;
```

### 2. 嵌入到现有页面

```tsx
import React from 'react';
import CardClockDemo from './CardClockDemo';

function MyPage() {
  return (
    <div>
      <h1>我的应用</h1>
      
      {/* 嵌入演示页面 */}
      <section>
        <CardClockDemo />
      </section>
      
      <footer>其他内容</footer>
    </div>
  );
}
```

### 3. 自定义演示页面样式

```tsx
import CardClockDemo from './CardClockDemo';

function CustomDemo() {
  return (
    <div style={{ 
      background: '#f0f2f5',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <CardClockDemo />
    </div>
  );
}
```

## 🎨 样式定制

演示页面使用内联样式，可以通过以下方式自定义：

### 1. 覆盖容器样式

```css
/* 自定义演示页面容器 */
.demo-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 2. 修改配置面板样式

```css
/* 自定义配置面板 */
.config-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 📱 响应式设计

演示页面已经内置了响应式设计：

- **桌面端**：完整的三列布局
- **平板端**：自适应的两列布局
- **移动端**：单列垂直布局

## 🔧 高级定制

### 1. 添加新的预设配置

```tsx
const customPresets = {
  ...presetConfigs,
  birthday: {
    formatOptions: { 
      showFullDate: true, 
      showWeekday: true 
    },
    theme: 'gradient' as const,
    title: '生日时钟'
  }
};
```

### 2. 扩展配置选项

```tsx
// 添加新的格式选项
const [extendedOptions, setExtendedOptions] = useState({
  ...formatOptions,
  showTimezone: false,
  show24Hour: true,
});
```

### 3. 自定义主题

```tsx
// 添加新主题选项
const themes = ['light', 'dark', 'gradient', 'neon', 'minimal'] as const;
```

## 🐛 常见问题

### Q: 如何修改演示页面的默认配置？

A: 修改 `CardClockDemo.tsx` 中的初始状态：

```tsx
const [formatOptions, setFormatOptions] = useState<DateFormatOptions>({
  showFullDate: true,    // 修改默认值
  showTime: true,
  showWeekday: false,    // 修改默认值
  // ...
});
```

### Q: 如何添加新的示例？

A: 在 `presetConfigs` 对象中添加新配置：

```tsx
const presetConfigs = {
  // 现有配置...
  newExample: {
    formatOptions: { /* 配置选项 */ },
    theme: 'light' as const,
    title: '新示例'
  }
};
```

### Q: 如何禁用某些功能？

A: 通过条件渲染控制功能显示：

```tsx
{/* 条件渲染配置面板 */}
{showConfigPanel && (
  <div className="config-panel">
    {/* 配置内容 */}
  </div>
)}
```

## 📚 相关文件

- `CardClock.tsx` - 主组件实现
- `CardClock.css` - 组件样式
- `CardClockExample.tsx` - 基础示例
- `README.md` - 详细使用文档

## 🎯 最佳实践

1. **性能优化**：大量组件时使用 `React.memo`
2. **用户体验**：提供加载状态和错误处理
3. **可访问性**：添加适当的 ARIA 标签
4. **测试**：为关键功能编写单元测试

## 📝 更新日志

- **v1.0.0** - 初始演示页面
- **v1.1.0** - 添加代码生成功能
- **v1.2.0** - 优化响应式设计
- **v1.3.0** - 增强交互体验