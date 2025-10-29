import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './KeyboardManager.scss';

/**
 * 键盘快捷键管理器组件属性
 */
export interface KeyboardManagerProps {
	/** 快捷键配置 */
	shortcuts?: ShortcutConfig[];
	/** 是否启用快捷键 */
	enabled?: boolean;
	/** 全局快捷键前缀 */
	prefix?: string;
	/** 快捷键触发时的回调 */
	onShortcutTrigger?: (shortcut: ShortcutConfig) => void;
	/** 自定义样式类名 */
	className?: string;
	/** 自定义样式 */
	style?: React.CSSProperties;
}

/**
 * 快捷键配置
 */
export interface ShortcutConfig {
	/** 快捷键组合，如 'ctrl+k' 或 'cmd+shift+p' */
	key: string;
	/** 快捷键描述 */
	description: string;
	/** 快捷键处理函数 */
	handler: (event: KeyboardEvent) => void;
	/** 是否启用 */
	enabled?: boolean;
	/** 是否全局监听 */
	global?: boolean;
}

/**
 * 键盘快捷键管理器组件
 */
export const KeyboardManager: React.FC<KeyboardManagerProps> = ({
	shortcuts = [],
	enabled = true,
	prefix = '',
	onShortcutTrigger,
	className = '',
	style = {}
}) => {
	const [activeShortcuts, setActiveShortcuts] = useState<ShortcutConfig[]>(shortcuts);
	const [pressedKeys, setPressedKeys] = useState<string[]>([]);
	const pressedKeysRef = useRef<string[]>([]);

	// 格式化快捷键显示
	const formatKeyDisplay = useCallback((key: string): string => {
		const keyMap: Record<string, string> = {
			ctrl: 'Ctrl',
			cmd: 'Cmd',
			shift: 'Shift',
			alt: 'Alt',
			enter: 'Enter',
			escape: 'Esc',
			space: 'Space',
			arrowup: '↑',
			arrowdown: '↓',
			arrowleft: '←',
			arrowright: '→',
			backspace: '⌫',
			tab: 'Tab',
			capslock: 'Caps',
			meta: 'Meta'
		};

		return keyMap[key.toLowerCase()] || key.toUpperCase();
	}, []);

	// 解析快捷键组合
	const parseShortcut = useCallback((shortcut: string): string[] => {
		return shortcut
			.toLowerCase()
			.split('+')
			.map(key => key.trim());
	}, []);

	// 检查快捷键是否匹配
	const isShortcutMatch = useCallback((shortcutKeys: string[], pressed: string[]): boolean => {
		// 检查是否包含所有必需的键
		return (
			shortcutKeys.every(key => pressed.includes(key)) && shortcutKeys.length === pressed.length
		);
	}, []);

	// 处理键盘按下事件
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!enabled) return;

			const key = event.key.toLowerCase();

			// 避免重复添加
			if (!pressedKeysRef.current.includes(key)) {
				pressedKeysRef.current = [...pressedKeysRef.current, key];
				setPressedKeys([...pressedKeysRef.current]);
			}

			// 检查是否有匹配的快捷键
			activeShortcuts.forEach(shortcut => {
				if (shortcut.enabled === false) return;

				const shortcutKeys = parseShortcut(shortcut.key);

				if (isShortcutMatch(shortcutKeys, pressedKeysRef.current)) {
					event.preventDefault();
					shortcut.handler(event);
					onShortcutTrigger?.(shortcut);
				}
			});
		},
		[enabled, activeShortcuts, parseShortcut, isShortcutMatch, onShortcutTrigger]
	);

	// 处理键盘释放事件
	const handleKeyUp = useCallback((event: KeyboardEvent) => {
		const key = event.key.toLowerCase();
		pressedKeysRef.current = pressedKeysRef.current.filter(k => k !== key);
		setPressedKeys([...pressedKeysRef.current]);
	}, []);

	// 添加新的快捷键
	const addShortcut = useCallback((shortcut: ShortcutConfig) => {
		setActiveShortcuts(prev => [...prev, shortcut]);
	}, []);

	// 移除快捷键
	const removeShortcut = useCallback((key: string) => {
		setActiveShortcuts(prev => prev.filter(s => s.key !== key));
	}, []);

	// 更新快捷键
	const updateShortcut = useCallback((key: string, updates: Partial<ShortcutConfig>) => {
		setActiveShortcuts(prev =>
			prev.map(shortcut => (shortcut.key === key ? { ...shortcut, ...updates } : shortcut))
		);
	}, []);

	// 清空所有快捷键
	const clearShortcuts = useCallback(() => {
		setActiveShortcuts([]);
	}, []);

	// 获取当前激活的快捷键列表
	const getActiveShortcuts = useCallback(() => {
		return activeShortcuts.filter(s => s.enabled !== false);
	}, [activeShortcuts]);

	// 监听键盘事件
	useEffect(() => {
		if (!enabled) return;

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [enabled, handleKeyDown, handleKeyUp]);

	// 提供给外部使用的API
	const api = useMemo(
		() => ({
			addShortcut,
			removeShortcut,
			updateShortcut,
			clearShortcuts,
			getActiveShortcuts
		}),
		[addShortcut, removeShortcut, updateShortcut, clearShortcuts, getActiveShortcuts]
	);

	// 通过ref暴露API给父组件
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current) {
			(ref.current as any).__keyboardManager = api;
		}
	}, [api]);

	return (
		<div ref={ref} className={`keyboard-manager ${className}`} style={style}>
			<div className="keyboard-manager-content">
				{/* 快捷键管理器内容 */}
				<div className="shortcut-list">
					{activeShortcuts
						.filter(s => s.enabled !== false)
						.map((shortcut, index) => (
							<div key={index} className="shortcut-item">
								<div className="shortcut-keys">
									{parseShortcut(shortcut.key).map((key, keyIndex) => (
										<span key={keyIndex} className="key-chip">
											{formatKeyDisplay(key)}
										</span>
									))}
								</div>
								<div className="shortcut-description">{shortcut.description}</div>
							</div>
						))}
				</div>

				{/* 当前按下的键显示 */}
				{pressedKeys.length > 0 && (
					<div className="pressed-keys">
						<div className="pressed-keys-label">当前按键:</div>
						<div className="pressed-keys-list">
							{pressedKeys.map((key, index) => (
								<span key={index} className="key-chip active">
									{formatKeyDisplay(key)}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default KeyboardManager;
