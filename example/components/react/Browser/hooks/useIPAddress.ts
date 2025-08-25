import { useState, useEffect, useCallback } from 'react';

/**
 * IP地址信息接口
 */
export interface IPInfo {
  localIPs: string[];
  publicIP?: string;
}

/**
 * 获取IP地址的Hook
 */
export const useIPAddress = () => {
  const [ipInfo, setIPInfo] = useState<IPInfo>({ localIPs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // 防止组件卸载后设置状态

    /**
     * 获取本地IP地址（通过WebRTC）
     */
    const getLocalIPs = (): Promise<string[]> => {
      return new Promise((resolve) => {
        const ipDuplicates: { [key: string]: boolean } = {};
        const ips: string[] = [];
        
        const RTCPeerConnection = window.RTCPeerConnection ||
          (window as any).mozRTCPeerConnection ||
          (window as any).webkitRTCPeerConnection;

        if (!RTCPeerConnection) {
          resolve([]);
          return;
        }

        const servers = {
          iceServers: [
            { urls: "stun:stun.services.mozilla.com" },
            { urls: "stun:stun.l.google.com:19302" },
          ]
        };

        try {
          const pc = new RTCPeerConnection(servers);

          const handleCandidate = (candidate: string) => {
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
            const hasIp = ipRegex.exec(candidate);
            
            if (hasIp) {
              const ipAddr = hasIp[1];
              if (!ipDuplicates[ipAddr]) {
                ips.push(ipAddr);
                ipDuplicates[ipAddr] = true;
              }
            }
          };

          pc.onicecandidate = (ice) => {
            if (ice.candidate) {
              handleCandidate(ice.candidate.candidate);
            }
          };

          pc.createDataChannel("");
          pc.createOffer()
            .then((result) => {
              return pc.setLocalDescription(result);
            })
            .catch(() => {});

          setTimeout(() => {
            if (pc.localDescription) {
              const lines = pc.localDescription.sdp.split('\n');
              lines.forEach((line) => {
                if (line.indexOf('a=candidate:') === 0) {
                  handleCandidate(line);
                }
              });
            }
            pc.close();
            resolve(ips);
          }, 2000);
        } catch (error) {
          console.error('获取本地IP失败:', error);
          resolve([]);
        }
      });
    };

    /**
     * 获取公网IP地址
     */
    const getPublicIP = async (): Promise<string | undefined> => {
      try {
        // 尝试多个IP获取服务
        const services = [
          'https://api.ipify.org?format=json',
          'https://ipapi.co/json/',
          'https://httpbin.org/ip'
        ];

        for (const service of services) {
          try {
            const response = await fetch(service, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              // 不同服务返回的字段名可能不同
              return data.ip || data.origin || data.query;
            }
          } catch (serviceError) {
            console.warn(`服务 ${service} 获取IP失败:`, serviceError);
            continue;
          }
        }
        
        throw new Error('所有IP获取服务都失败了');
      } catch (error) {
        console.error('获取公网IP失败:', error);
        return undefined;
      }
    };

    const fetchIPInfo = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);

      try {
        // 并行获取本地IP和公网IP
        const [localIPs, publicIP] = await Promise.all([
          getLocalIPs(),
          getPublicIP()
        ]);

        if (isMounted) {
          setIPInfo({
            localIPs,
            publicIP
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : '获取IP信息失败');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchIPInfo();

    return () => {
      isMounted = false;
    };
  }, []); // 只在组件挂载时执行一次

  /**
   * 刷新IP信息
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    /**
     * 获取本地IP地址（通过WebRTC）
     */
    const getLocalIPs = (): Promise<string[]> => {
      return new Promise((resolve) => {
        const ipDuplicates: { [key: string]: boolean } = {};
        const ips: string[] = [];
        
        const RTCPeerConnection = window.RTCPeerConnection ||
          (window as any).mozRTCPeerConnection ||
          (window as any).webkitRTCPeerConnection;

        if (!RTCPeerConnection) {
          resolve([]);
          return;
        }

        const servers = {
          iceServers: [
            { urls: "stun:stun.services.mozilla.com" },
            { urls: "stun:stun.l.google.com:19302" },
          ]
        };

        try {
          const pc = new RTCPeerConnection(servers);

          const handleCandidate = (candidate: string) => {
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
            const hasIp = ipRegex.exec(candidate);
            
            if (hasIp) {
              const ipAddr = hasIp[1];
              if (!ipDuplicates[ipAddr]) {
                ips.push(ipAddr);
                ipDuplicates[ipAddr] = true;
              }
            }
          };

          pc.onicecandidate = (ice) => {
            if (ice.candidate) {
              handleCandidate(ice.candidate.candidate);
            }
          };

          pc.createDataChannel("");
          pc.createOffer()
            .then((result) => {
              return pc.setLocalDescription(result);
            })
            .catch(() => {});

          setTimeout(() => {
            if (pc.localDescription) {
              const lines = pc.localDescription.sdp.split('\n');
              lines.forEach((line) => {
                if (line.indexOf('a=candidate:') === 0) {
                  handleCandidate(line);
                }
              });
            }
            pc.close();
            resolve(ips);
          }, 2000);
        } catch (error) {
          console.error('获取本地IP失败:', error);
          resolve([]);
        }
      });
    };

    /**
     * 获取公网IP地址
     */
    const getPublicIP = async (): Promise<string | undefined> => {
      try {
        // 尝试多个IP获取服务
        const services = [
          'https://api.ipify.org?format=json',
          'https://ipapi.co/json/',
          'https://httpbin.org/ip'
        ];

        for (const service of services) {
          try {
            const response = await fetch(service, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              // 不同服务返回的字段名可能不同
              return data.ip || data.origin || data.query;
            }
          } catch (serviceError) {
            console.warn(`服务 ${service} 获取IP失败:`, serviceError);
            continue;
          }
        }
        
        throw new Error('所有IP获取服务都失败了');
      } catch (error) {
        console.error('获取公网IP失败:', error);
        return undefined;
      }
    };

    try {
      const [localIPs, publicIP] = await Promise.all([
        getLocalIPs(),
        getPublicIP()
      ]);

      setIPInfo({
        localIPs,
        publicIP
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新IP信息失败');
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    ipInfo, 
    loading, 
    error, 
    refresh 
  };
};