import React, { useState } from 'react';
import CardClock, { DateFormatOptions } from './CardClock';

/**
 * 卡片时钟演示页面
 * 展示现代卡片时钟的各种配置和使用方式
 */
export const CardClockDemo: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'custom'>('basic');
	const [customDate, setCustomDate] = useState<string>('');
	const [formatOptions, setFormatOptions] = useState<DateFormatOptions>({
		showFullDate: true,
		showTime: true,
		showWeekday: true,
		showYearMonth: false,
		showWeekNumber: false
	});
	const [theme, setTheme] = useState<'light' | 'dark' | 'gradient'>('gradient');

	const handleFormatChange = (key: keyof DateFormatOptions) => {
		setFormatOptions(prev => ({
			...prev,
			[key]: !prev[key]
		}));
	};

	const presetConfigs = {
		minimal: {
			formatOptions: { showTime: true },
			theme: 'light' as const,
			title: '简洁时钟'
		},
		standard: {
			formatOptions: { showFullDate: true, showTime: true, showWeekday: true },
			theme: 'gradient' as const,
			title: '标准时钟'
		},
		complete: {
			formatOptions: {
				showFullDate: true,
				showYearMonth: true,
				showTime: true,
				showWeekday: true,
				showWeekNumber: true
			},
			theme: 'dark' as const,
			title: '完整信息时钟'
		}
	};

	const getFormatLabel = (key: string): string => {
		const labels: Record<string, string> = {
			showFullDate: '显示完整日期 (yyyy-mm-dd)',
			showYearMonth: '显示年月 (YYYY-MM)',
			showTime: '显示时分秒',
			showWeekday: '显示星期几',
			showWeekNumber: '显示当前周数'
		};
		return labels[key] || key;
	};

	return (
		<div
			style={{
				padding: '20px',
				maxWidth: '1400px',
				margin: '0 auto',
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
			}}
		>
			{/* 页面标题 */}
			<div style={{ textAlign: 'center', marginBottom: '40px' }}>
				<h1
					style={{
						fontSize: '2.5rem',
						fontWeight: '700',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						marginBottom: '10px'
					}}
				>
					现代卡片时钟组件
				</h1>
				<p
					style={{
						fontSize: '1.1rem',
						color: '#666',
						maxWidth: '600px',
						margin: '0 auto',
						lineHeight: '1.6'
					}}
				>
					基于掘金文章设计的现代化时钟组件，支持丰富的配置选项和多种主题
				</p>
			</div>

			{/* 标签页导航 */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '30px',
					borderBottom: '1px solid #e0e0e0'
				}}
			>
				{[
					{ key: 'basic', label: '基础示例' },
					{ key: 'advanced', label: '高级配置' },
					{ key: 'custom', label: '自定义配置' }
				].map(tab => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key as any)}
						style={{
							padding: '12px 24px',
							border: 'none',
							background: 'transparent',
							fontSize: '16px',
							fontWeight: '500',
							cursor: 'pointer',
							borderBottom: activeTab === tab.key ? '2px solid #667eea' : '2px solid transparent',
							color: activeTab === tab.key ? '#667eea' : '#666',
							transition: 'all 0.2s ease'
						}}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* 基础示例 */}
			{activeTab === 'basic' && (
				<div>
					<h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>基础示例展示</h2>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
							gap: '30px',
							justifyItems: 'center'
						}}
					>
						{Object.entries(presetConfigs).map(([key, config]) => (
							<div key={key} style={{ textAlign: 'center' }}>
								<h3 style={{ marginBottom: '16px', color: '#555' }}>{config.title}</h3>
								<CardClock {...config} animated={true} />
								<div
									style={{
										marginTop: '12px',
										fontSize: '14px',
										color: '#888',
										maxWidth: '300px'
									}}
								>
									{key === 'minimal' && '仅显示时间，适合空间有限的场景'}
									{key === 'standard' && '标准配置，显示日期、时间和星期'}
									{key === 'complete' && '完整信息显示，包含所有可用选项'}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* 高级配置 */}
			{activeTab === 'advanced' && (
				<div>
					<h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>高级配置示例</h2>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
							gap: '30px',
							justifyItems: 'center'
						}}
					>
						{/* 自定义日期示例 */}
						<div style={{ textAlign: 'center' }}>
							<h3 style={{ marginBottom: '16px', color: '#555' }}>自定义日期 - 完整格式</h3>
							<CardClock
								customDate="2024-12-25"
								title="圣诞节"
								theme="gradient"
								animated={true}
								formatOptions={{
									showFullDate: true,
									showWeekday: true,
									showWeekNumber: true
								}}
							/>
							<div
								style={{
									marginTop: '12px',
									fontSize: '14px',
									color: '#888',
									maxWidth: '300px'
								}}
							>
								显示特定日期：2024-12-25
							</div>
						</div>

						{/* 年月格式示例 */}
						<div style={{ textAlign: 'center' }}>
							<h3 style={{ marginBottom: '16px', color: '#555' }}>自定义日期 - 年月格式</h3>
							<CardClock
								customDate="2024-06"
								title="2024年6月"
								theme="dark"
								animated={true}
								formatOptions={{
									showYearMonth: true,
									showWeekNumber: true
								}}
							/>
							<div
								style={{
									marginTop: '12px',
									fontSize: '14px',
									color: '#888',
									maxWidth: '300px'
								}}
							>
								仅显示年月：2024-06
							</div>
						</div>

						{/* 主题对比 */}
						<div style={{ textAlign: 'center' }}>
							<h3 style={{ marginBottom: '16px', color: '#555' }}>浅色主题</h3>
							<CardClock
								title="浅色主题时钟"
								theme="light"
								animated={false}
								formatOptions={{
									showTime: true,
									showWeekday: true
								}}
							/>
							<div
								style={{
									marginTop: '12px',
									fontSize: '14px',
									color: '#888',
									maxWidth: '300px'
								}}
							>
								适合明亮环境，无动画效果
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 自定义配置 */}
			{activeTab === 'custom' && (
				<div>
					<h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
						自定义配置面板
					</h2>

					{/* 配置面板 */}
					<div
						style={{
							marginBottom: '40px',
							padding: '30px',
							background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
							borderRadius: '16px',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
						}}
					>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
								gap: '30px'
							}}
						>
							{/* 日期格式配置 */}
							<div>
								<h3 style={{ marginBottom: '16px', color: '#333' }}>📅 日期格式配置</h3>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
									{Object.entries(formatOptions).map(([key, value]) => (
										<label
											key={key}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '12px',
												padding: '8px 12px',
												background: 'rgba(255, 255, 255, 0.7)',
												borderRadius: '8px',
												cursor: 'pointer',
												transition: 'background 0.2s ease'
											}}
										>
											<input
												type="checkbox"
												checked={value}
												onChange={() => handleFormatChange(key as keyof DateFormatOptions)}
												style={{ transform: 'scale(1.2)' }}
											/>
											<span style={{ fontSize: '14px', fontWeight: '500' }}>
												{getFormatLabel(key)}
											</span>
										</label>
									))}
								</div>
							</div>

							{/* 自定义日期 */}
							<div>
								<h3 style={{ marginBottom: '16px', color: '#333' }}>🗓️ 自定义日期</h3>
								<input
									type="text"
									placeholder="yyyy-mm-dd 或 YYYY-MM"
									value={customDate}
									onChange={e => setCustomDate(e.target.value)}
									style={{
										width: '100%',
										padding: '12px 16px',
										border: '2px solid #e0e0e0',
										borderRadius: '8px',
										fontSize: '14px',
										background: 'rgba(255, 255, 255, 0.9)',
										transition: 'border-color 0.2s ease'
									}}
									onFocus={e => (e.target.style.borderColor = '#667eea')}
									onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
								/>
								<div
									style={{
										marginTop: '8px',
										fontSize: '12px',
										color: '#666',
										background: 'rgba(255, 255, 255, 0.7)',
										padding: '8px 12px',
										borderRadius: '6px'
									}}
								>
									💡 支持格式：2024-03-15 或 2024-03
									<br />
									留空则显示实时时间
								</div>
							</div>

							{/* 主题选择 */}
							<div>
								<h3 style={{ marginBottom: '16px', color: '#333' }}>🎨 主题选择</h3>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
									{(['light', 'dark', 'gradient'] as const).map(t => (
										<label
											key={t}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '12px',
												padding: '8px 12px',
												background: 'rgba(255, 255, 255, 0.7)',
												borderRadius: '8px',
												cursor: 'pointer'
											}}
										>
											<input
												type="radio"
												name="theme"
												value={t}
												checked={theme === t}
												onChange={e => setTheme(e.target.value as any)}
												style={{ transform: 'scale(1.2)' }}
											/>
											<span
												style={{
													fontSize: '14px',
													fontWeight: '500',
													textTransform: 'capitalize'
												}}
											>
												{t === 'light' && '🌞 浅色主题'}
												{t === 'dark' && '🌙 深色主题'}
												{t === 'gradient' && '🌈 渐变主题'}
											</span>
										</label>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* 预览区域 */}
					<div style={{ textAlign: 'center' }}>
						<h3 style={{ marginBottom: '20px', color: '#333' }}>🔍 实时预览</h3>
						<CardClock
							customDate={customDate || undefined}
							formatOptions={formatOptions}
							theme={theme}
							title="自定义配置时钟"
							animated={true}
						/>

						{/* 配置代码展示 */}
						<div
							style={{
								marginTop: '30px',
								padding: '20px',
								background: '#f8f9fa',
								borderRadius: '12px',
								textAlign: 'left',
								fontSize: '14px',
								fontFamily: 'Monaco, "Cascadia Code", monospace',
								overflow: 'auto'
							}}
						>
							<h4 style={{ marginBottom: '12px', color: '#333' }}>📝 当前配置代码：</h4>
							<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
								{`<CardClock
  ${customDate ? `customDate="${customDate}"` : '// 实时时间'}
  theme="${theme}"
  title="自定义配置时钟"
  animated={true}
  formatOptions={{
${Object.entries(formatOptions)
	.filter(([, value]) => value)
	.map(([key]) => `    ${key}: true,`)
	.join('\n')}
  }}
/>`}
							</pre>
						</div>
					</div>
				</div>
			)}

			{/* 使用说明 */}
			<div
				style={{
					marginTop: '60px',
					padding: '30px',
					background: 'linear-gradient(135deg, #e8f4fd 0%, #c3e8ff 100%)',
					borderRadius: '16px',
					borderLeft: '6px solid #007acc'
				}}
			>
				<h3 style={{ marginBottom: '20px', color: '#333' }}> 使用说明</h3>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
						gap: '20px',
						fontSize: '14px',
						lineHeight: '1.6'
					}}
				>
					<div>
						<h4 style={{ color: '#007acc', marginBottom: '8px' }}>核心特性</h4>
						<ul style={{ paddingLeft: '20px', color: '#555' }}>
							<li>支持实时时间和自定义日期显示</li>
							<li>丰富的日期格式配置选项</li>
							<li>三种内置主题：浅色、深色、渐变</li>
							<li>平滑的动画效果和悬停交互</li>
							<li>完整的TypeScript类型支持</li>
						</ul>
					</div>
					<div>
						<h4 style={{ color: '#007acc', marginBottom: '8px' }}> 配置说明</h4>
						<ul style={{ paddingLeft: '20px', color: '#555' }}>
							<li>
								<strong>customDate</strong>: 自定义日期，支持 yyyy-mm-dd 和 YYYY-MM 格式
							</li>
							<li>
								<strong>formatOptions</strong>: 控制显示哪些日期信息
							</li>
							<li>
								<strong>theme</strong>: 主题样式选择
							</li>
							<li>
								<strong>animated</strong>: 是否启用动画效果
							</li>
						</ul>
					</div>
					<div>
						<h4 style={{ color: '#007acc', marginBottom: '8px' }}> 快速开始</h4>
						<ul style={{ paddingLeft: '20px', color: '#555' }}>
							<li>复制 CardClock.tsx 和 CardClock.css 到项目中</li>
							<li>
								导入组件：<code>import CardClock from './CardClock'</code>
							</li>
							<li>
								基础使用：<code>&lt;CardClock /&gt;</code>
							</li>
							<li>查看示例代码了解更多配置选项</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardClockDemo;
