<template>
  <div class="dual-connection">
    <!-- 左侧列表 -->
    <div class="list-container">
      <h3>源数据 ({{ leftList.length }})</h3>
      <draggable v-model="leftList" group="connection" item-key="id" @end="updateLines">
        <template #item="{ element }">
          <div class="item-card" :ref="(el) => setNodeRef(el, element.id)" @click="handleSelect(element.id, 'left')"
            :class="{
              active: activeSelection.left === element.id,
              connected: isConnected(element.id),
            }">
            {{ element.name }}
            <span v-if="getPartnerId(element.id)" class="partner-badge">
              {{ getPartnerName(getPartnerId(element.id)) }}
            </span>
          </div>
        </template>
      </draggable>
    </div>

    <!-- 控制中心 -->
    <div class="control-center">
      <button @click="connectSelected" :disabled="!canConnect">建立连接</button>
      <button @click="disconnectSelected" :disabled="!canDisconnect">
        解除连接
      </button>
      <div class="connection-status">
        已连接: {{ connectedCount }} /
        {{ Math.min(leftList.length, rightList.length) }}
      </div>
    </div>

    <!-- 右侧列表 -->
    <div class="list-container">
      <h3>目标数据 ({{ rightList.length }})</h3>
      <draggable v-model="rightList" group="connection" item-key="id" @end="updateLines">
        <template #item="{ element }">
          <div class="item-card" :ref="(el) => setNodeRef(el, element.id)" @click="handleSelect(element.id, 'right')"
            :class="{
              active: activeSelection.right === element.id,
              connected: isConnected(element.id),
            }">
            {{ element.name }}
            <span v-if="getPartnerId(element.id)" class="partner-badge">
              {{ getPartnerName(getPartnerId(element.id)) }}
            </span>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import draggable from "vuedraggable";
import LeaderLine from "leader-line-vue";

