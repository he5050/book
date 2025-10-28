import React from 'react';
import { useBrowserInfo } from './hooks/useBrowserInfo';
import { useIPAddress } from './hooks/useIPAddress';
import { useLocation } from './hooks/useLocation';

/**
 * 浏览器信息统计组件
 * 基于掘金文章：JS获取用户访问网页的浏览器、IP、地址等信息 实现访问统计
 */
const BrowserInfoDemo: React.FC = () => {
	const { browserInfo, loading: browserLoading } = useBrowserInfo();
	const { ipInfo, loading: ipLoading, error: ipError, refresh: refreshIP } = useIPAddress();
	const {
		locationInfo,
		loading: locationLoading,
		error: locationError,
		refresh: refreshLocation,
		clearCache
	} = useLocation();

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">浏览器信息统计 Demo</h1>
			<p className="text-gray-600 mb-8 text-center">
				获取用户访问网页的浏览器、IP、地址等信息，实现访问统计功能
			</p>

			<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
				{/* 浏览器信息 */}
				<div className="bg-white rounded-lg shadow-md p-6 border">
					<h2 className="text-xl font-semibold mb-4 text-blue-600">🌐 浏览器信息</h2>
					{browserLoading ? (
						<div className="animate-pulse">
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded"></div>
						</div>
					) : browserInfo ? (
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="font-medium">浏览器:</span>
								<span>{browserInfo.browserName || '未知'}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">版本:</span>
								<span>{browserInfo.browserVersion || '未知'}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">操作系统:</span>
								<span>{browserInfo.osName || '未知'}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">系统版本:</span>
								<span>{browserInfo.osVersion || '未知'}</span>
							</div>
							{browserInfo.deviceName && (
								<div className="flex justify-between">
									<span className="font-medium">设备名称:</span>
									<span>{browserInfo.deviceName}</span>
								</div>
							)}
							<details className="mt-4">
								<summary className="cursor-pointer text-gray-600 hover:text-gray-800">
									查看完整 User Agent
								</summary>
								<div className="mt-2 p-2 bg-gray-100 rounded text-xs break-all">
									{browserInfo.userAgent}
								</div>
							</details>
						</div>
					) : (
						<p className="text-gray-500">无法获取浏览器信息</p>
					)}
				</div>

				{/* IP地址信息 */}
				<div className="bg-white rounded-lg shadow-md p-6 border">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-green-600">🌍 IP 地址信息</h2>
						<button
							onClick={refreshIP}
							disabled={ipLoading}
							className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
						>
							{ipLoading ? '刷新中...' : '刷新'}
						</button>
					</div>

					{ipLoading ? (
						<div className="animate-pulse">
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded"></div>
						</div>
					) : ipError ? (
						<div className="text-red-500 text-sm">
							<p>获取IP失败: {ipError}</p>
						</div>
					) : (
						<div className="space-y-2 text-sm">
							<div>
								<span className="font-medium">公网IP:</span>
								<div className="mt-1 p-2 bg-blue-50 rounded">{ipInfo.publicIP || '获取失败'}</div>
							</div>

							<div>
								<span className="font-medium">本地IP:</span>
								<div className="mt-1 space-y-1">
									{ipInfo.localIPs.length > 0 ? (
										ipInfo.localIPs.map((ip, index) => (
											<div key={index} className="p-2 bg-gray-50 rounded text-xs">
												{ip}
											</div>
										))
									) : (
										<div className="p-2 bg-gray-50 rounded text-xs text-gray-500">
											未检测到本地IP
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* 位置信息 */}
				<div className="bg-white rounded-lg shadow-md p-6 border">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-purple-600">📍 位置信息</h2>
						<div className="flex gap-2">
							<button
								onClick={clearCache}
								className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
							>
								清除缓存
							</button>
							<button
								onClick={refreshLocation}
								disabled={locationLoading}
								className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
							>
								{locationLoading ? '刷新中...' : '刷新'}
							</button>
						</div>
					</div>

					{locationLoading ? (
						<div className="animate-pulse">
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded"></div>
						</div>
					) : locationError ? (
						<div className="text-red-500 text-sm">
							<p>获取位置失败: {locationError}</p>
						</div>
					) : locationInfo ? (
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="font-medium">IP:</span>
								<span>{locationInfo.ip || '未知'}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">国家:</span>
								<span>{locationInfo.country_name || locationInfo.country || '未知'}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">地区:</span>
								<span>{locationInfo.region || '未知'}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">城市:</span>
								<span>{locationInfo.city || '未知'}</span>
							</div>
							{locationInfo.postal && (
								<div className="flex justify-between">
									<span className="font-medium">邮编:</span>
									<span>{locationInfo.postal}</span>
								</div>
							)}
							{locationInfo.latitude && locationInfo.longitude && (
								<div className="flex justify-between">
									<span className="font-medium">坐标:</span>
									<span className="text-xs">
										{locationInfo.latitude.toFixed(4)}, {locationInfo.longitude.toFixed(4)}
									</span>
								</div>
							)}
							{locationInfo.timezone && (
								<div className="flex justify-between">
									<span className="font-medium">时区:</span>
									<span>{locationInfo.timezone}</span>
								</div>
							)}
							{locationInfo.org && (
								<div className="mt-2">
									<span className="font-medium">ISP:</span>
									<div className="mt-1 p-2 bg-gray-50 rounded text-xs">{locationInfo.org}</div>
								</div>
							)}
						</div>
					) : (
						<p className="text-gray-500">无法获取位置信息</p>
					)}
				</div>
			</div>

			{/* 访问统计信息 */}
			<div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
				<h2 className="text-xl font-semibold mb-4 text-gray-800"> 访问统计摘要</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
					<div className="bg-white rounded-lg p-4 shadow-sm">
						<div className="text-2xl font-bold text-blue-600">
							{browserInfo?.browserName || '未知'}
						</div>
						<div className="text-sm text-gray-600">浏览器</div>
					</div>
					<div className="bg-white rounded-lg p-4 shadow-sm">
						<div className="text-2xl font-bold text-green-600">
							{ipInfo.publicIP ? '已获取' : '获取失败'}
						</div>
						<div className="text-sm text-gray-600">公网IP</div>
					</div>
					<div className="bg-white rounded-lg p-4 shadow-sm">
						<div className="text-2xl font-bold text-purple-600">{locationInfo?.city || '未知'}</div>
						<div className="text-sm text-gray-600">城市</div>
					</div>
					<div className="bg-white rounded-lg p-4 shadow-sm">
						<div className="text-2xl font-bold text-orange-600">
							{new Date().toLocaleTimeString()}
						</div>
						<div className="text-sm text-gray-600">访问时间</div>
					</div>
				</div>
			</div>

			{/* 使用说明 */}
			<div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
				<h3 className="text-lg font-semibold mb-3 text-yellow-800">💡 使用说明</h3>
				<ul className="text-sm text-yellow-700 space-y-2">
					<li>
						• <strong>浏览器信息</strong>：通过解析 navigator.userAgent
						获取浏览器类型、版本和操作系统信息
					</li>
					<li>
						• <strong>IP地址</strong>：使用 WebRTC 获取本地IP，通过第三方API获取公网IP
					</li>
					<li>
						• <strong>位置信息</strong>：基于IP地址通过第三方地理位置API获取，支持缓存以减少请求次数
					</li>
					<li>
						• <strong>缓存机制</strong>：位置信息会缓存1小时，避免频繁请求第三方服务
					</li>
					<li>
						• <strong>隐私保护</strong>：所有信息仅在客户端获取和显示，不会上传到服务器
					</li>
				</ul>
			</div>
		</div>
	);
};

export default BrowserInfoDemo;
