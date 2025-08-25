import { useState, useEffect, useCallback } from 'react';

/**
 * 位置信息接口
 */
export interface LocationInfo {
	ip?: string;
	city?: string;
	region?: string;
	country?: string;
	country_name?: string;
	postal?: string;
	latitude?: number;
	longitude?: number;
	timezone?: string;
	currency?: string;
	languages?: string;
	org?: string;
	asn?: string;
}

/**
 * 获取用户位置信息的Hook
 */
export const useLocation = () => {
	const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * 从sessionStorage获取缓存的位置信息
	 */
	const getCachedLocation = useCallback((): LocationInfo | null => {
		try {
			const cached = sessionStorage.getItem('user_location_info');
			if (cached) {
				const data = JSON.parse(cached);
				// 检查缓存是否过期（1小时）
				const cacheTime = data.timestamp;
				const now = Date.now();
				if (now - cacheTime < 60 * 60 * 1000) {
					return data.location;
				} else {
					sessionStorage.removeItem('user_location_info');
				}
			}
		} catch (error) {
			console.warn('读取位置缓存失败:', error);
			sessionStorage.removeItem('user_location_info');
		}
		return null;
	}, []);

	/**
	 * 缓存位置信息到sessionStorage
	 */
	const cacheLocation = useCallback((location: LocationInfo) => {
		try {
			const cacheData = {
				location,
				timestamp: Date.now()
			};
			sessionStorage.setItem('user_location_info', JSON.stringify(cacheData));
		} catch (error) {
			console.warn('缓存位置信息失败:', error);
		}
	}, []);

	/**
	 * 获取位置信息
	 */
	const fetchLocation = useCallback(async (): Promise<LocationInfo> => {
		// 尝试多个位置获取服务
		const services = [
			{
				url: 'https://ipapi.co/json/',
				parser: (data: any) => data
			},
			{
				url: 'https://ip-api.com/json/',
				parser: (data: any) => ({
					ip: data.query,
					city: data.city,
					region: data.regionName,
					country: data.countryCode,
					country_name: data.country,
					postal: data.zip,
					latitude: data.lat,
					longitude: data.lon,
					timezone: data.timezone,
					org: data.org,
					asn: data.as
				})
			},
			{
				url: 'https://ipinfo.io/json',
				parser: (data: any) => ({
					ip: data.ip,
					city: data.city,
					region: data.region,
					country: data.country,
					postal: data.postal,
					latitude: data.loc ? parseFloat(data.loc.split(',')[0]) : undefined,
					longitude: data.loc ? parseFloat(data.loc.split(',')[1]) : undefined,
					timezone: data.timezone,
					org: data.org
				})
			}
		];

		let lastError: Error | null = null;

		for (const service of services) {
			try {
				const response = await fetch(service.url, {
					method: 'GET',
					headers: {
						Accept: 'application/json'
					}
				});

				if (response.ok) {
					const data = await response.json();
					return service.parser(data);
				} else {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}
			} catch (serviceError) {
				console.warn(`位置服务 ${service.url} 失败:`, serviceError);
				lastError = serviceError instanceof Error ? serviceError : new Error(String(serviceError));
				continue;
			}
		}

		throw lastError || new Error('所有位置获取服务都失败了');
	}, []);

	/**
	 * 获取位置信息（优先使用缓存）
	 */
	const getLocation = useCallback(
		async (forceRefresh = false) => {
			setLoading(true);
			setError(null);

			try {
				// 如果不强制刷新，先尝试从缓存获取
				if (!forceRefresh) {
					const cached = getCachedLocation();
					if (cached) {
						setLocationInfo(cached);
						setLoading(false);
						return;
					}
				}

				// 从网络获取位置信息
				const location = await fetchLocation();
				setLocationInfo(location);

				// 缓存位置信息
				cacheLocation(location);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : '获取位置信息失败';
				setError(errorMessage);
				console.error('获取位置信息失败:', err);
			} finally {
				setLoading(false);
			}
		},
		[getCachedLocation, fetchLocation, cacheLocation]
	);

	/**
	 * 刷新位置信息
	 */
	const refresh = useCallback(() => {
		return getLocation(true);
	}, [getLocation]);

	/**
	 * 清除缓存
	 */
	const clearCache = useCallback(() => {
		try {
			sessionStorage.removeItem('user_location_info');
		} catch (error) {
			console.warn('清除位置缓存失败:', error);
		}
	}, []);

	useEffect(() => {
		getLocation();
	}, [getLocation]);

	return {
		locationInfo,
		loading,
		error,
		refresh,
		clearCache
	};
};
