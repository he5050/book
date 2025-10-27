---
date: 2025-10-27 16:50:53
title: README
permalink: /pages/0f93cf
categories:
  - example
  - components
  - react
  - effects
  - MovieSeatSelection
---
# 电影选座组件

一个基于 Canvas 的电影选座组件，支持多人实时选座，能够区分"我选的座位"和"他人选的座位"。

## 功能特性

- Canvas 绘制座位图，性能优异
- 支持座位选择、取消选择
- 区分"我选的座位"和"他人选的座位"
- 响应式设计，适配不同屏幕尺寸
- 支持高 DPI 屏幕显示
- 确认选座和重置功能

## 使用方法

```jsx
import MovieSeatSelection from './MovieSeatSelection';

const MyComponent = () => {
	const handleSeatSelect = seats => {
		console.log('当前用户选中的座位:', seats);
	};

	return (
		<MovieSeatSelection width={800} height={500} onSeatSelect={handleSeatSelect} userId="user123" />
	);
};
```

## Props 说明

| 属性名       | 类型     | 默认值    | 说明                          |
| ------------ | -------- | --------- | ----------------------------- |
| width        | number   | 600       | 组件宽度                      |
| height       | number   | 400       | 组件高度                      |
| onSeatSelect | function | undefined | 座位选择回调函数              |
| userId       | string   | 随机生成  | 当前用户 ID，用于区分座位归属 |
| className    | string   | ''        | 自定义 CSS 类名               |

## 座位状态说明

- **绿色**：可选座位
- **蓝色**：当前用户选中的座位（显示"我选"）
- **红色**：已售座位（显示"已售"）
- **橙色**：其他用户选中的座位（显示"他选"）
- **浅绿色**：鼠标悬停时的座位

## 技术实现

1. 使用 Canvas 绘制座位图，提高渲染性能
2. 通过 `devicePixelRatio` 适配高 DPI 屏幕
3. 使用 React Hooks 管理组件状态
4. 实现了精确的鼠标点击检测和悬停效果
5. 支持座位状态的实时更新和区分
