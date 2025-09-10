---
date: 2025-09-10 19:26:40
title: README
permalink: /pages/7cc0c2
categories:
  - example
  - components
  - vue
  - SizeTransition
---
# SizeTransition 组件 (Vue 版本)

## 简介

SizeTransition 是一个用于实现不固定高度 div 过渡效果的 Vue 组件。它使用 ResizeObserver API 监听元素尺寸变化，并通过 CSS transition 属性实现平滑的高度过渡动画。

## 功能特性

- 🌟 平滑的高度过渡动画
- 📏 自动监听内容区域尺寸变化
- ⚙️ 支持初始状态和最小高度设置
- 🎯 提供展开、收起、切换方法
- 📱 响应式设计，适配不同屏幕尺寸

## 使用方法

### 基本使用

```vue
<template>
	<SizeTransition>
		<div>可变高度的内容</div>
	</SizeTransition>
</template>

<script setup>
import SizeTransition from './SizeTransition/index.vue';
</script>
```

### 高级使用

```vue
<template>
	<SizeTransition ref="sizeTransitionRef" :min-height="20" :init-state="false">
		<div>可变高度的内容</div>
	</SizeTransition>

	<button @click="expand">展开</button>
	<button @click="contract">收起</button>
	<button @click="toggle">切换</button>
</template>

<script setup>
import { ref } from 'vue';
import SizeTransition from './SizeTransition/index.vue';

const sizeTransitionRef = ref(null);

const expand = () => {
	sizeTransitionRef.value.expand();
};

const contract = () => {
	sizeTransitionRef.value.contract();
};

const toggle = () => {
	sizeTransitionRef.value.toggle();
};
</script>
```

## Props

| 属性名    | 类型    | 默认值 | 说明                                |
| --------- | ------- | ------ | ----------------------------------- |
| minHeight | Number  | 0      | 收起时的最小高度                    |
| initState | Boolean | true   | 初始状态，true 为展开，false 为收起 |

## 方法

通过 ref 可以调用组件的以下方法：

- `expand()`: 展开内容
- `contract()`: 收起内容
- `toggle()`: 切换展开/收起状态

## 浏览器兼容性

ResizeObserver API 在以下浏览器版本中得到支持：

- Chrome 64+
- Firefox 69+
- Safari 13.1+
- Edge 79+

对于不支持的浏览器，可以安装并使用 polyfill：

```bash
npm install @juggle/resize-observer
```

然后在项目的入口文件中添加：

```javascript
// 在 ResizeObserver 使用之前添加
if (!window.ResizeObserver) {
	window.ResizeObserver = require('@juggle/resize-observer').ResizeObserver;
}
```

或者使用动态导入：

```javascript
if (!window.ResizeObserver) {
	const { ResizeObserver } = await import('@juggle/resize-observer');
	window.ResizeObserver = ResizeObserver;
}
```
