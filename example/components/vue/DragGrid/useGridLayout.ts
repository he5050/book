import { Ref, ref } from 'vue';
import { GridItem, GridCell } from './gridUtils';

interface SavedLayoutItem {
  position: string;
  number: number;
  color: string;
  shape: string;
}

interface SavedLayout {
  id: string;
  name: string;
  timestamp: number;
  items: SavedLayoutItem[];
}

export function useGridLayout(
  items: GridItem[], 
  cells: GridCell[], 
  nextItemNumber: Ref<number>, 
  pulseItems: Ref<number[]>
) {
  const savedLayouts = ref<SavedLayout[]>([]);
  
  // 加载所有保存的布局
  const loadSavedLayouts = (): SavedLayout[] => {
    try {
      const layoutsJson = localStorage.getItem("gridLayouts");
      if (layoutsJson) {
        const layouts = JSON.parse(layoutsJson);
        if (Array.isArray(layouts)) {
          savedLayouts.value = layouts;
          return layouts;
        }
      }
      return [];
    } catch (error) {
      console.error("加载布局列表失败:", error);
      return [];
    }
  };
  
  // 初始化加载布局列表
  loadSavedLayouts();
  
  // 保存布局到本地存储
  const saveLayout = () => {
    try {
      const layoutItems = items.map((item) => ({
        position: item.position,
        number: item.number,
        color: item.color,
        shape: item.shape,
      }));
      
      if (layoutItems.length === 0) {
        alert("没有元素可以保存!");
        return;
      }
      
      // 提示用户输入布局名称
      const layoutName = prompt("请输入布局名称:", `布局 ${new Date().toLocaleString()}`);
      if (!layoutName) return; // 用户取消
      
      const layoutId = `layout_${Date.now()}`;
      const newLayout: SavedLayout = {
        id: layoutId,
        name: layoutName,
        timestamp: Date.now(),
        items: layoutItems
      };
      
      // 加载现有布局
      const layouts = loadSavedLayouts();
      
      // 添加新布局
      layouts.push(newLayout);
      
      // 保存回本地存储
      localStorage.setItem("gridLayouts", JSON.stringify(layouts));
      
      // 更新当前布局ID到URL
      updateUrlWithLayoutId(layoutId);
      
      alert(`布局 "${layoutName}" 已保存!`);
    } catch (error) {
      console.error("保存布局失败:", error);
      alert("保存布局失败，请稍后再试!");
    }
  };
  
  // 从本地存储加载布局
  const loadLayout = () => {
    try {
      const layouts = loadSavedLayouts();
      
      if (layouts.length === 0) {
        alert("没有找到保存的布局!");
        return;
      }
      
      // 创建布局选择列表
      const layoutOptions = layouts.map((layout, index) => 
        `${index + 1}. ${layout.name} (${new Date(layout.timestamp).toLocaleString()})`
      ).join("\\n");
      
      const selection = prompt(`请选择要加载的布局编号:\\n${layoutOptions}`, "1");
      if (!selection) return; // 用户取消
      
      const index = parseInt(selection) - 1;
      if (isNaN(index) || index < 0 || index >= layouts.length) {
        alert("无效的选择!");
        return;
      }
      
      const selectedLayout = layouts[index];
      loadLayoutById(selectedLayout.id);
    } catch (error) {
      console.error("加载布局失败:", error);
      alert("加载布局失败，可能是数据格式不正确!");
    }
  };
  
  // 通过ID加载布局
  const loadLayoutById = (layoutId: string) => {
    try {
      const layouts = loadSavedLayouts();
      const layout = layouts.find(l => l.id === layoutId);
      
      if (!layout) {
        alert(`找不到ID为 ${layoutId} 的布局!`);
        return;
      }
      
      // 清空当前布局
      items.length = 0;
      
      // 验证布局数据
      if (!Array.isArray(layout.items)) {
        throw new Error("无效的布局数据");
      }
      
      // 找出最大的编号
      let maxNumber = 0;
      
      layout.items.forEach((item) => {
        // 验证必要的字段
        if (!item.position || typeof item.number !== 'number') {
          console.warn("跳过无效的布局项:", item);
          return;
        }
        
        const newItem: GridItem = {
          id: Date.now() + Math.random(),
          position: item.position,
          number: parseInt(item.number.toString()),
          color: item.color || 'lightblue',
          shape: item.shape || 'square',
        };
        
        items.push(newItem);
        pulseItems.value.push(newItem.id);
        
        if (newItem.number > maxNumber) {
          maxNumber = newItem.number;
        }
      });
      
      // 更新下一个编号
      nextItemNumber.value = maxNumber + 1;
      
      // 更新URL
      updateUrlWithLayoutId(layoutId);
      
      // 清除动画效果
      setTimeout(() => {
        pulseItems.value = [];
      }, 500);
      
      alert(`布局 "${layout.name}" 已加载!`);
    } catch (error) {
      console.error("加载布局失败:", error);
      alert("加载布局失败，可能是数据格式不正确!");
    }
  };
  
  // 更新URL以包含布局ID
  const updateUrlWithLayoutId = (layoutId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('layout', layoutId);
    window.history.replaceState({}, '', url.toString());
  };
  
  // 删除布局
  const deleteLayout = () => {
    try {
      const layouts = loadSavedLayouts();
      
      if (layouts.length === 0) {
        alert("没有找到保存的布局!");
        return;
      }
      
      // 创建布局选择列表
      const layoutOptions = layouts.map((layout, index) => 
        `${index + 1}. ${layout.name} (${new Date(layout.timestamp).toLocaleString()})`
      ).join("\\n");
      
      const selection = prompt(`请选择要删除的布局编号:\\n${layoutOptions}`, "1");
      if (!selection) return; // 用户取消
      
      const index = parseInt(selection) - 1;
      if (isNaN(index) || index < 0 || index >= layouts.length) {
        alert("无效的选择!");
        return;
      }
      
      const selectedLayout = layouts[index];
      
      if (confirm(`确定要删除布局 "${selectedLayout.name}" 吗?`)) {
        layouts.splice(index, 1);
        localStorage.setItem("gridLayouts", JSON.stringify(layouts));
        savedLayouts.value = layouts;
        alert("布局已删除!");
      }
    } catch (error) {
      console.error("删除布局失败:", error);
      alert("删除布局失败!");
    }
  };
  
  return {
    saveLayout,
    loadLayout,
    loadLayoutById,
    deleteLayout,
    savedLayouts
  };
}
  