<template>
    <div class="container">
      <!-- 自定义对话框组件 -->
      <DialogBox
        v-model:visible="dialogVisible"
        :title="dialogTitle"
        :message="dialogMessage"
        :type="dialogType"
        :confirm-text="dialogConfirmText"
        :cancel-text="dialogCancelText"
        :default-value="dialogDefaultValue"
        :input-placeholder="dialogInputPlaceholder"
        @confirm="handleDialogConfirm"
        @cancel="handleDialogCancel"
      />
      
      <SideBar
              :current-color="currentColor"
              :current-shape="currentShape"
              :item-count="items.length"
              :auto-save-enabled="autoSaveEnabled"
              :auto-save-interval="autoSaveInterval"
              @color-change="setCurrentColor"
              @shape-change="setCurrentShape"
              @clear-grid="clearGrid"
              @randomize="randomizeItems"
              @sort="sortItems"
              @save="saveLayout"
              @load="loadLayout"
              @delete-layout="deleteLayout"
              @share="shareLayout"
              @toggle-auto-save="toggleAutoSave"
              @update-grid-params="handleGridParamsUpdate"
            />
      <div class="grid" ref="gridRef" :style="gridStyle">
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
  /**
   * GridSystem 组件
   * 
   * 可拖拽网格系统的核心组件，负责：
   * - 管理网格布局和元素
   * - 处理拖拽操作
   * - 提供布局管理功能（保存、加载、分享）
   * - 实现响应式设计
   * - 支持可配置的网格尺寸和单元格大小
   */
  import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from "vue";
  import SideBar from "./SideBar.vue";
  import GridCell from "./GridCell.vue";
  import DialogBox from "./DialogBox.vue";
  import { useDragDrop } from "./useDragDrop";
  import { useGridLayout } from "./useGridLayout";
  import { generateCells, findEmptyCell, GridItem, GridCell as GridCellType } from "./gridUtils";

  // 定义组件props
  interface Props {
    // 初始单元格大小（像素）
    initialCellSize?: number;
    // 初始网格列数
    initialColumns?: number;
    // 初始网格行数
    initialRows?: number;
  }

  // 定义props，设置默认值
  const props = withDefaults(defineProps<Props>(), {
    initialCellSize: 100,
    initialColumns: 7,
    initialRows: 6
  });

  /**
   * 对话框状态
   */
  // 对话框是否可见
  const dialogVisible = ref<boolean>(false);
  // 对话框标题
  const dialogTitle = ref<string>("");
  // 对话框消息
  const dialogMessage = ref<string>("");
  // 对话框类型
  const dialogType = ref<"alert" | "confirm" | "prompt">("alert");
  // 确认按钮文本
  const dialogConfirmText = ref<string>("确定");
  // 取消按钮文本
  const dialogCancelText = ref<string>("取消");
  // 输入框默认值
  const dialogDefaultValue = ref<string>("");
  // 输入框占位符
  const dialogInputPlaceholder = ref<string>("请输入...");
  // 对话框回调函数
  const dialogCallback = ref<((value?: any) => void) | null>(null);

  /**
   * 对话框处理函数
   */
  // 显示提示对话框
  const showAlert = (message: string, title: string = "提示") => {
    dialogTitle.value = title;
    dialogMessage.value = message;
    dialogType.value = "alert";
    dialogConfirmText.value = "确定";
    dialogVisible.value = true;
    
    return new Promise<void>((resolve) => {
      dialogCallback.value = () => {
        resolve();
      };
    });
  };
  
  // 显示确认对话框
  const showConfirm = (message: string, title: string = "确认") => {
    dialogTitle.value = title;
    dialogMessage.value = message;
    dialogType.value = "confirm";
    dialogConfirmText.value = "确定";
    dialogCancelText.value = "取消";
    dialogVisible.value = true;
    
    return new Promise<boolean>((resolve) => {
      dialogCallback.value = (value: boolean) => {
        resolve(value);
      };
    });
  };
  
  // 显示输入对话框
  const showPrompt = (message: string, defaultValue: string = "", placeholder: string = "请输入...", title: string = "输入") => {
    dialogTitle.value = title;
    dialogMessage.value = message;
    dialogType.value = "prompt";
    dialogDefaultValue.value = defaultValue;
    dialogInputPlaceholder.value = placeholder;
    dialogConfirmText.value = "确定";
    dialogCancelText.value = "取消";
    dialogVisible.value = true;
    
    return new Promise<string | null>((resolve) => {
      dialogCallback.value = (value: string | null) => {
        resolve(value);
      };
    });
  };
  
  // 处理对话框确认事件
  const handleDialogConfirm = (value?: string) => {
    if (dialogCallback.value) {
      if (dialogType.value === "prompt") {
        dialogCallback.value(value);
      } else if (dialogType.value === "confirm") {
        dialogCallback.value(true);
      } else {
        dialogCallback.value();
      }
      dialogCallback.value = null;
    }
  };
  
  // 处理对话框取消事件
  const handleDialogCancel = () => {
    if (dialogCallback.value) {
      if (dialogType.value === "prompt") {
        dialogCallback.value(null);
      } else if (dialogType.value === "confirm") {
        dialogCallback.value(false);
      } else {
        dialogCallback.value();
      }
      dialogCallback.value = null;
    }
  };

  /**
   * 屏幕尺寸断点
   */
  interface BreakPoint {
    columns: number;
    rows: number;
    cellSize: number;
  }

  /**
   * 响应式网格配置
   * 根据屏幕宽度定义不同的网格布局
   */
  const breakpoints: Record<string, BreakPoint> = {
    large: { columns: props.initialColumns, rows: props.initialRows, cellSize: props.initialCellSize },    // > 1200px
    medium: { columns: Math.max(4, props.initialColumns - 2), rows: props.initialRows + 2, cellSize: props.initialCellSize },   // 768px - 1200px
    small: { columns: Math.max(3, props.initialColumns - 3), rows: props.initialRows + 4, cellSize: Math.max(60, props.initialCellSize - 20) }     // < 768px
  };

  // 当前网格配置
  const gridConfig = ref<BreakPoint>(breakpoints.large);

  // 处理网格参数更新
  const handleGridParamsUpdate = (columns: number, rows: number, cellSize: number) => {
    gridConfig.value = {
      columns,
      rows,
      cellSize
    };
  
    // 保存网格参数到本地存储
    localStorage.setItem('dragGrid_gridConfig', JSON.stringify(gridConfig.value));
  
    // 更新breakpoints中的large配置
    breakpoints.large = { columns, rows, cellSize };
  
    // 根据当前屏幕尺寸更新medium和small配置
    breakpoints.medium = { 
      columns: Math.max(4, columns - 2), 
      rows: rows + 2, 
      cellSize 
    };
  
    breakpoints.small = { 
      columns: Math.max(3, columns - 3), 
      rows: rows + 4, 
      cellSize: Math.max(60, cellSize - 20) 
    };
  };

  // 暴露方法给父组件使用
  defineExpose({
    handleGridParamsUpdate
  });

  /**
   * 更新网格配置
   * 根据当前窗口宽度设置合适的网格布局
   */
  const updateGridConfig = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      gridConfig.value = breakpoints.small;
    } else if (width <= 1200) {
      gridConfig.value = breakpoints.medium;
    } else {
      gridConfig.value = breakpoints.large;
    }
  };

  // 计算属性：当前列数
  const columns = computed(() => gridConfig.value.columns);
  // 计算属性：当前行数
  const rows = computed(() => gridConfig.value.rows);
  // 计算属性：当前单元格尺寸
  const cellSize = computed(() => gridConfig.value.cellSize);
  
  // 计算属性：网格样式
  const gridStyle = computed(() => {
    // 获取间距值（从字符串"20px"中提取数字20）
    const gapSize = 20; // 当前固定间距为20px
  
    // 计算网格总宽度 = 列数 * 单元格宽度 + (列数-1) * 间距
    const gridWidth = columns.value * cellSize.value + (columns.value - 1) * gapSize;
  
    // 计算网格总高度 = 行数 * 单元格高度 + (行数-1) * 间距
    const gridHeight = rows.value * cellSize.value + (rows.value - 1) * gapSize;
  
    return {
      gridTemplateColumns: `repeat(${columns.value}, ${cellSize.value}px)`,
      gridTemplateRows: `repeat(${rows.value}, ${cellSize.value}px)`,
      gap: '20px',
      width: `${gridWidth}px`,
      height: `${gridHeight}px`
    };
  });
  
  /**
   * 组件状态
   */
  // 当前选择的颜色和形状
  const currentColor = ref<string>("lightblue");
  const currentShape = ref<string>("square");
  // 下一个元素的编号
  const nextItemNumber = ref<number>(1);
  // 网格中的所有元素
  const items = reactive<GridItem[]>([]);
  // 网格单元格
  const cells = ref<GridCellType[]>(generateCells(rows.value, columns.value));
  // 可放置的单元格位置
  const canDropCells = ref<string[]>([]);
  // 当前高亮的单元格
  const highlightCell = ref<string | null>(null);
  // 需要脉冲动画效果的元素ID
  const pulseItems = ref<number[]>([]);
  // 当前被拖拽的元素ID
  const draggedItemId = ref<number | null>(null);
  // 网格DOM引用
  const gridRef = ref<HTMLElement | null>(null);
  // 自动保存定时器ID
  const autoSaveTimerId = ref<number | null>(null);
  // 自动保存是否启用
  const autoSaveEnabled = ref<boolean>(false);
  // 自动保存间隔（毫秒）
  const autoSaveInterval = ref<number>(60000); // 默认1分钟

  /**
   * 从hooks获取功能
   */
  const { handleDragStart, handleDragEnd: hookDragEnd } = useDragDrop();
  const { 
    saveLayout, 
    loadLayout, 
    loadLayoutById, 
    deleteLayout, 
    savedLayouts,
    autoSave 
  } = useGridLayout(
    items, 
    cells, 
    nextItemNumber, 
    pulseItems,
    showAlert,
    showPrompt,
    showConfirm
  );

  /**
   * 监听网格配置变化
   * 当屏幕尺寸改变导致网格配置变化时，重新生成网格单元格
   */
  watch(
    [columns, rows],
    ([newColumns, newRows], [oldColumns, oldRows]) => {
      if (newColumns !== oldColumns || newRows !== oldRows) {
        // 保存当前元素位置
        const currentItems = [...items];
      
        // 重新生成网格单元格
        cells.value = generateCells(newRows, newColumns);
      
        // 如果有元素，尝试重新放置它们
        if (currentItems.length > 0) {
          // 清空当前元素
          items.length = 0;
        
          // 尝试将元素放回网格
          currentItems.forEach(item => {
            // 查找空单元格
            const emptyCell = findEmptyCell(cells.value, items);
            if (emptyCell) {
              // 创建新元素并放置在空单元格
              items.push({
                ...item,
                position: emptyCell.position
              });
            }
          });
        
          // 如果有元素无法放置，显示提示
          if (items.length < currentItems.length) {
            const lostItems = currentItems.length - items.length;
            showAlert(`由于网格大小变化，${lostItems}个元素无法放置。`);
          }
        }
      }
    }
  );

  /**
   * 启用自动保存功能
   */
  const enableAutoSave = (enable: boolean = true, interval: number = 60000) => {
    // 清除现有定时器
    if (autoSaveTimerId.value) {
      window.clearInterval(autoSaveTimerId.value);
      autoSaveTimerId.value = null;
    }
  
    autoSaveEnabled.value = enable;
    autoSaveInterval.value = interval;
  
    // 如果启用，设置新定时器
    if (enable) {
      autoSaveTimerId.value = window.setInterval(() => {
        if (items.length > 0) {
          autoSave();
        }
      }, interval);
    }
  };
  
  // 计算属性
  const getCellItem = (position: string): GridItem | undefined => {
    return items.find((item) => item.position === position);
  };
  
  // 获取元素样式
  const getItemStyle = (item: GridItem): Record<string, string> => {
    const baseStyle = {
      background: item.color,
      borderRadius: "0 !important",
      clipPath: "none !important"
    };
  
    switch(item.shape) {
      case "circle":
        return { ...baseStyle, borderRadius: "50% !important" };
      case "triangle":
        return { ...baseStyle, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%) !important" };
      case "hexagon":
        return { ...baseStyle, clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%) !important" };
      case "star":
        return { ...baseStyle, clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) !important" };
      default: // square
        return baseStyle;
    }
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
  
  const handleDrop = async (event: DragEvent, position: string) => {
    event.preventDefault();
    canDropCells.value = [];
    highlightCell.value = position;
  
    setTimeout(() => {
      highlightCell.value = null;
    }, 500);
  
    // 如果是从侧边栏拖动的新元素
    if (!draggedItemId.value) {
      // 检查目标位置是否已有元素
      const existingItem = getCellItem(position);
      if (existingItem) {
        const confirmed = await showConfirm(
          `位置 ${position} 已有元素 ${existingItem.number}，是否替换？`,
          "替换确认"
        );
        if (!confirmed) {
          showAlert("请拖放到空白单元格");
          return;
        }
        // 删除原有元素
        const index = items.findIndex(item => item.id === existingItem.id);
        if (index !== -1) {
          items.splice(index, 1);
        }
      }
  
      // 尝试从拖拽数据中获取颜色和形状
      let color = currentColor.value;
      let shape = currentShape.value;
      
      try {
        if (event.dataTransfer && event.dataTransfer.getData("text/plain")) {
          const dragData = JSON.parse(event.dataTransfer.getData("text/plain"));
          if (dragData.color) color = dragData.color;
          if (dragData.shape) shape = dragData.shape;
        }
      } catch (e) {
        console.error("解析拖拽数据失败:", e);
      }
  
      // 创建新元素
      const newItem: GridItem = {
        id: Date.now(),
        position: position,
        number: nextItemNumber.value++,
        color: color,
        shape: shape,
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
  
  const clearGrid = async () => {
    const confirmed = await showConfirm("确定要清空网格吗？");
    if (confirmed) {
      items.length = 0;
    }
  };
  
  const randomizeItems = () => {
    if (items.length === 0) {
      showAlert("网格中没有元素可以随机排列");
      return;
    }
    
    const emptyCells = cells.value.filter((cell: GridCellType) => !getCellItem(cell.position));
    const availableCells = emptyCells.length + items.length; // 包括当前占用的单元格
  
    if (availableCells < items.length) {
      showAlert("没有足够的空间进行随机排列");
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
      showAlert("网格中没有元素可以排序");
      return;
    }
    
    // 检查是否有足够的空间
    if (items.length > cells.value.length) {
      showAlert("元素数量超过网格容量，无法排序");
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
      showAlert("元素已经按数字排序");
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
        showAlert("请先保存当前布局，然后再分享");
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
      showAlert('分享失败，请手动复制URL');
    }
  };
  
  // 后备分享方法
  const fallbackShare = (url: string) => {
    // 尝试复制到剪贴板
    try {
      navigator.clipboard.writeText(url).then(
        () => {
          showAlert('链接已复制到剪贴板！');
        },
        () => {
          // 如果剪贴板API失败，显示链接让用户手动复制
          showPrompt('复制此链接以分享您的布局:', url);
        }
      );
    } catch (err) {
      // 如果剪贴板API不可用，显示链接让用户手动复制
      showPrompt('复制此链接以分享您的布局:', url);
    }
  };

  /**
   * 切换自动保存功能
   * 允许用户启用/禁用自动保存并设置保存间隔
   */
  const toggleAutoSave = () => {
    if (!autoSaveEnabled.value) {
      // 启用自动保存
      const intervalStr = prompt(
        "请输入自动保存间隔（秒）:",
        String(autoSaveInterval.value / 1000)
      );
    
      if (intervalStr === null) {
        // 用户取消了操作
        return;
      }
    
      const interval = parseInt(intervalStr) * 1000;
      if (isNaN(interval) || interval < 5000) {
        alert("请输入有效的间隔时间，最小为5秒");
        return;
      }
    
      // 保存设置到本地存储
      localStorage.setItem('dragGrid_autoSave', 'true');
      localStorage.setItem('dragGrid_autoSaveInterval', String(interval));
    
      // 启用自动保存
      enableAutoSave(true, interval);
      alert(`自动保存已启用，间隔: ${interval / 1000}秒`);
    } else {
      // 禁用自动保存
      localStorage.setItem('dragGrid_autoSave', 'false');
      enableAutoSave(false);
      alert("自动保存已禁用");
    }
  };
  
  /**
   * 窗口大小变化处理函数
   * 使用防抖处理，避免频繁触发
   */
  let resizeTimeout: number | null = null;
  const handleResize = () => {
    if (resizeTimeout) {
      window.clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = window.setTimeout(() => {
      updateGridConfig();
    }, 200);
  };
  
  /**
   * 生命周期钩子
   */
  onMounted(() => {
    document.addEventListener("dragend", handleGlobalDragEnd);
    
    // 尝试从本地存储加载网格参数
    const savedGridConfig = localStorage.getItem('dragGrid_gridConfig');
    if (savedGridConfig) {
      try {
        const parsedConfig = JSON.parse(savedGridConfig);
        if (parsedConfig && typeof parsedConfig === 'object' && 
            'columns' in parsedConfig && 'rows' in parsedConfig && 'cellSize' in parsedConfig) {
          gridConfig.value = parsedConfig;
        } else {
          // 如果保存的配置无效，则使用默认配置
          updateGridConfig();
        }
      } catch (e) {
        console.error('Failed to parse saved grid config:', e);
        updateGridConfig();
      }
    } else {
      // 如果没有保存的配置，则使用默认配置
      updateGridConfig();
    }
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);
    
    // 尝试从URL参数加载布局
    const urlParams = new URLSearchParams(window.location.search);
    const layoutId = urlParams.get('layout');
    if (layoutId) {
      loadLayoutById(layoutId);
    }
    
    // 检查是否启用自动保存
    const savedAutoSave = localStorage.getItem('dragGrid_autoSave');
    if (savedAutoSave === 'true') {
      const savedInterval = parseInt(localStorage.getItem('dragGrid_autoSaveInterval') || '60000');
      enableAutoSave(true, savedInterval);
    }
    
    // 监听网格参数更新事件
    const sideBar = document.querySelector(".container > side-bar");
    if (sideBar) {
      sideBar.addEventListener("update-grid-params", (e: any) => {
        if (e.detail) {
          handleGridParamsUpdate(e.detail);
          // 保存网格参数到本地存储
          localStorage.setItem('dragGrid_gridConfig', JSON.stringify(gridConfig.value));
        }
      });
    }
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener("dragend", handleGlobalDragEnd);
    
    // 移除窗口大小变化监听
    window.removeEventListener('resize', handleResize);
    
    // 清除自动保存定时器
    if (autoSaveTimerId.value) {
      window.clearInterval(autoSaveTimerId.value);
    }
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
    width: calc(100% - 2px);
    height: calc(100% - 2px);
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
  