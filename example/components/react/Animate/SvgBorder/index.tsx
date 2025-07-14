import React, { useCallback, useMemo, useState } from 'react';

/**
 * 预设的渐变色彩主题
 */
const GRADIENT_THEMES = {
	ocean: {
		name: '海洋',
		colors: ['#667eea', '#764ba2', '#f093fb'],
		description: '深海蓝到紫色的渐变'
	},
	sunset: {
		name: '日落',
		colors: ['#ff6b6b', '#feca57', '#ff9ff3'],
		description: '温暖的日落色彩'
	},
	forest: {
		name: '森林',
		colors: ['#11998e', '#38ef7d', '#20bf6b'],
		description: '清新的绿色系'
	},
	aurora: {
		name: '极光',
		colors: ['#a8edea', '#fed6e3', '#d299c2'],
		description: '梦幻的极光色彩'
	},
	neon: {
		name: '霓虹',
		colors: ['#8b5cf6', '#06b6d4', '#10b981'],
		description: '科技感霓虹色'
	},
	fire: {
		name: '火焰',
		colors: ['#ff9a9e', '#fad0c4', '#ffd1ff'],
		description: '炽热的火焰色彩'
	}
};

/**
 * 虚线样式预设
 */
const DASH_PATTERNS = {
	normal: { pattern: '8,4', name: '普通' },
	dense: { pattern: '4,2', name: '密集' },
	sparse: { pattern: '16,8', name: '稀疏' },
	dot: { pattern: '2,6', name: '点状' },
	mixed: { pattern: '10,2,4,2', name: '混合' }
};

/**
 * 主组件 - SVG 渐变虚线边框效果演示
 */
