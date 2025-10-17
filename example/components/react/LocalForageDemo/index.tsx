import * as React from 'react';
import * as localforage from 'localforage';
import './index.scss';

interface LocalForageDemoProps {
	dbName?: string;
	storeName?: string;
	driver?: string;
	className?: string;
}

const LocalForageDemo: React.FC<LocalForageDemoProps> = ({
	dbName = 'localforage',
	storeName = 'key-value-pairs',
	driver = 'auto',
	className = ''
}) => {
	// 状态管理
	const [key, setKey] = React.useState<string>('');
	const [value, setValue] = React.useState<string>('');
	const [storedData, setStoredData] = React.useState<Record<string, any>>({});
	const [loading, setLoading] = React.useState<boolean>(false);
	const [message, setMessage] = React.useState<string>('');
	const [config, setConfig] = React.useState({
		dbName,
		storeName,
		driver
	});

	// 初始化 localForage 配置
	React.useEffect(() => {
		const initLocalForage = async () => {
			try {
				// 根据配置设置驱动
				let driverConfig;
				switch (driver) {
					case 'INDEXEDDB':
						driverConfig = localforage.INDEXEDDB;
						break;
					case 'WEBSQL':
						driverConfig = localforage.WEBSQL;
						break;
					case 'LOCALSTORAGE':
						driverConfig = localforage.LOCALSTORAGE;
						break;
					default:
						driverConfig = [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE];
				}

				localforage.config({
					driver: driverConfig,
					name: dbName,
					storeName: storeName
				});

				// 加载现有数据
				await loadStoredData();
			} catch (error) {
				console.error('初始化失败:', error);
				setMessage('初始化失败: ' + (error as Error).message);
			}
		};

		initLocalForage();
	}, [dbName, storeName, driver]);

	// 加载存储的数据
	const loadStoredData = async () => {
		try {
			setLoading(true);
			const keys = await localforage.keys();
			const data: Record<string, any> = {};

			for (const key of keys) {
				const value = await localforage.getItem(key);
				data[key] = value;
			}

			setStoredData(data);
			setMessage('数据加载成功');
		} catch (error) {
			console.error('加载数据失败:', error);
			setMessage('加载数据失败: ' + (error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	// 存储数据
	const handleSave = async () => {
		if (!key.trim()) {
			setMessage('请输入键名');
			return;
		}

		try {
			setLoading(true);
			// 尝试解析 JSON 字符串
			let parsedValue: any = value;
			try {
				parsedValue = JSON.parse(value);
			} catch {
				// 如果不是有效的 JSON，保持原样
			}

			await localforage.setItem(key, parsedValue);
			setMessage('数据存储成功');
			setKey('');
			setValue('');
			await loadStoredData(); // 重新加载数据
		} catch (error) {
			console.error('存储失败:', error);
			setMessage('存储失败: ' + (error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	// 删除数据
	const handleDelete = async (deleteKey: string) => {
		try {
			setLoading(true);
			await localforage.removeItem(deleteKey);
			setMessage(`键 "${deleteKey}" 删除成功`);
			await loadStoredData(); // 重新加载数据
		} catch (error) {
			console.error('删除失败:', error);
			setMessage('删除失败: ' + (error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	// 清空所有数据
	const handleClear = async () => {
		try {
			setLoading(true);
			await localforage.clear();
			setMessage('所有数据已清空');
			setStoredData({});
		} catch (error) {
			console.error('清空失败:', error);
			setMessage('清空失败: ' + (error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	// 更新配置
	const handleConfigChange = (field: keyof typeof config, value: string) => {
		setConfig(prev => ({
			...prev,
			[field]: value
		}));
	};

	// 应用配置
	const applyConfig = async () => {
		try {
			// 重新初始化 localForage
			let driverConfig;
			switch (config.driver) {
				case 'INDEXEDDB':
					driverConfig = localforage.INDEXEDDB;
					break;
				case 'WEBSQL':
					driverConfig = localforage.WEBSQL;
					break;
				case 'LOCALSTORAGE':
					driverConfig = localforage.LOCALSTORAGE;
					break;
				default:
					driverConfig = [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE];
			}

			localforage.config({
				driver: driverConfig,
				name: config.dbName,
				storeName: config.storeName
			});

			setMessage('配置已更新');
			await loadStoredData(); // 重新加载数据
		} catch (error) {
			console.error('配置更新失败:', error);
			setMessage('配置更新失败: ' + (error as Error).message);
		}
	};

	// 格式化值显示
	const formatValue = (value: any): string => {
		if (typeof value === 'object' && value !== null) {
			return JSON.stringify(value, null, 2);
		}
		return String(value);
	};

	return (
		<div className={`localforage-demo ${className}`}>
			<div className="demo-header">
				<h2>localForage 演示</h2>
				<p>异步存储库，支持多种数据类型</p>
			</div>

			<div className="demo-config">
				<h3>配置选项</h3>
				<div className="config-form">
					<div className="form-group">
						<label>数据库名称:</label>
						<input
							type="text"
							value={config.dbName}
							onChange={e => handleConfigChange('dbName', e.target.value)}
							disabled={loading}
						/>
					</div>
					<div className="form-group">
						<label>存储对象名称:</label>
						<input
							type="text"
							value={config.storeName}
							onChange={e => handleConfigChange('storeName', e.target.value)}
							disabled={loading}
						/>
					</div>
					<div className="form-group">
						<label>存储驱动:</label>
						<select
							value={config.driver}
							onChange={e => handleConfigChange('driver', e.target.value)}
							disabled={loading}
						>
							<option value="auto">自动检测</option>
							<option value="INDEXEDDB">IndexedDB</option>
							<option value="WEBSQL">WebSQL</option>
							<option value="LOCALSTORAGE">localStorage</option>
						</select>
					</div>
					<button onClick={applyConfig} disabled={loading}>
						{loading ? '应用中...' : '应用配置'}
					</button>
				</div>
			</div>

			<div className="demo-actions">
				<h3>数据操作</h3>
				<div className="action-form">
					<div className="form-row">
						<input
							type="text"
							placeholder="键名"
							value={key}
							onChange={e => setKey(e.target.value)}
							disabled={loading}
						/>
						<input
							type="text"
							placeholder="值 (可输入 JSON 格式)"
							value={value}
							onChange={e => setValue(e.target.value)}
							disabled={loading}
						/>
					</div>
					<div className="form-buttons">
						<button onClick={handleSave} disabled={loading}>
							{loading ? '存储中...' : '存储数据'}
						</button>
						<button onClick={handleClear} disabled={loading}>
							{loading ? '清空中...' : '清空所有'}
						</button>
						<button onClick={loadStoredData} disabled={loading}>
							{loading ? '加载中...' : '刷新数据'}
						</button>
					</div>
				</div>
			</div>

			<div className="demo-message">{message && <p>{message}</p>}</div>

			<div className="demo-data">
				<h3>存储的数据</h3>
				{Object.keys(storedData).length === 0 ? (
					<p className="no-data">暂无数据</p>
				) : (
					<div className="data-list">
						{Object.entries(storedData).map(([dataKey, dataValue]) => (
							<div key={dataKey} className="data-item">
								<div className="data-key">
									<strong>{dataKey}:</strong>
								</div>
								<div className="data-value">
									<pre>{formatValue(dataValue)}</pre>
								</div>
								<button
									className="delete-btn"
									onClick={() => handleDelete(dataKey)}
									disabled={loading}
								>
									删除
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default LocalForageDemo;
