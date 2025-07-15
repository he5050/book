import { useState } from 'react';
import MdWatermark from './MdWatermark';

export default function WatermarkDemo() {
	const [content, setContent] = useState('动态水印');
	const [fontSize, setFontSize] = useState(16);
	const [rotate, setRotate] = useState(-22);
	const [opacity, setOpacity] = useState(0.15);
	const [gap, setGap] = useState<[number, number]>([40, 40]);
	const [align, setAlign] = useState<'left' | 'right' | 'top' | 'bottom' | 'center'>('center');
	const [repeat, setRepeat] = useState<'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'>('repeat');
	const [animation, setAnimation] = useState<'fade' | 'rotate' | 'none'>('none');
	const [animationDuration, setAnimationDuration] = useState(3000);
	const [animationDelay, setAnimationDelay] = useState(0);

	return (
		<div className="w-full max-w-6xl mx-auto p-5">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
				<div className="flex flex-col gap-2">
					<label className="font-medium">水印内容:</label>
					<input
						type="text"
						value={content}
						onChange={e => setContent(e.target.value)}
						className="p-2 border border-gray-300 rounded-md"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium">字体大小:</label>
					<input
						type="range"
						min="10"
						max="50"
						value={fontSize}
						onChange={e => setFontSize(Number(e.target.value))}
						className="w-full"
					/>
					<span>{fontSize}</span>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium">旋转角度:</label>
					<input
						type="range"
						min="-180"
						max="180"
						value={rotate}
						onChange={e => setRotate(Number(e.target.value))}
						className="w-full"
					/>
					<span>{rotate}°</span>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium">透明度:</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={opacity}
						onChange={e => setOpacity(Number(e.target.value))}
						className="w-full"
					/>
					<span>{opacity}</span>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium">间距:</label>
					<input
						type="range"
						min="10"
						max="100"
						value={gap[0]}
						onChange={e => setGap([Number(e.target.value), Number(e.target.value)])}
						className="w-full"
					/>
					<span>{gap[0]}</span>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium">对齐方式:</label>
					<select
						value={align}
						onChange={e => setAlign(e.target.value as any)}
						className="p-2 border border-gray-300 rounded-md"
					>
						<option value="left">左</option>
						<option value="right">右</option>
						<option value="top">上</option>
						<option value="bottom">下</option>
						<option value="center">居中</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium">重复模式:</label>
					<select
						value={repeat}
						onChange={e => setRepeat(e.target.value as any)}
						className="p-2 border border-gray-300 rounded-md"
					>
						<option value="repeat">重复</option>
						<option value="repeat-x">横向重复</option>
						<option value="repeat-y">纵向重复</option>
						<option value="no-repeat">不重复</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-medium">动画效果:</label>
					<select
						value={animation}
						onChange={e => setAnimation(e.target.value as any)}
						className="p-2 border border-gray-300 rounded-md"
					>
						<option value="none">无</option>
						<option value="fade">淡入淡出</option>
						<option value="rotate">旋转</option>
					</select>
				</div>
				{animation !== 'none' && (
					<>
						<div className="flex flex-col gap-2">
							<label className="font-medium">动画时长(ms):</label>
							<input
								type="number"
								min="500"
								max="10000"
								value={animationDuration}
								onChange={e => setAnimationDuration(Number(e.target.value))}
								className="p-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="font-medium">动画延迟(ms):</label>
							<input
								type="number"
								min="0"
								max="5000"
								value={animationDelay}
								onChange={e => setAnimationDelay(Number(e.target.value))}
								className="p-2 border border-gray-300 rounded-md"
							/>
						</div>
					</>
				)}
			</div>
			<div className="relative min-h-[300px] p-5 border border-gray-200 rounded-lg bg-white overflow-hidden">
				<MdWatermark
					content={content}
					fontSize={fontSize}
					rotate={rotate}
					opacity={opacity}
					gap={gap}
					align={align}
					repeat={repeat}
					animation={animation}
					animationDuration={animationDuration}
					animationDelay={animationDelay}
				>
					<div className="flex flex-col items-center justify-center h-full text-gray-700 p-5 relative z-10">
						<h2 className="mt-0 text-xl font-bold">水印演示区域</h2>
						<p>调整上方参数以查看水印效果变化</p>
					</div>
				</MdWatermark>
				<div className="absolute inset-0 pointer-events-none" style={{ zIndex: -2 }}></div>
			</div>
		</div>
	);
}
