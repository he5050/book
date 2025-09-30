<template>
  <div class="flip-motion-advanced-demo" style="width: 500px; margin: 0 auto; padding: 20px">
    <h2>Vue Flip Motion 高级动画示例</h2>

    <!-- 标签页导航 -->
    <div style="display: flex; margin-bottom: 20px; border-bottom: 1px solid #ddd">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :style="{
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: activeTab === tab.id ? '#4a90e2' : 'transparent',
        color: activeTab === tab.id ? 'white' : 'black',
        border: 'none',
        borderRadius: '4px 4px 0 0',
        marginRight: '5px'
      }">
        {{ tab.name }}
      </button>
    </div>

    <!-- 场景1: 网格位移动画 -->
    <div v-show="activeTab === 'grid'" style="margin-bottom: 30px">
      <h3>网格位移动画</h3>
      <p>点击任意项目可将其移动到第一位置</p>

      <div style="margin-bottom: 15px">
        <button @click="shuffleGrid" style="padding: 8px 16px; margin-right: 10px">
          随机排序
        </button>
        <button @click="resetGrid" style="padding: 8px 16px">
          重置
        </button>
      </div>

      <Flip :mutation="gridItems" :animate-option="{ duration: 600, easing: 'ease-in-out' }"
        :styles="['position-x', 'position-y']">
        <div class="grid-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px">
          <div v-for="item in gridItems" :key="item.id" :id="`grid-${item.id}`" :style="{
            padding: '20px',
            backgroundColor: item.color,
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            aspectRatio: '1'
          }" @click="moveToFirst(item)">
            {{ item.name }}
          </div>
        </div>
      </Flip>
    </div>

    <!-- 场景2: 嵌套动画 -->
    <div v-show="activeTab === 'nested'" style="margin-bottom: 30px">
      <h3>嵌套动画</h3>
      <p>外层Flip处理位置变化，内层Flip处理背景色变化</p>

      <div style="margin-bottom: 15px">
        <button @click="shuffleNested" style="padding: 8px 16px; margin-right: 10px">
          重新排列
        </button>
        <button @click="toggleNestedColors" style="padding: 8px 16px">
          切换颜色
        </button>
      </div>

      <Flip :mutation="nestedItems" :animate-option="{ duration: 800, easing: 'ease-in-out' }"
        :styles="['position-x', 'position-y']" selector=".nested-item">
        <div class="nested-container" style="min-height: 300px">
          <div v-for="item in nestedItems" :key="item.id" class="nested-item" :id="`nested-${item.id}`" :style="{
            position: 'relative',
            margin: '10px 0',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }">
            <Flip :mutation="item" :animate-option="{ duration: 500, easing: 'ease-in-out' }"
              :styles="['backgroundColor']">
              <div :style="{
                padding: '15px',
                backgroundColor: item.color,
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'center'
              }" @click="selectNestedItem(item)">
                <h4 style="margin: 0 0 10px 0">{{ item.name }}</h4>
                <p style="margin: 0">点击切换背景色</p>
              </div>
            </Flip>
          </div>
        </div>
      </Flip>
    </div>

    <!-- 场景3: 列表过滤动画 -->
    <div v-show="activeTab === 'filter'" style="margin-bottom: 30px">
      <h3>列表过滤动画</h3>
      <p>输入关键词过滤列表项，观察动画效果</p>

      <div style="margin-bottom: 15px">
        <input v-model="filterText" placeholder="输入关键词过滤..."
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px">
        <button @click="resetFilter" style="padding: 8px 16px">
          重置
        </button>
      </div>

      <Flip :mutation="filteredItems" :animate-option="{ duration: 500, easing: 'ease-in-out' }"
        :styles="['position-x', 'position-y', 'opacity']">
        <div class="filter-container">
          <div v-for="item in filteredItems" :key="item.id" :id="`filter-${item.id}`" :style="{
            padding: '15px',
            margin: '10px 0',
            backgroundColor: item.color,
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1
          }">
            <h4 style="margin: 0 0 5px 0">{{ item.name }}</h4>
            <p style="margin: 0">{{ item.description }}</p>
          </div>
        </div>
      </Flip>
    </div>

    <!-- 场景4: 自定义选择器 -->
    <div v-show="activeTab === 'selector'" style="margin-bottom: 30px">
      <h3>自定义选择器动画</h3>
      <p>使用自定义选择器指定需要动画的元素</p>

      <div style="margin-bottom: 15px">
        <button @click="addItemWithSelector" style="padding: 8px 16px; margin-right: 10px">
          添加项目
        </button>
        <button @click="removeItemWithSelector" style="padding: 8px 16px">
          删除项目
        </button>
      </div>

      <Flip :mutation="selectorItems" :animate-option="{ duration: 600, easing: 'ease-in-out' }"
        :styles="['position-x', 'position-y']" selector=".animated-card">
        <div class="selector-container">
          <div style="display: flex; flex-wrap: wrap; gap: 15px">
            <div v-for="item in selectorItems" :key="item.id" class="card-wrapper"
              :style="{ width: 'calc(50% - 8px)' }">
              <div class="animated-card" :id="`selector-${item.id}`" :style="{
                padding: '20px',
                backgroundColor: item.color,
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                textAlign: 'center'
              }" @click="selectSelectorItem(item)">
                <h4 style="margin: 0 0 10px 0">{{ item.name }}</h4>
                <p style="margin: 0">ID: {{ item.id }}</p>
              </div>
            </div>
          </div>
        </div>
      </Flip>
    </div>

    <!-- 使用说明 -->
    <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 8px">
      <h3>高级使用场景说明</h3>
      <ol>
        <li><strong>网格位移动画</strong>: 展示如何在网格布局中实现元素位置交换动画</li>
        <li><strong>嵌套动画</strong>: 演示多个 Flip 组件嵌套使用，实现复合动画效果</li>
        <li><strong>列表过滤动画</strong>: 展示列表过滤时的元素移入移出动画</li>
        <li><strong>自定义选择器</strong>: 演示如何使用 selector 属性精确控制需要动画的元素</li>
      </ol>

      <h4>FLIP 动画应用场景</h4>
      <ul>
        <li>列表重排和过滤</li>
        <li>网格布局调整</li>
        <li>动态表单字段</li>
        <li>购物车项目管理</li>
        <li>数据可视化元素变换</li>
        <li>用户界面状态切换</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed } from 'vue'
