import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

interface ScreenProjectionProps {
	width?: number;
	height?: number;
	className?: string;
	style?: React.CSSProperties;
}

interface ScreenInfo {
	id?: string;
	label?: string;
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	availLeft?: number;
	availTop?: number;
	availWidth?: number;
	availHeight?: number;
	colorDepth?: number;
	pixelDepth?: number;
}

const ScreenProjection: React.FC<ScreenProjectionProps> = ({
	width = 600,
	height = 800,
	className = '',
	style = {}
}) => {
	const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
	const [screens, setScreens] = useState<ScreenInfo[]>([]);
	const [currentScreen, setCurrentScreen] = useState<ScreenInfo | null>(null);
	const [selectedScreenIndex, setSelectedScreenIndex] = useState<number>(0);
	const [isProjected, setIsProjected] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const popupRef = useRef<Window | null>(null);
	const permissionStatusRef = useRef<PermissionStatus | null>(null);
	const screenDetailsRef = useRef<any>(null);

	// 检查API兼容性
	const checkAPICompatibility = () => {
		return 'getScreenDetails' in window && 'isExtended' in screen && 'onchange' in screen;
	};

	// 初始化权限监听
	const initPermission = async () => {
		if (!('permissions' in navigator)) {
			setPermissionStatus('unsupported');
			return;
		}

		try {
			const permissionStatus = await navigator.permissions.query({
				name: 'window-management' as any
			});

			permissionStatusRef.current = permissionStatus;
			setPermissionStatus(permissionStatus.state);

			// 监听权限变化
			permissionStatus.addEventListener('change', (e: any) => {
				permissionStatusRef.current = e;
				setPermissionStatus(e.state);
				updateScreens(false);
			});
		} catch (error) {
			console.error('权限申请失败:', error);
			setPermissionStatus('denied');
		}
	};

	// 获取当前屏幕信息
	const getCurrentScreen = async (): Promise<ScreenInfo> => {
		if (!('getScreenDetails' in window)) {
			return {
				label: '当前屏幕',
				left: window.screen.left,
				top: window.screen.top,
				width: window.screen.width,
				height: window.screen.height,
				availLeft: window.screen.availLeft,
				availTop: window.screen.availTop,
				availWidth: window.screen.availWidth,
				availHeight: window.screen.availHeight,
				colorDepth: window.screen.colorDepth,
				pixelDepth: window.screen.pixelDepth
			};
		}

		try {
			const screenDetails: any = await (window as any).getScreenDetails();
			return screenDetails.currentScreen;
		} catch (error) {
			console.warn('获取当前屏幕信息失败', error);
			return {
				label: '当前屏幕',
				left: window.screen.left,
				top: window.screen.top,
				width: window.screen.width,
				height: window.screen.height,
				availLeft: window.screen.availLeft,
				availTop: window.screen.availTop,
				availWidth: window.screen.availWidth,
				availHeight: window.screen.availHeight,
				colorDepth: window.screen.colorDepth,
				pixelDepth: window.screen.pixelDepth
			};
		}
	};

	// 绑定单个屏幕的变化监听
	const setScreenChangeListeners = () => {
		const screens = screenDetailsRef.current?.screens || [window.screen];
		screens.forEach((screen: any) => {
			screen.onchange = () => updateScreens(false);
		});
	};

	// 获取屏幕详情（含兼容性兜底）
	const getScreenDetailsWithFallback = async (requestPermission = false) => {
		if (!('getScreenDetails' in window)) {
			return [
				{
					label: '主屏幕',
					left: window.screen.left,
					top: window.screen.top,
					width: window.screen.width,
					height: window.screen.height,
					availLeft: window.screen.availLeft,
					availTop: window.screen.availTop,
					availWidth: window.screen.availWidth,
					availHeight: window.screen.availHeight
				}
			];
		}

		try {
			// 检查权限，无权限且允许申请时尝试获取
			if (
				!screenDetailsRef.current &&
				(permissionStatusRef.current?.state === 'granted' ||
					(permissionStatusRef.current?.state === 'prompt' && requestPermission))
			) {
				screenDetailsRef.current = await (window as any).getScreenDetails().catch((e: Error) => {
					console.error('获取屏幕信息失败', e);
					if (
						window.location.hostname !== 'localhost' &&
						!window.location.protocol.includes('https')
					) {
						setError('投屏功能仅支持localhost或HTTPS环境');
					}
					return null;
				});

				// 监听屏幕配置变化（如接入新显示器）
				if (screenDetailsRef.current) {
					screenDetailsRef.current.addEventListener('screenchange', () => {
						updateScreens(false);
						setScreenChangeListeners();
					});
					setScreenChangeListeners();
				}
			}

			return (
				screenDetailsRef.current?.screens || [
					{
						label: '主屏幕',
						left: window.screen.left,
						top: window.screen.top,
						width: window.screen.width,
						height: window.screen.height,
						availLeft: window.screen.availLeft,
						availTop: window.screen.availTop,
						availWidth: window.screen.availWidth,
						availHeight: window.screen.availHeight
					}
				]
			);
		} catch (error) {
			console.error('处理屏幕信息出错', error);
			return [
				{
					label: '主屏幕',
					left: window.screen.left,
					top: window.screen.top,
					width: window.screen.width,
					height: window.screen.height,
					availLeft: window.screen.availLeft,
					availTop: window.screen.availTop,
					availWidth: window.screen.availWidth,
					availHeight: window.screen.availHeight
				}
			];
		}
	};

	// 更新屏幕信息
	const updateScreens = async (requestPermission = true) => {
		setLoading(true);
		try {
			const screens = await getScreenDetailsWithFallback(requestPermission);
			const current = await getCurrentScreen();

			setScreens(screens);
			setCurrentScreen(current);

			// 如果只有一个屏幕，提示用户
			if (screens.length === 1) {
				setError('请连接多个显示器以使用完整投屏功能');
			} else {
				setError('');
			}
		} catch (error) {
			console.error('更新屏幕信息失败:', error);
			setError('获取屏幕信息失败');
		} finally {
			setLoading(false);
		}
	};

	// 在指定屏幕打开窗口
	const openPopup = async (screenIndex: number) => {
		if (!screens[screenIndex]) {
			setError('无法获取指定屏幕信息，请检查环境或权限');
			return null;
		}

		const targetScreen = screens[screenIndex];

		// 避免在当前屏幕重复打开
		if (currentScreen && currentScreen.label === targetScreen.label) {
			setError('当前屏幕已打开窗口，无需重复操作');
			return null;
		}

		try {
			// 配置新窗口参数（全屏适配目标屏幕）
			const windowOptions = {
				url: window.location.origin, // 投屏页面地址
				x: targetScreen.availLeft || 0,
				y: targetScreen.availTop || 0,
				width: targetScreen.availWidth || 800,
				height: targetScreen.availHeight || 600,
				left: targetScreen.availLeft || 0,
				top: targetScreen.availTop || 0
			};

			// 打开新窗口并存储引用
			const features = `width=${windowOptions.width},height=${windowOptions.height},left=${windowOptions.left},top=${windowOptions.top}`;
			popupRef.current = window.open(windowOptions.url, `screen-${screenIndex}`, features);

			if (!popupRef.current) {
				setError('窗口被拦截，请允许弹窗');
				return null;
			}

			setIsProjected(true);
			return popupRef.current;
		} catch (error) {
			console.error('打开窗口失败:', error);
			setError('打开窗口失败，请重试');
			return null;
		}
	};

	// 关闭投屏窗口
	const closePopup = () => {
		if (popupRef.current && !popupRef.current.closed) {
			popupRef.current.close();
		}
		popupRef.current = null;
		setIsProjected(false);
	};

	// 监听窗口状态
	useEffect(() => {
		if (!isProjected || !popupRef.current) return;

		const interval = setInterval(() => {
			if (popupRef.current && popupRef.current.closed) {
				setIsProjected(false);
				popupRef.current = null;
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isProjected]);

	// 初始化
	useEffect(() => {
		const init = async () => {
			// 检查API兼容性
			if (!checkAPICompatibility()) {
				setError('当前浏览器不支持投屏功能');
				return;
			}

			// 初始化权限
			await initPermission();

			// 更新屏幕信息
			await updateScreens();
		};

		init();
	}, []);

	// 处理投屏操作
	const handleProjection = async () => {
		if (loading) return;

		setError('');

		if (isProjected) {
			closePopup();
		} else {
			setLoading(true);
			try {
				await openPopup(selectedScreenIndex);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className={`screen-projection-container ${className}`} style={{ width, height, ...style }}>
			<div className="screen-projection-header">
				<h2>多屏幕投屏控制</h2>
				{permissionStatus === 'denied' && (
					<div className="permission-warning">权限被拒绝，请在浏览器设置中允许窗口管理权限</div>
				)}
				{error && <div className="error-message">{error}</div>}
			</div>

			<div className="screen-projection-content">
				<div className="screen-info">
					<h3>屏幕信息</h3>
					{loading ? (
						<div className="loading">正在获取屏幕信息...</div>
					) : (
						<>
							<div className="screen-list">
								<label htmlFor="screen-select">选择目标屏幕:</label>
								<select
									id="screen-select"
									value={selectedScreenIndex}
									onChange={e => setSelectedScreenIndex(Number(e.target.value))}
									disabled={screens.length <= 1}
								>
									{screens.map((screen, index) => (
										<option key={index} value={index}>
											{screen.label || `屏幕 ${index + 1}`} ({screen.availWidth}x
											{screen.availHeight})
											{currentScreen && currentScreen.label === screen.label && ' (当前屏幕)'}
										</option>
									))}
								</select>
							</div>

							{currentScreen && (
								<div className="current-screen-info">
									<h4>当前屏幕信息</h4>
									<p>标签: {currentScreen.label}</p>
									<p>
										分辨率: {currentScreen.width}x{currentScreen.height}
									</p>
									<p>
										可用区域: {currentScreen.availWidth}x{currentScreen.availHeight}
									</p>
									<p>
										位置: ({currentScreen.availLeft}, {currentScreen.availTop})
									</p>
								</div>
							)}
						</>
					)}
				</div>

				<div className="projection-controls">
					<button
						onClick={handleProjection}
						disabled={loading || screens.length <= 1}
						className={`projection-button ${isProjected ? 'stop' : 'start'}`}
					>
						{loading ? '处理中...' : isProjected ? '停止投屏' : '开始投屏'}
					</button>

					{isProjected && <div className="projection-status">投屏进行中...</div>}
				</div>
			</div>

			<div className="screen-projection-footer">
				<h3>使用说明</h3>
				<ul>
					<li>确保浏览器支持 Window Management API（Chrome/Edge）</li>
					<li>项目需运行在 localhost 或 HTTPS 环境下</li>
					<li>需要用户授权窗口管理权限</li>
					<li>请连接多个显示器以使用完整功能</li>
				</ul>
			</div>
		</div>
	);
};

export default ScreenProjection;
