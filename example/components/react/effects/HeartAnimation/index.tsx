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

		clone() {
			return new Point(this.x, this.y);
		}

		length(length?: number) {
			if (length === undefined) {
				return Math.sqrt(this.x * this.x + this.y * this.y);
			}
			this.normalize();
			this.x *= length;
			this.y *= length;
			return this;
		}

		normalize() {
			const length = this.length();
			this.x /= length;
			this.y /= length;
			return this;
		}
	}

	// Particle class
	class Particle {
		position: Point;
		velocity: Point;
		acceleration: Point;
		age: number;

		constructor() {
			this.position = new Point();
			this.velocity = new Point();
			this.acceleration = new Point();
			this.age = 0;
		}

		initialize(x: number, y: number, dx: number, dy: number) {
			this.position.x = x;
			this.position.y = y;
			this.velocity.x = dx;
			this.velocity.y = dy;
			this.acceleration.x = dx * -0.75;
			this.acceleration.y = dy * -0.75;
			this.age = 0;
		}

		update(deltaTime: number) {
			this.position.x += this.velocity.x * deltaTime;
			this.position.y += this.velocity.y * deltaTime;
			this.velocity.x += this.acceleration.x * deltaTime;
			this.velocity.y += this.acceleration.y * deltaTime;
			this.age += deltaTime;
		}

		draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
			function ease(t: number) {
				return -t * t * t + 1;
			}
			const particleSize = image.width * ease(this.age / duration);
			context.globalAlpha = 1 - this.age / duration;
			context.drawImage(
				image,
				this.position.x - particleSize / 2,
				this.position.y - particleSize / 2,
				particleSize,
				particleSize
			);
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
			this.particles[this.firstFree].initialize(x, y, dx, dy);
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
			while (
				this.particles[this.firstActive].age >= this.duration &&
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
	const pointOnHeart = (t: number) => {
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

		const to = (t: number) => {
			const point = pointOnHeart(t);
			point.x = size / 2 + (point.x * size) / 350;
			point.y = size / 2 - (point.y * size) / 350;
			return point;
		};

		context.beginPath();
		let t = -Math.PI;
		let point = to(t);
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

		const particleRate = particleCount / duration;
		const amount = particleRate * deltaTime;

		for (let i = 0; i < amount; i++) {
			const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
			const dir = pos.clone().length(velocity);
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
