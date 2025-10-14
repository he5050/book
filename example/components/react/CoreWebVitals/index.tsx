import React, { useState, useEffect } from 'react';
import { onLCP, onINP, onCLS } from 'web-vitals';
import './index.scss';

interface Metric {
	value: number;
	// 添加其他可能需要的属性
	[key: string]: any;
}

interface CoreWebVitalsProps {
	width?: number;
	height?: number;
	lcpValue?: number;
	inpValue?: number;
	clsValue?: number;
	className?: string;
	onMetricChange?: (metrics: { lcp: number; inp: number; cls: number }) => void;
}

const CoreWebVitals: React.FC<CoreWebVitalsProps> = ({
	width = 500,
	height = 300,
	lcpValue,
	inpValue,
	clsValue,
	className = '',
	onMetricChange
}) => {
	const [metrics, setMetrics] = useState({
		lcp: lcpValue !== undefined ? lcpValue : 0,
		inp: inpValue !== undefined ? inpValue : 0,
		cls: clsValue !== undefined ? clsValue : 0
	});

	// 初始化时获取真实的核心指标
	useEffect(() => {
		// 只在浏览器环境中执行
		if (typeof window !== 'undefined') {
			// 获取LCP指标
			onLCP((metric: Metric) => {
				setMetrics(prev => ({
					...prev,
					lcp: metric.value / 1000 // 转换为秒
				}));
			});

			// 获取INP指标（替代了FID）
			onINP((metric: Metric) => {
				setMetrics(prev => ({
					...prev,
					inp: metric.value
				}));
			});

			// 获取CLS指标
			onCLS((metric: Metric) => {
				setMetrics(prev => ({
					...prev,
					cls: metric.value
				}));
			});
		}
	}, []);

	// 当指标变化时触发回调
	useEffect(() => {
		// 只有当所有指标都有值时才触发回调
		if (metrics.lcp > 0 || metrics.inp > 0 || metrics.cls > 0) {
			onMetricChange?.({
				lcp: metrics.lcp,
				inp: metrics.inp,
				cls: metrics.cls
			});
		}
	}, [metrics, onMetricChange]);

	// 判断指标状态
	const getMetricStatus = (value: number, thresholds: number[]) => {
		if (value <= thresholds[0]) return 'good';
		if (value <= thresholds[1]) return 'needs-improvement';
		return 'poor';
	};

	// LCP状态 (目标: ≤ 2.5s)
	const lcpStatus = getMetricStatus(metrics.lcp, [2.5, 4.0]);

	// INP状态 (目标: ≤ 200ms)
	const inpStatus = getMetricStatus(metrics.inp, [200, 500]);

	// CLS状态 (目标: ≤ 0.1)
	const clsStatus = getMetricStatus(metrics.cls, [0.1, 0.25]);

	// 获取状态标签
	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'good':
				return '良好';
			case 'needs-improvement':
				return '需要改进';
			case 'poor':
				return '较差';
			default:
				return '未知';
		}
	};

	// 获取状态颜色
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'good':
				return '#4caf50';
			case 'needs-improvement':
				return '#ff9800';
			case 'poor':
				return '#f44336';
			default:
				return '#9e9e9e';
		}
	};

	return (
		<div className={`core-web-vitals ${className}`} style={{ width, height }}>
			<div className="core-web-vitals-header">
				<h3>Core Web Vitals 指标</h3>
				<p>实时监控页面性能指标</p>
			</div>

			<div className="core-web-vitals-metrics">
				{/* LCP 指标 */}
				<div className="metric-card">
					<div className="metric-header">
						<h4>LCP</h4>
						<span className="metric-status" style={{ color: getStatusColor(lcpStatus) }}>
							{getStatusLabel(lcpStatus)}
						</span>
					</div>
					<div className="metric-value">
						<span className="value">{metrics.lcp.toFixed(2)}s</span>
						<span className="target">目标: ≤ 2.5s</span>
					</div>
					<div className="metric-description">
						<p>最大内容绘制时间</p>
						<p>衡量页面加载性能</p>
					</div>
				</div>

				{/* INP 指标 */}
				<div className="metric-card">
					<div className="metric-header">
						<h4>INP</h4>
						<span className="metric-status" style={{ color: getStatusColor(inpStatus) }}>
							{getStatusLabel(inpStatus)}
						</span>
					</div>
					<div className="metric-value">
						<span className="value">{metrics.inp.toFixed(0)}ms</span>
						<span className="target">目标: ≤ 200ms</span>
					</div>
					<div className="metric-description">
						<p>交互到下次绘制时间</p>
						<p>衡量页面交互性</p>
					</div>
				</div>

				{/* CLS 指标 */}
				<div className="metric-card">
					<div className="metric-header">
						<h4>CLS</h4>
						<span className="metric-status" style={{ color: getStatusColor(clsStatus) }}>
							{getStatusLabel(clsStatus)}
						</span>
					</div>
					<div className="metric-value">
						<span className="value">{metrics.cls.toFixed(2)}</span>
						<span className="target">目标: ≤ 0.1</span>
					</div>
					<div className="metric-description">
						<p>累积布局偏移</p>
						<p>衡量视觉稳定性</p>
					</div>
				</div>
			</div>

			<div className="core-web-vitals-footer">
				<p>Core Web Vitals 是 Google 衡量网页用户体验的官方标准</p>
			</div>
		</div>
	);
};

export default CoreWebVitals;
