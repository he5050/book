<template>
    <div class="sidebar">
      <h3 style="text-align: center; white-space: nowrap">拖放网格系统</h3>
  
      <div class="color-palette">
        <div
          v-for="color in colors"
          :key="color.value"
          class="color-option"
          :class="{ selected: currentColor === color.value }"
          :style="{ background: color.value }"
          :data-color="color.value"
          @click="handleColorChange(color.value)"
        ></div>
      </div>
  
      <div class="shape-options">
        <div
          class="shape-option shape-square"
          :class="{ selected: currentShape === 'square' }"
          data-shape="square"
          @click="handleShapeChange('square')"
        ></div>
        <div
          class="shape-option shape-circle"
          :class="{ selected: currentShape === 'circle' }"
          data-shape="circle"
          @click="handleShapeChange('circle')"
        ></div>
        <div
          class="shape-option shape-triangle"
          :class="{ selected: currentShape === 'triangle' }"
          data-shape="triangle"
          @click="handleShapeChange('triangle')"
        ></div>
        <div
          class="shape-option shape-hexagon"
          :class="{ selected: currentShape === 'hexagon' }"
          data-shape="hexagon"
          @click="handleShapeChange('hexagon')"
        ></div>
        <div
          class="shape-option shape-star"
          :class="{ selected: currentShape === 'star' }"
          data-shape="star"
          @click="handleShapeChange('star')"
        ></div>
      </div>
  
      <div
        class="draggable-item"
        draggable="true"
        :style="{
          background: currentColor,
          borderRadius: currentShape === 'circle' ? '50%' : '0',
          clipPath: currentShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                  currentShape === 'hexagon' ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                  currentShape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
        }"
        @dragstart="handleDragStart"
      ></div>
  
      <div class="item-counter" style="white-space: nowrap">
        已放置: <span>{{ itemCount }}</span> 个元素
      </div>
  
      <div class="controls">
        <button class="control-btn" @click="$emit('clear-grid')">清空网格</button>
        <button class="control-btn" @click="$emit('randomize')">随机排列</button>
        <button class="control-btn" @click="$emit('sort')">按数字排序</button>
      </div>
  
      <div class="grid-params">
        <h4>网格参数设置</h4>
        <div class="param-input">
          <label for="columns">列数:</label>
          <input 
            type="number" 
            id="columns" 
            v-model="gridParams.columns" 
            min="3" 
            max="12"
          />
        </div>
        <div class="param-input">
          <label for="rows">行数:</label>
          <input 
            type="number" 
            id="rows" 
            v-model="gridParams.rows" 
            min="3" 
            max="12"
          />
        </div>
        <div class="param-input">
          <label for="cellSize">单元格大小(px):</label>
          <input 
            type="number" 
            id="cellSize" 
            v-model="gridParams.cellSize" 
            min="50" 
            max="150" 
            step="10"
          />
        </div>
        <button class="control-btn" @click="updateGridParams">更新网格</button>
      </div>

      <div class="save-load">
        <button class="control-btn" @click="$emit('save')">保存布局</button>
        <button class="control-btn" @click="$emit('load')">加载布局</button>
        <button class="control-btn" @click="$emit('delete-layout')">删除布局</button>
        <button class="control-btn" @click="$emit('share')">分享布局</button>
        <button 
          class="control-btn" 
          :class="{ 'active-btn': autoSaveEnabled }" 
          @click="$emit('toggle-auto-save')"
        >
          {{ autoSaveEnabled ? '禁用自动保存' : '启用自动保存' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  
  const currentColor = ref("lightblue");
  const currentShape = ref("square");

  const props = defineProps({
    itemCount: {
      type: Number,
      default: 0,
    },
    /**
     * 是否启用自动保存
     */
    autoSaveEnabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 自动保存间隔（毫秒）
     */
    autoSaveInterval: {
      type: Number,
      default: 60000, // 默认1分钟
    }
  });

  const emit = defineEmits([
      "color-change",
      "shape-change",
      "clear-grid",
      "randomize",
      "sort",
      "save",
      "load",
      "delete-layout",
      "share",
      "toggle-auto-save",
      "update-grid-params"
    ]);

  const handleColorChange = (color: string) => {
    currentColor.value = color;
    emit("color-change", color);
  };

  const handleShapeChange = (shape: string) => {
    currentShape.value = shape;
    emit("shape-change", shape);
  };
  
  const colors = ref([
    { value: "lightblue" },
    { value: "lightcoral" },
    { value: "lightgreen" },
    { value: "lightgoldenrodyellow" },
    { value: "#9370DB" },
    { value: "#FF7F50" },
    { value: "#20B2AA" },
    { value: "#FF69B4" },
  ]);

  // 网格参数设置
  const gridParams = ref({
    columns: 5,
    rows: 5,
    cellSize: 50
  });

  // 更新网格参数
  const updateGridParams = () => {
    emit("update-grid-params", 
      gridParams.value.columns, 
      gridParams.value.rows, 
      gridParams.value.cellSize
    );
  };
  
  const handleDragStart = (event: DragEvent) => {
    // 设置拖动效果为复制
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "copy";
      // 设置拖拽数据，包括颜色和形状
      event.dataTransfer.setData("text/plain", JSON.stringify({
        color: props.currentColor,
        shape: props.currentShape
      }));
    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .color-palette {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .color-option {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #333;
    transition: transform 0.2s;
  }
  
  .color-option:hover {
    transform: scale(1.2);
  }
  
  .color-option.selected {
    border: 3px solid #000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  .shape-options {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 15px;
    justify-content: center;
  }
  
  .shape-option {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border: 2px solid #333;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ADD8E6; /* 浅蓝色背景 */
  }

  .shape-option.selected {
    border-color: #000;
    background-color: #0066CC; /* 深蓝色背景 */
  }
  
  .shape-square {
    border-radius: 0;
  }
  
  .shape-circle {
    border-radius: 50%;
  }

  .shape-triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  .shape-hexagon {
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }

  .shape-star {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
  
  .draggable-item {
    width: 100px;
    height: 100px;
    background: lightblue;
    cursor: move;
    border: 2px solid #666;
    box-sizing: border-box;
    transition: transform 0.2s;
    margin-left: auto;
    margin-right: auto;
  }
  
  .draggable-item:hover {
    transform: scale(1.05);
  }
  
  .item-counter {
    margin-top: 15px;
    text-align: center;
    font-weight: bold;
  }
  
  .controls {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .control-btn {
    padding: 8px 12px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .control-btn:hover {
    background: #3a80d2;
  }
  
  .save-load {
    margin-top: 20px;
  }

  .save-load button {
    width: 100%;
    margin-bottom: 10px;
  }

  /* 网格参数设置样式 */
  .grid-params {
    margin-top: 20px;
    padding: 10px;
    background: #e8e8e8;
    border-radius: 6px;
  }

  .grid-params h4 {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
  }

  .param-input {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }

  .param-input label {
    margin-bottom: 5px;
    font-size: 14px;
  }

  .param-input input {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .active-btn {
    background: #2ecc71;
  }

  .active-btn:hover {
    background: #27ae60;
  }
  </style>
  