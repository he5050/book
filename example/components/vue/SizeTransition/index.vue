<template>
	<div class="size-transition" :style="{ height }">
		<div :id="id" ref="contentRef">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

// 生成 UUID 的函数
const generateUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

const props = defineProps({
	minHeight: {
		type: Number,
		default: 0
	},
	initState: {
		type: Boolean,
		default: true
	}
})

const id = ref<string>(generateUUID())
const contentRef = ref<HTMLElement | null>(null)
const state = ref<boolean>(props.initState)
const height = ref<undefined | string>(undefined)
let observer: ResizeObserver | null = null

// 初始化尺寸观察
const initResizeObserver = (): void => {
	if (!contentRef.value) return

	observer = new ResizeObserver(entries => {
		for (const entry of entries) {
			const newHeight = entry.contentRect.height
			// 当处于展开状态时同步高度
			if (state.value) {
				height.value = `${newHeight + 3}px`
			}
		}
	})

	observer.observe(contentRef.value)
}

// 折叠方法
const contract = (): void => {
	if (!contentRef.value) return
	height.value = `${contentRef.value.offsetHeight}px`
	requestAnimationFrame(() => {
		height.value = `${props.minHeight}px`
		state.value = false
	})
}

// 展开方法
const expand = (): void => {
	if (!contentRef.value) return
	height.value = '0px'
	requestAnimationFrame(() => {
		height.value = `${contentRef.value!.offsetHeight + 3}px`
		state.value = true
	})
}

// 切换方法
const toggle = (): void => {
	state.value ? contract() : expand()
}

// 监听 initState 变化
watch(
	() => props.initState,
	newValue => {
		if (newValue) {
			expand()
		} else {
			contract()
		}
	}
)

// 生命周期
onMounted(() => {
	props.initState ? expand() : contract()
	initResizeObserver()
})

onBeforeUnmount(() => {
	observer?.disconnect()
})

// 暴露方法给父组件
defineExpose({
	contract,
	expand,
	toggle
})
</script>

<style scoped lang="scss">
.size-transition {
	width: 100%;
	overflow: hidden;
	transition: height 0.3s ease-in-out;
	will-change: height; // 启用硬件加速
}
</style>