export default {
  components: { draggable }, // 注册draggable组件为当前组件的子组件
  setup() {
    // 生成带类型的测试数据
    const generateItems = (prefix, count, type) => { // 定义一个函数，用于生成指定数量、类型、前缀的测试数据
      return Array.from({ length: count }, (_, i) => ({ // 使用Array.from生成一个数组，数组元素由回调函数生成
        id: `${prefix}-${type}-${i + }`, // 设置元素的id属性
        name: `${type}${i + }`, // 设置元素的name属性
        type: type, // 设置元素的type属性
        value: Math.random().toString().slice(,), // 设置元素的value属性，为一个随机字符串
      }));
    };

    // 状态管理
    const leftList = ref(
      [ // 创建一个响应式引用，存储左侧列表数据
        ...generateItems("L", '', "设备"), // 生成个设备类型的测试数据
        ...generateItems("L", '', "用户"), // 生成个用户类型的测试数据
      ]);
    const rightList = ref(
      [ // 创建一个响应式引用，存储右侧列表数据
        ...generateItems("R", '', "位置"), // 生成个位置类型的测试数据
        ...generateItems("R", '', "部门"), // 生成个部门类型的测试数据
      ]);
    const nodeRefs = ref({}); // 创建一个响应式引用，用于存储节点元素的引用
    const activeSelection = ref({ left: null, right: null }); // 创建一个响应式引用，用于存储当前选中的左侧和右侧项
    const connectionMap = ref(new Map()); // 创建一个响应式引用，用于存储连线映射关系（左侧项ID到右侧项ID）
    const reverseConnectionMap = ref(new Map()); // 创建一个响应式引用，用于存储反向连线映射关系（右侧项ID到左侧项ID）
    const lineInstances = ref(new Map()); // 创建一个响应式引用，用于存储连线实例

    // 设置节点引用
    const setNodeRef = (el, id) => { // 定义一个函数，用于设置节点元素的引用
      if (el) nodeRefs.valueid = el; // 如果传入的元素el存在，则将其存储到nodeRefs中，以id为键
    };

    // 创建连线
    const createConnection = (sourceId, targetId) => { // 定义一个函数，用于创建从sourceId到targetId的连线
      // 检查是否已存在连接
      if (connectionMap.value.has(sourceId) || reverseConnectionMap.value.has(targetId)) { // 如果sourceId已连接或targetId已有反向连接，则返回false
        return false;
      }
      const sourceEl = nodeRefs.valuesourceId]; // 获取sourceId对应的元素
      const targetEl = nodeRefs.valuetargetId]; // 获取targetId对应的元素
      if (!sourceEl || !targetEl) return false; // 如果sourceEl或targetEl不存在，则返回false
      // 创建连线实例
      const line = LeaderLine.setLine(sourceEl, targetEl, { // 使用LeaderLine的setLine方法创建连线
        color: `hsl(${Math.random() * }, %, %)`, // 设置连线的颜色为随机色
        path: "fluid", // 设置连线的路径为流体路径
        startSocket: "right", // 设置起点插座位置为右侧
        endSocket: "left", // 设置终点插座位置为左侧
        size: , // 设置连线粗细为
        startSocketGravity: , ], // 设置起点插座的重力方向及强度
        endSocketGravity: [-,], // 设置终点插座的重力方向及强度
        dash: { animation: true }, // 设置连线为虚线并添加流动动画效果
      });
      // 更新连接映射
      connectionMap.value.set(sourceId, targetId); // 在connectionMap中添加sourceId到targetId的映射
      reverseConnectionMap.value.set(targetId, sourceId); // 在reverseConnectionMap中添加targetId到sourceId的反向映射
      lineInstances.value.set(`${sourceId}-${targetId}`, line); // 在lineInstances中添加连线的实例
      return true; // 返回true表示连线创建成功
    };

    // 断开连接
    const disconnect = (sourceId, targetId) => { // 定义一个函数，用于断开从sourceId到targetId的连接
      const connectionKey = `${sourceId}-${targetId}`; // 生成连接的键
      const line = lineInstances.value.get(connectionKey); // 从lineInstances中获取连线实例
      if (line) { // 如果连线实例存在
        line.remove(); // 移除连线
        lineInstances.value.delete(connectionKey); // 从lineInstances中删除连线实例
      }
      connectionMap.value.delete(sourceId); // 从connectionMap中删除sourceId的映射
      reverseConnectionMap.value.delete(targetId); // 从reverseConnectionMap中删除targetId的反向映射
    };

    // 更新所有连线位置
    const updateLines = () => { // 定义一个函数，用于更新所有连线的位置
      requestAnimationFrame(() => { // 使用requestAnimationFrame来优化性能
        lineInstances.value.forEach((line) => line.position()); // 遍历lineInstances，调用每个连线的position方法更新位置
      });
    };

    // 处理选择项
    const handleSelect = (id, side) => { // 定义一个函数，用于处理选择项
      activeSelection.valueside = id; // 将选中的项ID存储到activeSelection中，side为'left'或'right'
    };

    // 连接选中项
    const connectSelected = () => { // 定义一个函数，用于连接选中的左侧和右侧项
      if (activeSelection.value.left && activeSelection.value.right) { // 如果左侧和右侧都有选中的项
        const success = createConnection(activeSelection.value.left, activeSelection.value.right); // 尝试创建连线
        if (success) { // 如果创建成功
          activeSelection.value = { left: null, right: null }; // 清空选中的项
        }
      }
    };

    // 断开选中项
    const disconnectSelected = () => { // 定义一个函数，用于断开选中的项的连接
      if (activeSelection.value.left && connectionMap.value.has(activeSelection.value.left)) { // 如果左侧有选中的项且已连接
        const targetId = connectionMap.value.get(activeSelection.value.left); // 获取连接的右侧项ID
        disconnect(activeSelection.value.left, targetId); // 断开连接
      } else if (activeSelection.value.right && reverseConnectionMap.value.has(activeSelection.value.right)) { // 如果右侧有选中的项且有反向连接
        const sourceId = reverseConnectionMap.value.get(activeSelection.value.right); // 获取连接的左侧项ID
        disconnect(sourceId, activeSelection.value.right); // 断开连接
      }
      activeSelection.value = { left: null, right: null }; // 清空选中的项
    };

    // 获取伙伴ID
    const getPartnerId = (id) => { // 定义一个函数，用于获取与指定ID相连的伙伴ID
      return connectionMap.value.get(id) || reverseConnectionMap.value.get(id); // 从connectionMap或reverseConnectionMap中获取伙伴ID
    };

    // 获取伙伴名称
    const getPartnerName = (id) => { // 定义一个函数，用于获取指定ID的伙伴名称
      const allItems = [...leftList.value, ...rightList.value]; // 合并左右列表数据
      const item = allItems.find((item) => item.id === id); // 查找指定ID的项
      return item ? item.name : ""; // 返回项的名称或空字符串
    };

    // 检查是否已连接
    const isConnected = (id) => { // 定义一个函数，用于检查指定ID是否已连接
      return connectionMap.value.has(id) || reverseConnectionMap.value.has(id); // 从connectionMap或reverseConnectionMap中检查是否已连接
    };

    // 计算属性
    const canConnect = computed(() => { // 定义一个计算属性，用于判断是否可以连接
      return activeSelection.value.left && activeSelection.value.right && !isConnected(activeSelection.value.left) && !isConnected(activeSelection.value.right); // 判断条件为左侧和右侧都有选中的项且都未连接
    });

    const canDisconnect = computed(() => { // 定义一个计算属性，用于判断是否可以断开连接
      return (activeSelection.value.left && isConnected(activeSelection.value.left)) || (activeSelection.value.right && isConnected(activeSelection.value.right)); // 判断条件为左侧或右侧有选中的项且已连接
    });

    const connectedCount = computed(() => { // 定义一个计算属性，用于获取已连接的数量
      return connectionMap.value
    });
  }
}

</script>
<style>
.dual-connection {
  display: flex;
  height: 85vh;
  padding: 20px;
  gap: 20px;
  background: #f5f7fa;
}

.list-container {
  flex: 1;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-card {
  padding: 12px 15px;
  margin: 8px 0;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.item-card:hover {
  background: #e9ecef;
}

.item-card.active {
  background: #e7f1ff;
  border-left-color: #4d7cfe;
}

.item-card.connected {
  background: #f0f7ff;
  border-left-color: #3a6bfd;
}

.partner-badge {
  position: absolute;
  right: 10px;
  background: #495057;
  color: white;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
}

.control-center {
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px 0;
}

button {
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #4d7cfe;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

button:hover {
  background: #3a6bfd;
}

button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

.connection-status {
  margin-top: 10px;
  padding: 8px;
  background: #f1f3f5;
  border-radius: 6px;
  text-align: center;
  font-size: 13px;
}

h3 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e4e8;
  color: #24292e;
}
</style>
