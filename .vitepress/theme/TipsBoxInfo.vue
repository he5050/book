<template>
	<div class="w-full">
		<div class="footer-info-warp">
			<div class="weather-warp">
				<div class="weather-top">
					<p>{{ formattedDate }}</p>
					<div v-if="today.city" class="weather-info">
						<div class="weather-main">
							<span class="weather-city">{{ today.city }}</span>
							<!-- <span class="weather-temp">{{ today.tem_day }}°C</span> -->
							<div class="weather-desc">
								<img
									class="weather-icon-img"
									:src="`/weather/cake/${today.wea_img || 'qing'}.png`"
									:alt="today.wea"
								/>
								<span>{{ today.wea }}</span>
							</div>
						</div>
						<div class="weather-details">
							<span class="weather-item">
								<i class="weather-icon wind-icon"></i>
								{{ today.win }}({{ today.win_speed }})
							</span>
							<span class="weather-item">
								<i class="weather-icon day-icon"></i>
								白天: {{ today.tem_day }}°C
							</span>
							<span class="weather-item">
								<i class="weather-icon night-icon"></i>
								夜晚: {{ today.tem_night }}°C
							</span>
							<span class="weather-item">
								<i class="weather-icon humidity-icon"></i>
								湿度: {{ today.humidity || '未知' }}
							</span>
							<el-tooltip content="查看未来天气预报" placement="top">
								<span class="weather-detail" @click="showWeatherDetail = true">七日天气</span>
							</el-tooltip>
						</div>
						<div class="weather-tips" v-if="today.air_tips">
							<i class="weather-icon tips-icon"></i>
							温馨提示：{{ today.air_tips }}
						</div>
					</div>
				</div>
			</div>
			<p
				class="footer"
				:style="{ '--color-one': colorOne, '--color-two': colorTwo, '--color-three': colorThree }"
			>
				{{ tips || defaultTips }}
			</p>
		</div>

		<!-- 天气详情弹窗 -->
		<el-dialog v-model="showWeatherDetail" title="七日天气预报" width="80%" destroy-on-close>
			<div class="weather-tips-list">
				<div class="dialog-title">
					<span>{{ today.city }} 七日天气预报</span>
					<span class="dialog-subtitle">数据更新时间: {{ today.update_time || '未知' }}</span>
				</div>

				<div class="item-warp header">
					<div class="item">日期</div>
					<div class="item">天气</div>
					<div class="item">温度范围</div>
					<div class="item">风向</div>
					<div class="item">空气质量</div>
				</div>

				<div class="item-warp" v-for="(v, i) in weather" :key="i">
					<div class="item date-item">
						<div class="date-day">{{ v.date?.split('-')[2] || '未知' }}</div>
						<div class="date-info">{{ getDayOfWeek(v.date) }}</div>
					</div>

					<div class="item wea">
						<img :src="`/weather/cake/${v.wea_img || 'qing'}.png`" :alt="v.wea" />
						<span class="tips">{{ v.wea }}</span>
					</div>

					<div class="item temp-item">
						<span class="temp-high">{{ v.tem_day }}°C</span>
						<span class="temp-divider">~</span>
						<span class="temp-low">{{ v.tem_night }}°C</span>
					</div>

					<div class="item wind-item">
						<span>{{ v.win || '未知' }}</span>
						<span class="wind-speed">{{ v.win_speed || '未知' }}</span>
					</div>

					<div class="item air-item">
						<span :class="getAirQualityClass(v.air || v.air_level)">
							{{ v.air || v.air_level || '未知' }}
						</span>
					</div>
				</div>

				<div class="weather-notice" v-if="today.air_tips">
					<div class="notice-title">
						<i class="weather-icon tips-icon"></i>
						温馨提示
					</div>
					<div class="notice-content">{{ today.air_tips }}</div>
				</div>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="showWeatherDetail = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import dayjs from 'dayjs';
import { ElTooltip, ElDialog, ElButton } from 'element-plus';
import 'element-plus/dist/index.css';
import { calendar } from '../tools/calendar';

