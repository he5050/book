import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface PuzzlePiece {
	id: string;
	correctPosition: number;
	currentPosition: number;
	imageUrl: string;
}

interface ImagePuzzleGameProps {
	gridSize?: number;
	pieceSize?: number;
	boardPieceSize?: number;
	gap?: number;
	imageUrl?: string;
	autoShuffle?: boolean;
	showPreview?: boolean;
	enableHints?: boolean;
	backgroundColor?: string;
	onComplete?: (stats: { moves: number; time: number }) => void;
	className?: string;
}

const ImagePuzzleGame: React.FC<ImagePuzzleGameProps> = ({
	gridSize = 3,
	pieceSize = 100,
	boardPieceSize = 140,
	gap = 10,
	imageUrl = 'https://picsum.photos/300/300',
	autoShuffle = true,
	showPreview = false,
	enableHints = false,
	backgroundColor = '#2f363e',
	onComplete,
	className = ''
}) => {
	const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
	const [boardPieces, setBoardPieces] = useState<(PuzzlePiece | null)[]>([]);
	const [moves, setMoves] = useState(0);
	const [startTime, setStartTime] = useState(Date.now());
	const [isCompleted, setIsCompleted] = useState(false);
	const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [actualImageUrl, setActualImageUrl] = useState<string>('');

  const puzzleContainerRef = useRef<HTMLDivElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);

	// 初始化拼图块
		const initializePuzzle = useCallback(() => {
			const totalPieces = gridSize * gridSize;
			const newPieces: PuzzlePiece[] = [];

			// 使用预览图已经加载的实际URL，如果没有则使用原始URL
			const useImageUrl = actualImageUrl || imageUrl;

			for (let i = 0; i < totalPieces; i++) {
				newPieces.push({
					id: `piece-${i}`,
					correctPosition: i,
					currentPosition: i,
					imageUrl: useImageUrl
				});
			}

			if (autoShuffle) {
				// 随机打乱
				for (let i = newPieces.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
					newPieces[i].currentPosition = i;
					newPieces[j].currentPosition = j;
				}
			}

			setPieces(newPieces);
			setBoardPieces(new Array(totalPieces).fill(null));
			setMoves(0);
			setStartTime(Date.now());
			setIsCompleted(false);
		}, [gridSize, imageUrl, autoShuffle, actualImageUrl]);

	// 检查是否完成
	const checkCompletion = useCallback(() => {
		// 确保所有位置都有拼图块，且都在正确位置
		const hasAllPieces = boardPieces.every(piece => piece !== null);
		const isComplete =
			hasAllPieces && boardPieces.every((piece, index) => piece && piece.correctPosition === index);

		if (isComplete && !isCompleted) {
			setIsCompleted(true);
			const endTime = Date.now();
			const timeElapsed = Math.floor((endTime - startTime) / 1000);
			onComplete?.({ moves, time: timeElapsed });
		}
	}, [boardPieces, isCompleted, moves, startTime, onComplete]);

	useEffect(() => {
		initializePuzzle();
	}, [initializePuzzle]);

	useEffect(() => {
		// 只有当拼图板有内容且游戏已经开始时才检查完成状态
		if (boardPieces.some(piece => piece !== null) && moves > 0) {
			checkCompletion();
		}
	}, [checkCompletion, boardPieces, moves]);

	// 拖拽开始
	const handleDragStart = (e: React.DragEvent, pieceId: string) => {
		setDraggedPiece(pieceId);
		e.dataTransfer.setData('text/plain', pieceId);
		e.dataTransfer.effectAllowed = 'move';
	};

	// 允许放置
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	// 放置到拼图板
  const handleDropToBoard = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    
    // 检查是否从原始区域拖拽
    const pieceFromOriginal = pieces.find(p => p.id === pieceId);
    
    if (pieceFromOriginal && !boardPieces[targetIndex]) {
      // 从原始区域移除
      setPieces(prev => prev.filter(p => p.id !== pieceId));
      
      // 添加到拼图板
      setBoardPieces(prev => {
        const newBoard = [...prev];
        newBoard[targetIndex] = pieceFromOriginal;
        return newBoard;
      });
      
      setMoves(prev => prev + 1);
    } else {
      // 检查是否从拼图板内部拖拽（交换位置）
      const sourceIndex = boardPieces.findIndex(p => p?.id === pieceId);
      if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        setBoardPieces(prev => {
          const newBoard = [...prev];
          const sourcePiece = newBoard[sourceIndex];
          const targetPiece = newBoard[targetIndex];
          
          // 交换位置
          newBoard[sourceIndex] = targetPiece;
          newBoard[targetIndex] = sourcePiece;
          
          return newBoard;
        });
        
        setMoves(prev => prev + 1);
      }
    }
    setDraggedPiece(null);
  };

	// 放置回原始区域
  const handleDropToPuzzle = (e: React.DragEvent) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    
    // 只允许从拼图板移回原始区域
    const boardIndex = boardPieces.findIndex(p => p?.id === pieceId);
    if (boardIndex !== -1) {
      const piece = boardPieces[boardIndex];
      if (piece) {
        setBoardPieces(prev => {
          const newBoard = [...prev];
          newBoard[boardIndex] = null;
          return newBoard;
        });
        
        setPieces(prev => [...prev, piece]);
        setMoves(prev => prev + 1);
      }
    }
    setDraggedPiece(null);
  };

	// 重置游戏
  const resetGame = () => {
    // 重新生成图片URL，确保获取新的随机图片
    const newImageUrl = imageUrl.includes('picsum.photos') 
      ? imageUrl.split('?')[0] + '?random=' + Date.now()
      : imageUrl;
    
    // 清空当前的实际图片URL和游戏状态
    setActualImageUrl('');
    setPieces([]);
    setBoardPieces([]);
    setMoves(0);
    setStartTime(Date.now());
    setIsCompleted(false);
    
    // 创建新的图片元素来预加载
    const newImg = new Image();
    newImg.crossOrigin = 'anonymous';
    newImg.onload = () => {
      // 图片预加载完成后，更新状态并初始化
      setActualImageUrl(newImg.src);
      
      // 更新预览图
      if (previewImageRef.current) {
        previewImageRef.current.src = newImg.src;
      }
      
      // 延迟初始化确保状态更新
      setTimeout(() => {
        const totalPieces = gridSize * gridSize;
        const newPieces: PuzzlePiece[] = [];
        
        for (let i = 0; i < totalPieces; i++) {
          newPieces.push({
            id: `piece-${i}`,
            correctPosition: i,
            currentPosition: i,
            imageUrl: newImg.src
          });
        }

        if (autoShuffle) {
          // 随机打乱
          for (let i = newPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
            newPieces[i].currentPosition = i;
            newPieces[j].currentPosition = j;
          }
        }

        setPieces(newPieces);
        setBoardPieces(new Array(totalPieces).fill(null));
      }, 50);
    };
    
    newImg.onerror = () => {
      console.error('图片加载失败，使用原始URL');
      setActualImageUrl(newImageUrl);
      initializePuzzle();
    };
    
    // 开始加载新图片
    newImg.src = newImageUrl;
  };

	const containerStyles = {
		'--grid-size': gridSize,
		'--piece-size': `${pieceSize}px`,
		'--board-piece-size': `${boardPieceSize}px`,
		'--gap': `${gap}px`,
		'--bg-color': backgroundColor,
		'--image-url': `url(${imageUrl})`
	} as React.CSSProperties;

	return (
		<div className={`image-puzzle-container ${className}`} style={containerStyles}>
			{/* 游戏信息 */}
			<div className="game-info">
				<div className="stats">
					<span>移动次数: {moves}</span>
					<span>时间: {Math.floor((Date.now() - startTime) / 1000)}s</span>
				</div>
				<button className="reset-btn" onClick={resetGame}>
					重新开始
				</button>
			</div>

			{/* 预览图片 - 始终加载但控制显示 */}
      <div className={`preview-image ${showPreview ? 'visible' : 'hidden'}`}>
        <img 
          ref={previewImageRef}
          src={imageUrl} 
          alt="完整图片"
          onLoad={() => {
            // 图片加载完成后，使用这个图片的实际URL
            if (previewImageRef.current) {
              setActualImageUrl(previewImageRef.current.src);
            }
          }}
        />
      </div>

			<div className="game-area">
				{/* 拼图块区域 */}
				<div
					ref={puzzleContainerRef}
					className="puzzle-pieces"
					onDragOver={handleDragOver}
					onDrop={handleDropToPuzzle}
				>
					<h3>拼图块</h3>
					<div className="pieces-container">
						{pieces.map(piece => (
							<div
								key={piece.id}
								className={`puzzle-piece ${draggedPiece === piece.id ? 'dragging' : ''}`}
								draggable
								onDragStart={e => handleDragStart(e, piece.id)}
								style={{
									backgroundImage: `url(${actualImageUrl || piece.imageUrl})`,
									backgroundPosition: `${-(piece.correctPosition % gridSize) * pieceSize}px ${
										-Math.floor(piece.correctPosition / gridSize) * pieceSize
									}px`,
									backgroundSize: `${gridSize * pieceSize}px ${gridSize * pieceSize}px`
								}}
							/>
						))}
					</div>
				</div>

				{/* 拼图板区域 */}
				<div ref={boardContainerRef} className="puzzle-board">
					<h3>拼图板</h3>
					<div className="board-grid">
						{boardPieces.map((piece, index) => (
							<div
								key={index}
								className={`board-slot ${piece ? 'filled' : 'empty'} ${
									piece && piece.correctPosition === index ? 'correct' : ''
								}`}
								onDragOver={handleDragOver}
								onDrop={e => handleDropToBoard(e, index)}
							>
								{piece && (
									<div
										className="puzzle-piece in-board"
										draggable
										onDragStart={e => handleDragStart(e, piece.id)}
										style={{
											backgroundImage: `url(${actualImageUrl || piece.imageUrl})`,
											backgroundPosition: `${
												-(piece.correctPosition % gridSize) * boardPieceSize
											}px ${-Math.floor(piece.correctPosition / gridSize) * boardPieceSize}px`,
											backgroundSize: `${gridSize * boardPieceSize}px ${
												gridSize * boardPieceSize
											}px`
										}}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 完成提示 */}
      {isCompleted && (
        <div className="completion-modal">
          <div className="modal-content">
            <h2>🎉 恭喜完成!</h2>
            <p>移动次数: {moves}</p>
            <p>用时: {Math.floor((Date.now() - startTime) / 1000)}秒</p>
            <button onClick={resetGame}>再玩一次</button>
          </div>
        </div>
      )}
		</div>
	);
};

export default ImagePuzzleGame;
