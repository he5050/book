// 定义网格项类型
export interface GridItem {
  id: number;
  position: string;
  number: number;
  color: string;
  shape: string;
}

// 定义单元格类型
export interface GridCell {
  position: string;
  row: number;
  column: number;
}

// 定义颜色选项类型
export interface ColorOption {
  value: string;
}

// 定义布局保存类型
export interface SavedLayout {
  position: string;
  number: number;
  color: string;
  shape: string;
}

// 定义拖拽事件类型
export interface DragEvent extends Event {
  dataTransfer?: DataTransfer;
  target: HTMLElement;
}