---
date: 2025-10-30 23:26:00
title: README
permalink: /pages/2e4246
categories:
  - example
  - components
  - react
  - ThreeDGlassCardHover
---
# 3D玻璃形态卡片悬停效果组件

基于Vanilla Tilt.js的3D玻璃形态卡片悬停效果React组件，提供现代化的UI交互体验。

## 功能特性

- ✅ 鼠标跟随3D旋转效果
- ✅ 玻璃态半透明质感
- ✅ 实时参数配置
- ✅ 主题切换支持（浅色/深色）
- ✅ 眩光效果
- ✅ 响应式设计
- ✅ 设备倾斜支持

## 安装依赖

```bash
npm install vanilla-tilt
```

## 基本使用

```tsx
import ThreeDGlassCard from './components/react/ThreeDGlassCardHover';

const App = () => {
  const cardData = {
    title: '产品展示',
    description: '这是一个精美的3D玻璃卡片',
    imageUrl: 'https://picsum.photos/300/260'
  };

  return (
    <ThreeDGlassCard
      data={cardData}
      tiltConfig={{
        max: 25,
        speed: 400,
        glare: true,
        scale: 1.1
      }}
      theme="light"
      onCardClick={(card) => console.log('点击卡片:', card.title)}
    />
  );
};
```

## 参数配置

### CardData 接口

```tsx
interface CardData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
}
```

### TiltConfig 接口

```tsx
interface TiltConfig {
  max?: number;        // 最大旋转角度 (默认: 25)
  speed?: number;      // 动画速度 (默认: 400)
  glare?: boolean;     // 启用眩光 (默认: true)
  maxGlare?: number;   // 最大眩光强度 (默认: 1)
  perspective?: number; // 3D透视距离 (默认: 1000)
  scale?: number;      // 悬停缩放 (默认: 1.1)
  reverse?: boolean;   // 反向旋转 (默认: false)
  axis?: 'x' | 'y' | null; // 旋转轴限制 (默认: null)
  reset?: boolean;     // 离开时重置 (默认: true)
}
```

### ThreeDGlassCardProps 接口

```tsx
interface ThreeDGlassCardProps {
  data: CardData;
  tiltConfig?: TiltConfig;
  theme?: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
  onCardClick?: (card: CardData) => void;
  onTiltChange?: (values: any) => void;
}
```

## 高级用法

### 多卡片布局

```tsx
const ProductShowcase = () => {
  const products = [
    { id: '1', title: '产品A', description: '描述', imageUrl: 'image1.jpg' },
    { id: '2', title: '产品B', description: '描述', imageUrl: 'image2.jpg' },
    { id: '3', title: '产品C', description: '描述', imageUrl: 'image3.jpg' }
  ];

  return (
    <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
      {products.map(product => (
        <ThreeDGlassCard
          key={product.id}
          data={product}
          tiltConfig={{ max: 20, speed: 300 }}
          theme="light"
        />
      ))}
    </div>
  );
};
```

### 自定义主题

```tsx
// 自定义深色主题
const darkThemeConfig = {
  background: 'rgba(0, 0, 0, 0.1)',
  glassColor: 'rgba(0, 0, 0, 0.15)',
  borderColor: 'rgba(0, 0, 0, 0.2)',
  textColor: '#fff'
};

<ThreeDGlassCard
  data={cardData}
  theme="dark"
  style={{
    background: darkThemeConfig.background,
    color: darkThemeConfig.textColor
  }}
/>
```

### 动态配置

```tsx
const InteractiveCard = () => {
  const [config, setConfig] = useState({
    max: 25,
    speed: 400,
    glare: true,
    scale: 1.1
  });

  return (
    <div>
      <ThreeDGlassCard
        data={cardData}
        tiltConfig={config}
      />
      
      {/* 控制面板 */}
      <div>
        <input
          type="range"
          min="10"
          max="45"
          value={config.max}
          onChange={(e) => setConfig({...config, max: parseInt(e.target.value)})}
        />
        <span>旋转角度: {config.max}°</span>
      </div>
    </div>
  );
};
```

## 样式定制

组件使用SCSS编写，支持以下CSS变量定制：

```scss
.three-d-glass-card {
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: 10px;
  --card-width: 300px;
  --card-height: 260px;
  --transition-speed: 0.5s;
}
```

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 注意事项

1. 确保页面有足够空间显示3D效果
2. 眩光效果可能在某些设备上性能较差，可选择禁用
3. 建议在支持CSS3D变换的现代浏览器中使用
4. 移动端使用时注意调整max角度值

## 性能优化

- 使用`transform-style: preserve-3d`启用硬件加速
- 合理设置`max`和`speed`参数
- 考虑在移动设备上禁用眩光效果
- 使用`will-change`属性优化关键动画属性

## 故障排除

### 3D效果不显示
- 检查浏览器是否支持CSS3D变换
- 确认Vanilla Tilt.js正确加载
- 验证容器有正确的perspective设置

### 眩光效果异常
- 调整`max-glare`值
- 检查glare元素是否正确创建
- 考虑禁用眩光效果

### 移动端兼容性问题
- 检查Gyroscope权限
- 调整max角度适应小屏幕
- 提供触摸友好的交互