// 初始化数据
const tips = ref('');
const weather = ref([]);
const today = ref({});
// 使用指定的固定颜色值
const colorOne = ref('rgba(189, 52, 254, 0.2)'); // #bd34fe 紫色
const colorTwo = ref('rgba(228, 52, 152, 0.2)'); // #e43498 粉红色
const colorThree = ref('rgba(52, 152, 219, 0.2)'); // #3498db 蓝色
const showWeatherDetail = ref(false);
let timerId = null;

const defaultTips = '民国最浪费的不是爱情，是走出黑暗的并肩同行。';
let timeNow = calendar.solar2lunar();

// 计算属性：格式化日期显示
const formattedDate = computed(() => {
	return `${dayjs().format('YYYY-MM-DD')}(${timeNow.ncWeek}), 农历:${timeNow.Animal}年,${
		timeNow.IMonthCn
	}${timeNow.IDayCn}(${timeNow.gzYear}年${timeNow.gzMonth}月${timeNow.gzDay}日)`;
});

// 获取星期几
const getDayOfWeek = dateStr => {
	if (!dateStr) return '未知';
	try {
		const date = dayjs(dateStr);
		const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
		return weekdays[date.day()];
	} catch (e) {
		return '未知';
	}
};

// 获取空气质量对应的样式类
const getAirQualityClass = quality => {
	if (!quality) return 'air-unknown';

	if (typeof quality === 'number') {
		if (quality <= 50) return 'air-excellent';
		if (quality <= 100) return 'air-good';
		if (quality <= 150) return 'air-moderate';
		if (quality <= 200) return 'air-poor';
		if (quality <= 300) return 'air-bad';
		return 'air-hazardous';
	}

	const qualityStr = String(quality).toLowerCase();
	if (qualityStr.includes('优') || qualityStr.includes('excellent')) return 'air-excellent';
	if (qualityStr.includes('良') || qualityStr.includes('good')) return 'air-good';
	if (qualityStr.includes('中') || qualityStr.includes('moderate')) return 'air-moderate';
	if (qualityStr.includes('差') || qualityStr.includes('poor')) return 'air-poor';
	if (qualityStr.includes('重') || qualityStr.includes('bad')) return 'air-bad';
	if (qualityStr.includes('严') || qualityStr.includes('hazard')) return 'air-hazardous';

	return 'air-unknown';
};

// 生命周期钩子：组件挂载后执行
onMounted(() => {
	// 组件挂载后立即获取数据
	init();
	getWeather();
});

// 生命周期钩子：组件卸载前清理定时器
onUnmounted(() => {
	if (timerId) {
		clearInterval(timerId);
	}
});

// 初始化函数
const init = async () => {
	// 不再设置颜色，使用初始化时的固定颜色

	try {
		// 使用 Fetch API 获取诗句
		const response = await fetch(`https://v1.hitokoto.cn?_=${Date.now()}`);
		const data = await response.json();

		console.log('data', data);
		if (data.content) {
			tips.value = data.content;
		}
		if (data.result) {
			tips.value = `${data.result.name} - ${data.result.from}`;
		}
		if (data.hitokoto) {
			tips.value = data.hitokoto;
		}
	} catch (error) {
		console.error('获取诗句失败:', error);
	}
};

// 获取天气数据
const getWeather = async () => {
	try {
		// 首先检查会话存储中是否有缓存的天气数据
		let myWeatherItem = sessionStorage.getItem('weatherItem');
		if (myWeatherItem) {
			let weatherItem = JSON.parse(myWeatherItem);
			if (weatherItem.data && weatherItem.data[0]) {
				today.value = {
					...weatherItem.data[0],
					city: weatherItem.city
				};
				weather.value = weatherItem.data;
				return;
			}
		}

		// 如果没有缓存数据，则使用 Fetch API 获取天气数据
		const response = await fetch(
			`http://v1.yiketianqi.com/free/week?appid=18979323&appsecret=iIfhjL3K`
		);
		const res = await response.json();

		console.log('getWeather', res);
		if (res.data) {
			sessionStorage.setItem('weatherItem', JSON.stringify(res));
			weather.value = res.data;
			if (res.data[0]) {
				today.value = {
					...res.data[0],
					city: res.city
				};
			}
		}
	} catch (error) {
		console.error('获取天气数据失败:', error);
		// 如果获取失败，5秒后重试
		setTimeout(() => {
			getWeather();
		}, 5000);
	}
};
</script>

