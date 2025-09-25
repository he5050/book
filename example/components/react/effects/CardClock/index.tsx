import React, { useState, useEffect } from 'react';
import './index.scss';

// 定义数字状态，每个数组表示对应数字需要显示的片段索引
// 基于原版HTML代码的13个片段布局
const NUMBER_STATES: number[][] = [
	[1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13], // 0
	[3, 5, 8, 10, 13], // 1
	[1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13], // 2
	[1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13], // 3
	[1, 3, 4, 5, 6, 7, 8, 10, 13], // 4
	[1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13], // 5
	[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13], // 6
	[1, 2, 3, 5, 8, 10, 13], // 7
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // 8
	[1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13] // 9
];

interface NumberDisplayProps {
	digit: number;
	pieceSize?: number; // 新增属性：控制片段大小
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ digit, pieceSize }) => {
	// 创建13个片段的数组
	const pieces = Array(13).fill(0);

	return (
		<div
			className="number"
			style={pieceSize ? ({ '--piece-size': `${pieceSize}px` } as React.CSSProperties) : {}}
		>
			{pieces.map((_, index) => {
				// 检查当前数字是否需要显示这个片段
				const show = NUMBER_STATES[digit].includes(index + 1);
				return <div key={index} className={`piece ${show ? 'show' : ''}`} />;
			})}
		</div>
	);
};

interface CardClockProps {
	hour?: number;
	minute?: number;
	second?: number;
	className?: string;
	style?: React.CSSProperties;
	pieceSize?: number; // 片段大小，默认10px
	containerWidth?: number; // 容器宽度，默认500px
	containerHeight?: number; // 容器高度，默认400px
}

const CardClock: React.FC<CardClockProps> = ({
	hour: propHour,
	minute: propMinute,
	second: propSecond,
	className = '',
	style = {},
	pieceSize = 10, // 默认片段大小为10px
	containerWidth = 570, // 默认容器宽度570px
	containerHeight = 400 // 默认容器高度400px
}) => {
	const [time, setTime] = useState({
		hour: propHour ?? 0,
		minute: propMinute ?? 0,
		second: propSecond ?? 0
	});

	useEffect(() => {
		// 如果没有传入时间，则使用当前时间
		if (propHour === undefined && propMinute === undefined && propSecond === undefined) {
			const updateTime = () => {
				const now = new Date();
				setTime({
					hour: now.getHours(),
					minute: now.getMinutes(),
					second: now.getSeconds()
				});
			};

			updateTime();
			const interval = setInterval(updateTime, 1000);

			return () => clearInterval(interval);
		}
	}, [propHour, propMinute, propSecond]);

	// 将数字转换为两位数字符串
	const formatNumber = (num: number): string => {
		return num < 10 ? `0${num}` : `${num}`;
	};

	// 分解数字为十位和个位
	const getDigits = (num: number): [number, number] => {
		const str = formatNumber(num);
		return [parseInt(str[0]), parseInt(str[1])];
	};

	const [hourTens, hourOnes] = getDigits(time.hour);
	const [minuteTens, minuteOnes] = getDigits(time.minute);
	const [secondTens, secondOnes] = getDigits(time.second);

	return (
		<div
			className={`card-clock ${className}`}
			style={{
				...style,
				width: `${containerWidth}px`,
				height: `${containerHeight}px`
			}}
		>
			<div className="container">
				<div className="flex" id="hours">
					<NumberDisplay digit={hourTens} pieceSize={pieceSize} />
					<NumberDisplay digit={hourOnes} pieceSize={pieceSize} />
				</div>

				<div className="flex" id="minutes">
					<NumberDisplay digit={minuteTens} pieceSize={pieceSize} />
					<NumberDisplay digit={minuteOnes} pieceSize={pieceSize} />
				</div>

				<div className="flex" id="seconds">
					<NumberDisplay digit={secondTens} pieceSize={pieceSize} />
					<NumberDisplay digit={secondOnes} pieceSize={pieceSize} />
				</div>
			</div>
		</div>
	);
};

export default CardClock;