import Flip from './index.vue'

// 标签页状态
const activeTab = ref('grid')
const tabs = ref([
  { id: 'grid', name: '网格动画' },
  { id: 'nested', name: '嵌套动画' },
  { id: 'filter', name: '过滤动画' },
  { id: 'selector', name: '自定义选择器' }
])

// 场景1: 网格位移动画数据
const gridItems = ref([
  { id: 1, name: 'A', color: '#4a90e2' },
  { id: 2, name: 'B', color: '#7b68ee' },
  { id: 3, name: 'C', color: '#50c878' },
  { id: 4, name: 'D', color: '#ff6b6b' },
  { id: 5, name: 'E', color: '#ffa500' },
  { id: 6, name: 'F', color: '#ff69b4' }
])

const shuffleGrid = () => {
  gridItems.value = [...gridItems.value].sort(() => Math.random() - 0.5)
}

const resetGrid = () => {
  gridItems.value = [
    { id: 1, name: 'A', color: '#4a90e2' },
    { id: 2, name: 'B', color: '#7b68ee' },
    { id: 3, name: 'C', color: '#50c878' },
    { id: 4, name: 'D', color: '#ff6b6b' },
    { id: 5, name: 'E', color: '#ffa500' },
    { id: 6, name: 'F', color: '#ff69b4' }
  ]
}

