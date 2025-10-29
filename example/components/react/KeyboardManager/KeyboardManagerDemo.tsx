import React, { useState, useRef } from 'react';
import KeyboardManager, { ShortcutConfig } from './KeyboardManager';

const KeyboardManagerDemo: React.FC = () => {
	const [log, setLog] = useState<string[]>([]);
	const [isEnabled, setIsEnabled] = useState(true);
	const keyboardManagerRef = useRef<HTMLDivElement>(null);

	// 添加日志
	const addLog = (message: string) => {
		setLog(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
	};

	// 快捷键配置
	const shortcuts: ShortcutConfig[] = [
		{
			key: 'ctrl+k',
			description: '打开搜索面板',
			handler: event => {
				event.preventDefault();
				addLog('触发了 Ctrl+K 快捷键 - 打开搜索面板');
			}
		},
		{
			key: 'ctrl+s',
			description: '保存当前内容',
			handler: event => {
				event.preventDefault();
				addLog('触发了 Ctrl+S 快捷键 - 保存当前内容');
			}
		},
		{
			key: 'ctrl+shift+n',
			description: '新建项目',
			handler: event => {
				event.preventDefault();
				addLog('触发了 Ctrl+Shift+N 快捷键 - 新建项目');
			}
		},
		{
			key: 'alt+f4',
			description: '关闭应用',
			handler: event => {
				event.preventDefault();
				addLog('触发了 Alt+F4 快捷键 - 关闭应用');
			}
		},
		{
			key: 'f5',
			description: '刷新页面',
			handler: event => {
				event.preventDefault();
				addLog('触发了 F5 快捷键 - 刷新页面');
			}
		}
	];

	// 添加新的快捷键
	const handleAddShortcut = () => {
		const newShortcut: ShortcutConfig = {
			key: 'ctrl+d',
			description: '删除选中项',
			handler: event => {
				event.preventDefault();
				addLog('触发了 Ctrl+D 快捷键 - 删除选中项');
			}
		};

		if (keyboardManagerRef.current) {
			const manager = (keyboardManagerRef.current as any).__keyboardManager;
			if (manager) {
				manager.addShortcut(newShortcut);
				addLog('已添加新的快捷键 Ctrl+D');
			}
		}
	};

	// 移除快捷键
	const handleRemoveShortcut = () => {
		if (keyboardManagerRef.current) {
			const manager = (keyboardManagerRef.current as any).__keyboardManager;
			if (manager) {
				manager.removeShortcut('ctrl+s');
				addLog('已移除快捷键 Ctrl+S');
			}
		}
	};

	return (
		<div
			className="keyboard-manager-demo"
			style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}
		>
			<h2>键盘快捷键管理器演示</h2>

			<div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button
					onClick={() => setIsEnabled(!isEnabled)}
					style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
				>
					{isEnabled ? '禁用快捷键' : '启用快捷键'}
				</button>

				<button
					onClick={handleAddShortcut}
					style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
				>
					添加快捷键 (Ctrl+D)
				</button>

				<button
					onClick={handleRemoveShortcut}
					style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
				>
					移除快捷键 (Ctrl+S)
				</button>

				<button
					onClick={() => setLog([])}
					style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
				>
					清空日志
				</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h3>尝试以下快捷键组合：</h3>
				<ul>
					<li>
						<strong>Ctrl+K</strong> - 打开搜索面板
					</li>
					<li>
						<strong>Ctrl+S</strong> - 保存当前内容
					</li>
					<li>
						<strong>Ctrl+Shift+N</strong> - 新建项目
					</li>
					<li>
						<strong>Alt+F4</strong> - 关闭应用
					</li>
					<li>
						<strong>F5</strong> - 刷新页面
					</li>
				</ul>
			</div>

			<KeyboardManager
				ref={keyboardManagerRef}
				shortcuts={shortcuts}
				enabled={isEnabled}
				onShortcutTrigger={shortcut => {
					console.log('快捷键触发:', shortcut);
				}}
				style={{ marginBottom: '20px' }}
			/>

			<div
				style={{
					background: 'white',
					padding: '16px',
					borderRadius: '6px',
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<h3>操作日志</h3>
				<div
					style={{
						height: '200px',
						overflowY: 'auto',
						border: '1px solid #eee',
						padding: '10px',
						borderRadius: '4px'
					}}
				>
					{log.length === 0 ? (
						<p style={{ color: '#999', textAlign: 'center' }}>暂无操作日志</p>
					) : (
						log.map((entry, index) => (
							<div key={index} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
								{entry}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default KeyboardManagerDemo;
