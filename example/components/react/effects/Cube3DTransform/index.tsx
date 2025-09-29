import React from 'react';
import './index.scss';

interface Cube3DTransformProps {
	cubeSize?: number; // 立方体大小 (em)
	animationDuration?: number; // 动画持续时间 (秒)
	colors?: string[]; // 立方体各面的颜色
	containerWidth?: number; // 容器宽度 (px)
}

const Cube3DTransform: React.FC<Cube3DTransformProps> = ({
	cubeSize = 3,
	animationDuration = 4,
	colors = ['#3498db', '#2ecc71', '#e74c3c'],
	containerWidth = 500
}) => {
	return (
		<div className="cube-3d-transform" style={{ width: containerWidth }}>
			<div
				className="container"
				style={
					{
						'--cube-size': `${cubeSize}em`,
						'--animation-duration': `${animationDuration}s`
					} as React.CSSProperties
				}
			>
				{[0, 1, 2].map(index => (
					<div
						className="box-wrapper"
						key={index}
						style={
							{
								'--box-color': colors[index % colors.length],
								'--box-color-dark': darkenColor(colors[index % colors.length], 0.2)
							} as React.CSSProperties
						}
					>
						<div className="box"></div>
					</div>
				))}
			</div>
		</div>
	);
};

// 颜色加深函数
function darkenColor(color: string, amount: number): string {
	// 处理十六进制颜色
	if (color.startsWith('#')) {
		const hex = color.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		const dr = Math.floor(r * (1 - amount));
		const dg = Math.floor(g * (1 - amount));
		const db = Math.floor(b * (1 - amount));

		return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db
			.toString(16)
			.padStart(2, '0')}`;
	}

	// 处理 rgb 颜色
	if (color.startsWith('rgb')) {
		const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (match) {
			const r = Math.floor(parseInt(match[1]) * (1 - amount));
			const g = Math.floor(parseInt(match[2]) * (1 - amount));
			const b = Math.floor(parseInt(match[3]) * (1 - amount));
			return `rgb(${r}, ${g}, ${b})`;
		}
	}

	return color;
}

export default Cube3DTransform;
