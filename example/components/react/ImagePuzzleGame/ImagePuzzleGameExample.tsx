import React from 'react';
import ImagePuzzleGame from './index';

const ImagePuzzleGameExample: React.FC = () => {
  const handleGameComplete = (stats: { moves: number; time: number }) => {
    console.log('游戏完成!', stats);
  };

  return (
    <div style={{ 
      textAlign: 'center',
      padding: '20px'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>
        图片拼图游戏示例
      </h2>
      <ImagePuzzleGame
        gridSize={3}
        pieceSize={80}
        boardPieceSize={100}
        gap={8}
        imageUrl="https://picsum.photos/300/300"
        autoShuffle={true}
        showPreview={false}
        enableHints={false}
        backgroundColor="#2f363e"
        onComplete={handleGameComplete}
      />
    </div>
  );
};

export default ImagePuzzleGameExample;