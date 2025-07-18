<template>
    <div class="container">
      <SideBar
        :current-color="currentColor"
        :current-shape="currentShape"
        :item-count="items.length"
        @color-change="setCurrentColor"
        @shape-change="setCurrentShape"
        @clear-grid="clearGrid"
        @randomize="randomizeItems"
        @sort="sortItems"
        @save="saveLayout"
        @load="loadLayout"
        @delete-layout="deleteLayout"
        @share="shareLayout"
      />
      <div class="grid" ref="gridRef">
        <GridCell
          v-for="(cell, index) in cells"
          :key="index"
          :position="cell.position"
          :can-drop="canDropCells.includes(cell.position)"
          :highlight="highlightCell === cell.position"
          @dragover="handleDragOver($event, cell.position)"
          @dragleave="handleDragLeave($event, cell.position)"
          @drop="handleDrop($event, cell.position)"
        >
          <div
            v-if="getCellItem(cell.position)"
            class="dropped-item"
            :class="{ pulse: pulseItems.includes(getCellItem(cell.position).id) }"
            :style="getItemStyle(getCellItem(cell.position))"
            draggable="true"
            @dragstart="handleItemDragStart($event, getCellItem(cell.position))"
          >
            {{ getCellItem(cell.position).number }}
            <div class="delete-btn" @click.stop="deleteItem(getCellItem(cell.position).id)">×</div>
          </div>
        </GridCell>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
  import SideBar from "./SideBar.vue";
  import GridCell from "./GridCell.vue";
  import { useDragDrop } from "./useDragDrop";
  import { useGridLayout } from "./useGridLayout";
  import { generateCells, findEmptyCell, GridItem, GridCell as GridCellType } from "./gridUtils";
  
  // 网格配置
  const columns = 7;
  const rows = 6;
  
  // 状态
  const currentColor = ref<string>("lightblue");
  const currentShape = ref<string>("square");
  const nextItemNumber = ref<number>(1);
  const items = reactive<GridItem[]>([]);
  const cells = ref<GridCellType[]>(generateCells(rows, columns));
  const canDropCells = ref<string[]>([]);
  const highlightCell = ref<string | null>(null);
  const pulseItems = ref<number[]>([]);
  const draggedItemId = ref<number | null>(null);
  const gridRef = ref<HTMLElement | null>(null);
  
  // 从hooks获取功能
  const { handleDragStart, handleDragEnd: hookDragEnd } = useDragDrop();
  const { saveLayout, loadLayout, loadLayoutById, deleteLayout, savedLayouts } = useGridLayout(items, cells, nextItemNumber, pulseItems);
  
  // 计算属性
  const getCellItem = (position: string): GridItem | undefined => {
    return items.find((item) => item.position === position);
  };
  
  // 获取元素样式
  const getItemStyle = (item: GridItem): Record<string, string> => {
    return {
      background: item.color,
      borderRadius: item.shape === "circle" ? "50%" : "0",
    };
  };
  
  // 方法
  const setCurrentColor = (color: string) => {
    currentColor.value = color;
  };
  
  const setCurrentShape = (shape: string) => {
    currentShape.value = shape;
  };
  
  const handleDragOver = (event: DragEvent, position: string) => {
    event.preventDefault();
    if (!canDropCells.value.includes(position)) {
      canDropCells.value.push(position);
    }
  };
  
  const handleDragLeave = (event: DragEvent, position: string) => {
    canDropCells.value = canDropCells.value.filter((pos) => pos !== position);
  };
  
  const handleItemDragStart = (event: DragEvent, item: GridItem) => {
    draggedItemId.value = item.id;
    handleDragStart(event);
  };
  
  const addPulseEffect = (itemId: number) => {
    pulseItems.value.push(itemId);
    setTimeout(() => {
      pulseItems.value = pulseItems.value.filter((id) => id !== itemId);
    }, 500);
  };
  
  const handleDrop = (event: DragEvent, position: string) => {
    event.preventDefault();
    canDropCells.value = [];
    highlightCell.value = position;
  
    setTimeout(() => {
      highlightCell.value = null;
    }, 500);
  
    // 如果是从侧边栏拖动的新元素
    if (!draggedItemId.value) {
      // 检查目标位置是否已有元素
      if (getCellItem(position)) {
        alert("该位置已有元素，请选择空白位置放置");
        return;
      }
  
      // 创建新元素
      const newItem: GridItem = {
        id: Date.now(),
        position: position,
        number: nextItemNumber.value++,
        color: currentColor.value,
        shape: currentShape.value,
      };
  
      items.push(newItem);
      addPulseEffect(newItem.id);
    } else {
      // 网格内元素之间的拖动
      const draggedItem = items.find((item) => item.id === draggedItemId.value);
      const targetItem = getCellItem(position);
  
      if (!draggedItem) {
        console.error("找不到被拖动的元素");
        return;
      }
  
      if (targetItem) {
        // 交换位置
        const draggedPosition = draggedItem.position;
        draggedItem.position = targetItem.position;
        targetItem.position = draggedPosition;
  
        addPulseEffect(draggedItem.id);
        addPulseEffect(targetItem.id);
      } else {
        // 移动到空位置
        draggedItem.position = position;
        addPulseEffect(draggedItem.id);
      }
  
      draggedItemId.value = null;
    }
  };
  
  const deleteItem = (itemId: number) => {
    const index = items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      addPulseEffect(itemId);
      setTimeout(() => {
        items.splice(index, 1);
      }, 300);
    }
  };
  
  const clearGrid = () => {
    if (confirm("确定要清空网格吗？")) {
      items.length = 0;
    }
  };
  
  const randomizeItems = () => {
    if (items.length === 0) {
      alert("网格中没有元素可以随机排列");
      return;
    }
    
    const emptyCells = cells.value.filter((cell: GridCellType) => !getCellItem(cell.position));
    const availableCells = emptyCells.length + items.length; // 包括当前占用的单元格
  
    if (availableCells < items.length) {
      alert("没有足够的空间进行随机排列");
      return;
    }
  
    // 创建所有可用位置的数组（当前空位置 + 已占用位置）
    const availablePositions: string[] = [
      ...emptyCells.map(cell => cell.position),
      ...items.map(item => item.position)
    ];
    
    // 随机打乱可用位置
    for (let i = availablePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
    }
    
    // 为每个元素分配新位置
    items.forEach((item: GridItem, index: number) => {
      if (index < availablePositions.length) {
        const newPosition = availablePositions[index];
        if (item.position !== newPosition) {
          item.position = newPosition;
          addPulseEffect(item.id);
        }
      }
    });
  };
  
  const sortItems = () => {
    if (items.length === 0) {
      alert("网格中没有元素可以排序");
      return;
    }
    
    // 检查是否有足够的空间
    if (items.length > cells.value.length) {
      alert("元素数量超过网格容量，无法排序");
      return;
    }
    
    // 按数字排序
    const sortedItems = [...items].sort((a: GridItem, b: GridItem) => a.number - b.number);
    
    // 创建一个映射，用于快速查找原始项目
    const itemMap = new Map<number, GridItem>();
    items.forEach(item => itemMap.set(item.id, item));
    
    // 重新分配位置
    let changedCount = 0;
    sortedItems.forEach((item: GridItem, index: number) => {
      if (index < cells.value.length) {
        const originalItem = itemMap.get(item.id);
        if (originalItem && originalItem.position !== cells.value[index].position) {
          originalItem.position = cells.value[index].position;
          addPulseEffect(item.id);
          changedCount++;
        }
      }
    });
    
    if (changedCount === 0) {
      alert("元素已经按数字排序");
    }
  };
  
  // 处理拖拽结束事件
  const handleGlobalDragEnd = (event: DragEvent) => {
    hookDragEnd(event);
    canDropCells.value = [];
    draggedItemId.value = null;
  };
  
  // 分享布局功能
  const shareLayout = () => {
    try {
      // 获取当前URL中的布局ID
      const url = new URL(window.location.href);
      const layoutId = url.searchParams.get('layout');
      
      if (!layoutId) {
        alert("请先保存当前布局，然后再分享");
        return;
      }
      
      // 创建分享链接
      const shareUrl = `${window.location.origin}${window.location.pathname}?layout=${layoutId}`;
      
      // 尝试使用现代分享API
      if (navigator.share) {
        navigator.share({
          title: '拖拽布局分享',
          text: '查看我创建的拖拽布局！',
          url: shareUrl
        })
        .then(() => console.log('分享成功'))
        .catch((error) => {
          console.error('分享失败:', error);
          fallbackShare(shareUrl);
        });
      } else {
        fallbackShare(shareUrl);
      }
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请手动复制URL');
    }
  };
  
  // 后备分享方法
  const fallbackShare = (url: string) => {
    // 尝试复制到剪贴板
    try {
      navigator.clipboard.writeText(url).then(
        () => {
          alert('链接已复制到剪贴板！');
        },
        () => {
          // 如果剪贴板API失败，显示链接让用户手动复制
          prompt('复制此链接以分享您的布局:', url);
        }
      );
    } catch (err) {
      // 如果剪贴板API不可用，显示链接让用户手动复制
      prompt('复制此链接以分享您的布局:', url);
    }
  };
  
  // 生命周期钩子
  onMounted(() => {
    document.addEventListener("dragend", handleGlobalDragEnd);
    
    // 尝试从URL参数加载布局
    const urlParams = new URLSearchParams(window.location.search);
    const layoutId = urlParams.get('layout');
    if (layoutId) {
      loadLayoutById(layoutId);
    }
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener("dragend", handleGlobalDragEnd);
  });
  </script>
  
  <style scoped>
  .container {
    display: flex;
    gap: 20px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    flex-wrap: wrap;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(7, 100px);
    grid-template-rows: repeat(6, 100px);
    gap: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 20px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    transition: box-shadow 0.3s ease;
  }
  
  .grid:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  .dropped-item {
    width: 98px;
    height: 98px;
    background: lightblue;
    position: absolute;
    top: 0;
    left: 0;
    cursor: move;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #333;
    font-weight: bold;
    border-radius: 5px;
    transition:
      transform 0.3s,
      box-shadow 0.3s,
      opacity 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    user-select: none;
    -webkit-user-select: none;
  }
  
  .dropped-item:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    z-index: 10;
  }
  
  .dropped-item:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  .delete-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 16px;
    height: 16px;
    background: red;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    cursor: pointer;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .dropped-item:hover .delete-btn {
    opacity: 1;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  }
  
  .pulse {
    animation: pulse 0.5s;
    z-index: 20;
  }
  
  /* 响应式设计 */
  @media (max-width: 1200px) {
    .container {
      justify-content: center;
    }
    
    .grid {
      grid-template-columns: repeat(5, 100px);
      grid-template-rows: repeat(8, 100px);
    }
  }
  
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
      align-items: center;
    }
    
    .grid {
      grid-template-columns: repeat(4, 80px);
      grid-template-rows: repeat(10, 80px);
      gap: 10px;
    }
    
    .dropped-item {
      width: 78px;
      height: 78px;
      font-size: 20px;
    }
  }
  </style>
  