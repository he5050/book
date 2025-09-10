<template>
	<div style="padding: 20px">
		<h2>不固定高度 div 过渡效果示例 (Vue 版本)</h2>

		<div style="margin-bottom: 20px">
			<button @click="toggleContent" style="margin-right: 10px">
				{{ showContent ? '收起内容' : '展开内容' }}
			</button>
			<button @click="handleExpand" style="margin-right: 10px">展开</button>
			<button @click="handleContract" style="margin-right: 10px">收起</button>
			<button @click="handleToggle">切换</button>
		</div>

		<SizeTransition ref="sizeTransitionRef" :min-height="0" :init-state="showContent">
			<div style="padding: 20px; background-color: #f0f0f0; border-radius: 4px">
				<h3>这是可变高度的内容区域</h3>
				<p>这段内容的高度是不固定的，会根据内容的多少自动调整。</p>
				<div v-if="showContent">
					<p>当我们点击按钮时，这个区域会有一个平滑的高度过渡动画效果。</p>
					<p>这比直接显示/隐藏要友好得多，提升了用户体验。</p>
					<ul>
						<li>列表项 1</li>
						<li>列表项 2</li>
						<li>列表项 3</li>
						<li>列表项 4</li>
						<li>列表项 5</li>
					</ul>
					<p>
						通过使用 ResizeObserver API，我们可以监听元素尺寸的变化，从而实现流畅的过渡动画。
					</p>
				</div>
			</div>
		</SizeTransition>
	</div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import SizeTransition from './index.vue'

const showContent = ref(true)
const sizeTransitionRef = ref(null)

const toggleContent = () => {
	showContent.value = !showContent.value
}

const handleExpand = () => {
	sizeTransitionRef.value?.expand()
}

const handleContract = () => {
	sizeTransitionRef.value?.contract()
}

const handleToggle = () => {
	sizeTransitionRef.value?.toggle()
}
</script>