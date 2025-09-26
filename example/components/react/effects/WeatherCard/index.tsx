import React, { useState, useEffect } from 'react';
import './index.scss';

// 天气数据接口
interface WeatherData {
	location: string;
	temperature: number;
	condition: string;
	humidity: number;
	windSpeed: number;
	precipitation: number;
	sunrise: string;
	sunset: string;
	dayLength: string;
	forecast: ForecastDay[];
}

// 预报数据接口
interface ForecastDay {
	day: string;
	high: number;
	low: number;
	condition: string;
}

// 天气图标组件
const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({
	condition,
	className = ''
}) => {
	const getIcon = () => {
		switch (condition.toLowerCase()) {
			case 'sunny':
				return '☀️';
			case 'cloudy':
				return '☁️';
			case 'rainy':
				return '🌧️';
			case 'stormy':
				return '⛈️';
			case 'snowy':
				return '❄️';
			case 'partly cloudy':
				return '⛅';
			default:
				return '🌈';
		}
	};

	return <span className={`weather-icon ${className}`}>{getIcon()}</span>;
};

// 天气卡片组件
interface WeatherCardProps {
	location?: string;
	apiKey?: string;
	className?: string;
	style?: React.CSSProperties;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
	location = 'New York',
	apiKey = '',
	className = '',
	style = {}
}) => {
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 模拟获取天气数据
	const fetchWeatherData = async () => {
		try {
			setLoading(true);

			// 模拟API延迟
			await new Promise(resolve => setTimeout(resolve, 800));

			// 模拟天气数据
			const mockData: WeatherData = {
				location: location,
				temperature: Math.floor(Math.random() * 30) - 5, // -5到25度
				condition: ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Partly Cloudy'][
					Math.floor(Math.random() * 6)
				],
				humidity: Math.floor(Math.random() * 50) + 30, // 30%到80%
				windSpeed: Math.floor(Math.random() * 30) + 5, // 5到35 km/h
				precipitation: Math.floor(Math.random() * 100), // 0%到100%
				sunrise: `${Math.floor(Math.random() * 3) + 6}:${Math.floor(Math.random() * 60)
					.toString()
					.padStart(2, '0')} am`,
				sunset: `${Math.floor(Math.random() * 3) + 6}:${Math.floor(Math.random() * 60)
					.toString()
					.padStart(2, '0')} pm`,
				dayLength: `${Math.floor(Math.random() * 4) + 10} h ${Math.floor(Math.random() * 60)
					.toString()
					.padStart(2, '0')} m`,
				forecast: Array(4)
					.fill(0)
					.map((_, index) => ({
						day: ['Today', 'Fri', 'Sat', 'Sun'][index],
						high: Math.floor(Math.random() * 15) + 10, // 10到25度
						low: Math.floor(Math.random() * 10) - 5, // -5到5度
						condition: ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Partly Cloudy'][
							Math.floor(Math.random() * 6)
						]
					}))
			};

			setWeatherData(mockData);
			setError(null);
		} catch (err) {
			setError('Failed to fetch weather data');
			console.error('Weather API error:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWeatherData();

		// 每5分钟刷新一次数据
		const interval = setInterval(fetchWeatherData, 300000);

		return () => clearInterval(interval);
	}, [location, apiKey]);

	if (loading) {
		return (
			<div className={`weather-card ${className}`} style={style}>
				<div className="weather-card-loading">
					<div className="spinner"></div>
					<p>Loading weather data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`weather-card ${className}`} style={style}>
				<div className="weather-card-error">
					<p>{error}</p>
					<button onClick={fetchWeatherData}>Retry</button>
				</div>
			</div>
		);
	}

	if (!weatherData) {
		return (
			<div className={`weather-card ${className}`} style={style}>
				<div className="weather-card-error">
					<p>No weather data available</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`weather-card ${className}`} style={style}>
			{/* 3D云层容器 */}
			<div id="cloud-container" className="cloud-container"></div>

			<div className="weather-content">
				{/* 日期时间 */}
				<div className="date-time" id="dateTime">
					{new Date().toLocaleDateString('en-US', { weekday: 'long' })},{' '}
					{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				</div>

				{/* 当前天气 */}
				<div className="current-weather">
					<WeatherIcon condition={weatherData.condition} className="weather-icon-main" />
					<div className="temp">
						<span className="temperature-value">{weatherData.temperature}°C</span>
					</div>
				</div>

				{/* 位置 */}
				<div className="location" id="location">
					{weatherData.location}
				</div>

				{/* 日出日落信息 */}
				<div className="sun-info">
					<div className="sunrise">
						<div className="sun-icon">☀️</div>
						<div className="sun-time" id="sunriseTime">
							{weatherData.sunrise}
						</div>
					</div>
					<div className="day-length" id="dayLength">
						{weatherData.dayLength}
					</div>
					<div className="sunset">
						<div className="sun-icon">🌙</div>
						<div className="sun-time" id="sunsetTime">
							{weatherData.sunset}
						</div>
					</div>
				</div>

				{/* 降水信息 */}
				<div className="precipitation">
					<div className="precip-icon">🌧️</div>
					<div className="precip-text" id="precipitationChance">
						Rain {weatherData.precipitation}%
					</div>
				</div>

				{/* 湿度和风速 */}
				<div className="humidity-wind">
					<div id="humidity">Humidity: {weatherData.humidity}%</div>
					<div id="windSpeed">Wind: {weatherData.windSpeed} km/h</div>
				</div>

				{/* 天气预报 */}
				<div className="forecast">
					{weatherData.forecast.map((day, index) => (
						<div key={index} className="forecast-day">
							<div className="day-name">{day.day}</div>
							<WeatherIcon condition={day.condition} className="forecast-icon" />
							<div className="high-temp">{day.high}°</div>
							<div className="low-temp">{day.low}°</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WeatherCard;
