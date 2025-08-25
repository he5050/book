import React from 'react';
import { useBrowserInfo, useIPAddress, useLocation } from './hooks';

/**
 * 简单的使用示例
 * 展示如何单独使用各个Hook
 */
const SimpleExample: React.FC = () => {
  const { browserInfo } = useBrowserInfo();
  const { ipInfo } = useIPAddress();
  const { locationInfo } = useLocation();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">简单使用示例</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">浏览器信息</h2>
          <p>浏览器: {browserInfo?.browserName} {browserInfo?.browserVersion}</p>
          <p>操作系统: {browserInfo?.osName} {browserInfo?.osVersion}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">IP信息</h2>
          <p>公网IP: {ipInfo.publicIP || '获取中...'}</p>
          <p>本地IP: {ipInfo.localIPs.join(', ') || '获取中...'}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">位置信息</h2>
          <p>国家: {locationInfo?.country_name || '获取中...'}</p>
          <p>城市: {locationInfo?.city || '获取中...'}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * 访问统计Hook示例
 * 展示如何将这些信息用于访问统计
 */
export const useVisitorStats = () => {
  const { browserInfo } = useBrowserInfo();
  const { ipInfo } = useIPAddress();
  const { locationInfo } = useLocation();

  // 构建访问统计数据
  const visitorStats = React.useMemo(() => {
    return {
      // 基本信息
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      
      // 浏览器信息
      browser: browserInfo?.browserName,
      browserVersion: browserInfo?.browserVersion,
      os: browserInfo?.osName,
      osVersion: browserInfo?.osVersion,
      device: browserInfo?.deviceName,
      userAgent: browserInfo?.userAgent,
      
      // 网络信息
      publicIP: ipInfo.publicIP,
      localIPs: ipInfo.localIPs,
      
      // 位置信息
      country: locationInfo?.country,
      region: locationInfo?.region,
      city: locationInfo?.city,
      latitude: locationInfo?.latitude,
      longitude: locationInfo?.longitude,
      timezone: locationInfo?.timezone,
      isp: locationInfo?.org,
      
      // 页面信息
      title: document.title,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    };
  }, [browserInfo, ipInfo, locationInfo]);

  // 发送统计数据的函数
  const sendStats = React.useCallback(async (endpoint: string) => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorStats),
      });
    } catch (error) {
      console.error('发送访问统计失败:', error);
    }
  }, [visitorStats]);

  return {
    visitorStats,
    sendStats,
  };
};

/**
 * 访问统计组件示例
 */
export const VisitorStatsExample: React.FC = () => {
  const { visitorStats, sendStats } = useVisitorStats();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">访问统计示例</h1>
      
      <div className="mb-4">
        <button
          onClick={() => sendStats('/api/visitor-stats')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          发送统计数据
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">统计数据预览:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(visitorStats, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SimpleExample;