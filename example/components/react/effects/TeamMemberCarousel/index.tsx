import React, { useState, useEffect, useCallback } from 'react';
import './index.scss';

interface TeamMember {
	name: string;
	role: string;
	imageUrl: string;
	imageAlt: string;
}

interface TeamMemberCarouselProps {
	members?: TeamMember[];
	containerWidth?: number;
	className?: string;
	style?: React.CSSProperties;
}

const TeamMemberCarousel: React.FC<TeamMemberCarouselProps> = ({
	members = [
		{
			name: '山川湖泊',
			role: '自然风光',
			imageUrl:
				'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '山川湖泊风景'
		},
		{
			name: '森林小径',
			role: '绿色生态',
			imageUrl:
				'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '森林小径风景'
		},
		{
			name: '海滨日落',
			role: '海岸风光',
			imageUrl:
				'https://images.unsplash.com/photo-1505228395891-9a51e7f86e1c?q=80&w=3867&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '海滨日落风景'
		},
		{
			name: '雪山之巅',
			role: '雪域风光',
			imageUrl:
				'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '雪山之巅风景'
		},
		{
			name: '田园风光',
			role: '乡村美景',
			imageUrl:
				'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '田园风光风景'
		},
		{
			name: '沙漠日出',
			role: '沙漠奇观',
			imageUrl:
				'https://images.unsplash.com/photo-1509316785289-025f5b8b4c06?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			imageAlt: '沙漠日出风景'
		}
	],
	containerWidth = 500,
	className = '',
	style = {}
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	// 更新轮播位置
	const updateCarousel = useCallback(
		(newIndex: number) => {
			if (isAnimating) return;
			setIsAnimating(true);

			// 确保索引在有效范围内
			const validIndex = (newIndex + members.length) % members.length;
			setCurrentIndex(validIndex);

			// 动画结束后重置状态
			setTimeout(() => {
				setIsAnimating(false);
			}, 800);
		},
		[isAnimating, members.length]
	);

	// 前一个成员
	const prevMember = () => {
		updateCarousel(currentIndex - 1);
	};

	// 下一个成员
	const nextMember = () => {
		updateCarousel(currentIndex + 1);
	};

	// 跳转到指定成员
	const goToMember = (index: number) => {
		updateCarousel(index);
	};

	// 键盘事件处理
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				prevMember();
			} else if (e.key === 'ArrowRight') {
				nextMember();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [currentIndex, isAnimating]);

	// 触摸事件处理
	useEffect(() => {
		let touchStartX = 0;
		let touchEndX = 0;

		const handleTouchStart = (e: TouchEvent) => {
			touchStartX = e.changedTouches[0].screenX;
		};

		const handleTouchEnd = (e: TouchEvent) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		};

		const handleSwipe = () => {
			const swipeThreshold = 50;
			const diff = touchStartX - touchEndX;

			if (Math.abs(diff) > swipeThreshold) {
				if (diff > 0) {
					nextMember();
				} else {
					prevMember();
				}
			}
		};

		document.addEventListener('touchstart', handleTouchStart);
		document.addEventListener('touchend', handleTouchEnd);

		return () => {
			document.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	}, [currentIndex, isAnimating]);

	// 获取卡片位置类名
	const getCardPositionClass = (index: number) => {
		const offset = (index - currentIndex + members.length) % members.length;

		if (offset === 0) return 'center';
		if (offset === 1) return 'right-1';
		if (offset === 2) return 'right-2';
		if (offset === members.length - 1) return 'left-1';
		if (offset === members.length - 2) return 'left-2';
		return 'hidden';
	};

	return (
		<div
			className={`team-member-carousel ${className}`}
			style={{ width: containerWidth, ...style }}
		>
			<h1 className="about-title">SCENERY</h1>

			<div className="carousel-container">
				<button className="nav-arrow left" onClick={prevMember}>
					‹
				</button>

				<div className="carousel-track">
					{members.map((member, index) => (
						<div
							key={index}
							className={`card ${getCardPositionClass(index)}`}
							data-index={index}
							onClick={() => goToMember(index)}
						>
							<img src={member.imageUrl} alt={member.imageAlt} />
						</div>
					))}
				</div>

				<button className="nav-arrow right" onClick={nextMember}>
					›
				</button>
			</div>

			<div className="member-info">
				<h2 className="member-name">{members[currentIndex].name}</h2>
				<p className="member-role">{members[currentIndex].role}</p>
			</div>

			<div className="dots">
				{members.map((_, index) => (
					<div
						key={index}
						className={`dot ${index === currentIndex ? 'active' : ''}`}
						data-index={index}
						onClick={() => goToMember(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default TeamMemberCarousel;
