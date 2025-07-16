import { useEffect, useRef } from 'react';
import './index.scss';
const GradientBackground = () => {
	return (
		<div className=" w-full h-[200px] relative flex-center">
			{/* 渐变流动背景 */}
			<div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 inset-0 bg-gradient-45deg from-purple-500 via-pink-500 to-red-500 bg-[size:400%_400%] animate-gradientFlow"></div>

			{/* 前景内容 */}
			<div className="relative z-10 flex items-center justify-center  text-white text-2xl font-bold">
				渐变流动动画背景
			</div>
		</div>
	);
};

const ParticleBackground = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// 创建50个粒子
		const particleCount = 50;
		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			// 随机大小与位置
			const size = Math.random() * 5 + 2;
			particle.className = 'absolute rounded-full bg-white/50 will-change-transform';
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;
			particle.style.left = `${Math.random() * 100}%`;
			particle.style.top = `${Math.random() * 100}%`;
			// 随机动画延迟与 duration
			particle.style.animationDelay = `${Math.random() * 5}s`;
			particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
			container.appendChild(particle);
		}

		return () => {
			container.innerHTML = ''; // 清理粒子
		};
	}, []);

	return (
		<div className=" w-full bg-slate-900 h-[200px] relative flex-center">
			{/* 粒子容器 */}
			<div ref={containerRef} className="absolute inset-0 animate-float" />

			{/* 前景内容 */}
			<div className="relative z-10 flex items-center justify-center min-h-screen text-white text-2xl font-bold">
				粒子系统动画背景
			</div>
		</div>
	);
};
const ParallaxBackground = () => {
	return (
		<div className="relative h-[300px] w-full overflow-hidden">
			{/* 三层视差背景 */}
			<div className="absolute inset-0 bg-[url('https://picsum.photos/id/1/1000/1000')] bg-cover bg-fixed animate-parallax-1" />
			<div className="absolute inset-0 bg-[url('https://picsum.photos/id/2/1000/1000')] bg-cover opacity-50 animate-parallax-2" />
			<div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />

			{/* 前景内容 */}
			<div className="relative z-10 flex items-center justify-center  text-white text-2xl font-bold">
				视差滚动动画背景
			</div>
		</div>
	);
};

const RippleBackground = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// 创建3个波纹
		const createRipple = (index: number) => {
			const ripple = document.createElement('div');
			ripple.className = 'absolute rounded-full bg-white/30 will-change-transform';
			// 定位在不同位置
			const positions = [
				{ left: '20%', top: '30%' },
				{ left: '60%', top: '70%' },
				{ left: '80%', top: '20%' }
			];
			ripple.style.left = positions[index].left;
			ripple.style.top = positions[index].top;
			ripple.style.animationDelay = `${index * 0.5}s`;
			const size = Math.random() * 10 + 10;
			ripple.style.width = `${size}px`;
			ripple.style.height = `${size}px`;

			container.appendChild(ripple);
		};

		[0, 1, 2].forEach(createRipple);

		return () => {
			container.innerHTML = '';
		};
	}, []);

	return (
		<div className="relative h-[200px] w-full bg-blue-600 overflow-hidden">
			{/* 波纹容器 */}
			<div ref={containerRef} className="absolute inset-0 animate-ripple w-full h-full" />

			{/* 前景内容 */}
			<div className="relative z-10 flex items-center justify-center  text-white text-2xl font-bold">
				波纹动画背景
			</div>
		</div>
	);
};

const TextImgBackground = () => {
	return (
		<div className="relative w-full h-[200px] bg-black flex-col items-center justify-center text-white  font-bold">
			<span className="img-span">测试</span>
			<span className="img-span">TEST</span>
		</div>
	);
};

const BackgroundDemo = () => {
	return (
		<div className="w-full h-[500px] overflow-auto">
			<GradientBackground></GradientBackground>
			<ParticleBackground></ParticleBackground>
			<ParallaxBackground></ParallaxBackground>
			<RippleBackground></RippleBackground>
			<TextImgBackground></TextImgBackground>
		</div>
	);
};

export default BackgroundDemo;
