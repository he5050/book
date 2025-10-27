import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface Seat {
	id: string;
	row: number;
	seat: number;
	status: 'available' | 'selected' | 'occupied' | 'selectedByOther';
	selectedBy?: string;
}

interface SeatData {
	rows: number;
	seatsPerRow: number;
	seats: Record<string, Seat>;
}

interface MovieSeatSelectionProps {
	width?: number;
	height?: number;
	onSeatSelect?: (seats: Seat[]) => void;
	userId?: string;
	className?: string;
}

// 座位颜色配置
const SEAT_COLORS = {
	available: '#4CAF50', // 可选 - 绿色
	selected: '#2196F3', // 已选 - 蓝色
	occupied: '#F44336', // 已售 - 红色
	selectedByOther: '#FF9800', // 他人已选 - 橙色
	hover: '#81C784' // 悬停 - 浅绿色
};

// 座位配置常量
const SEAT_SIZE = 30; // 座位大小
const SEAT_SPACING = 35; // 座位间距
const ROW_SPACING = 40; // 行间距
const CANVAS_PADDING = 50; // 画布边距
const AISLE_WIDTH = 20; // 过道宽度

const MovieSeatSelection: React.FC<MovieSeatSelectionProps> = ({
	width = 600,
	height = 400,
	onSeatSelect,
	userId = Math.random().toString(36).substr(2, 9),
	className = ''
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [seatData, setSeatData] = useState<SeatData | null>(null);
	const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
	const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
	const [confirmedSeats, setConfirmedSeats] = useState<Seat[]>([]);

	// 初始化座位数据
	useEffect(() => {
		const rows = 8;
		const seatsPerRow = 12;
		const seats: Record<string, Seat> = {};

		for (let row = 0; row < rows; row++) {
			for (let seat = 0; seat < seatsPerRow; seat++) {
				const seatId = `${row}-${seat}`;
				seats[seatId] = {
					id: seatId,
					row,
					seat,
					status: Math.random() > 0.7 ? 'occupied' : 'available',
					selectedBy: undefined
				};
			}
		}

		setSeatData({
			rows,
			seatsPerRow,
			seats
		});
	}, []);

	// 监听seatData变化，更新选中座位列表
	useEffect(() => {
		if (seatData) {
			const selected = Object.values(seatData.seats).filter(
				s => s.status === 'selected' && s.selectedBy === userId
			);
			setSelectedSeats(selected);
		}
	}, [seatData, userId]);

	// 设备像素比适配
	const drawSeatMap = useCallback(() => {
		if (!seatData || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// 获取设备像素比
		const dpr = window.devicePixelRatio || 1;

		// 获取Canvas的显示尺寸
		const rect = canvas.getBoundingClientRect();
		const displayWidth = rect.width;
		const displayHeight = rect.height;

		// 设置Canvas的实际像素尺寸
		canvas.width = displayWidth * dpr;
		canvas.height = displayHeight * dpr;

		// 缩放绘图上下文以匹配设备像素比
		ctx.scale(dpr, dpr);

		// 设置Canvas的CSS尺寸
		canvas.style.width = displayWidth + 'px';
		canvas.style.height = displayHeight + 'px';

		// 清除画布
		ctx.clearRect(0, 0, displayWidth, displayHeight);

		// 绘制屏幕
		ctx.fillStyle = '#333';
		ctx.fillRect(CANVAS_PADDING, CANVAS_PADDING, displayWidth - CANVAS_PADDING * 2, 40);
		ctx.fillStyle = '#fff';
		ctx.font = '16px Arial';
		ctx.textAlign = 'center';
		ctx.fillText('SCREEN', displayWidth / 2, CANVAS_PADDING + 25);

		// 绘制座位
		for (let row = 0; row < seatData.rows; row++) {
			for (let seat = 0; seat < seatData.seatsPerRow; seat++) {
				const seatId = `${row}-${seat}`;
				const seatInfo = seatData.seats[seatId];
				drawSeat(ctx, row, seat, seatInfo, seatId);
			}
		}

		// 绘制行号
		ctx.fillStyle = '#333';
		ctx.font = '14px Arial';
		ctx.textAlign = 'center';
		for (let row = 0; row < seatData.rows; row++) {
			const y = CANVAS_PADDING + 60 + row * ROW_SPACING + SEAT_SIZE / 2 + 5;
			ctx.fillText(`${row + 1}`, CANVAS_PADDING / 2, y);
		}
	}, [seatData, hoveredSeat, selectedSeats]);

	// 绘制圆角矩形
	const drawRoundedRect = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number
	) => {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	};

	// 绘制单个座位
	const drawSeat = (
		ctx: CanvasRenderingContext2D,
		row: number,
		seat: number,
		seatInfo: Seat,
		seatId: string
	) => {
		// 计算座位位置，第6座后添加过道
		const x = CANVAS_PADDING + seat * SEAT_SPACING + (seat >= 6 ? AISLE_WIDTH : 0);
		const y = CANVAS_PADDING + 60 + row * ROW_SPACING;

		// 根据座位状态确定颜色
		let color = SEAT_COLORS.available;
		if (seatInfo.status === 'occupied') {
			color = SEAT_COLORS.occupied;
		} else if (seatInfo.status === 'selected') {
			// 确保当前用户选中的座位显示蓝色
			color = seatInfo.selectedBy === userId ? SEAT_COLORS.selected : SEAT_COLORS.selectedByOther;
		} else if (seatInfo.status === 'available' && hoveredSeat === seatId) {
			color = SEAT_COLORS.hover;
		}

		// 绘制圆角矩形座位
		ctx.fillStyle = color;
		drawRoundedRect(ctx, x, y, SEAT_SIZE, SEAT_SIZE, 5);
		ctx.fill();

		// 绘制座位编号
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 12px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// 显示座位号，已选座位也显示座位号而不是"已选"文字
		if (seatInfo.status === 'occupied') {
			ctx.fillText('已售', x + SEAT_SIZE / 2, y + SEAT_SIZE / 2);
		} else {
			// 所有可选和已选座位都显示座位号
			ctx.fillText(`${row + 1}-${seat + 1}`, x + SEAT_SIZE / 2, y + SEAT_SIZE / 2);
		}
	};

	// 重绘座位图
	useEffect(() => {
		console.log('重绘座位图，selectedSeats:', selectedSeats);
		drawSeatMap();
	}, [seatData, hoveredSeat, selectedSeats, drawSeatMap]);

	// 窗口大小变化时重绘
	useEffect(() => {
		const handleResize = () => {
			drawSeatMap();
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [drawSeatMap]);

	// 处理Canvas点击事件
	const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!seatData || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		// 遍历所有座位进行碰撞检测
		for (let row = 0; row < seatData.rows; row++) {
			for (let seat = 0; seat < seatData.seatsPerRow; seat++) {
				const seatX = CANVAS_PADDING + seat * SEAT_SPACING + (seat >= 6 ? AISLE_WIDTH : 0);
				const seatY = CANVAS_PADDING + 60 + row * ROW_SPACING;

				if (x >= seatX && x <= seatX + SEAT_SIZE && y >= seatY && y <= seatY + SEAT_SIZE) {
					const seatId = `${row}-${seat}`;
					const seatInfo = seatData.seats[seatId];

					if (seatInfo && seatInfo.status !== 'occupied') {
						// 切换选择状态
						const newSeatData = { ...seatData };

						if (seatInfo.status === 'available') {
							// 选择座位
							newSeatData.seats[seatId] = {
								...seatInfo,
								status: 'selected',
								selectedBy: userId
							};
						} else if (seatInfo.status === 'selected' && seatInfo.selectedBy === userId) {
							// 取消选择当前用户选中的座位
							newSeatData.seats[seatId] = {
								...seatInfo,
								status: 'available',
								selectedBy: undefined
							};
						} else if (seatInfo.status === 'selected' && seatInfo.selectedBy !== userId) {
							// 其他用户选择的座位，不允许操作
							return;
						}
						setSeatData(newSeatData);

						// 更新座位数据，选中座位列表会通过 useEffect 自动更新
						setSeatData(newSeatData);
						onSeatSelect?.(
							Object.values(newSeatData.seats).filter(
								s => s.status === 'selected' && s.selectedBy === userId
							)
						);
					}
					return;
				}
			}
		}
	};

	// 处理鼠标移动事件
	const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!seatData || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		let foundSeat = null;

		// 查找鼠标悬停的座位
		for (let row = 0; row < seatData.rows; row++) {
			for (let seat = 0; seat < seatData.seatsPerRow; seat++) {
				const seatX = CANVAS_PADDING + seat * SEAT_SPACING + (seat >= 6 ? AISLE_WIDTH : 0);
				const seatY = CANVAS_PADDING + 60 + row * ROW_SPACING;

				if (x >= seatX && x <= seatX + SEAT_SIZE && y >= seatY && y <= seatY + SEAT_SIZE) {
					foundSeat = `${row}-${seat}`;
					break;
				}
			}
			if (foundSeat) break;
		}

		if (foundSeat !== hoveredSeat) {
			setHoveredSeat(foundSeat);
		}
	};

	// 处理鼠标离开事件
	const handleCanvasMouseLeave = () => {
		setHoveredSeat(null);
	};

	// 处理确认选座
	const handleConfirmSeats = () => {
		if (selectedSeats.length === 0 || !seatData) return;

		// 更新座位状态为已售
		const newSeatData = { ...seatData };
		selectedSeats.forEach(seat => {
			const seatId = `${seat.row}-${seat.seat}`;
			if (newSeatData.seats && newSeatData.seats[seatId]) {
				newSeatData.seats[seatId] = {
					...newSeatData.seats[seatId],
					status: 'occupied',
					selectedBy: undefined
				};
			}
		});

		setSeatData(newSeatData);
		setConfirmedSeats([...confirmedSeats, ...selectedSeats]); // 累加已确认的座位
		setSelectedSeats([]);
		alert(`已确认座位: ${selectedSeats.map(s => `${s.row + 1}排${s.seat + 1}座`).join(', ')}`);
	};

	// 重置选座
	const handleResetSeats = () => {
		if (!seatData) return;

		// 将已确认的座位恢复为可选状态
		const newSeatData = { ...seatData };
		confirmedSeats.forEach(seat => {
			const seatId = `${seat.row}-${seat.seat}`;
			if (newSeatData.seats && newSeatData.seats[seatId]) {
				newSeatData.seats[seatId] = {
					...newSeatData.seats[seatId],
					status: 'available',
					selectedBy: undefined
				};
			}
		});

		setSeatData(newSeatData);
		setConfirmedSeats([]);
	};

	return (
		<div className={`movie-seat-selection ${className}`} style={{ width, height }}>
			<div className="seat-selection-header">
				<h3>电影选座</h3>
				<div className="legend">
					<div className="legend-item">
						<div className="legend-color available"></div>
						<span>可选</span>
					</div>
					<div className="legend-item">
						<div className="legend-color selected"></div>
						<span>已选</span>
					</div>
					<div className="legend-item">
						<div className="legend-color occupied"></div>
						<span>已售</span>
					</div>
					<div className="legend-item">
						<div className="legend-color selected-by-other"></div>
						<span>他人已选</span>
					</div>
				</div>
			</div>
			<div className="canvas-container">
				<canvas
					ref={canvasRef}
					onClick={handleCanvasClick}
					onMouseMove={handleCanvasMouseMove}
					onMouseLeave={handleCanvasMouseLeave}
					width={width}
					height={height - 80}
				/>
			</div>
			<div className="selection-info">
				<div className="selected-seats">
					已选座位: {selectedSeats.map(s => `${s.row + 1}排${s.seat + 1}座`).join(', ') || '无'}
				</div>
				<button
					className="confirm-button"
					disabled={selectedSeats.length === 0}
					onClick={handleConfirmSeats}
				>
					确认选座
				</button>
				{confirmedSeats.length > 0 && (
					<button className="reset-button" onClick={handleResetSeats}>
						重置选座
					</button>
				)}
			</div>
		</div>
	);
};

export default MovieSeatSelection;
