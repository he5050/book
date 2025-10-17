---
date: 2025-10-17 23:26:07
title: README
permalink: /pages/696d18
categories:
  - example
  - components
  - react
  - LocalForageDemo
---
# localForage Demo 组件

## 简介

localForage Demo 是一个用于演示 localForage 功能的 React 组件。它提供了直观的界面来测试 localForage 的各种功能，包括数据存储、读取、删除和配置选项。

## 功能特性

- 数据的增删改查操作
- 支持多种数据类型（字符串、对象、数组等）
- 可配置的存储驱动（IndexedDB、WebSQL、localStorage）
- 实时数据展示
- 响应式设计

## 使用方法

```typescript
import LocalForageDemo from './LocalForageDemo';

// 基础使用
<LocalForageDemo />

// 自定义配置
<LocalForageDemo
  dbName="myAppDB"
  storeName="userData"
  driver="INDEXEDDB"
  width={600}
  height={500}
/>
```

## 参数说明

| 参数      | 类型   | 默认值          | 说明            |
| --------- | ------ | --------------- | --------------- |
| dbName    | string | 'localforage'   | 数据库名称      |
| storeName | string | 'keyvaluepairs' | 存储对象名称    |
| driver    | string | 'auto'          | 存储驱动类型    |
| width     | number | 500             | 组件宽度        |
| height    | number | 400             | 组件高度        |
| className | string | ''              | 自定义 CSS 类名 |

## 驱动类型

- `auto`: 自动检测（默认）
- `INDEXEDDB`: IndexedDB
- `WEBSQL`: WebSQL
- `LOCALSTORAGE`: localStorage

## 注意事项

1. 组件使用了 TypeScript，确保项目支持 TypeScript
2. 需要安装 localforage 依赖包
3. 组件样式使用 SCSS，确保项目支持 SCSS 预处理器
