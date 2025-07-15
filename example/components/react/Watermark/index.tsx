import { useRef } from 'react';
import MdWatermark from './MdWatermark';

export default function WatermarkDemo() {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<h1 className="text-2xl font-bold mb-6">水印组件示例</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* 基本文本水印 */}
				<div className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">基本文本水印</h2>
					<MdWatermark content="机密文件" color="rgba(0, 0, 0, 0.1)" fontSize={14} rotate={-15}>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">内容区域</p>
						</div>
					</MdWatermark>
				</div>

				{/* 多行文本水印 */}
				<div className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">多行文本水印</h2>
					<MdWatermark
						content={['版权所有', '请勿传播']}
						lineHeight={1.8}
						color="rgba(0, 0, 0, 0.12)"
						fontSize={16}
						gap={[60, 60]}
					>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">内容区域</p>
						</div>
					</MdWatermark>
				</div>

				{/* 图片水印 */}
				<div className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">图片水印</h2>
					<MdWatermark
						imageUrl="https://picsum.photos/seed/watermark/100/40" // 示例图片
						imageWidth={120}
						imageHeight={50}
						opacity={0.1}
						rotate={-30}
					>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">内容区域</p>
						</div>
					</MdWatermark>
				</div>

				{/* 淡入淡出动画水印 */}
				<div className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">淡入淡出动画</h2>
					<MdWatermark
						content="重要通知"
						animation="fade"
						animationDuration={4000}
						color="rgba(255, 0, 0, 0.2)"
						fontSize={18}
					>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">内容区域</p>
						</div>
					</MdWatermark>
				</div>

				{/* 旋转动画水印 */}
				<div className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">旋转动画</h2>
					<MdWatermark
						content="系统维护中"
						animation="rotate"
						animationDuration={6000}
						color="rgba(0, 0, 255, 0.15)"
						fontSize={16}
					>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">内容区域</p>
						</div>
					</MdWatermark>
				</div>

				{/* 自定义容器水印 */}
				<div ref={containerRef} className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">自定义容器水印</h2>
					<MdWatermark
						content="自定义容器"
						container={containerRef}
						align="top"
						offset={{ x: 20, y: 20 }}
						color="rgba(0, 128, 0, 0.1)"
					>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">内容区域</p>
						</div>
					</MdWatermark>
				</div>

				{/* 响应式水印 */}
				<div className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">响应式水印</h2>
					<MdWatermark
						content="响应式水印"
						responsiveOptions={{
							baseWidth: 1200,
							responsive: true
						}}
						color="rgba(128, 0, 128, 0.1)"
					>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">调整窗口大小查看效果</p>
						</div>
					</MdWatermark>
				</div>

				{/* 所有配置项组合 */}
				<div className="bg-white rounded-lg shadow-lg p-6 h-64 relative">
					<h2 className="text-lg font-semibold mb-4">组合配置</h2>
					<MdWatermark
						content={['高度自定义', '水印组件']}
						lineHeight={1.6}
						color="rgba(0, 0, 0, 0.15)"
						fontSize={15}
						rotate={-25}
						gap={[50, 50]}
						opacity={0.12}
						align="right"
						repeat="repeat-y"
						animation="fade"
						animationDuration={5000}
						animationDelay={1000}
						optimizePerformance={true}
					>
						<div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
							<p className="text-gray-500">所有配置组合</p>
						</div>
					</MdWatermark>
				</div>
			</div>

			<div className="mt-10 bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-lg font-semibold mb-4">自定义控制示例</h2>
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex-1 bg-gray-50 rounded-lg p-4">
						<h3 className="font-medium mb-3">控制参数</h3>
						<div className="space-y-3">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">文本内容</label>
								<input
									type="text"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									defaultValue="动态水印"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
								<input type="range" min="10" max="30" defaultValue="16" className="w-full" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">透明度</label>
								<input
									type="range"
									min="0"
									max="1"
									step="0.05"
									defaultValue="0.15"
									className="w-full"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">旋转角度</label>
								<input type="range" min="-45" max="45" defaultValue="-22" className="w-full" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">动画类型</label>
								<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
									<option value="none">无动画</option>
									<option value="fade">淡入淡出</option>
									<option value="rotate">旋转</option>
								</select>
							</div>
						</div>
					</div>
					<div className="flex-1 bg-gray-50 rounded-lg p-4 relative h-64">
						<h3 className="font-medium mb-3">实时预览</h3>
						{/* 这里应该有一个使用上面控制参数的MdWatermark组件 */}
						<MdWatermark
							content="动态水印"
							fontSize={16}
							opacity={0.15}
							rotate={-22}
							animation="none"
						>
							<div className="w-full h-full bg-white rounded-md border border-gray-200 flex items-center justify-center">
								<p className="text-gray-500">实时预览区域</p>
							</div>
						</MdWatermark>
					</div>
				</div>
			</div>
		</div>
	);
}
