import React, { useState } from 'react';
import CrashMonitoring from './index';
import './index.scss';

const CrashMonitoringDemo: React.FC = () => {
  const [crashInfo, setCrashInfo] = useState<any>(null);

  const handleCrashDetected = (info: any) => {
    console.log('崩溃检测:', info);
    setCrashInfo(info);
  };

  const handleHeartbeat = (vitalSigns: any) => {
    console.log('心跳信号:', vitalSigns);
  };

  const triggerMemoryLeak = () => {
    // 模拟内存泄漏
    const leak: any[] = [];
    setInterval(() => {
      leak.push(new Array(100000).fill('*'));
    }, 100);
  };

  const triggerEventLoopBlock = () => {
    // 模拟事件循环阻塞
    const start = Date.now();
    while (Date.now() - start < 2000) {
      // 空循环阻塞主线程
    }
  };

  const clearCrashInfo = () => {
    setCrashInfo(null);
  };

  return (
    <div className="crash-monitoring-demo">
      <div className="demo-controls">
        <h2>前端崩溃监控演示</h2>
        <p>这是一个模拟的崩溃监控系统，用于演示前端页面生命体征监测功能。</p>
        
        <div className="control-buttons">
          <button onClick={triggerMemoryLeak} className="btn-danger">
            模拟内存泄漏
          </button>
          <button onClick={triggerEventLoopBlock} className="btn-warning">
            模拟事件循环阻塞
          </button>
          <button onClick={clearCrashInfo} className="btn-secondary">
            清除崩溃信息
          </button>
        </div>

        {crashInfo && (
          <div className="crash-info-panel">
            <h3>🚨 崩溃信息</h3>
            <pre>{JSON.stringify(crashInfo, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="demo-monitoring">
        <CrashMonitoring
          width={600}
          height={400}
          heartbeatInterval={3000}
          crashThreshold={10000}
          memoryThreshold={80}
          eventLoopThreshold={50}
          enableServiceWorker={false} // 演示环境禁用Service Worker
          enableLocalStorageBackup={true}
          showDetails={true}
          onCrashDetected={handleCrashDetected}
          onHeartbeat={handleHeartbeat}
        />
      </div>

      <div className="demo-explanation">
        <h3>💡 功能说明</h3>
        <ul>
          <li><strong>心跳监测</strong>: 每3秒检测一次页面生命体征</li>
          <li><strong>内存监控</strong>: 实时监控JavaScript堆内存使用率</li>
          <li><strong>事件循环监控</strong>: 检测主线程阻塞情况</li>
          <li><strong>异常检测</strong>: 自动识别各种异常情况</li>
          <li><strong>崩溃判断</strong>: 基于多维度指标综合判断</li>
          <li><strong>智能上报</strong>: 支持多种上报策略</li>
        </ul>

        <h3>🔧 自定义参数</h3>
        <p>可以通过props调整监控参数：</p>
        <ul>
          <li><code>heartbeatInterval</code>: 心跳间隔（默认5000ms）</li>
          <li><code>crashThreshold</code>: 崩溃检测阈值（默认15000ms）</li>
          <li><code>memoryThreshold</code>: 内存使用率阈值（默认90%）</li>
          <li><code>eventLoopThreshold</code>: 事件循环延迟阈值（默认100ms）</li>
          <li><code>enableServiceWorker</code>: 是否启用Service Worker</li>
          <li><code>enableLocalStorageBackup</code>: 是否启用LocalStorage备份</li>
        </ul>
      </div>
    </div>
  );
};

export default CrashMonitoringDemo;