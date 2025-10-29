import React, { useState } from 'react';
import ImagePuzzleGame from './index';

const ImagePuzzleGameDemo: React.FC = () => {
  const [gridSize, setGridSize] = useState(3);
  const [pieceSize, setPieceSize] = useState(80);
  const [boardPieceSize, setBoardPieceSize] = useState(100);
  const [gap, setGap] = useState(8);
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/300/300');
  const [autoShuffle, setAutoShuffle] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [enableHints, setEnableHints] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#2f363e');
  const [gameKey, setGameKey] = useState(0);

  const presetImages = [
    { name: '风景', url: 'https://picsum.photos/300/300?random=1' },
    { name: '动物', url: 'https://picsum.photos/300/300?random=2' },
    { name: '建筑', url: 'https://picsum.photos/300/300?random=3' },
    { name: '花朵', url: 'https://picsum.photos/300/300?random=4' },
    { name: '汽车', url: 'https://picsum.photos/300/300?random=5' }
  ];

  const difficultyLevels = [
    { name: '简单 (3x3)', size: 3 },
    { name: '中等 (4x4)', size: 4 },
    { name: '困难 (5x5)', size: 5 }
  ];

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    setGameKey(prev => prev + 1); // 强制重新渲染游戏
  };

  const handleDifficultyChange = (size: number) => {
    setGridSize(size);
    setGameKey(prev => prev + 1); // 强制重新渲染游戏
  };

  const handleGameComplete = (stats: { moves: number; time: number }) => {
    alert(`恭喜完成！\n移动次数: ${stats.moves}\n用时: ${stats.time}秒`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>图片拼图游戏</h1>
      
      {/* 难度选择 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px'
      }}>
        <h3>难度选择</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {difficultyLevels.map(level => (
            <button 
              key={level.size}
              onClick={() => handleDifficultyChange(level.size)}
              style={{
                padding: '8px 16px',
                border: gridSize === level.size ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: '4px',
                background: gridSize === level.size ? '#007bff' : 'white',
                color: gridSize === level.size ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      {/* 图片选择 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px'
      }}>
        <h3>图片选择</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          {presetImages.map(image => (
            <button 
              key={image.name}
              onClick={() => handleImageChange(image.url)}
              style={{
                padding: '8px 16px',
                border: imageUrl === image.url ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: '4px',
                background: imageUrl === image.url ? '#007bff' : 'white',
                color: imageUrl === image.url ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              {image.name}
            </button>
          ))}
        </div>
        <div>
          <label>自定义图片URL: </label>
          <input 
            type="text" 
            value={imageUrl} 
            onChange={(e) => handleImageChange(e.target.value)}
            style={{ 
              width: '300px', 
              padding: '5px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>
      </div>
      
      {/* 参数配置面板 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div>
          <label>拼图块大小: {pieceSize}px</label>
          <input 
            type="range" 
            min="60" 
            max="120" 
            value={pieceSize} 
            onChange={(e) => setPieceSize(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>拼图板格子大小: {boardPieceSize}px</label>
          <input 
            type="range" 
            min="80" 
            max="150" 
            value={boardPieceSize} 
            onChange={(e) => setBoardPieceSize(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>间距: {gap}px</label>
          <input 
            type="range" 
            min="2" 
            max="20" 
            value={gap} 
            onChange={(e) => setGap(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label>背景颜色: </label>
          <input 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={autoShuffle} 
              onChange={(e) => setAutoShuffle(e.target.checked)}
            />
            自动打乱
          </label>
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={showPreview} 
              onChange={(e) => setShowPreview(e.target.checked)}
            />
            显示预览图
          </label>
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={enableHints} 
              onChange={(e) => setEnableHints(e.target.checked)}
            />
            启用提示
          </label>
        </div>
      </div>

      {/* 游戏区域 */}
      <div style={{ 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <ImagePuzzleGame
          key={gameKey}
          gridSize={gridSize}
          pieceSize={pieceSize}
          boardPieceSize={boardPieceSize}
          gap={gap}
          imageUrl={imageUrl}
          autoShuffle={autoShuffle}
          showPreview={showPreview}
          enableHints={enableHints}
          backgroundColor={backgroundColor}
          onComplete={handleGameComplete}
        />
      </div>

      {/* 游戏说明 */}
      <div style={{ marginTop: '30px' }}>
        <h3>游戏说明</h3>
        <ul>
          <li><strong>目标</strong>: 将左侧的拼图块拖拽到右侧拼图板的正确位置</li>
          <li><strong>操作</strong>: 点击并拖拽拼图块到目标位置</li>
          <li><strong>提示</strong>: 正确位置的拼图块会显示绿色边框</li>
          <li><strong>完成</strong>: 所有拼图块都放置到正确位置即可完成游戏</li>
        </ul>
        
        <h3>参数说明</h3>
        <ul>
          <li><strong>难度选择</strong>: 选择3x3、4x4或5x5的拼图网格</li>
          <li><strong>图片选择</strong>: 选择预设图片或输入自定义图片URL</li>
          <li><strong>拼图块大小</strong>: 控制左侧拼图块的尺寸</li>
          <li><strong>拼图板格子大小</strong>: 控制右侧拼图板格子的尺寸</li>
          <li><strong>间距</strong>: 控制拼图块之间的间距</li>
          <li><strong>背景颜色</strong>: 自定义游戏背景颜色</li>
          <li><strong>自动打乱</strong>: 游戏开始时是否自动打乱拼图块</li>
          <li><strong>显示预览图</strong>: 是否显示完整图片作为参考</li>
          <li><strong>启用提示</strong>: 是否启用拼图提示功能</li>
        </ul>
      </div>
    </div>
  );
};

export default ImagePuzzleGameDemo;