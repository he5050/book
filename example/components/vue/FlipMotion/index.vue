<template>
	<div class="flip-motion-container">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, onUpdated, onBeforeUnmount, nextTick, watch } from 'vue'

// 定义组件 props
const props = defineProps({
	mutation: {
		type: [Array, Object, Number, String, Boolean],
		required: true
	},
	selector: {
		type: String,
		default: null
	},
	styles: {
		type: Array,
		default: () => ['position-x', 'position-y', 'width', 'height']
	},
	animateOption: {
		type: Object,
		default: () => ({})
	}
})

// 定义事件
const emit = defineEmits(['finish'])

// 状态管理
const firstPositions = ref(new Map())
const containerRef = ref(null)
let observer = null

// 获取动画元素
const getAnimateElements = () => {
	if (!containerRef.value) return []

	if (props.selector) {
		return Array.from(containerRef.value.querySelectorAll(props.selector))
	} else {
		// 默认选择直接子元素
		return Array.from(containerRef.value.children)
	}
}

// 获取元素位置信息
const getElementPosition = (el) => {
	const rect = el.getBoundingClientRect()
	const styles = window.getComputedStyle(el)

	return {
		x: rect.left,
		y: rect.top,
		width: rect.width,
		height: rect.height,
		// 获取指定的样式属性
		...(props.styles.includes('backgroundColor') && { backgroundColor: styles.backgroundColor }),
		...(props.styles.includes('color') && { color: styles.color }),
		...(props.styles.includes('opacity') && { opacity: styles.opacity }),
		...(props.styles.includes('transform') && { transform: styles.transform }),
		...(props.styles.includes('borderRadius') && { borderRadius: styles.borderRadius })
	}
}

// 记录初始位置
const recordFirst = () => {
	const elements = getAnimateElements()
	firstPositions.value.clear()

	elements.forEach(el => {
		const selector = el.dataset.flipSelector || el.id
		if (selector) {
			firstPositions.value.set(selector, getElementPosition(el))
		} else {
			// 使用索引作为 key
			firstPositions.value.set(elements.indexOf(el), getElementPosition(el))
		}
	})
}

// 执行动画
const playAnimation = async () => {
	await nextTick()

	const elements = getAnimateElements()

	elements.forEach(el => {
		const selector = el.dataset.flipSelector || el.id || elements.indexOf(el)
		const firstPos = firstPositions.value.get(selector)

		if (!firstPos) return

		const lastPos = getElementPosition(el)

		// 计算差值
		const deltaX = firstPos.x - lastPos.x
		const deltaY = firstPos.y - lastPos.y
		const deltaW = firstPos.width / lastPos.width
		const deltaH = firstPos.height / lastPos.height

		// 应用反向变换
		let invertStyles = ''

		if (props.styles.includes('position-x') && deltaX !== 0) {
			invertStyles += ` translateX(${deltaX}px)`
		}

		if (props.styles.includes('position-y') && deltaY !== 0) {
			invertStyles += ` translateY(${deltaY}px)`
		}

		if (props.styles.includes('width') && deltaW !== 1) {
			invertStyles += ` scaleX(${deltaW})`
		}

		if (props.styles.includes('height') && deltaH !== 1) {
			invertStyles += ` scaleY(${deltaH})`
		}

		// 应用背景色变化
		if (props.styles.includes('backgroundColor') && firstPos.backgroundColor !== lastPos.backgroundColor) {
			el.style.backgroundColor = firstPos.backgroundColor
		}

		// 应用其他样式变化
		if (props.styles.includes('color') && firstPos.color !== lastPos.color) {
			el.style.color = firstPos.color
		}

		if (props.styles.includes('opacity') && firstPos.opacity !== lastPos.opacity) {
			el.style.opacity = firstPos.opacity
		}

		if (props.styles.includes('borderRadius') && firstPos.borderRadius !== lastPos.borderRadius) {
			el.style.borderRadius = firstPos.borderRadius
		}

		if (invertStyles) {
			el.style.transform = invertStyles
		}

		// 强制重绘
		el.offsetHeight

		// 播放动画
		const animation = el.animate([
			{
				transform: invertStyles,
				...(props.styles.includes('backgroundColor') && { backgroundColor: firstPos.backgroundColor }),
				...(props.styles.includes('color') && { color: firstPos.color }),
				...(props.styles.includes('opacity') && { opacity: firstPos.opacity }),
				...(props.styles.includes('borderRadius') && { borderRadius: firstPos.borderRadius })
			},
			{
				transform: 'none',
				...(props.styles.includes('backgroundColor') && { backgroundColor: lastPos.backgroundColor }),
				...(props.styles.includes('color') && { color: lastPos.color }),
				...(props.styles.includes('opacity') && { opacity: lastPos.opacity }),
				...(props.styles.includes('borderRadius') && { borderRadius: lastPos.borderRadius })
			}
		], {
			duration: 200,
			easing: 'ease-in-out',
			...props.animateOption
		})

		animation.onfinish = () => {
			// 清理样式
			el.style.transform = ''
			emit('finish', el)
		}
	})
}

// 监听 mutation 变化
watch(() => props.mutation, () => {
	recordFirst()
	nextTick(() => {
		playAnimation()
	})
}, { deep: true })

// 生命周期钩子
onMounted(() => {
	containerRef.value = document.querySelector('.flip-motion-container')

	// 初始化记录位置
	recordFirst()
})

onUpdated(() => {
	// 组件更新后执行动画
	playAnimation()
})

onBeforeUnmount(() => {
	if (observer) {
		observer.disconnect()
	}
})

// 暴露方法给父组件
defineExpose({
	recordFirst,
	playAnimation
})
</script>

<style scoped lang="scss">
.flip-motion-container {
	width: 100%;
}
</style>