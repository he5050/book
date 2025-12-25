import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss';

interface CrashMonitoringProps {
  /** 监控容器宽度 */
  width?: number;
  /** 监控容器高度 */
  height?: number;
  /** 心跳间隔（毫秒） */
  heartbeatInterval?: number;
  /** 崩溃检测阈值（毫秒） */
  crashThreshold?: number;
  /** 内存使用率阈值 */
  memoryThreshold?: number;
  /** 事件循环延迟阈值（毫秒） */
  eventLoopThreshold?: number;
  /** 是否启用Service Worker */
  enableServiceWorker?: boolean;
  /** 是否启用LocalStorage备份 */
  enableLocalStorageBackup?: boolean;
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 崩溃事件回调 */
  onCrashDetected?: (crashInfo: CrashInfo) => void;
  /** 心跳事件回调 */
  onHeartbeat?: (vitalSigns: VitalSigns) => void;
}

interface VitalSigns {
  type: string;
  timestamp: number;
  sessionId: string;
  memoryPressure: number;
  eventLoopHealth: number;
  url: string;
}

interface CrashInfo {
  type: string;
  timestamp: number;
  crashScore: number;
  anomalyHistory: any[];
  pageInfo: any;
}

interface MonitoringState {
  isHealthy: boolean;
  lastHeartbeat: number;
  memoryUsage: number;
  eventLoopDelay: number;
  anomalyCount: number;
  crashScore: number;
  status: 'normal' | 'warning' | 'critical' | 'crashed';
}

