import { useEffect, useRef } from 'react';

interface Props {
	photos: string[];
	onImageClick: (index: number) => void;
}

export default function Gallery({ photos, onImageClick }: Props) {
	const container = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const obs = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement;
						img.src = img.dataset.src || '';
						obs.unobserve(img);
					}
				});
			},
			{ rootMargin: '200px' }
		);

		container.current?.querySelectorAll('img[data-src]').forEach(img => {
			obs.observe(img);
		});

		return () => obs.disconnect();
	}, [photos]);

	return (
		<div
			ref={container}
			className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 auto-rows-[200px] grid-flow-row-dense p-4"
		>
			{photos.map((src, i) => (
				<img
					key={i}
					data-src={src}
					className="w-full h-full object-cover cursor-pointer rounded shadow"
					onClick={() => onImageClick(i)}
					alt={`img-${i}`}
				/>
			))}
		</div>
	);
}