<style scoped>
.footer-info-warp {
	padding: 20px;
	background-color: #f5f5f5;
	border-radius: 8px;
	margin-bottom: 20px;
}

.weather-warp {
	margin-bottom: 15px;
}

.weather-top p {
	margin: 5px 0;
	font-size: 14px;
}

.weather-info {
	background-color: #fff;
	border-radius: 8px;
	padding: 12px 15px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-bottom: 10px;
}

.weather-main {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.weather-city {
	font-weight: bold;
	font-size: 16px;
	margin-right: 10px;
}

.weather-temp {
	font-size: 18px;
	font-weight: bold;
	color: #f76707;
	margin-right: 10px;
}

.weather-desc {
	color: #666;
	font-size: 14px;
	display: flex;
	align-items: center;
}

.weather-icon-img {
	width: 20px;
	height: 20px;
	margin-right: 5px;
	background-color: #4a6fa1; /* 与弹窗中的图标背景一致 */
	padding: 3px;
	border-radius: 50%;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weather-details {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 8px;
}

.weather-item {
	display: flex;
	align-items: center;
	font-size: 13px;
	color: #555;
	background-color: #f9f9f9;
	padding: 4px 8px;
	border-radius: 4px;
}

.weather-icon {
	display: inline-block;
	width: 16px;
	height: 16px;
	margin-right: 4px;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}

.wind-icon {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M4,10a1,1 0 1,0 2,0a1,1 0 1,0 -2,0M4,10h8c1.1,0,2,0.9,2,2s-0.9,2-2,2H10M10,14h1c1.1,0,2,0.9,2,2s-0.9,2-2,2H4M4,18h7M4,6h9c1.1,0,2,0.9,2,2s-0.9,2-2,2"/></svg>');
}

.day-icon {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f76707"><path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13h2c0.55,0,1-0.45,1-1s-0.45-1-1-1H2 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13h2c0.55,0,1-0.45,1-1s-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 S11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0 s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" /></svg>');
}

.night-icon {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23555"><path d="M9.5,2c-1.82,0-3.53,0.5-5,1.35c2.99,1.73,5,4.95,5,8.65s-2.01,6.92-5,8.65C5.97,21.5,7.68,22,9.5,22c5.52,0,10-4.48,10-10 S15.02,2,9.5,2z"/></svg>');
}

.humidity-icon {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233498db"><path d="M12,2c-5.33,4.55-8,8.48-8,11.8c0,4.98,3.8,8.2,8,8.2s8-3.22,8-8.2C20,10.48,17.33,6.55,12,2z M7.83,14 c0.37,0,0.67,0.26,0.74,0.62c0.41,2.22,2.28,2.98,3.64,2.87c0.43-0.02,0.79,0.32,0.79,0.75c0,0.4-0.32,0.73-0.72,0.75 c-2.13,0.13-4.62-1.09-5.19-4.12C7.01,14.42,7.37,14,7.83,14z"/></svg>');
}

.tips-icon {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59f00"><path d="M11,7h2v2h-2V7z M11,11h2v6h-2V11z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20 c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/></svg>');
}

.weather-tips {
	font-size: 13px;
	color: #666;
	background-color: #fff8e1;
	padding: 8px 10px;
	border-radius: 4px;
	border-left: 3px solid #f59f00;
	display: flex;
	align-items: center;
}

.weather-detail {
	color: #1890ff;
	cursor: pointer;
	text-decoration: underline;
	margin-left: auto;
	font-size: 13px;
}

.footer {
	padding: 4px;
	text-align: center;
	font-size: 16px;
	border-radius: 4px;
	height: 28px;
	line-height: 22px;
	overflow: hidden; /* 确保内容不会溢出 */
	/* 使用指定的三种颜色创建渐变背景 */
	background-image: repeating-linear-gradient(
		45deg,
		#fff 0% 4%,
		var(--color-one, rgba(189, 52, 254, 0.2)) 4% 8%,
		#fff 8% 12%,
		var(--color-two, rgba(228, 52, 152, 0.2)) 12% 16%,
		#fff 16% 20%,
		var(--color-three, rgba(52, 152, 219, 0.2)) 20% 24%
	);
	/* 调整背景尺寸，使其与动画距离匹配 */
	background-size: 240px 240px;
	/* 使用更慢的速度和更平滑的缓动函数 */
	animation: up 20s infinite linear;
	/* 使用 will-change 提高动画性能 */
	will-change: background-position;
	/* 使用硬件加速 */
	transform: translateZ(0);
}

/* 已在上面定义过 .weather-detail，这里移除重复定义 */

#cat-iframe {
	display: none; /* 隐藏iframe，原React组件中也可能不需要显示 */
}

/* 天气详情弹窗样式 */
.weather-tips-list {
	width: 100%;
	background-color: #fff;
	border-radius: 8px;
	padding: 15px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.item-warp {
	display: flex;
	padding: 12px 0;
	border-bottom: 1px solid #eee;
	transition: background-color 0.2s;
}

.item-warp:hover:not(.header) {
	background-color: #f9f9f9;
}

.header {
	font-weight: bold;
	background-color: #f0f0f0;
	border-radius: 6px 6px 0 0;
	padding: 12px 8px;
	margin-bottom: 5px;
}

.item {
	flex: 1;
	text-align: center;
	padding: 0 5px;
}

.wea {
	display: flex;
	align-items: center;
	justify-content: center;
}

.wea .tips {
	margin-right: 5px;
	color: #555;
	min-width: 80px;
	text-align: left;
}

.wea img {
	width: 24px;
	height: 24px;
	margin-right: 8px;
	background-color: #4a6fa1; /* 添加深蓝色背景 */
	padding: 4px;
	border-radius: 50%;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 15px;
	color: #333;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.dialog-subtitle {
	font-size: 13px;
	font-weight: normal;
	color: #999;
}

.date-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.date-day {
	font-size: 16px;
	font-weight: bold;
	color: #333;
}

.date-info {
	font-size: 12px;
	color: #666;
	margin-top: 2px;
}

.temp-item {
	display: flex;
	align-items: center;
	justify-content: center;
}

.temp-high {
	color: #f76707;
	font-weight: bold;
}

.temp-divider {
	margin: 0 5px;
	color: #999;
}

.temp-low {
	color: #3498db;
}

.wind-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.wind-speed {
	font-size: 12px;
	color: #666;
	margin-top: 2px;
}

.air-item span {
	padding: 2px 8px;
	border-radius: 10px;
	font-size: 12px;
}

.air-excellent {
	background-color: #e3f9e5;
	color: #2b8a3e;
}

.air-good {
	background-color: #e7f5ff;
	color: #1971c2;
}

.air-moderate {
	background-color: #fff3bf;
	color: #e67700;
}

.air-poor {
	background-color: #ffe8cc;
	color: #d9480f;
}

.air-bad {
	background-color: #ffe3e3;
	color: #c92a2a;
}

.air-hazardous {
	background-color: #f8f0fc;
	color: #ae3ec9;
}

.air-unknown {
	background-color: #f1f3f5;
	color: #868e96;
}

.weather-notice {
	margin-top: 20px;
	background-color: #fff8e1;
	border-radius: 6px;
	padding: 12px 15px;
	border-left: 3px solid #f59f00;
}

.notice-title {
	font-weight: bold;
	color: #f59f00;
	display: flex;
	align-items: center;
	margin-bottom: 5px;
}

.notice-content {
	color: #666;
	font-size: 13px;
	line-height: 1.5;
}

@keyframes up {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 0 240px;
	}
}
</style>
