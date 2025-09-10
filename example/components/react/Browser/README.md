---
date: 2025-08-25 22:16:47
title: README
permalink: /pages/64bd25
categories:
  - example
  - components
  - react
  - Browser
---
# 浏览器信息统计组件

基于掘金文章《JS获取用户访问网页的浏览器、IP、地址等信息 实现访问统计》实现的React组件库。

## 功能特性

- 🌐 **浏览器信息检测**：获取浏览器类型、版本、操作系统等信息
- 🌍 **IP地址获取**：支持获取本地IP和公网IP地址
- 📍 **地理位置定位**：基于IP地址获取用户地理位置信息
- 💾 **智能缓存**：位置信息自动缓存1小时，减少API请求
- 🔄 **手动刷新**：支持手动刷新IP和位置信息
- 🎨 **美观界面**：使用Tailwind CSS构建的现代化界面

## 组件结构

```
Browser/
├── hooks/
│   ├── useBrowserInfo.ts    # 浏览器信息Hook
│   ├── useIPAddress.ts      # IP地址获取Hook
│   ├── useLocation.ts       # 位置信息Hook
│   └── index.ts            # 统一导出
├── index.tsx               # 主要演示组件
└── README.md              # 说明文档
```

## 使用方法

### 1. 完整演示组件

```tsx
import BrowserInfoDemo from './Browser';

function App() {
  return <BrowserInfoDemo />;
}
```

### 2. 单独使用Hooks

```tsx
import { useBrowserInfo, useIPAddress, useLocation } from './Browser/hooks';

function MyComponent() {
  const { browserInfo, loading: browserLoading } = useBrowserInfo();
  const { ipInfo, loading: ipLoading, refresh: refreshIP } = useIPAddress();
  const { locationInfo, loading: locationLoading, refresh: refreshLocation } = useLocation();

  return (
    <div>
      <h2>浏览器: {browserInfo?.browserName}</h2>
      <h2>公网IP: {ipInfo.publicIP}</h2>
      <h2>城市: {locationInfo?.city}</h2>
    </div>
  );
}
```

## API 文档

### useBrowserInfo

获取浏览器和设备信息。

**返回值：**
```typescript
{
  browserInfo: BrowserInfo | null;
  loading: boolean;
}
```

**BrowserInfo 接口：**
```typescript
interface BrowserInfo {
  browserName: string;      // 浏览器名称
  browserVersion: string;   // 浏览器版本
  osName: string;          // 操作系统名称
  osVersion: string;       // 操作系统版本
  deviceName: string;      // 设备名称（Android设备）
  userAgent: string;       // 完整的User Agent字符串
}
```

### useIPAddress

获取IP地址信息。

**返回值：**
```typescript
{
  ipInfo: IPInfo;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
```

**IPInfo 接口：**
```typescript
interface IPInfo {
  localIPs: string[];      // 本地IP地址列表
  publicIP?: string;       // 公网IP地址
}
```

### useLocation

获取地理位置信息。

**返回值：**
```typescript
{
  locationInfo: LocationInfo | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearCache: () => void;
}
```

**LocationInfo 接口：**
```typescript
interface LocationInfo {
  ip?: string;           // IP地址
  city?: string;         // 城市
  region?: string;       // 地区/省份
  country?: string;      // 国家代码
  country_name?: string; // 国家名称
  postal?: string;       // 邮政编码
  latitude?: number;     // 纬度
  longitude?: number;    // 经度
  timezone?: string;     // 时区
  currency?: string;     // 货币
  languages?: string;    // 语言
  org?: string;         // ISP组织
  asn?: string;         // ASN号码
}
```

## 技术实现

### 浏览器信息检测
- 使用 `navigator.userAgent` 解析浏览器信息
- 支持主流浏览器：Chrome、Firefox、Safari、Edge、IE、360、QQ浏览器
- 支持主流操作系统：Windows、macOS、iOS、Android

### IP地址获取
- **本地IP**：通过WebRTC的ICE候选获取
- **公网IP**：使用多个第三方API服务，确保高可用性
  - ipify.org
  - ipapi.co
  - httpbin.org

### 地理位置定位
- 使用多个地理位置API服务
  - ipapi.co
  - ip-api.com
  - ipinfo.io
- 自动缓存机制，减少API调用
- 支持手动刷新和清除缓存

## 注意事项

1. **隐私保护**：所有信息仅在客户端获取，不会上传到服务器
2. **网络依赖**：IP和位置信息需要网络连接
3. **API限制**：第三方API可能有调用频率限制
4. **浏览器兼容性**：WebRTC功能需要现代浏览器支持
5. **HTTPS要求**：某些功能在HTTPS环境下工作更稳定

## 样式依赖

组件使用了Tailwind CSS类名，请确保项目中已安装并配置Tailwind CSS：

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 许可证

MIT License