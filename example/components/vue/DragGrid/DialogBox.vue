<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
      <div class="dialog-container" :class="{ 'dialog-prompt': type === 'prompt' }">
        <div class="dialog-header">
          <h3>{{ title }}</h3>
          <button class="dialog-close-btn" @click="close">×</button>
        </div>
        
        <div class="dialog-content">
          <p>{{ message }}</p>
          
          <input 
            v-if="type === 'prompt'" 
            v-model="inputValue" 
            class="dialog-input"
            :placeholder="inputPlaceholder"
            @keyup.enter="confirm"
            ref="inputRef"
          />
        </div>
        
        <div class="dialog-actions">
          <button 
            v-if="type !== 'alert'" 
            class="dialog-btn dialog-cancel-btn" 
            @click="cancel"
          >
            {{ cancelText }}
          </button>
          
          <button 
            class="dialog-btn dialog-confirm-btn" 
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * DialogBox 组件
 * 
 * 现代化的对话框组件，替代原生的 alert、confirm 和 prompt
 * 支持三种类型：alert、confirm 和 prompt
 */
import { ref, onMounted, nextTick, watch } from 'vue';

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'alert' | 'confirm' | 'prompt';
  confirmText?: string;
  cancelText?: string;
  defaultValue?: string;
  inputPlaceholder?: string;
  closeOnOverlayClick?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {
  type: 'alert',
  confirmText: '确定',
  cancelText: '取消',
  defaultValue: '',
  inputPlaceholder: '请输入...',
  closeOnOverlayClick: false
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', value?: string): void;
  (e: 'cancel'): void;
}>();

// 输入框的值
const inputValue = ref(props.defaultValue);
// 输入框引用
const inputRef = ref<HTMLInputElement | null>(null);

// 监听 visible 变化，当对话框显示时，自动聚焦输入框
watch(() => props.visible, (newValue) => {
  if (newValue && props.type === 'prompt') {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
  
  // 重置输入值
  if (newValue) {
    inputValue.value = props.defaultValue;
  }
});

// 确认操作
const confirm = () => {
  if (props.type === 'prompt') {
    emit('confirm', inputValue.value);
  } else {
    emit('confirm');
  }
  close();
};

// 取消操作
const cancel = () => {
  emit('cancel');
  close();
};

// 关闭对话框
const close = () => {
  emit('update:visible', false);
};

// 处理遮罩层点击
const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlayClick && event.target === event.currentTarget) {
    cancel();
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.dialog-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  padding: 0;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.dialog-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.dialog-close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.dialog-content {
  padding: 20px;
}

.dialog-content p {
  margin: 0 0 15px;
  color: #555;
  line-height: 1.5;
}

.dialog-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 10px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.dialog-input:focus {
  border-color: #4a90e2;
  outline: none;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.dialog-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.dialog-cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.dialog-cancel-btn:hover {
  background-color: #e0e0e0;
}

.dialog-confirm-btn {
  background-color: #4a90e2;
  color: white;
}

.dialog-confirm-btn:hover {
  background-color: #3a80d2;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>