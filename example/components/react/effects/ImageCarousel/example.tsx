import React, { useState } from 'react';
import ImageCarousel from './index';

const ImageCarouselExample: React.FC = () => {
	const [autoPlay, setAutoPlay] = useState(true);
	const [interval, setInterval] = useState(2000);
	const [customSlides, setCustomSlides] = useState([
		{
			title: '春天',
			imageUrl:
				'https://img0.baidu.com/it/u=3902947011,207703161&fm=253&app=138&f=JPEG?w=800&h=1455',
			imageAlt: '春天的风景'
		},
		{
			title: '夏天',
			imageUrl:
				'https://img0.baidu.com/it/u=4091158592,2102354044&fm=253&app=138&f=JPEG?w=800&h=1455',
			imageAlt: '夏天的风景'
		},
		{
			title: '秋天',
			imageUrl:
				'https://img0.baidu.com/it/u=3902947011,207703161&fm=253&app=138&f=JPEG?w=800&h=1455',
			imageAlt: '秋天的风景'
		},
		{
			title: '冬天',
			imageUrl:
				'https://img0.baidu.com/it/u=4091158592,2102354044&fm=253&app=138&f=JPEG?w=800&h=1455',
			imageAlt: '冬天的风景'
		}
	]);

	const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 2000;
		setInterval(Math.max(1000, Math.min(10000, value)));
	};

	const handleAddSlide = () => {
		const newSlide = {
			title: `季节 ${customSlides.length + 1}`,
			imageUrl: 'https://q6.itc.cn/q_70/images03/20250116/b5dba16a1f5749a6a375f20f901d6381.png',
			imageAlt: `季节 ${customSlides.length + 1} 的风景`
		};
		setCustomSlides([...customSlides, newSlide]);
	};

	const handleRemoveSlide = () => {
		if (customSlides.length > 1) {
			setCustomSlides(customSlides.slice(0, -1));
		}
	};

	return (
		<div style={{ padding: '20px' }}>
			<h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>图片轮播效果演示</h1>

			<div style={{ marginBottom: '30px', textAlign: 'center' }}>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>默认轮播效果</h2>
				<div
					style={{
						display: 'inline-block',
						backgroundColor: '#f0f0f0',
						borderRadius: '8px',
						padding: '20px',
						height: '300px',
						width: '100%'
					}}
				>
					<ImageCarousel />
				</div>
			</div>

			<div style={{ marginBottom: '30px' }}>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>自定义配置轮播</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
						padding: '20px',
						backgroundColor: '#f0f0f0',
						borderRadius: '8px'
					}}
				>
					<div style={{ display: 'inline-block', height: '300px', width: '100%' }}>
						<ImageCarousel slides={customSlides} autoPlay={autoPlay} interval={interval} />
					</div>

					<div
						style={{
							display: 'flex',
							gap: '20px',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<div>
							<label style={{ marginRight: '10px' }}>自动播放:</label>
							<input
								type="checkbox"
								checked={autoPlay}
								onChange={e => setAutoPlay(e.target.checked)}
							/>
						</div>

						<div>
							<label style={{ marginRight: '10px' }}>间隔时间:</label>
							<input
								type="range"
								min="1000"
								max="10000"
								step="500"
								value={interval}
								onChange={handleIntervalChange}
								style={{ padding: '5px', width: '100px' }}
							/>
							<span style={{ marginLeft: '10px' }}>{interval}ms</span>
						</div>

						<div>
							<button onClick={handleAddSlide} style={{ padding: '5px 10px', marginRight: '10px' }}>
								添加图片
							</button>
							<button onClick={handleRemoveSlide} style={{ padding: '5px 10px' }}>
								删除图片
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				style={{
					marginTop: '30px',
					padding: '20px',
					backgroundColor: '#f8f9fa',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
					textAlign: 'left',
					maxWidth: '800px',
					margin: '30px auto 0'
				}}
			>
				<h2 style={{ color: '#333', marginBottom: '15px' }}>图片轮播特点</h2>
				<ul style={{ paddingLeft: '20px' }}>
					<li style={{ margin: '10px 0' }}>支持自动播放和手动切换</li>
					<li style={{ margin: '10px 0' }}>可自定义轮播间隔时间</li>
					<li style={{ margin: '10px 0' }}>支持动态添加/删除图片</li>
					<li style={{ margin: '10px 0' }}>带有滑入动画效果</li>
					<li style={{ margin: '10px 0' }}>响应式设计，适配不同屏幕尺寸</li>
					<li style={{ margin: '10px 0' }}>使用TypeScript编写，具有完整的类型定义</li>
				</ul>

				<h3 style={{ color: '#333', marginTop: '20px', marginBottom: '10px' }}>使用说明</h3>
				<p>
					图片轮播组件通过滑入动画展示图片，用户可以通过底部的指示点手动切换图片，
					也可以设置自动播放。组件支持自定义图片数据、播放间隔等配置。
				</p>
				<p style={{ marginTop: '10px' }}>
					<strong>Props说明：</strong>
					<br />
					• slides: 图片数据数组，默认包含3张示例图片
					<br />
					• autoPlay: 是否自动播放，默认为true
					<br />
					• interval: 轮播间隔时间(毫秒)，默认为2000ms
					<br />
					• className: 自定义CSS类名
					<br />• style: 自定义内联样式
				</p>
			</div>
		</div>
	);
};

export default ImageCarouselExample;