const GradientDashedBorder: React.FC = () => {
	// 状态管理
	const [animationType, setAnimationType] = useState('dash'); // 动画类型：dash(虚线移动) 或 gradient(渐变旋转)
	const [isAnimating, setIsAnimating] = useState(true); // 动画开关
	const [selectedTheme, setSelectedTheme] = useState('neon'); // 选中的主题
	const [dashPattern, setDashPattern] = useState('normal'); // 虚线模式
	const [strokeWidth, setStrokeWidth] = useState(3); // 边框宽度
	const [animationSpeed, setAnimationSpeed] = useState(1); // 动画速度

	// 获取当前主题配置
	const currentTheme = useMemo(() => GRADIENT_THEMES[selectedTheme], [selectedTheme]);

	// 切换动画状态
	const toggleAnimation = useCallback(() => {
		setIsAnimating(prev => !prev);
	}, []);

	// 重置所有设置
	const resetSettings = useCallback(() => {
		setAnimationType('dash');
		setIsAnimating(true);
		setSelectedTheme('neon');
		setDashPattern('normal');
		setStrokeWidth(3);
		setAnimationSpeed(1);
	}, []);

	return (
		<div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
			<div className="max-w-6xl mx-auto">
				{/* 页面标题 */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">SVG 渐变虚线边框效果</h1>
					<p className="text-gray-600">
						使用 SVG 实现科技感的渐变虚线边框，支持多种动画效果和样式定制
					</p>
				</div>

				{/* 增强版控制面板 */}
				<div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
					<h2 className="text-2xl font-semibold mb-6 text-gray-800">控制面板</h2>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* 左侧：动画控制 */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">动画类型</label>
								<div className="flex gap-4">
									<label className="flex items-center">
										<input
											type="radio"
											name="animation"
											value="dash"
											checked={animationType === 'dash'}
											onChange={e => setAnimationType(e.target.value)}
											className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
										<span className="ml-2 text-sm text-gray-700">虚线移动</span>
									</label>
									<label className="flex items-center">
										<input
											type="radio"
											name="animation"
											value="gradient"
											checked={animationType === 'gradient'}
											onChange={e => setAnimationType(e.target.value)}
											className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
										/>
										<span className="ml-2 text-sm text-gray-700">渐变旋转</span>
									</label>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									动画速度：{animationSpeed}x
								</label>
								<input
									type="range"
									min="0.1"
									max="3"
									step="0.1"
									value={animationSpeed}
									onChange={e => setAnimationSpeed(parseFloat(e.target.value))}
									className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									边框宽度：{strokeWidth}px
								</label>
								<input
									type="range"
									min="1"
									max="8"
									step="1"
									value={strokeWidth}
									onChange={e => setStrokeWidth(parseInt(e.target.value))}
									className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
								/>
							</div>
						</div>

						{/* 右侧：样式控制 */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">颜色主题</label>
								<select
									value={selectedTheme}
									onChange={e => setSelectedTheme(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									{Object.entries(GRADIENT_THEMES).map(([key, theme]) => (
										<option key={key} value={key}>
											{theme.name} - {theme.description}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">虚线模式</label>
								<select
									value={dashPattern}
									onChange={e => setDashPattern(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									{Object.entries(DASH_PATTERNS).map(([key, pattern]) => (
										<option key={key} value={key}>
											{pattern.name} ({pattern.pattern})
										</option>
									))}
								</select>
							</div>

							<div className="flex gap-2">
								<button
									onClick={toggleAnimation}
									className={`flex-1 px-4 py-2 rd-lg font-medium transition-colors ${
										isAnimating
											? 'bg-red-500 hover:bg-red-600 text-white'
											: 'bg-green-500 hover:bg-green-600 text-white'
									}`}
								>
									{isAnimating ? '暂停动画' : '开始动画'}
								</button>
								<button
									onClick={resetSettings}
									className="px-4 py-2 bg-gray-500 text-white rd-lg hover:bg-gray-600 transition-colors"
								>
									重置
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* 实时预览区域 */}
				<div className="bg-white rd-xl shadow-lg p-6 mb-8 border border-gray-200">
					<h3 className="text-xl font-semibold mb-6 text-gray-800">实时预览</h3>
					<div className="flex justify-center">
						<EnhancedBorderBox
							width={300}
							height={200}
							colors={currentTheme.colors}
							dashArray={DASH_PATTERNS[dashPattern].pattern}
							strokeWidth={strokeWidth}
							animationType={animationType}
							isAnimating={isAnimating}
							animationSpeed={animationSpeed}
							title="实时预览"
							subtitle={`${currentTheme.name} · ${DASH_PATTERNS[dashPattern].name}`}
						/>
					</div>
				</div>

				{/* 功能展示区域 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* 固定尺寸示例 */}
					<div className="bg-white rd-xl shadow-lg p-6 border border-gray-200">
						<h3 className="text-xl font-semibold mb-4 text-gray-800">固定尺寸示例</h3>
						<p className="text-gray-600 mb-4 text-sm">展示不同尺寸的边框效果，边框宽度保持一致</p>
						<div className="grid grid-cols-2 gap-4">
							<EnhancedBorderBox
								width={120}
								height={80}
								colors={currentTheme.colors}
								dashArray={DASH_PATTERNS[dashPattern].pattern}
								strokeWidth={strokeWidth}
								animationType={animationType}
								isAnimating={isAnimating}
								animationSpeed={animationSpeed}
								title="小尺寸"
								subtitle="120x80"
							/>
							<EnhancedBorderBox
								width={180}
								height={120}
								colors={currentTheme.colors}
								dashArray={DASH_PATTERNS[dashPattern].pattern}
								strokeWidth={strokeWidth}
								animationType={animationType}
								isAnimating={isAnimating}
								animationSpeed={animationSpeed}
								title="中尺寸"
								subtitle="180x120"
							/>
						</div>
					</div>

					{/* 可拖拽缩放示例 */}
					<div className="bg-white rd-xl shadow-lg p-6 border border-gray-200">
						<h3 className="text-xl font-semibold mb-4 text-gray-800">可拖拽缩放</h3>
						<p className="text-gray-600 mb-4 text-sm">右下角拖拽调整大小，边框宽度始终保持不变</p>
						<div className="flex justify-center">
							<ResizableBorderBox
								colors={currentTheme.colors}
								dashArray={DASH_PATTERNS[dashPattern].pattern}
								strokeWidth={strokeWidth}
								animationType={animationType}
								isAnimating={isAnimating}
								animationSpeed={animationSpeed}
							/>
						</div>
					</div>
				</div>

				{/* 主题展示区域 */}
				<div className="bg-white rd-xl shadow-lg p-6 border border-gray-200">
					<h3 className="text-xl font-semibold mb-6 text-gray-800">所有主题预览</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Object.entries(GRADIENT_THEMES).map(([key, theme]) => (
							<div key={key} className="text-center">
								<EnhancedBorderBox
									width={160}
									height={120}
									colors={theme.colors}
									dashArray={DASH_PATTERNS[dashPattern].pattern}
									strokeWidth={strokeWidth}
									animationType={animationType}
									isAnimating={isAnimating}
									animationSpeed={animationSpeed}
									title={theme.name}
									subtitle={theme.description}
								/>
								<button
									onClick={() => setSelectedTheme(key)}
									className={`mt-2 px-3 py-1 rd-full text-sm font-medium transition-colors ${
										selectedTheme === key
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
									}`}
								>
									{selectedTheme === key ? '当前主题' : '选择主题'}
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * 增强版边框组件
 * @param {Object} props - 组件属性
 * @param {number} props.width - 宽度
 * @param {number} props.height - 高度
 * @param {string[]} props.colors - 渐变颜色数组
 * @param {string} props.dashArray - 虚线模式
 * @param {number} props.strokeWidth - 边框宽度
 * @param {string} props.animationType - 动画类型
 * @param {boolean} props.isAnimating - 是否播放动画
 * @param {number} props.animationSpeed - 动画速度
 * @param {string} props.title - 标题
 * @param {string} props.subtitle - 副标题
 */
const EnhancedBorderBox = ({
	width = 200,
	height = 150,
	colors = ['#8b5cf6', '#06b6d4', '#10b981'],
	dashArray = '8,4',
	strokeWidth = 3,
	animationType = 'dash',
	isAnimating = true,
	animationSpeed = 1,
	title = '魔法框',
	subtitle = '科技感边框'
}) => {
	// 生成唯一的渐变 ID，避免多个组件间的冲突
	const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);

	// 计算动画持续时间
	const animationDuration = useMemo(() => `${1 / animationSpeed}s`, [animationSpeed]);

	// 虚线移动动画样式
	const dashMoveStyle = useMemo(
		() => ({
			animation:
				isAnimating && animationType === 'dash'
					? `dashmove ${animationDuration} linear infinite`
					: 'none'
		}),
		[isAnimating, animationType, animationDuration]
	);

	return (
		<div className="relative">
			{/* 动画样式定义 */}
			<style>
				{`
          @keyframes dashmove {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 20; }
          }
        `}
			</style>

			{/* 主容器 */}
			<div
				className="border-box relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rd-lg shadow-sm"
				style={{ width, height }}
			>
				{/* SVG 边框 */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					width="100%"
					height="100%"
					className="absolute inset-0 pointer-events-none"
				>
					<defs>
						{/* 渐变定义 */}
						<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
							{colors.map((color, index) => (
								<stop
									key={index}
									offset={`${(index / (colors.length - 1)) * 100}%`}
									stopColor={color}
								/>
							))}

							{/* 渐变旋转动画 */}
							{isAnimating && animationType === 'gradient' && (
								<animateTransform
									attributeName="gradientTransform"
									type="rotate"
									from="0 0.5 0.5"
									to="360 0.5 0.5"
									dur={animationDuration}
									repeatCount="indefinite"
								/>
							)}
						</linearGradient>
					</defs>

					{/* 边框矩形 */}
					<rect
						fill="transparent"
						stroke={`url(#${gradientId})`}
						strokeWidth={strokeWidth}
						strokeDasharray={dashArray}
						width="100%"
						height="100%"
						rx="8" // 圆角
						ry="8"
						style={dashMoveStyle}
					/>
				</svg>

				{/* 内容区域 */}
				<div className="relative z-10 text-center text-gray-700 px-4">
					<div className="text-sm font-semibold mb-1">{title}</div>
					<div className="text-xs text-gray-500">{subtitle}</div>
				</div>
			</div>
		</div>
	);
};

/**
 * 可调整大小的边框组件
 * @param {Object} props - 组件属性
 */
const ResizableBorderBox = ({
	colors = ['#8b5cf6', '#06b6d4', '#10b981'],
	dashArray = '8,4',
	strokeWidth = 3,
	animationType = 'dash',
	isAnimating = true,
	animationSpeed = 1
}) => {
	// 生成唯一的渐变 ID
	const gradientId = useMemo(
		() => `resizable-gradient-${Math.random().toString(36).substr(2, 9)}`,
		[]
	);

	// 计算动画持续时间
	const animationDuration = useMemo(() => `${1 / animationSpeed}s`, [animationSpeed]);

	return (
		<div className="relative">
			{/* 动画样式定义 */}
			<style>
				{`
          @keyframes dashmove {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 20; }
          }

          .resizable-container {
            resize: both;
            overflow: auto;
            min-width: 150px;
            min-height: 100px;
            max-width: 400px;
            max-height: 300px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 2px dashed #e2e8f0;
            border-radius: 8px;
            cursor: nw-resize;
          }

          .resizable-container::-webkit-resizer {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 0 0 8px 0;
          }
        `}
			</style>

			{/* 可调整大小的容器 */}
			<div
				className="resizable-container relative flex items-center justify-center"
				style={{
					width: '250px',
					height: '180px',
					position: 'relative'
				}}
			>
				{/* SVG 边框 */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					width="100%"
					height="100%"
					className="absolute inset-0 pointer-events-none"
				>
					<defs>
						{/* 渐变定义 */}
						<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
							{colors.map((color, index) => (
								<stop
									key={index}
									offset={`${(index / (colors.length - 1)) * 100}%`}
									stopColor={color}
								/>
							))}

							{/* 渐变旋转动画 */}
							{isAnimating && animationType === 'gradient' && (
								<animateTransform
									attributeName="gradientTransform"
									type="rotate"
									from="0 0.5 0.5"
									to="360 0.5 0.5"
									dur={animationDuration}
									repeatCount="indefinite"
								/>
							)}
						</linearGradient>
					</defs>

					{/* 边框矩形 */}
					<rect
						fill="transparent"
						stroke={`url(#${gradientId})`}
						strokeWidth={strokeWidth}
						strokeDasharray={dashArray}
						width="100%"
						height="100%"
						rx="6"
						ry="6"
						style={{
							animation:
								isAnimating && animationType === 'dash'
									? `dashmove ${animationDuration} linear infinite`
									: 'none'
						}}
					/>
				</svg>

				{/* 内容区域 */}
				<div className="relative z-10 text-center text-gray-700 pointer-events-none">
					<div className="text-sm font-semibold mb-1">可拖拽缩放</div>
					<div className="text-xs text-gray-500">右下角拖拽调整大小</div>
					<div className="text-xs text-gray-400 mt-1">边框宽度保持不变</div>
				</div>
			</div>
		</div>
	);
};

export default GradientDashedBorder;