const CrashMonitoring: React.FC<CrashMonitoringProps> = ({
  width = 600,
  height = 400,
  heartbeatInterval = 5000,
  crashThreshold = 15000,
  memoryThreshold = 90,
  eventLoopThreshold = 100,
  enableServiceWorker = true,
  enableLocalStorageBackup = true,
  showDetails = true,
  className = '',
  style = {},
  onCrashDetected,
  onHeartbeat
}) => {
  const [state, setState] = useState<MonitoringState>({
    isHealthy: true,
    lastHeartbeat: Date.now(),
    memoryUsage: 0,
    eventLoopDelay: 0,
    anomalyCount: 0,
    crashScore: 0,
    status: 'normal'
  });

  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const heartbeatTimerRef = useRef<number>();
  const eventLoopTimerRef = useRef<number>();
  const animationFrameRef = useRef<number>();
  const serviceWorkerRef = useRef<ServiceWorker | null>(null);

  // 生成会话ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // 获取内存使用率
  const getMemoryPressure = useCallback(() => {
    if (performance.memory) {
      return (performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100;
    }
    return 0;
  }, []);

  // 获取事件循环健康度
  const getEventLoopHealth = useCallback(() => {
    const start = performance.now();
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        const duration = performance.now() - start;
        resolve(duration);
      }, 0);
    });
  }, []);

  // 发送心跳
  const sendHeartbeat = useCallback(async () => {
    const vitalSigns: VitalSigns = {
      type: 'HEARTBEAT',
      timestamp: Date.now(),
      sessionId,
      memoryPressure: getMemoryPressure(),
      eventLoopHealth: await getEventLoopHealth(),
      url: window.location.href
    };

    // 更新状态
    setState(prev => ({
      ...prev,
      lastHeartbeat: vitalSigns.timestamp,
      memoryUsage: vitalSigns.memoryPressure,
      eventLoopDelay: vitalSigns.eventLoopHealth
    }));

    // 发送到Service Worker
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage(vitalSigns);
    }

    // 备份到LocalStorage
    if (enableLocalStorageBackup) {
      localStorage.setItem('heartbeat_backup', JSON.stringify({
        timestamp: vitalSigns.timestamp,
        sessionId,
        url: vitalSigns.url
      }));
    }

    // 触发回调
    onHeartbeat?.(vitalSigns);

    // 检查异常
    checkAnomalies(vitalSigns);
  }, [sessionId, getMemoryPressure, getEventLoopHealth, enableLocalStorageBackup, onHeartbeat]);

  // 检查异常
  const checkAnomalies = useCallback((vitalSigns: VitalSigns) => {
    const newAnomalies: any[] = [];

    // 内存压力检查
    if (vitalSigns.memoryPressure > memoryThreshold) {
      newAnomalies.push({
        type: 'MEMORY_PRESSURE',
        severity: vitalSigns.memoryPressure > 95 ? 'CRITICAL' : 'WARNING',
        value: vitalSigns.memoryPressure,
        timestamp: vitalSigns.timestamp
      });
    }

    // 事件循环延迟检查
    if (vitalSigns.eventLoopHealth > eventLoopThreshold) {
      newAnomalies.push({
        type: 'EVENT_LOOP_BLOCKED',
        severity: vitalSigns.eventLoopHealth > 500 ? 'CRITICAL' : 'WARNING',
        value: vitalSigns.eventLoopHealth,
        timestamp: vitalSigns.timestamp
      });
    }

    if (newAnomalies.length > 0) {
      setAnomalies(prev => [...prev, ...newAnomalies].slice(-20));
      setState(prev => ({
        ...prev,
        anomalyCount: prev.anomalyCount + newAnomalies.length,
        crashScore: prev.crashScore + newAnomalies.reduce((sum, anomaly) => {
          return sum + (anomaly.severity === 'CRITICAL' ? 40 : 20);
        }, 0)
      }));
    }
  }, [memoryThreshold, eventLoopThreshold]);

  // 检查崩溃
  const checkCrash = useCallback(() => {
    const now = Date.now();
    const timeSinceLastHeartbeat = now - state.lastHeartbeat;

    // 基于多种指标判断崩溃
    let crashScore = state.crashScore;
    
    // 时间间隔权重
    if (timeSinceLastHeartbeat > crashThreshold) {
      crashScore += 50;
    }
    
    // 异常数量权重
    if (state.anomalyCount > 10) {
      crashScore += 30;
    }
    
    // 内存使用率权重
    if (state.memoryUsage > 95) {
      crashScore += 40;
    }

    setState(prev => ({
      ...prev,
      crashScore,
      isHealthy: crashScore < 100,
      status: crashScore >= 200 ? 'crashed' : 
              crashScore >= 100 ? 'critical' : 
              crashScore >= 50 ? 'warning' : 'normal'
    }));

    // 如果检测到崩溃
    if (crashScore >= 200) {
      handleCrashDetected();
    }
  }, [state.lastHeartbeat, state.crashScore, state.anomalyCount, state.memoryUsage, crashThreshold, onCrashDetected]);

  // 处理崩溃检测
  const handleCrashDetected = useCallback(() => {
    const crashInfo: CrashInfo = {
      type: 'CRASH_DETECTED',
      timestamp: Date.now(),
      crashScore: state.crashScore,
      anomalyHistory: anomalies.slice(-10),
      pageInfo: {
        url: window.location.href,
        title: document.title,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        scrollPosition: { x: window.scrollX, y: window.scrollY },
        memory: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize
        } : null
      }
    };

    console.warn('检测到页面崩溃:', crashInfo);
    onCrashDetected?.(crashInfo);
  }, [state.crashScore, anomalies, onCrashDetected]);

  // 启动Service Worker
  const startServiceWorker = useCallback(async () => {
    if (!enableServiceWorker || !('serviceWorker' in navigator)) {
      console.warn('Service Worker不支持，使用降级方案');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw-heartbeat.js');
      serviceWorkerRef.current = registration.active || registration.installing || registration.waiting;
      
      // 监听Service Worker消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'HEARTBEAT_ACK') {
          console.log('Service Worker心跳确认:', event.data.timestamp);
        }
      });

      console.log('Service Worker注册成功');
    } catch (error) {
      console.error('Service Worker注册失败:', error);
    }
  }, [enableServiceWorker]);

  // 启动监控
  useEffect(() => {
    // 启动Service Worker
    startServiceWorker();

    // 启动心跳定时器
    heartbeatTimerRef.current = window.setInterval(() => {
      sendHeartbeat();
    }, heartbeatInterval);

    // 启动崩溃检查
    const crashCheckTimer = setInterval(() => {
      checkCrash();
    }, 5000);

    // 启动事件循环监控
    const checkEventLoop = () => {
      const start = performance.now();
      setTimeout(() => {
        const delay = performance.now() - start;
        setState(prev => ({
          ...prev,
          eventLoopDelay: delay
        }));
        animationFrameRef.current = requestAnimationFrame(checkEventLoop);
      }, 0);
    };
    animationFrameRef.current = requestAnimationFrame(checkEventLoop);

    // 检查上次心跳
    if (enableLocalStorageBackup) {
      const lastHeartbeat = localStorage.getItem('heartbeat_backup');
      if (lastHeartbeat) {
        const { timestamp } = JSON.parse(lastHeartbeat);
        const timeSinceLast = Date.now() - timestamp;
        if (timeSinceLast > crashThreshold) {
          console.warn('检测到可能的崩溃，上次心跳时间:', new Date(timestamp));
        }
      }
    }

    return () => {
      clearInterval(heartbeatTimerRef.current);
      clearInterval(crashCheckTimer);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [heartbeatInterval, crashThreshold, enableServiceWorker, enableLocalStorageBackup, sendHeartbeat, checkCrash, startServiceWorker]);

  // 获取状态颜色
  const getStatusColor = () => {
    switch (state.status) {
      case 'normal': return '#4ade80';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'crashed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (state.status) {
      case 'normal': return '健康';
      case 'warning': return '警告';
      case 'critical': return '严重';
      case 'crashed': return '崩溃';
      default: return '未知';
    }
  };

  return (
    <div 
      className={`crash-monitoring ${className}`}
      style={{ width, height, ...style }}
      data-status={state.status}
    >
      <div className="monitoring-header">
        <h3>🏥 页面生命体征监测</h3>
        <div className="status-indicator" style={{ borderColor: getStatusColor() }}>
          <span className="status-dot" style={{ backgroundColor: getStatusColor() }}></span>
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>

      <div className="monitoring-content">
        <div className="vital-signs">
          <div className="vital-item">
            <label>心跳状态</label>
            <div className="vital-value">
              <span className={`heartbeat-status ${state.isHealthy ? 'healthy' : 'unhealthy'}`}>
                {state.isHealthy ? '正常' : '异常'}
              </span>
              <span className="last-beat">最后心跳: {new Date(state.lastHeartbeat).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="vital-item">
            <label>内存使用</label>
            <div className="vital-value">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${state.memoryUsage}%`, 
                    backgroundColor: state.memoryUsage > memoryThreshold ? '#ef4444' : '#4ade80' 
                  }}
                ></div>
              </div>
              <span className="progress-text">{state.memoryUsage.toFixed(1)}%</span>
            </div>
          </div>

          <div className="vital-item">
            <label>事件循环延迟</label>
            <div className="vital-value">
              <span className={`delay-value ${state.eventLoopDelay > eventLoopThreshold ? 'warning' : ''}`}>
                {state.eventLoopDelay.toFixed(2)}ms
              </span>
            </div>
          </div>

          <div className="vital-item">
            <label>异常计数</label>
            <div className="vital-value">
              <span className="anomaly-count">{state.anomalyCount}</span>
            </div>
          </div>

          <div className="vital-item">
            <label>崩溃分数</label>
            <div className="vital-value">
              <div className="crash-score">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${Math.min(state.crashScore, 200)}%`, 
                    backgroundColor: state.crashScore > 100 ? '#ef4444' : '#4ade80' 
                  }}
                ></div>
              </div>
              <span className="score-text">{state.crashScore}</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="anomaly-list">
            <h4>📋 最近异常</h4>
            {anomalies.length === 0 ? (
              <p className="no-anomalies">暂无异常</p>
            ) : (
              <ul className="anomaly-items">
                {anomalies.slice(-5).map((anomaly, index) => (
                  <li key={index} className={`anomaly-item ${anomaly.severity.toLowerCase()}`}>
                    <span className="anomaly-type">{anomaly.type}</span>
                    <span className="anomaly-severity">{anomaly.severity}</span>
                    <span className="anomaly-value">{anomaly.value}</span>
                    <span className="anomaly-time">{new Date(anomaly.timestamp).toLocaleTimeString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="monitoring-footer">
        <div className="session-info">
          <span>会话ID: {sessionId}</span>
          <span>监控间隔: {heartbeatInterval}ms</span>
        </div>
        <div className="controls">
          <button 
            className="btn-refresh" 
            onClick={() => window.location.reload()}
            disabled={state.status === 'crashed'}
          >
            刷新页面
          </button>
          <button 
            className="btn-memory" 
            onClick={() => {
              if (window.gc) {
                window.gc();
                console.log('手动触发垃圾回收');
              }
            }}
          >
            清理内存
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrashMonitoring;