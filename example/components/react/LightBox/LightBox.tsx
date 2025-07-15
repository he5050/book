import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
	photos: string[];
	state: { open: boolean; idx: number };
	onClose: () => void;
	onNavigate: (idx: number) => void;
}

export default function LightBox({ photos, state, onClose, onNavigate }: Props) {
	const { open, idx } = state;
	const [direction, setDirection] = useState(0);
	const startXRef = useRef(0);
	const [scale, setScale] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [autoPlay, setAutoPlay] = useState(true);

	const navigate = (dir: number) => {
		setDirection(dir);
		resetZoom();
		const nextIdx = (idx + dir + photos.length) % photos.length;
		onNavigate(nextIdx);
	};

	useEffect(() => {
		if (!open || !autoPlay) return;
		const timer = setInterval(() => navigate(1), 5000);
		return () => clearInterval(timer);
	}, [idx, open, autoPlay]);

	useEffect(() => {
		if (!open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowRight') navigate(1);
			if (e.key === 'ArrowLeft') navigate(-1);
		};
		window.addEventListener('keydown', handleKey);
		preload(photos[(idx + 1) % photos.length]);
		preload(photos[(idx - 1 + photos.length) % photos.length]);
		return () => window.removeEventListener('keydown', handleKey);
	}, [idx, open]);

	const preload = (url: string) => {
		const img = new Image();
		img.src = url;
	};

	const onTouchStart = (e: React.TouchEvent) => {
		startXRef.current = e.touches[0].clientX;
	};

	const onTouchEnd = (e: React.TouchEvent) => {
		const delta = e.changedTouches[0].clientX - startXRef.current;
		if (Math.abs(delta) > 50) {
			navigate(delta < 0 ? 1 : -1);
		}
	};

	const handleWheel = (e: React.WheelEvent) => {
		if (!e.ctrlKey) return;
		e.preventDefault();
		const newScale = Math.min(Math.max(scale - e.deltaY * 0.005, 1), 3);
		setScale(newScale);
	};

	const handleDrag = (e: any, info: any) => {
		if (scale <= 1) return;
		setOffset({
			x: offset.x + info.delta.x,
			y: offset.y + info.delta.y
		});
	};

	const resetZoom = () => {
		setScale(1);
		setOffset({ x: 0, y: 0 });
	};

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-hidden"
			onClick={onClose}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onWheel={handleWheel}
		>
			<X
				className="absolute top-4 right-4 text-white cursor-pointer z-50"
				size={32}
				onClick={e => {
					e.stopPropagation();
					onClose();
				}}
			/>

			<div
				className="absolute bottom-4 right-4 text-white text-sm cursor-pointer z-50"
				onClick={e => {
					e.stopPropagation();
					setAutoPlay(!autoPlay);
				}}
			>
				{autoPlay ? '暂停自动播放' : '开启自动播放'}
			</div>

			<ChevronLeft
				className="absolute left-4 top-1/2 -translate-y-1/2 text-white cursor-pointer z-50"
				size={40}
				onClick={e => {
					e.stopPropagation();
					navigate(-1);
				}}
			/>
			<ChevronRight
				className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer z-50"
				size={40}
				onClick={e => {
					e.stopPropagation();
					navigate(1);
				}}
			/>

			<AnimatePresence initial={false} custom={direction}>
				<motion.img
					key={idx}
					src={photos[idx]}
					className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-xl cursor-grab"
					custom={direction}
					initial={{ x: direction * 200, opacity: 0 }}
					animate={{
						x: 0,
						opacity: 1,
						scale,
						translateX: offset.x,
						translateY: offset.y
					}}
					exit={{ x: -direction * 200, opacity: 0 }}
					transition={{ duration: 0.4 }}
					drag={scale > 1}
					dragMomentum={false}
					onDrag={handleDrag}
					onClick={e => e.stopPropagation()}
				/>
			</AnimatePresence>
		</div>
	);
}
