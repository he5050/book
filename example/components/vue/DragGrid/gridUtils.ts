// 定义类型
export interface GridCell {
  position: string;
  row: number;
  column: number;
}

export interface GridItem {
  id: number;
  position: string;
  number: number;
  color: string;
  shape: string;
}

// 生成网格单元格
export function generateCells(rows: number, columns: number): GridCell[] {
  const cells: GridCell[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      cells.push({
        position: `${i}-${j}`,
        row: i,
        column: j,
      });
    }
  }
  return cells;
}

// 查找空单元格
export function findEmptyCell(cells: GridCell[], items: GridItem[]): GridCell | null {
  // 过滤出所有空单元格
  const occupiedPositions = items.map((item) => item.position);
  const emptyCells = cells.filter((cell) => !occupiedPositions.includes(cell.position));

  // 如果没有空单元格，返回null
  if (emptyCells.length === 0) {
    return null;
  }

  // 随机选择一个空单元格
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// 检查单元格是否被占用
export function isCellOccupied(position: string, items: GridItem[]): boolean {
  return items.some((item) => item.position === position);
}
  