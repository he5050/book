<template>
	<div class="flip-motion-demo" style="width: 500px; margin: 0 auto; padding: 20px">
		<h2>Vue Flip Motion 动画示例</h2>

		<div style="margin-bottom: 20px">
			<button @click="shuffleList" style="margin-right: 10px; padding: 8px 16px">
				随机排序
			</button>
			<button @click="addItem" style="margin-right: 10px; padding: 8px 16px">
				添加项目
			</button>
			<button @click="removeItem" style="margin-right: 10px; padding: 8px 16px">
				删除项目
			</button>
			<button @click="toggleColor" style="padding: 8px 16px">
				切换颜色
			</button>
		</div>

		<div style="margin-bottom: 20px">
			<label style="display: block; margin-bottom: 10px">
				动画时长: {{ animateOption.duration }}ms
				<input
					type="range"
					min="100"
					max="2000"
					:value="animateOption.duration"
					@input="updateDuration"
					style="width: 100%; margin-top: 5px"
				>
			</label>

			<label style="display: block; margin-bottom: 10px">
				缓动函数:
				<select v-model="animateOption.easing" style="margin-left: 10px; padding: 4px">
					<option value="ease-in-out">ease-in-out</option>
					<option value="ease">ease</option>
					<option value="ease-in">ease-in</option>
					<option value="ease-out">ease-out</option>
					<option value="linear">linear</option>
				</select>
			</label>
		</div>

		<Flip
			:mutation="list"
			:animate-option="animateOption"
			:styles="['position-x', 'position-y', 'backgroundColor']"
			@finish="onAnimationFinish"
		>
			<div
				v-for="item in list"
				:key="item.id"
				:id="`item-${item.id}`"
				:style="{
					padding: '20px',
					margin: '10px',
					backgroundColor: item.color,
					color: 'white',
					borderRadius: '8px',
					cursor: 'pointer',
					textAlign: 'center',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
				}"
				@click="selectItem(item)"
			>
				<h3 style="margin: 0 0 10px 0">{{ item.name }}</h3>
				<p style="margin: 0">ID: {{ item.id }}</p>
			</div>
		</Flip>

		<div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 8px">
			<h3>说明</h3>
			<p>这是一个使用 Vue Flip Motion 实现的列表重排动画示例。</p>
			<ul>
				<li>点击"随机排序"按钮可以打乱列表顺序，观察 FLIP 动画效果</li>
				<li>点击"添加项目"和"删除项目"按钮可以动态修改列表</li>
				<li>点击"切换颜色"按钮可以改变项目背景色</li>
				<li>通过滑块和下拉框可以实时调整动画参数</li>
			</ul>

			<h4>FLIP 动画原理</h4>
			<ol>
				<li><strong>First</strong>: 记录元素动画前的位置</li>
				<li><strong>Last</strong>: 记录元素动画后的位置</li>
				<li><strong>Invert</strong>: 计算位置差值并应用反向变换</li>
				<li><strong>Play</strong>: 移除反向变换，播放动画到最终位置</li>
			</ol>
		</div>
	</div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive } from 'vue'
import Flip from './index.vue'

// 数据状态
const list = ref([
	{ id: 1, name: '项目 A', color: '#4a90e2' },
	{ id: 2, name: '项目 B', color: '#7b68ee' },
	{ id: 3, name: '项目 C', color: '#50c878' },
	{ id: 4, name: '项目 D', color: '#ff6b6b' },
	{ id: 5, name: '项目 E', color: '#ffa500' }
])

const animateOption = reactive({
	duration: 500,
	easing: 'ease-in-out'
})

const selectedItem = ref(null)

// 方法
const shuffleList = () => {
	// 打乱列表顺序
	list.value = [...list.value].sort(() => Math.random() - 0.5)
}

const addItem = () => {
	const colors = ['#4a90e2', '#7b68ee', '#50c878', '#ff6b6b', '#ffa500', '#ff69b4', '#20b2aa']
	const newId = list.value.length > 0 ? Math.max(...list.value.map(item => item.id)) + 1 : 1
	const newColor = colors[Math.floor(Math.random() * colors.length)]

	list.value.push({
		id: newId,
		name: `项目 ${String.fromCharCode(65 + newId - 1)}`,
		color: newColor
	})
}

const removeItem = () => {
	if (list.value.length > 1) {
		// 随机删除一个项目
		const index = Math.floor(Math.random() * list.value.length)
		list.value.splice(index, 1)
	}
}

const toggleColor = () => {
	const colors = ['#4a90e2', '#7b68ee', '#50c878', '#ff6b6b', '#ffa500', '#ff69b4', '#20b2aa']

	list.value = list.value.map(item => ({
		...item,
		color: colors[Math.floor(Math.random() * colors.length)]
	}))
}

const selectItem = (item) => {
	selectedItem.value = item
}

const updateDuration = (event) => {
	animateOption.duration = parseInt(event.target.value)
}

const onAnimationFinish = (element) => {
	console.log('动画完成:', element)
}
</script>

<style scoped>
.flip-motion-demo {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>