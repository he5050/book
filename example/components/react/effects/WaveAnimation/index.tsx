import React, { useEffect, useRef } from 'react';
import './index.scss';

interface WaveAnimationProps {
	width?: number;
	height?: number;
	amplitude?: number;
	frequency?: number;
	speed?: number;
	color?: string;
	showProbability?: boolean;
	probabilityColor?: string;
	className?: string;
	style?: React.CSSProperties;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({
	width = 500,
	height = 300,
	amplitude = 100,
	frequency = 0.2,
	speed = 0.02,
	color = 'cyan',
	showProbability = true,
	probabilityColor = 'yellow',
	className = '',
	style = {}
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const timeRef = useRef(0);
	const animationRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const N = 500;
		const dx = 1;

		const draw = () => {
			if (!ctx) return;

			// 清除画布
			ctx.clearRect(0, 0, width, height);
			ctx.lineWidth = 2;

			// 绘制波函数实部
			ctx.beginPath();
			ctx.strokeStyle = color;

			for (let i = 0; i < N; i++) {
				let x = (i - N / 2) * dx;
				let sigma = 30;
				let k0 = frequency;

				// 高斯包络
				let envelope = Math.exp((-x * x) / (2 * sigma * sigma));

				// 时间演化的波：Re(ψ) = envelope * cos(kx - ωt)
				let real = envelope * Math.cos(k0 * x - speed * timeRef.current);

				let px = i * (width / N);
				let py = height / 2 - real * amplitude;

				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}

			ctx.stroke();

			// 绘制概率密度 (|ψ|²)
			if (showProbability) {
				ctx.beginPath();
				ctx.strokeStyle = probabilityColor;
				for (let i = 0; i < N; i++) {
					let x = (i - N / 2) * dx;
					let sigma = 30;
					let k0 = frequency;
					let envelope = Math.exp((-x * x) / (2 * sigma * sigma));
					let prob = envelope * envelope;

					let px = i * (width / N);
					let py = height / 2 - prob * amplitude * 3;

					if (i === 0) ctx.moveTo(px, py);
					else ctx.lineTo(px, py);
				}
				ctx.stroke();
			}

			timeRef.current += 1;
			animationRef.current = requestAnimationFrame(draw);
		};

		animationRef.current = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(animationRef.current);
		};
	}, [width, height, amplitude, frequency, speed, color, showProbability, probabilityColor]);

	return (
		<div className={`wave-animation ${className}`} style={style}>
			<canvas ref={canvasRef} width={width} height={height} />
		</div>
	);
};

export default WaveAnimation;
