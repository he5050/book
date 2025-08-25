import { useState, useEffect } from 'react';

/**
 * 浏览器信息接口
 */
export interface BrowserInfo {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  deviceName: string;
  userAgent: string;
}

/**
 * 获取浏览器信息的Hook
 */
export const useBrowserInfo = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBrowserInfo = (): BrowserInfo => {
      const browserReg = {
        Chrome: /Chrome/,
        IE: /MSIE/,
        Firefox: /Firefox/,
        Opera: /Presto/,
        Safari: /Version\/([\d.]+).*Safari/,
        '360': /360SE/,
        QQBrowser: /QQ/,
        Edge: /Edg/
      };

      const deviceReg = {
        iPhone: /iPhone/,
        iPad: /iPad/,
        Android: /Android/,
        Windows: /Windows/,
        Mac: /Macintosh/,
      };

      const userAgentStr = navigator.userAgent;
      const userAgentObj: BrowserInfo = {
        browserName: '',
        browserVersion: '',
        osName: '',
        osVersion: '',
        deviceName: '',
        userAgent: userAgentStr
      };

      // 检测浏览器
      for (const key in browserReg) {
        if (browserReg[key as keyof typeof browserReg].test(userAgentStr)) {
          userAgentObj.browserName = key;
          
          switch (key) {
            case 'Chrome':
              userAgentObj.browserVersion = userAgentStr.split('Chrome/')[1]?.split(' ')[0] || '';
              break;
            case 'IE':
              userAgentObj.browserVersion = userAgentStr.split('MSIE ')[1]?.split(' ')[1] || '';
              break;
            case 'Firefox':
              userAgentObj.browserVersion = userAgentStr.split('Firefox/')[1] || '';
              break;
            case 'Opera':
              userAgentObj.browserVersion = userAgentStr.split('Version/')[1] || '';
              break;
            case 'Safari':
              userAgentObj.browserVersion = userAgentStr.split('Version/')[1]?.split(' ')[0] || '';
              break;
            case '360':
              userAgentObj.browserVersion = '';
              break;
            case 'QQBrowser':
              userAgentObj.browserVersion = userAgentStr.split('Version/')[1]?.split(' ')[0] || '';
              break;
            case 'Edge':
              userAgentObj.browserVersion = userAgentStr.split('Edg/')[1]?.split(' ')[0] || '';
              break;
          }
          break;
        }
      }

      // 检测操作系统和设备
      for (const key in deviceReg) {
        if (deviceReg[key as keyof typeof deviceReg].test(userAgentStr)) {
          userAgentObj.osName = key;
          
          switch (key) {
            case 'Windows':
              userAgentObj.osVersion = userAgentStr.split('Windows NT ')[1]?.split(';')[0] || '';
              break;
            case 'Mac':
              userAgentObj.osVersion = userAgentStr.split('Mac OS X ')[1]?.split(')')[0] || '';
              break;
            case 'iPhone':
              userAgentObj.osVersion = userAgentStr.split('iPhone OS ')[1]?.split(' ')[0] || '';
              break;
            case 'iPad':
              userAgentObj.osVersion = userAgentStr.split('iPad; CPU OS ')[1]?.split(' ')[0] || '';
              break;
            case 'Android':
              userAgentObj.osVersion = userAgentStr.split('Android ')[1]?.split(';')[0] || '';
              const deviceMatch = userAgentStr.match(/\(Linux; Android [^;]+; ([^)]+)\)/);
              userAgentObj.deviceName = deviceMatch?.[1]?.split(' Build')[0] || '';
              break;
          }
          break;
        }
      }

      return userAgentObj;
    };

    try {
      const info = getBrowserInfo();
      setBrowserInfo(info);
    } catch (error) {
      console.error('获取浏览器信息失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { browserInfo, loading };
};