import React, { useState, useEffect } from 'react';

interface WaterfallItem {
  id: number;
  height: number;
  color: string;
}

const WaterfallLayoutDemo: React.FC = () => {
  // 配置状态
  const [columnCount, setColumnCount] = useState<number>(3);
  const [columnGap, setColumnGap] = useState<number>(16);
  const [itemWidth, setItemWidth] = useState<number>(150);
  const [itemCount, setItemCount] = useState<number>(20);
  
  // 生成示例数据
  const generateItems = (count: number): WaterfallItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      height: Math.floor(Math.random() * 150) + 100, // 随机高度 100-250px
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)` // 随机颜色
    }));
  };

  const [items, setItems] = useState<WaterfallItem[]>(() => generateItems(itemCount));

  // 当 itemCount 变化时重新生成项目
  useEffect(() => {
    setItems(generateItems(itemCount));
  }, [itemCount]);

  // 重置数据
  const handleReset = () => {
    setItems(generateItems(itemCount));
  };

  // 实现瀑布流布局的核心算法
  const renderWaterfall = () => {
    // 初始化列高度数组
    const columnHeights = new Array(columnCount).fill(0);
    // 存储每个项目的定位信息
    const itemPositions: { 
      item: WaterfallItem; 
      columnIndex: number; 
      top: number; 
      left: number 
    }[] = [];

    // 为每个项目计算位置
    items.forEach(item => {
      // 找到当前高度最小的列
      const minColumnHeight = Math.min(...columnHeights);
      const columnIndex = columnHeights.indexOf(minColumnHeight);
      
      // 记录项目位置信息
      itemPositions.push({
        item,
        columnIndex,
        top: minColumnHeight,
        left: columnIndex * (itemWidth + columnGap)
      });
      
      // 更新该列的高度
      columnHeights[columnIndex] = minColumnHeight + item.height + columnGap;
    });

    // 计算容器总高度
    const containerHeight = Math.max(...columnHeights);

    return (
      <div 
        className="relative bg-gray-100 rounded-lg p-4 overflow-auto"
        style={{ 
          width: columnCount * itemWidth + (columnCount - 1) * columnGap + 24, // 加上padding
          height: 400
        }}
      >
        <div 
          className="relative"
          style={{ 
            width: columnCount * itemWidth + (columnCount - 1) * columnGap,
            height: containerHeight
          }}
        >
          {itemPositions.map(({ item, top, left }) => (
            <div
              key={item.id}
              className="absolute rounded shadow-lg flex items-center justify-center text-gray-700 font-medium"
              style={{
                top,
                left,
                width: itemWidth,
                height: item.height,
                backgroundColor: item.color
              }}
            >
              Item {item.id}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">瀑布流布局配置</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              列数: {columnCount}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={columnCount}
              onChange={(e) => setColumnCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>6</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              列间距: {columnGap}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={columnGap}
              onChange={(e) => setColumnGap(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0px</span>
              <span>50px</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              项目宽度: {itemWidth}px
            </label>
            <input
              type="range"
              min="100"
              max="300"
              value={itemWidth}
              onChange={(e) => setItemWidth(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>100px</span>
              <span>300px</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              项目数量: {itemCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5</span>
              <span>50</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            重新生成数据
          </button>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg">
        {renderWaterfall()}
      </div>
    </div>
  );
};

export default WaterfallLayoutDemo;