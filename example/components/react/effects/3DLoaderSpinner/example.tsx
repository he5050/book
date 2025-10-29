import React, { useState, useEffect } from 'react';
import D3LoaderSpinner, { BlendMode, AnimationState } from './index';

const D3LoaderSpinnerExample: React.FC = () => {
	const [config, setConfig] = useState({
		size: 250,
		backgroundColor: '#c9d5e0',
		primaryColor: '#2196f3',
		secondaryColor: '#e91e63',
		animationDuration: 2,
		blendMode: 'plus-lighter' as BlendMode,
		showProgress: false,
		progress: 0,
		animationState: 'playing' as AnimationState,
		enableClickControl: false,
		gradientAngle: 45,
		blurIntensity: 20
	});

	const [autoProgress, setAutoProgress] = useState(false);

	const handleConfigChange = (key: string, value: string | number | boolean) => {
		setConfig(prev => ({
			...prev,
			[key]: value
		}));
	};

	// 自动进度模拟
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (autoProgress && !config.showProgress) {
			setConfig(prev => ({ ...prev, showProgress: true }));
		}
		if (autoProgress && config.showProgress && config.animationState === 'playing') {
			interval = setInterval(() => {
				setConfig(prev => ({
					...prev,
					progress: prev.progress >= 100 ? 0 : prev.progress + 2
				}));
			}, 100);
		}
		return () => clearInterval(interval);
	}, [autoProgress, config.showProgress, config.animationState]);

	// 混合模式选项
	const blendModes: Array<{ value: BlendMode; label: string; description: string }> = [
		{ value: 'plus-lighter', label: '发光叠加', description: '增亮混合，创造发光效果' },
		{ value: 'screen', label: '滤色', description: '明亮混合，软化效果' },
		{ value: 'overlay', label: '叠加', description: '增强对比度' },
		{ value: 'color-dodge', label: '颜色减淡', description: '强烈发光效果' },
		{ value: 'hard-light', label: '强光', description: '硬质光照效果' },
		{ value: 'soft-light', label: '柔光', description: '柔和光照效果' },
		{ value: 'difference', label: '差值', description: '颜色反转效果' },
		{ value: 'exclusion', label: '排除', description: '柔和差值效果' },
		{ value: 'multiply', label: '正片叠底', description: '加深混合' },
		{ value: 'normal', label: '正常', description: '无混合效果' }
	];

	const handleAnimationStateChange = (state: AnimationState) => {
		setConfig(prev => ({ ...prev, animationState: state }));
	};

	const handleProgressChange = (progress: number) => {
		if (!autoProgress) {
			setConfig(prev => ({ ...prev, progress }));
		}
	};

	return (
		<div
			className="d3-loader-spinner-demo"
			style={{
				maxWidth: '600px',
				margin: '0 auto',
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
			}}
		>
			<div
				style={{
					textAlign: 'center',
					marginBottom: '20px',
					padding: '0 20px'
				}}
			>
				<h2
					style={{
						color: '#2c3e50',
						marginBottom: '8px',
						fontSize: '1.5rem',
						fontWeight: '600'
					}}
				>
					3D加载旋转器 - 增强版
				</h2>
				<p
					style={{
						color: '#7f8c8d',
						fontSize: '0.9rem',
						margin: '0'
					}}
				>
					支持多种混合模式、动画控制和进度显示的立体加载器
				</p>
			</div>

			{/* 效果展示区域 */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '320px',
					marginBottom: '25px',
					backgroundColor: '#f8f9fa',
					borderRadius: '12px',
					border: '1px solid #e9ecef',
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				<D3LoaderSpinner
					{...config}
					onAnimationStateChange={handleAnimationStateChange}
					onProgressChange={handleProgressChange}
				/>

				{/* 状态指示器 */}
				<div
					style={{
						position: 'absolute',
						top: '10px',
						right: '15px',
						fontSize: '0.8rem',
						color: '#6c757d',
						backgroundColor: 'rgba(255,255,255,0.9)',
						padding: '6px 10px',
						borderRadius: '6px',
						backdropFilter: 'blur(4px)'
					}}
				>
					<div>
						{config.size}×{config.size}px
					</div>
					<div>
						状态:{' '}
						{config.animationState === 'playing'
							? '播放中'
							: config.animationState === 'paused'
							? '已暂停'
							: '已停止'}
					</div>
					{config.showProgress && <div>进度: {Math.round(config.progress)}%</div>}
				</div>
			</div>

			{/* 混合模式配置 */}
			<div
				style={{
					backgroundColor: '#ffffff',
					borderRadius: '12px',
					border: '1px solid #e9ecef',
					padding: '20px',
					marginBottom: '20px'
				}}
			>
				<h3
					style={{
						color: '#495057',
						marginTop: '0',
						marginBottom: '15px',
						fontSize: '1.1rem',
						fontWeight: '600'
					}}
				>
					混合模式
				</h3>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
						gap: '10px'
					}}
				>
					{blendModes.map(mode => (
						<div
							key={mode.value}
							style={{
								padding: '10px',
								border: config.blendMode === mode.value ? '2px solid #007bff' : '1px solid #e9ecef',
								borderRadius: '8px',
								cursor: 'pointer',
								backgroundColor: config.blendMode === mode.value ? '#f8f9ff' : '#fafafa',
								transition: 'all 0.2s ease'
							}}
							onClick={() => handleConfigChange('blendMode', mode.value)}
						>
							<div
								style={{
									fontWeight: '600',
									fontSize: '0.85rem',
									color: config.blendMode === mode.value ? '#007bff' : '#495057',
									marginBottom: '4px'
								}}
							>
								{mode.label}
							</div>
							<div
								style={{
									fontSize: '0.75rem',
									color: '#6c757d',
									lineHeight: '1.3'
								}}
							>
								{mode.description}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* 动画控制和进度配置 */}
			<div
				style={{
					backgroundColor: '#ffffff',
					borderRadius: '12px',
					border: '1px solid #e9ecef',
					padding: '20px',
					marginBottom: '20px'
				}}
			>
				<h3
					style={{
						color: '#495057',
						marginTop: '0',
						marginBottom: '20px',
						fontSize: '1.1rem',
						fontWeight: '600'
					}}
				>
					动画控制 & 进度显示
				</h3>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
						gap: '20px'
					}}
				>
					{/* 动画控制 */}
					<div>
						<div
							style={{
								fontWeight: '500',
								color: '#495057',
								marginBottom: '12px',
								fontSize: '0.9rem'
							}}
						>
							动画状态控制
						</div>
						<div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
							{(['playing', 'paused', 'stopped'] as AnimationState[]).map(state => (
								<button
									key={state}
									onClick={() => handleConfigChange('animationState', state)}
									style={{
										padding: '8px 16px',
										border:
											config.animationState === state ? '2px solid #007bff' : '1px solid #e9ecef',
										borderRadius: '6px',
										backgroundColor: config.animationState === state ? '#007bff' : '#fff',
										color: config.animationState === state ? '#fff' : '#495057',
										cursor: 'pointer',
										fontSize: '0.8rem',
										fontWeight: '500',
										transition: 'all 0.2s ease'
									}}
								>
									{state === 'playing' ? '播放' : state === 'paused' ? '暂停' : '停止'}
								</button>
							))}
						</div>

						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								fontSize: '0.9rem',
								color: '#495057',
								cursor: 'pointer'
							}}
						>
							<input
								type="checkbox"
								checked={config.enableClickControl}
								onChange={e => handleConfigChange('enableClickControl', e.target.checked)}
								style={{ cursor: 'pointer' }}
							/>
							启用点击控制
						</label>
					</div>

					{/* 进度控制 */}
					<div>
						<div
							style={{
								fontWeight: '500',
								color: '#495057',
								marginBottom: '12px',
								fontSize: '0.9rem'
							}}
						>
							进度显示设置
						</div>

						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								fontSize: '0.9rem',
								color: '#495057',
								cursor: 'pointer',
								marginBottom: '12px'
							}}
						>
							<input
								type="checkbox"
								checked={config.showProgress}
								onChange={e => handleConfigChange('showProgress', e.target.checked)}
								style={{ cursor: 'pointer' }}
							/>
							显示进度环
						</label>

						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								fontSize: '0.9rem',
								color: '#495057',
								cursor: 'pointer',
								marginBottom: '12px'
							}}
						>
							<input
								type="checkbox"
								checked={autoProgress}
								onChange={e => setAutoProgress(e.target.checked)}
								style={{ cursor: 'pointer' }}
								disabled={!config.showProgress}
							/>
							自动进度模拟
						</label>

						{config.showProgress && !autoProgress && (
							<div>
								<label
									style={{
										display: 'block',
										marginBottom: '8px',
										fontWeight: '500',
										color: '#495057',
										fontSize: '0.85rem'
									}}
								>
									手动进度: {Math.round(config.progress)}%
								</label>
								<input
									type="range"
									min="0"
									max="100"
									value={config.progress}
									onChange={e => handleConfigChange('progress', parseInt(e.target.value))}
									style={{ width: '100%' }}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 技术说明 */}
			<div
				style={{
					backgroundColor: '#ffffff',
					borderRadius: '12px',
					border: '1px solid #e9ecef',
					padding: '20px'
				}}
			>
				<h3
					style={{
						color: '#495057',
						marginTop: '0',
						marginBottom: '15px',
						fontSize: '1.1rem',
						fontWeight: '600'
					}}
				>
					功能说明
				</h3>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '15px',
						fontSize: '0.9rem'
					}}
				>
					<div>
						<div
							style={{
								fontWeight: '600',
								color: '#007bff',
								marginBottom: '8px'
							}}
						>
							混合模式
						</div>
						<ul
							style={{
								margin: '0',
								paddingLeft: '16px',
								color: '#6c757d',
								lineHeight: '1.5'
							}}
						>
							<li>10种不同视觉效果</li>
							<li>实时切换预览</li>
							<li>专业级光效控制</li>
						</ul>
					</div>

					<div>
						<div
							style={{
								fontWeight: '600',
								color: '#28a745',
								marginBottom: '8px'
							}}
						>
							动画控制
						</div>
						<ul
							style={{
								margin: '0',
								paddingLeft: '16px',
								color: '#6c757d',
								lineHeight: '1.5'
							}}
						>
							<li>播放/暂停/停止</li>
							<li>点击交互控制</li>
							<li>状态反馈显示</li>
						</ul>
					</div>

					<div>
						<div
							style={{
								fontWeight: '600',
								color: '#fd7e14',
								marginBottom: '8px'
							}}
						>
							进度显示
						</div>
						<ul
							style={{
								margin: '0',
								paddingLeft: '16px',
								color: '#6c757d',
								lineHeight: '1.5'
							}}
						>
							<li>环形进度条</li>
							<li>百分比显示</li>
							<li>自动/手动模式</li>
						</ul>
					</div>
				</div>

				<div
					style={{
						marginTop: '15px',
						padding: '12px',
						backgroundColor: '#f8f9fa',
						borderRadius: '8px',
						borderLeft: '4px solid #007bff'
					}}
				>
					<div
						style={{
							fontWeight: '600',
							color: '#495057',
							fontSize: '0.9rem',
							marginBottom: '5px'
						}}
					>
						适用场景
					</div>
					<div
						style={{
							color: '#6c757d',
							fontSize: '0.85rem',
							lineHeight: '1.4'
						}}
					>
						文件上传进度、数据处理状态、用户等待提示、高端UI加载器
					</div>
				</div>
			</div>
		</div>
	);
};

export default D3LoaderSpinnerExample;
