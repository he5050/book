# 卡片时钟组件

基于掘金文章设计的现代化React时钟组件，支持丰富的配置选项和多种主题。

## 🌟 特性

- ⏰ **实时时间显示** - 精确到秒的实时更新
- 📅 **灵活日期格式** - 支持多种日期显示格式
- 🎯 **自定义日期** - 支持显示指定日期
- 🎨 **多种主题** - 内置浅色、深色、渐变三种主题
- ✨ **动画效果** - 平滑的浮动和悬停动画
- 📱 **响应式设计** - 适配不同屏幕尺寸
- 🔧 **TypeScript支持** - 完整的类型定义

## 📦 安装

```bash
# 复制以下文件到你的项目中
CardClock.tsx          # 主组件
CardClock.css          # 样式文件
CardClockExample.tsx   # 基础使用示例
CardClockDemo.tsx      # 完整演示页面
README.md              # 详细使用文档
```

## 🚀 快速开始

### 基础使用

```tsx
import React from 'react';
import CardClock from './CardClock';
import './CardClock.css';

function App() {
  return (
    <div>
      {/* 基础实时时钟 */}
      <CardClock />
    </div>
  );
}
```

### 查看完整演示

```tsx
import CardClockDemo from './CardClockDemo';

function App() {
  return (
    <div>
      {/* 完整的交互式演示页面 */}
      <CardClockDemo />
    </div>
  );
}
```

演示页面包含：
- 🎯 **基础示例**：三种预设配置的展示
- ⚙️ **高级配置**：自定义日期和主题对比
- 🎛️ **自定义配置**：实时配置面板和代码生成
- 📚 **使用说明**：详细的功能介绍

### 使用示例组件

```tsx
import CardClockExample from './CardClockExample';

function App() {
  return (
    <div>
      {/* 基础示例和配置面板 */}
      <CardClockExample />
    </div>
  );
}
```

### 自定义配置

```tsx
import CardClock from './CardClock';

function MyComponent() {
  return (
    <div>
      {/* 自定义主题和格式 */}
      <CardClock
        title="我的时钟"
        theme="gradient"
        animated={true}
        formatOptions={{
          showFullDate: true,
          showTime: true,
          showWeekday: true,
        }}
      />
      
      {/* 显示特定日期 */}
      <CardClock
        customDate="2024-12-25"
        title="圣诞节"
        theme="dark"
        formatOptions={{
          showFullDate: true,
          showWeekday: true,
          showWeekNumber: true,
        }}
      />
    </div>
  );
}
```

## 📖 API 文档

### CardClockProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `customDate` | `string` | `undefined` | 自定义日期，支持 `yyyy-mm-dd` 或 `YYYY-MM` 格式 |
| `formatOptions` | `DateFormatOptions` | `{ showFullDate: true, showTime: true, showWeekday: true }` | 日期格式配置 |
| `title` | `string` | `"数字时钟"` | 时钟标题 |
| `theme` | `'light' \| 'dark' \| 'gradient'` | `'gradient'` | 主题样式 |
| `animated` | `boolean` | `true` | 是否显示动画效果 |

### DateFormatOptions

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `showFullDate` | `boolean` | `false` | 显示完整日期 (yyyy-mm-dd) |
| `showYearMonth` | `boolean` | `false` | 显示年月 (YYYY-MM) |
| `showTime` | `boolean` | `false` | 显示时分秒 |
| `showWeekday` | `boolean` | `false` | 显示星期几 |
| `showWeekNumber` | `boolean` | `false` | 显示当前周数 |

## 🎨 主题样式

### 内置主题

```tsx
// 浅色主题 - 适合明亮环境
<CardClock theme="light" />

// 深色主题 - 适合暗色环境
<CardClock theme="dark" />

// 渐变主题 - 视觉效果更佳
<CardClock theme="gradient" />
```

### 自定义主题

你可以通过修改 CSS 文件来添加新的主题：

