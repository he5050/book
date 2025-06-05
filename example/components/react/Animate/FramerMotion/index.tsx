import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

// 方法一：使用 useMotionValue 和 animate
const NumberAnimation1 = () => {
	const count = useMotionValue(0);
	const rounded = useTransform(count, Math.round);

	useEffect(() => {
		const animation = animate(count, 1000, {
			duration: 2,
			ease: 'easeOut'
		});

		return animation.stop;
	}, [count]);

	return <motion.div className="text-6xl font-bold text-blue-600">{rounded}</motion.div>;
};

/** 方法二：使用 useSpring */
const NumberAnimation2 = () => {
	const [displayValue, setDisplayValue] = useState(0);
	const count = useSpring(0, {
		stiffness: 30,
		damping: 15,
		mass: 1
	});

	useEffect(() => {
		// 监听 count 值的变化并更新显示值
		const unsubscribe = count.on('change', latest => {
			setDisplayValue(Math.round(latest));
		});

		// 启动动画
		const timer = setTimeout(() => {
			count.set(1000);
		}, 100);

		return () => {
			clearTimeout(timer);
			unsubscribe();
		};
	}, [count]);

	return <motion.div className="text-6xl font-bold text-blue-600">{displayValue}</motion.div>;
};

// 方法三：使用传统的状态动画
const NumberAnimation3 = () => {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		let start = 0;
		const end = 1000;
		const duration = 2000;
		const startTime = Date.now();

		const updateValue = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// easeOut 缓动函数
			const easeOut = 1 - Math.pow(1 - progress, 3);
			const current = Math.floor(start + (end - start) * easeOut);

			setDisplayValue(current);

			if (progress < 1) {
				requestAnimationFrame(updateValue);
			}
		};

		updateValue();
	}, []);

	return (
		<motion.div
			className="text-6xl font-bold text-purple-600"
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
		>
			{displayValue}
		</motion.div>
	);
};

const ScrollAnimation = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: false });
	console.log('isInView', isInView);

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, x: 300 }}
			animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 300 }}
			transition={{ duration: 3, ease: 'easeOut' }}
			className="my-20 p-8 bg-gray-100 rounded-xl"
		>
			<h3>滚动触发的内容</h3>
			<p>当此元素进入视口时会触发动画效果。</p>
		</motion.div>
	);
};
const FramerMotion: React.FC = () => {
	return (
		<div className="h-full overflow-hidden">
			<div className="color-[#333] lh-6  mb-10 text-4">1.微交互（按钮悬停 / 点击效果）</div>
			<div className="button-demo">
				<motion.button
					whileHover={{
						scale: 1.05,
						boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
					}}
					whileTap={{ scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className="bg-blue-500 text-white px-6 py-3 rounded-lg"
				>
					点击我
				</motion.button>
			</div>
			<div className="color-[#333] lh-8  m-y-10 text-4 ">2.数字滚动</div>
			<div className="number-demo">
				<NumberAnimation1 />
			</div>
			<div className="number-demo mt-4">
				<NumberAnimation2 />
			</div>
			<div className="color-[#333] lh-8  mb-4 text-4 mt-2">传统的做法</div>
			<div className="number-demo mt-4">
				<NumberAnimation3 />
			</div>
			<div className="color-[#333] lh-6  mt-30 text-4">3.滚动视差</div>
			<div className="in-view-demo pt-10">
				<ScrollAnimation />
			</div>
		</div>
	);
};

export default FramerMotion;
