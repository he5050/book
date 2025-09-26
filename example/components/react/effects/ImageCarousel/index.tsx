import React, { useState, useEffect } from 'react';
import './index.scss';

interface Slide {
	title: string;
	imageUrl: string;
	imageAlt: string;
}

interface ImageCarouselProps {
	slides?: Slide[];
	autoPlay?: boolean;
	interval?: number;
	className?: string;
	style?: React.CSSProperties;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
	slides = [
		{
			title: '好景',
			imageUrl: 'https://q6.itc.cn/q_70/images03/20250116/b5dba16a1f5749a6a375f20f901d6381.png',
			imageAlt: '桂林山水'
		},
		{
			title: '好山',
			imageUrl:
				'https://img0.baidu.com/it/u=3902947011,207703161&fm=253&app=138&f=JPEG?w=800&h=1455',
			imageAlt: '桂林山水'
		},
		{
			title: '好水',
			imageUrl:
				'https://img0.baidu.com/it/u=4091158592,2102354044&fm=253&app=138&f=JPEG?w=800&h=1455',
			imageAlt: '桂林山水'
		}
	],
	autoPlay = true,
	interval = 2000,
	className = '',
	style = {}
}) => {
	const [current, setCurrent] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const goToSlide = (index: number) => {
		if (index !== current && !isAnimating) {
			setIsAnimating(true);
			setCurrent(index);
			// 动画结束后重置状态
			setTimeout(() => {
				setIsAnimating(false);
			}, 500);
		}
	};

	const nextSlide = () => {
		setCurrent(prev => (prev + 1) % slides.length);
	};

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		if (autoPlay) {
			intervalId = setInterval(() => {
				nextSlide();
			}, interval);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [autoPlay, interval, slides.length]);

	return (
		<div
			className={`image-carousel ${className}`}
			style={{
				...style,
				backgroundImage: `url(${slides[current].imageUrl})`
			}}
		>
			<div className="card">
				<div className="content">
					<h1 id="title">{slides[current].title}</h1>
				</div>
				<div className="image">
					<img
						src={slides[current].imageUrl}
						alt={slides[current].imageAlt}
						id="slide"
						className={isAnimating ? 'slide-animation' : ''}
					/>
				</div>
			</div>
			<div className="dots">
				{slides.map((_, index) => (
					<span
						key={index}
						className={`dot ${index === current ? 'active' : ''}`}
						onClick={() => goToSlide(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default ImageCarousel;