```css
/* 添加霓虹主题 */
.card-clock.neon {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  color: #00ff88;
  border: 1px solid #00ff88;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}
```

## 📅 日期格式示例

### 实时时间显示

```tsx
// 显示当前时间
<CardClock
  formatOptions={{
    showTime: true,
    showWeekday: true,
  }}
/>
```

### 自定义日期显示

```tsx
// 完整日期格式
<CardClock
  customDate="2024-03-15"
  formatOptions={{
    showFullDate: true,
    showWeekday: true,
    showWeekNumber: true,
  }}
/>

// 年月格式
<CardClock
  customDate="2024-03"
  formatOptions={{
    showYearMonth: true,
    showWeekNumber: true,
  }}
/>
```

### 完整信息显示

```tsx
// 显示所有可用信息
<CardClock
  formatOptions={{
    showFullDate: true,
    showYearMonth: true,
    showTime: true,
    showWeekday: true,
    showWeekNumber: true,
  }}
/>
```

## 🎯 使用场景

- **仪表板界面** - 作为时间显示组件
- **管理后台** - 系统时间展示
- **移动应用** - 时钟小部件
- **网站首页** - 装饰性时间显示
- **个人博客** - 侧边栏时钟组件
- **日程管理** - 当前时间提醒
- **游戏界面** - 游戏内时钟显示

## 🔧 高级配置

### 性能优化

```tsx
import React from 'react';

// 使用 React.memo 优化渲染性能
const MemoizedCardClock = React.memo(CardClock, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
```

### 国际化支持

```tsx
// 自定义星期几显示
const getLocalizedWeekday = (date: Date, locale: string = 'zh-CN'): string => {
  return date.toLocaleDateString(locale, { weekday: 'long' });
};
```

### 自定义格式化

```tsx
// 扩展日期格式化函数
const formatDate = (date: Date, format: string): string => {
  // ... 现有格式化逻辑
  
  // 添加新的格式
  switch (format) {
    case 'custom-format':
      return `自定义格式: ${year}年${month}月${day}日`;
    // ... 其他格式
  }
};
```

## 📱 响应式设计

组件内置了响应式设计，在不同屏幕尺寸下自动适配：

```css
/* 移动端适配 */
@media (max-width: 480px) {
  .card-clock {
    width: 100%;
    max-width: 300px;
    padding: 20px;
  }
  
  .date-value {
    font-size: 14px;
  }
  
  .time-value {
    font-size: 18px;
  }
}
```

## 🐛 常见问题

### Q: 如何修改时钟的更新频率？

A: 组件默认每秒更新一次。如需修改，可以调整 `setInterval` 的间隔：

```tsx
// 在 CardClock.tsx 中修改
const interval = setInterval(updateTime, 500); // 500ms 更新一次
```

### Q: 如何添加新的日期格式？

A: 在 `formatDate` 函数中添加新的 case：

```tsx
case 'new-format':
  return `新格式: ${year}-${month}-${day}`;
```

### Q: 如何禁用动画效果？

A: 设置 `animated` 属性为 `false`：

```tsx
<CardClock animated={false} />
```

## 🌐 浏览器兼容性

- Chrome 36+
- Firefox 16+
- Safari 9+
- Edge 12+
- IE 10+

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📚 相关资源

- [原文链接 - 掘金文章](https://juejin.cn/post/7470971173879906358)
- [React Hooks 官方文档](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript 接口定义](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [CSS 动画教程](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

## 📝 更新日志

### v1.0.0 (2024-03-26)
- 🎉 初始版本发布
- ✨ 支持实时时间显示
- 🎨 内置三种主题
- 📅 基础日期格式配置

### v1.1.0 (2024-03-26)
- ✨ 添加自定义日期支持
- 🔧 完善 TypeScript 类型定义
- 📱 优化响应式设计
- 🎯 新增多种日期格式选项

### v1.2.0 (2024-03-26)
- ✨ 添加周数显示功能
- 🎨 优化动画效果
- 📖 完善文档和示例
- 🐛 修复已知问题