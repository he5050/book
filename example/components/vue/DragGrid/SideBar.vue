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
          @click="$emit('color-change', color.value)"
        ></div>
      </div>
  
      <div class="shape-options">
        <div
          class="shape-option shape-square"
          :class="{ selected: currentShape === 'square' }"
          data-shape="square"
          @click="$emit('shape-change', 'square')"
        ></div>
        <div
          class="shape-option shape-circle"
          :class="{ selected: currentShape === 'circle' }"
          data-shape="circle"
          @click="$emit('shape-change', 'circle')"
        ></div>
      </div>
  
      <div
        class="draggable-item"
        draggable="true"
        :style="{
          background: currentColor,
          borderRadius: currentShape === 'circle' ? '50%' : '0',
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
  
      <div class="save-load">
        <button class="control-btn" @click="$emit('save')">保存布局</button>
        <button class="control-btn" @click="$emit('load')">加载布局</button>
        <button class="control-btn" @click="$emit('delete-layout')">删除布局</button>
        <button class="control-btn" @click="$emit('share')">分享布局</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  
  const props = defineProps({
    currentColor: {
      type: String,
      default: "lightblue",
    },
    currentShape: {
      type: String,
      default: "square",
    },
    itemCount: {
      type: Number,
      default: 0,
    },
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
    "share"
  ]);
  
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
  
  const handleDragStart = (event: DragEvent) => {
    // 设置拖动效果为复制
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "copy";
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
  }
  
  .shape-option.selected {
    border-color: #000;
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .shape-square {
    border-radius: 0;
  }
  
  .shape-circle {
    border-radius: 50%;
  }
  
  .draggable-item {
    width: 100px;
    height: 100px;
    background: lightblue;
    cursor: move;
    border: 2px solid #666;
    box-sizing: border-box;
    transition: transform 0.2s;
    border-radius: 5px;
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
  </style>
  