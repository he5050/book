import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface HeartAnimationProps {
	particleCount?: number;
	duration?: number;
	velocity?: number;
	size?: number;
	color?: string;
	className?: string;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({
	particleCount = 400,
	duration = 2,
	velocity = 90,
	size = 30,
	color = '#FF416C',
	className = ''
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const particlesRef = useRef<any[]>([]);
	const activeParticlesRef = useRef<number>(0);
	const freeParticlesRef = useRef<number>(0);
	const timeRef = useRef<number>(0);
	const particleImageRef = useRef<HTMLImageElement | null>(null);

	// Point class
	class Point {
		x: number;
		y: number;

		constructor(x = 0, y = 0) {
			this.x = x;
			this.y = y;
		}

		clone(): Point {
			return new Point(this.x, this.y);
		}

		length(length?: number): number | Point {
			if (length === undefined) {
				return Math.sqrt(this.x * this.x + this.y * this.y);
			}
			this.normalize();
			this.x *= length;
			this.y *= length;
			return this;
		}

		normalize(): Point {
			const len = this.length() as number;
			if (len !== 0) {
				this.x /= len;
				this.y /= len;
			}
			return this;
		}
	}

	// Particle class
	class Particle {
		position: Point;
		velocity: Point;
		acceleration: Point;
		age: number;
		lifespan: number;
		initialSize: number;

		constructor() {
			this.position = new Point();
			this.velocity = new Point();
			this.acceleration = new Point();
			this.age = 0;
			this.lifespan = 0;
			this.initialSize = 0;
		}

		initialize(
			x: number,
			y: number,
			dx: number,
			dy: number,
			lifespan: number,
			initialSize: number
		) {
			this.position.x = x;
			this.position.y = y;
			this.velocity.x = dx;
			this.velocity.y = dy;
			this.acceleration.x = dx * -0.5;
			this.acceleration.y = dy * -0.5;
			this.age = 0;
			this.lifespan = lifespan;
			this.initialSize = initialSize;
		}

		update(deltaTime: number) {
			this.position.x += this.velocity.x * deltaTime;
			this.position.y += this.velocity.y * deltaTime;
			this.velocity.x += this.acceleration.x * deltaTime;
			this.velocity.y += this.acceleration.y * deltaTime;
			this.age += deltaTime;
		}

		draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
			// 改进的缓动函数，使动画更自然
			function easeInQuart(t: number) {
				return t * t * t * t;
			}

			function easeOutQuart(t: number) {
				return 1 - Math.pow(1 - t, 4);
			}

			function easeInOutQuart(t: number) {
				return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
			}

			// 使用更平滑的缓动函数计算粒子大小和透明度
			const ageRatio = Math.min(this.age / this.lifespan, 1);
			const scale = 1 - easeInQuart(ageRatio) * 0.7;
			const particleSize = this.initialSize * scale;

			// 更自然的透明度变化
			const alpha = 1 - easeOutQuart(ageRatio);
			context.globalAlpha = alpha;

			// 添加轻微的旋转效果
			const rotation = (ageRatio * Math.PI) / 4;
			context.save();
			context.translate(this.position.x, this.position.y);
			context.rotate(rotation);
			context.drawImage(image, -particleSize / 2, -particleSize / 2, particleSize, particleSize);
			context.restore();
		}
	}

	// ParticlePool class
	class ParticlePool {
		particles: Particle[];
		firstActive: number;
		firstFree: number;
		duration: number;

		constructor(length: number) {
			this.particles = new Array(length);
			for (let i = 0; i < this.particles.length; i++) {
				this.particles[i] = new Particle();
			}
			this.firstActive = 0;
			this.firstFree = 0;
			this.duration = duration;
		}

		add(x: number, y: number, dx: number, dy: number) {
			// 为每个粒子添加随机的生命周期和初始大小
			const lifespan = duration * (0.8 + Math.random() * 0.4);
			const initialSize = size * (0.7 + Math.random() * 0.6);
			this.particles[this.firstFree].initialize(x, y, dx, dy, lifespan, initialSize);
			this.firstFree++;
			if (this.firstFree === this.particles.length) this.firstFree = 0;
			if (this.firstActive === this.firstFree) this.firstActive++;
			if (this.firstActive === this.particles.length) this.firstActive = 0;
		}

		update(deltaTime: number) {
			if (this.firstActive < this.firstFree) {
				for (let i = this.firstActive; i < this.firstFree; i++) {
					this.particles[i].update(deltaTime);
				}
			} else if (this.firstFree < this.firstActive) {
				for (let i = this.firstActive; i < this.particles.length; i++) {
					this.particles[i].update(deltaTime);
				}
				for (let i = 0; i < this.firstFree; i++) {
					this.particles[i].update(deltaTime);
				}
			}
			// 使用粒子的生命周期而不是固定duration
			while (
				this.particles[this.firstActive].age >= this.particles[this.firstActive].lifespan &&
				this.firstActive !== this.firstFree
			) {
				this.firstActive++;
				if (this.firstActive === this.particles.length) this.firstActive = 0;
			}
		}

		draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
			if (this.firstActive < this.firstFree) {
				for (let i = this.firstActive; i < this.firstFree; i++) {
					this.particles[i].draw(context, image);
				}
			} else if (this.firstFree < this.firstActive) {
				for (let i = this.firstActive; i < this.particles.length; i++) {
					this.particles[i].draw(context, image);
				}
				for (let i = 0; i < this.firstFree; i++) {
					this.particles[i].draw(context, image);
				}
			}
		}
	}

	// Calculate point on heart curve
	const pointOnHeart = (t: number): Point => {
		return new Point(
			160 * Math.pow(Math.sin(t), 3),
			130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
		);
	};

	// Create particle image
	const createParticleImage = () => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!context) return;

		canvas.width = size;
		canvas.height = size;

		const to = (t: number): Point => {
			const point = pointOnHeart(t);
			point.x = size / 2 + (point.x * size) / 350;
			point.y = size / 2 - (point.y * size) / 350;
			return point;
		};

		context.beginPath();
		let t = -Math.PI;
		let point: Point = to(t);
		context.moveTo(point.x, point.y);
		while (t < Math.PI) {
			t += 0.01;
			point = to(t);
			context.lineTo(point.x, point.y);
		}
		context.closePath();
		context.fillStyle = color;
		context.fill();

		const image = new Image();
		image.src = canvas.toDataURL();
		particleImageRef.current = image;
	};

	// Render animation
	const render = () => {
		const canvas = canvasRef.current;
		if (!canvas || !particleImageRef.current) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		const newTime = new Date().getTime() / 1000;
		const deltaTime = newTime - (timeRef.current || newTime);
		timeRef.current = newTime;

		context.clearRect(0, 0, canvas.width, canvas.height);

		// 调整粒子发射速率，使动画更流畅
		const particleRate = particleCount / (duration * 2);
		const amount = particleRate * deltaTime;

		for (let i = 0; i < amount; i++) {
			// 添加随机性使粒子分布更自然
			const angleVariation = (Math.random() - 0.5) * 0.5;
			const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random() + angleVariation);
			const dir = pos.clone().length(velocity * (0.7 + Math.random() * 0.6)) as Point;
			const particles = particlesRef.current as any;
			particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
		}

		const particles = particlesRef.current as any;
		particles.update(deltaTime);
		particles.draw(context, particleImageRef.current);

		requestAnimationFrame(render);
	};

	// Handle resize
	const onResize = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	};

	// Initialize
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		particlesRef.current = new ParticlePool(particleCount) as any;
		createParticleImage();

		window.addEventListener('resize', onResize);
		setTimeout(() => {
			onResize();
			render();
		}, 10);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, [particleCount, duration, velocity, size, color]);

	return (
		<div className={`heart-animation ${className}`}>
			<canvas ref={canvasRef} className="heart-canvas" />
			<div className="heart-text">
				<span style={{ fontSize: '16px', color }}>X ♥ X</span>
				<span style={{ fontStyle: '12px', fontWeight: 600, color }}>I Love You</span>
			</div>
		</div>
	);
};

export default HeartAnimation;
