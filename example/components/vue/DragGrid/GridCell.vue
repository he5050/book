<template>
    <div
      class="grid-cell"
      :class="{
        'can-drop': canDrop,
        highlight: highlight,
      }"
      :style="{
        width: `${size}px`,
        height: `${size}px`
      }"
      :data-position="position"
      @dragover="$emit('dragover', $event)"
      @dragleave="$emit('dragleave', $event)"
      @drop="$emit('drop', $event)"
    >
      <slot></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    position: {
      type: String,
      required: true,
    },
    canDrop: {
      type: Boolean,
      default: false,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 50, // 默认大小为50px
    },
  });

  defineEmits(["dragover", "dragleave", "drop"]);
  </script>
  
  <style scoped>
  .grid-cell {
    /* 移除固定的宽度和高度，使用:style绑定来动态设置 */
    border: 1px solid #eee;
    position: relative;
    box-sizing: border-box;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }
  
  .grid-cell.highlight {
    box-shadow: 0 0 10px rgba(0, 0, 255, 0.5);
  }
  
  .grid-cell.can-drop {
    background-color: rgba(0, 255, 0, 0.1);
  }
  </style>
  