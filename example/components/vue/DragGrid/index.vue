<template>
	<div class="drag-grid-app">
		<!-- 侧边栏组件 -->
		<SideBar @update-grid-params="handleGridParamsUpdate" />
		
		<!-- 主网格系统组件 -->
		<GridSystem 
			ref="gridSystemRef"
			:initial-cell-size="props.cellSize"
			:initial-columns="props.columns"
			:initial-rows="props.rows"
		/>
	</div>
</template>

<script setup lang="ts">
/**
 * DragGrid 组件入口
 * 
 * 这是一个可拖拽网格系统的入口组件，提供了以下功能：
 * - 从侧边栏拖动元素到网格中
 * - 在网格内拖动元素交换位置
 * - 保存、加载和分享布局
 * - 随机排列和排序元素
 * - 可配置的网格尺寸和单元格大小
 */

// 导入组件
import GridSystem from './GridSystem.vue';
import SideBar from './SideBar.vue';
import { ref } from 'vue';

// 创建对GridSystem组件的引用
const gridSystemRef = ref(null);

// 处理网格参数更新
const handleGridParamsUpdate = (columns: number, rows: number, cellSize: number) => {
  if (gridSystemRef.value) {
    // 调用GridSystem组件的handleGridParamsUpdate方法
    gridSystemRef.value.handleGridParamsUpdate(columns, rows, cellSize);
  }
};

// 定义组件配置类型
type DragGridConfig = {
  // 是否启用自动保存功能
  enableAutoSave: boolean;
  // 自动保存间隔（毫秒）
  autoSaveInterval: number;
};

// 定义组件props
interface Props {
  // 单元格大小（像素）
  cellSize?: number;
  // 网格列数
  columns?: number;
  // 网格行数
  rows?: number;
  // 组件配置
  config?: DragGridConfig;
}

// 定义props，设置默认值
const props = withDefaults(defineProps<Props>(), {
  cellSize: 100,
  columns: 7,
  rows: 6,
  config: () => ({
    enableAutoSave: false,
    autoSaveInterval: 60000, // 1分钟
  })
});
</script>

<style>
/**
 * DragGrid 组件样式
 * 
 * 包含基础样式和响应式设计
 * 使用CSS变量以便于主题定制
 */

/* CSS变量定义 */
:root {
  /* 颜色变量 */
  --primary-color: #646cff;
  --primary-hover-color: #535bf2;
  --text-color: #213547;
  --background-color: #ffffff;
  --button-bg-color: #f9f9f9;
  --button-dark-bg-color: #1a1a1a;
  
  /* 尺寸变量 */
  --grid-cell-size: 100px;
  --grid-gap: 8px;
  --border-radius: 8px;
  
  /* 过渡效果 */
  --transition-speed: 0.25s;
}

/* 暗色模式变量 */
@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #ffffff;
    --background-color: #242424;
    --button-bg-color: #1a1a1a;
  }
}

/* 链接样式 */
a {
	font-weight: 500;
	color: var(--primary-color);
	text-decoration: inherit;
	transition: color var(--transition-speed);
}

a:hover {
	color: var(--primary-hover-color);
}

/* 基础布局 */
body {
	margin: 0;
	display: flex;
	place-items: center;
	min-width: 320px;
	min-height: 100vh;
	color: var(--text-color);
	background-color: var(--background-color);
	transition: color 0.3s, background-color 0.3s;
}

/* 标题样式 */
h1 {
	font-size: 3.2em;
	line-height: 1.1;
}

/* 按钮样式 */
button {
	border-radius: var(--border-radius);
	border: 1px solid transparent;
	padding: 0.6em 1.2em;
	font-size: 1em;
	font-weight: 500;
	font-family: inherit;
	background-color: var(--button-bg-color);
	cursor: pointer;
	transition: border-color var(--transition-speed);
}

button:hover {
	border-color: var(--primary-color);
}

button:focus,
button:focus-visible {
	outline: 4px auto -webkit-focus-ring-color;
}

/* 卡片样式 */
.card {
	padding: 2em;
}

/* 应用容器样式 */
.drag-grid-app {
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.drag-grid-app {
		padding: 0.5rem;
	}
	
	:root {
		--grid-cell-size: 80px; /* 小屏幕上减小网格单元格尺寸 */
	}
}

@media (max-width: 480px) {
	:root {
		--grid-cell-size: 60px; /* 更小屏幕上进一步减小网格单元格尺寸 */
	}
	
	button {
		padding: 0.4em 0.8em; /* 更小的按钮 */
		font-size: 0.9em;
	}
}
</style>