import { ref } from "vue";

export function useDragDrop() {
  const isDragging = ref(false);

  const handleDragStart = (event: DragEvent) => {
    isDragging.value = true;

    // 设置拖动时的透明度
    if (event.target && (event.target as HTMLElement).style) {
      (event.target as HTMLElement).style.opacity = "0.7";
    }

    // 设置拖动的数据
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", "dragging");
    }
  };

  const handleDragEnd = (event: DragEvent) => {
    isDragging.value = false;

    // 恢复透明度
    if (event.target && (event.target as HTMLElement).style) {
      (event.target as HTMLElement).style.opacity = "1";
    }
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
  };
}
