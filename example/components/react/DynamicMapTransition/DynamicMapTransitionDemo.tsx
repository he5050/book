import React, { useState } from 'react';
import DynamicMapTransition from './index';

const DynamicMapTransitionDemo: React.FC = () => {
  const [config, setConfig] = useState({
    width: 600,
    height: 400,
    animationDuration: 800,
    animationEasing: 'cubicOut',
    borderColor: '#80AACC',
    borderWidth: 2,
    emphasisColor: '#409eff',
    maskOpacity: 0.1,
    enableTransition: true,
    allowNavigation: true,
    showLabel: true,
    theme: 'light' as 'light' | 'dark'
  });

  const [currentRegion, setCurrentRegion] = useState('china');
  const [clickHistory, setClickHistory] = useState<string[]>([]);

  const handleRegionChange = (region: string) => {
    setCurrentRegion(region);
    console.log('区域切换到:', region);
  };

  const handleRegionClick = (regionData: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setClickHistory(prev => [
      `${timestamp}: 点击了 ${regionData.name}`,
      ...prev.slice(0, 4) // 只保留最近5条记录
    ]);
    console.log('点击区域数据:', regionData);
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="dynamic-map-transition-demo">
      <div className="demo-container">
        <h3>Vue3 + ECharts 动态地图切换演示</h3>
        
        {/* 配置面板 */}
        <div className="config-panel">
          <h4>配置选项</h4>
          <div className="config-grid">
            <div className="config-item">
              <label>宽度:</label>
              <input
                type="range"
                min="400"
                max="800"
                value={config.width}
                onChange={(e) => handleConfigChange('width', parseInt(e.target.value))}
              />
              <span>{config.width}px</span>
            </div>
            
            <div className="config-item">
              <label>高度:</label>
              <input
                type="range"
                min="300"
                max="600"
                value={config.height}
                onChange={(e) => handleConfigChange('height', parseInt(e.target.value))}
              />
              <span>{config.height}px</span>
            </div>
            
            <div className="config-item">
              <label>动画时长:</label>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={config.animationDuration}
                onChange={(e) => handleConfigChange('animationDuration', parseInt(e.target.value))}
              />
              <span>{config.animationDuration}ms</span>
            </div>
            
            <div className="config-item">
              <label>边框宽度:</label>
              <input
                type="range"
                min="1"
                max="5"
                value={config.borderWidth}
                onChange={(e) => handleConfigChange('borderWidth', parseInt(e.target.value))}
              />
              <span>{config.borderWidth}px</span>
            </div>
            
            <div className="config-item">
              <label>遮罩透明度:</label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={config.maskOpacity}
                onChange={(e) => handleConfigChange('maskOpacity', parseFloat(e.target.value))}
              />
              <span>{config.maskOpacity}</span>
            </div>
            
            <div className="config-item">
              <label>主题:</label>
              <select
                value={config.theme}
                onChange={(e) => handleConfigChange('theme', e.target.value)}
              >
                <option value="light">亮色</option>
                <option value="dark">暗色</option>
              </select>
            </div>
            
            <div className="config-item">
              <label>边框颜色:</label>
              <input
                type="color"
                value={config.borderColor}
                onChange={(e) => handleConfigChange('borderColor', e.target.value)}
              />
            </div>
            
            <div className="config-item">
              <label>高亮颜色:</label>
              <input
                type="color"
                value={config.emphasisColor}
                onChange={(e) => handleConfigChange('emphasisColor', e.target.value)}
              />
            </div>
          </div>
          
          <div className="config-switches">
            <label>
              <input
                type="checkbox"
                checked={config.enableTransition}
                onChange={(e) => handleConfigChange('enableTransition', e.target.checked)}
              />
              启用过渡动画
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={config.allowNavigation}
                onChange={(e) => handleConfigChange('allowNavigation', e.target.checked)}
              />
              允许层级导航
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={config.showLabel}
                onChange={(e) => handleConfigChange('showLabel', e.target.checked)}
              />
              显示区域标签
            </label>
          </div>
        </div>

        {/* 地图组件 */}
        <div className="map-demo">
          <DynamicMapTransition
            {...config}
            onRegionChange={handleRegionChange}
            onRegionClick={handleRegionClick}
          />
        </div>

        {/* 状态信息 */}
        <div className="status-panel">
          <div className="current-status">
            <h4>当前状态</h4>
            <p><strong>当前区域:</strong> {currentRegion}</p>
            <p><strong>主题模式:</strong> {config.theme === 'light' ? '亮色' : '暗色'}</p>
            <p><strong>动画状态:</strong> {config.enableTransition ? '启用' : '禁用'}</p>
            <p><strong>导航权限:</strong> {config.allowNavigation ? '允许' : '禁止'}</p>
          </div>
          
          <div className="click-history">
            <h4>点击历史</h4>
            <div className="history-list">
              {clickHistory.length === 0 ? (
                <p className="no-history">暂无点击记录</p>
              ) : (
                clickHistory.map((record, index) => (
                  <div key={index} className="history-item">
                    {record}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 阿里云DataV地图数据测试面板 */}
        <div className="datav-test-panel">
          <h4>阿里云DataV地图数据测试</h4>
          <div className="test-buttons">
            <button 
              onClick={() => handleRegionChange('100000')}
              className="test-btn"
            >
              加载全国地图
            </button>
            <button 
              onClick={() => handleRegionChange('440000')}
              className="test-btn"
            >
              加载广东省
            </button>
            <button 
              onClick={() => handleRegionChange('320000')}
              className="test-btn"
            >
              加载江苏省
            </button>
            <button 
              onClick={() => handleRegionChange('110000')}
              className="test-btn"
            >
              加载北京市
            </button>
            <button 
              onClick={() => handleRegionChange('310000')}
              className="test-btn"
            >
              加载上海市
            </button>
            <button 
              onClick={() => handleRegionChange('440100')}
              className="test-btn"
            >
              加载广州市
            </button>
          </div>
          <div className="api-info">
            <p><strong>当前API:</strong> https://geo.datav.aliyun.com/areas_v3/bound/{currentRegion}_full.json</p>
            <p><strong>数据来源:</strong> 阿里云DataV地理小工具</p>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="usage-guide">
          <h4>使用说明</h4>
          <ul>
            <li>点击地图上的区域可以进入下一级视图（如果允许导航）</li>
            <li>使用"返回上级"按钮可以回到上一级视图</li>
            <li>悬停在区域上可以查看详细信息和随机图片</li>
            <li>调整配置参数可以实时看到效果变化</li>
            <li>支持亮色和暗色两种主题模式</li>
            <li>集成了阿里云DataV地图数据和Picsum图片服务</li>
            <li>使用上方测试按钮可以直接切换到不同省市地图</li>
            <li>支持全国34个省市自治区的地图数据动态加载</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DynamicMapTransitionDemo;