const moveToFirst = (item) => {
  const index = gridItems.value.findIndex(i => i.id === item.id)
  if (index > 0) {
    // 创建新的数组以确保响应式更新
    const newItems = [...gridItems.value]
    const [movedItem] = newItems.splice(index, 1)
    newItems.unshift(movedItem)
    gridItems.value = newItems
  }
}

// 场景2: 嵌套动画数据
const nestedItems = ref([
  { id: 1, name: '项目 1', color: '#4a90e2', description: '这是第一个项目' },
  { id: 2, name: '项目 2', color: '#7b68ee', description: '这是第二个项目' },
  { id: 3, name: '项目 3', color: '#50c878', description: '这是第三个项目' }
])

const shuffleNested = () => {
  nestedItems.value = [...nestedItems.value].sort(() => Math.random() - 0.5)
}

const toggleNestedColors = () => {
  const colors = ['#4a90e2', '#7b68ee', '#50c878', '#ff6b6b', '#ffa500', '#ff69b4', '#20b2aa']

  nestedItems.value = nestedItems.value.map(item => ({
    ...item,
    color: colors[Math.floor(Math.random() * colors.length)]
  }))
}

const selectNestedItem = (item) => {
  const colors = ['#4a90e2', '#7b68ee', '#50c878', '#ff6b6b', '#ffa500', '#ff69b4', '#20b2aa']
  const currentIndex = colors.indexOf(item.color)
  const nextIndex = (currentIndex + 1) % colors.length

  item.color = colors[nextIndex]
}

// 场景3: 列表过滤动画数据
const allItems = ref([
  { id: 1, name: '苹果', description: '一种常见的水果', color: '#ff6b6b' },
  { id: 2, name: '香蕉', description: '热带水果，富含钾元素', color: '#feca57' },
  { id: 3, name: '橙子', description: '富含维生素C的柑橘类水果', color: '#ff9ff3' },
  { id: 4, name: '葡萄', description: '可以酿酒的浆果', color: '#54a0ff' },
  { id: 5, name: '草莓', description: '红色的心形浆果', color: '#5f27cd' },
  { id: 6, name: '西瓜', description: '夏季消暑的大型水果', color: '#00d2d3' },
  { id: 7, name: '菠萝', description: '热带酸甜水果', color: '#ff9f43' },
  { id: 8, name: '芒果', description: '热带香甜水果', color: '#ee5a24' }
])

const filterText = ref('')

const filteredItems = computed(() => {
  if (!filterText.value) return allItems.value
  return allItems.value.filter(item =>
    item.name.includes(filterText.value) ||
    item.description.includes(filterText.value)
  )
})

const resetFilter = () => {
  filterText.value = ''
}

// 场景4: 自定义选择器数据
const selectorItems = ref([
  { id: 1, name: '卡片 1', color: '#4a90e2' },
  { id: 2, name: '卡片 2', color: '#7b68ee' },
  { id: 3, name: '卡片 3', color: '#50c878' },
  { id: 4, name: '卡片 4', color: '#ff6b6b' }
])

const addItemWithSelector = () => {
  const colors = ['#4a90e2', '#7b68ee', '#50c878', '#ff6b6b', '#ffa500', '#ff69b4', '#20b2aa']
  const newId = selectorItems.value.length > 0 ? Math.max(...selectorItems.value.map(item => item.id)) + 1 : 1
  const newColor = colors[Math.floor(Math.random() * colors.length)]

  selectorItems.value.push({
    id: newId,
    name: `卡片 ${newId}`,
    color: newColor
  })
}

const removeItemWithSelector = () => {
  if (selectorItems.value.length > 1) {
    selectorItems.value.pop()
  }
}

const selectSelectorItem = (item) => {
  console.log('选中项目:', item)
}
</script>

<style scoped>
.flip-motion-advanced-demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.grid-container {
  width: 100%;
}

.nested-container {
  width: 100%;
}

.filter-container {
  width: 100%;
}

.selector-container {
  width: 100%;
}
</style>