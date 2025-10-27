import React, { useEffect, useRef } from 'react';
import './index.scss';

interface EyeTrackingProps {
	eyeSize?: number;
	pupilSize?: number;
	eyeColor?: string;
	pupilColor?: string;
	borderColor?: string;
	pupilBorderWidth?: number;
	pupilBorderColor?: string;
	shadowColor?: string;
	containerClass?: string;
}

const EyeTracking: React.FC<EyeTrackingProps> = ({
	eyeSize = 120,
	pupilSize = 45,
	eyeColor = '#ffffff',
	pupilColor = '#000000',
	borderColor = '#f2761e',
	pupilBorderWidth = 10,
	pupilBorderColor = '#2196f3',
	shadowColor = 'rgba(0,0,0,0.2)',
	containerClass = ''
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;

			const eyes = containerRef.current.querySelectorAll('.eye');
			eyes.forEach(eye => {
				const pupil = eye.querySelector('.eye-pupil') as HTMLElement;
				if (!pupil) return;

				// 计算眼球中心点坐标（基于视口）
				const eyeRect = eye.getBoundingClientRect();
				const eyeCenterX = eyeRect.left + eyeRect.width / 2;
				const eyeCenterY = eyeRect.top + eyeRect.height / 2;

				// 使用 clientX / clientY 与 eyeRect 对齐
				const deltaX = e.clientX - eyeCenterX;
				const deltaY = e.clientY - eyeCenterY;

				// 计算距离
				const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				// 计算边界
				const eyeRadius = eyeRect.width / 2;
				const pupilRadius = pupil.offsetWidth / 2;
				const maxDistance = eyeRadius - pupilRadius - 8;

				// 限制移动范围
				let moveX = deltaX;
				let moveY = deltaY;

				if (distance > maxDistance) {
					moveX = (deltaX / distance) * maxDistance;
					moveY = (deltaY / distance) * maxDistance;
				}

				// 应用 transform
				pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
			});
		};

		const container = containerRef.current;
		container?.addEventListener('mousemove', handleMouseMove);

		return () => {
			container?.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<div ref={containerRef} className={`eye-tracking-container ${containerClass}`}>
			<div className="eye-box">
				<div
					className="eye"
					style={{
						width: `${eyeSize}px`,
						height: `${eyeSize}px`,
						backgroundColor: eyeColor,
						borderColor: borderColor,
						boxShadow: `0 5px 45px ${shadowColor},
                        inset 0 0 15px ${borderColor},
                        inset 0 0 25px ${borderColor}`
					}}
				>
					<div
						className="eye-pupil"
						style={{
							width: `${pupilSize}px`,
							height: `${pupilSize}px`,
							backgroundColor: pupilColor,
							border: `${pupilBorderWidth}px solid ${pupilBorderColor}`
						}}
					></div>
				</div>
				<div
					className="eye"
					style={{
						width: `${eyeSize}px`,
						height: `${eyeSize}px`,
						backgroundColor: eyeColor,
						borderColor: borderColor,
						boxShadow: `0 5px 45px ${shadowColor},
                        inset 0 0 15px ${borderColor},
                        inset 0 0 25px ${borderColor}`
					}}
				>
					<div
						className="eye-pupil"
						style={{
							width: `${pupilSize}px`,
							height: `${pupilSize}px`,
							backgroundColor: pupilColor,
							border: `${pupilBorderWidth}px solid ${pupilBorderColor}`
						}}
					></div>
				</div>
			</div>
		</div>
	);
};

export default EyeTracking;
