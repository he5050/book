import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
import './index.scss';

interface DynamicMapTransitionProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  animationDuration?: number;
  animationEasing?: string;
  borderColor?: string;
  borderWidth?: number;
  emphasisColor?: string;
  maskOpacity?: number;
  enableTransition?: boolean;
  allowNavigation?: boolean;
  showLabel?: boolean;
  theme?: 'light' | 'dark';
  onRegionChange?: (region: string) => void;
  onRegionClick?: (regionData: any) => void;
}

interface RegionData {
  name: string;
  code: string;
  level: 'country' | 'province' | 'city' | 'district';
  children?: RegionData[];
}

const DynamicMapTransition: React.FC<DynamicMapTransitionProps> = ({
  width = 600,
  height = 400,
  className = '',
  style = {},
  animationDuration = 800,
  animationEasing = 'cubicOut',
  borderColor = '#80AACC',
  borderWidth = 2,
  emphasisColor = '#409eff',
  maskOpacity = 0.1,
  enableTransition = true,
  allowNavigation = true,
  showLabel = true,
  theme = 'light',
  onRegionChange,
  onRegionClick
}) => {
  const mapChartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [currentRegion, setCurrentRegion] = useState('china');
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState<any>(null);
  const [regionHistory, setRegionHistory] = useState<string[]>(['china']);

  // 模拟中国地图数据
  const mockChinaData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: '北京市', code: '110000' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[116.4, 39.9], [116.5, 39.9], [116.5, 40.0], [116.4, 40.0], [116.4, 39.9]]]
        }
      },
      {
        type: 'Feature',
        properties: { name: '上海市', code: '310000' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[121.4, 31.2], [121.5, 31.2], [121.5, 31.3], [121.4, 31.3], [121.4, 31.2]]]
        }
      },
      {
        type: 'Feature',
        properties: { name: '广东省', code: '440000' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[113.2, 23.1], [113.8, 23.1], [113.8, 23.7], [113.2, 23.7], [113.2, 23.1]]]
        }
      },
      {
        type: 'Feature',
        properties: { name: '江苏省', code: '320000' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[118.7, 32.0], [119.3, 32.0], [119.3, 32.6], [118.7, 32.6], [118.7, 32.0]]]
        }
      },
      {
        type: 'Feature',
        properties: { name: '浙江省', code: '330000' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[120.1, 30.2], [120.7, 30.2], [120.7, 30.8], [120.1, 30.8], [120.1, 30.2]]]
        }
      }
    ]
  };

  // 模拟省级地图数据
  const mockProvinceData = {
    '440000': {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: '广州市', code: '440100' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[113.2, 23.1], [113.4, 23.1], [113.4, 23.3], [113.2, 23.3], [113.2, 23.1]]]
          }
        },
        {
          type: 'Feature',
          properties: { name: '深圳市', code: '440300' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[114.0, 22.5], [114.2, 22.5], [114.2, 22.7], [114.0, 22.7], [114.0, 22.5]]]
          }
        },
        {
          type: 'Feature',
          properties: { name: '珠海市', code: '440400' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[113.5, 22.2], [113.7, 22.2], [113.7, 22.4], [113.5, 22.4], [113.5, 22.2]]]
          }
        }
      ]
    }
  };

  // 创建带遮罩的背景图像
  const createMaskedBgImg = useCallback((maskColor = `rgba(0,0,0,${maskOpacity})`): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      
      // 创建渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
      gradient.addColorStop(0, theme === 'dark' ? '#2d3748' : '#e6f3ff');
      gradient.addColorStop(1, theme === 'dark' ? '#1a202c' : '#b3d9ff');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 100, 100);
      
      // 添加遮罩层
      ctx.fillStyle = maskColor;
      ctx.fillRect(0, 0, 100, 100);
      
      resolve(canvas.toDataURL());
    });
  }, [maskOpacity, theme]);

  // 获取地图数据
  const getMapData = useCallback(async (regionCode: string) => {
    setLoading(true);
    try {
      // 阿里云DataV地图数据API
      const getDataVUrl = (code: string) => {
        // 根据区域代码构建API URL
        if (code === 'china' || code === '100000') {
          return 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
        }
        // 省级数据
        return `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`;
      };

      try {
        const apiUrl = getDataVUrl(regionCode);
        console.log('正在获取地图数据:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('成功获取阿里云地图数据:', data);
          
          // 为每个区域添加随机图片
          if (data.features) {
            data.features = data.features.map((feature: any, index: number) => ({
              ...feature,
              properties: {
                ...feature.properties,
                image: `https://picsum.photos/200/150?random=${Date.now() + index}`,
                description: `${feature.properties.name || '未知区域'} - 来自阿里云DataV`
              }
            }));
          }
          
          return data;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn('阿里云DataV API调用失败，使用备用数据:', apiError);
        
        // 使用备用数据
        if (regionCode === 'china' || regionCode === '100000') {
          return {
            ...mockChinaData,
            features: mockChinaData.features.map((feature, index) => ({
              ...feature,
              properties: {
                ...feature.properties,
                image: `https://picsum.photos/200/150?random=${Date.now() + index}`,
                description: `${feature.properties.name} - 模拟数据`
              }
            }))
          };
        } else if (mockProvinceData[regionCode as keyof typeof mockProvinceData]) {
          const provinceData = mockProvinceData[regionCode as keyof typeof mockProvinceData];
          return {
            ...provinceData,
            features: provinceData.features.map((feature, index) => ({
              ...feature,
              properties: {
                ...feature.properties,
                image: `https://picsum.photos/200/150?random=${Date.now() + index}`,
                description: `${feature.properties.name} - 模拟数据`
              }
            }))
          };
        } else {
          // 生成示例区域数据
          const imageId = Math.floor(Math.random() * 1000) + 1;
          return {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { 
                  name: '示例区域', 
                  code: regionCode,
                  image: `https://picsum.photos/200/150?random=${imageId}`,
                  description: `这是一个示例区域，图片ID: ${imageId}`
                },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[110, 30], [120, 30], [120, 40], [110, 40], [110, 30]]]
                }
              }
            ]
          };
        }
      }
    } catch (error) {
      console.error('获取地图数据失败:', error);
      return mockChinaData;
    } finally {
      setLoading(false);
    }
  }, []);

  // 生成ECharts地图配置
  const getMapOption = useCallback(async (regionCode: string, mapGeoData: any) => {
    const maskedBgImg = await createMaskedBgImg();
    
    // 注册地图数据
    echarts.registerMap('currentMap', mapGeoData);
    
    const themeColors = {
      light: {
        backgroundColor: '#ffffff',
        areaColor: '#e6f3ff',
        borderColor: borderColor,
        textColor: '#333333',
        titleColor: '#2564AD'
      },
      dark: {
        backgroundColor: '#1a1a1a',
        areaColor: '#2d3748',
        borderColor: '#4fd1c7',
        textColor: '#ffffff',
        titleColor: '#4fd1c7'
      }
    };

    const colors = themeColors[theme];

    return {
      backgroundColor: colors.backgroundColor,
      animation: enableTransition,
      animationDuration,
      animationEasing,
      animationDurationUpdate: animationDuration,
      animationEasingUpdate: animationEasing,
      
      title: {
        top: 10,
        text: getRegionTitle(regionCode),
        left: 'center',
        textStyle: {
          color: colors.titleColor,
          fontWeight: 600,
          fontSize: 16
        }
      },
      
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const feature = mapGeoData.features.find((f: any) => f.properties.name === params.name);
          let content = `<div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
            <div style="color: #666; font-size: 12px;">数值: ${params.value || 'N/A'}</div>`;
          
          if (feature?.properties?.image) {
            content += `<div style="margin-top: 8px;">
              <img src="${feature.properties.image}" alt="${params.name}" 
                   style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px;" />
            </div>`;
          }
          
          if (feature?.properties?.description) {
            content += `<div style="margin-top: 4px; color: #888; font-size: 11px;">
              ${feature.properties.description}
            </div>`;
          }
          
          content += `<div style="margin-top: 8px; color: #4a90e2; font-size: 12px;">
            点击查看详情
          </div></div>`;
          
          return content;
        }
      },
      
      geo: {
        map: 'currentMap',
        aspectScale: 0.8,
        layoutCenter: ['50%', '50%'],
        layoutSize: '80%',
        roam: false,
        itemStyle: {
          areaColor: colors.areaColor,
          borderColor: colors.borderColor,
          borderWidth: 1
        }
      },
      
      series: [{
        type: 'map',
        map: 'currentMap',
        universalTransition: enableTransition ? { 
          enabled: true, 
          divideShape: 'clone'
        } : undefined,
        zoom: 1.2,
        itemStyle: {
          areaColor: colors.areaColor,
          borderColor: colors.borderColor,
          borderWidth
        },
        emphasis: {
          itemStyle: {
            areaColor: emphasisColor,
            borderColor: colors.borderColor,
            borderWidth: borderWidth + 1
          },
          label: { 
            color: colors.textColor, 
            fontWeight: 'bold',
            show: showLabel
          }
        },
        select: {
          itemStyle: {
            areaColor: emphasisColor,
            borderColor: colors.borderColor
          },
          label: { 
            color: colors.textColor, 
            fontWeight: 'bold',
            show: showLabel
          }
        },
        label: {
          show: showLabel,
          color: colors.textColor,
          fontWeight: 'normal',
          fontSize: 12
        },
        data: mapGeoData.features.map((feature: any) => ({
          name: feature.properties.name,
          value: Math.floor(Math.random() * 1000) + 100 // 模拟数据值
        }))
      }]
    };
  }, [
    createMaskedBgImg, 
    borderColor, 
    borderWidth, 
    emphasisColor, 
    theme, 
    enableTransition, 
    animationDuration, 
    animationEasing, 
    showLabel
  ]);

  // 获取区域标题
  const getRegionTitle = (regionCode: string): string => {
    const titleMap: Record<string, string> = {
      'china': '中华人民共和国',
      '100000': '中华人民共和国',
      
      // 直辖市
      '110000': '北京市',
      '120000': '天津市',
      '310000': '上海市',
      '500000': '重庆市',
      
      // 省份
      '130000': '河北省',
      '140000': '山西省',
      '150000': '内蒙古自治区',
      '210000': '辽宁省',
      '220000': '吉林省',
      '230000': '黑龙江省',
      '320000': '江苏省',
      '330000': '浙江省',
      '340000': '安徽省',
      '350000': '福建省',
      '360000': '江西省',
      '370000': '山东省',
      '410000': '河南省',
      '420000': '湖北省',
      '430000': '湖南省',
      '440000': '广东省',
      '450000': '广西壮族自治区',
      '460000': '海南省',
      '510000': '四川省',
      '520000': '贵州省',
      '530000': '云南省',
      '540000': '西藏自治区',
      '610000': '陕西省',
      '620000': '甘肃省',
      '630000': '青海省',
      '640000': '宁夏回族自治区',
      '650000': '新疆维吾尔自治区',
      
      // 广东省下级市
      '440100': '广州市',
      '440200': '韶关市',
      '440300': '深圳市',
      '440400': '珠海市',
      '440500': '汕头市',
      '440600': '佛山市',
      '440700': '江门市',
      '440800': '湛江市',
      '440900': '茂名市',
      '441200': '肇庆市',
      '441300': '惠州市',
      '441400': '梅州市',
      '441500': '汕尾市',
      '441600': '河源市',
      '441700': '阳江市',
      '441800': '清远市',
      '441900': '东莞市',
      '442000': '中山市',
      '445100': '潮州市',
      '445200': '揭阳市',
      '445300': '云浮市'
    };
    
    return titleMap[regionCode] || `区域代码: ${regionCode}`;
  };

  // 处理地图点击事件
  const handleMapClick = useCallback((params: any) => {
    if (!allowNavigation || !params.name) return;
    
    const regionName = params.name;
    const regionCode = getRegionCode(regionName);
    
    // 触发回调
    onRegionClick?.(params);
    
    // 检查是否可以导航到下级
    if (canNavigateToNext(currentRegion)) {
      setCurrentRegion(regionCode);
      setRegionHistory(prev => [...prev, regionCode]);
      onRegionChange?.(regionCode);
    }
  }, [allowNavigation, currentRegion, onRegionClick, onRegionChange]);

  // 初始化地图
  const initMap = useCallback(async () => {
    if (!mapChartRef.current) return;
    
    try {
      // 销毁现有实例
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
      
      // 创建新实例
      chartInstanceRef.current = echarts.init(mapChartRef.current);
      
      // 确保实例创建成功
      if (!chartInstanceRef.current) {
        console.error('ECharts实例创建失败');
        return;
      }
      
      // 获取地图数据
      const geoData = await getMapData(currentRegion);
      setMapData(geoData);
      
      // 设置地图配置
      const option = await getMapOption(currentRegion, geoData);
      
      // 再次检查实例是否存在
      if (chartInstanceRef.current) {
        chartInstanceRef.current.setOption(option, true);
        
        // 添加点击事件
        chartInstanceRef.current.on('click', handleMapClick);
      }
    } catch (error) {
      console.error('地图初始化失败:', error);
      setLoading(false);
    }
  }, [currentRegion, getMapData, getMapOption, handleMapClick]);

  // 获取区域代码
  const getRegionCode = (regionName: string): string => {
    // 常用省市区域代码映射
    const codeMap: Record<string, string> = {
      // 直辖市
      '北京市': '110000',
      '天津市': '120000', 
      '上海市': '310000',
      '重庆市': '500000',
      
      // 省份
      '河北省': '130000',
      '山西省': '140000',
      '内蒙古自治区': '150000',
      '辽宁省': '210000',
      '吉林省': '220000',
      '黑龙江省': '230000',
      '江苏省': '320000',
      '浙江省': '330000',
      '安徽省': '340000',
      '福建省': '350000',
      '江西省': '360000',
      '山东省': '370000',
      '河南省': '410000',
      '湖北省': '420000',
      '湖南省': '430000',
      '广东省': '440000',
      '广西壮族自治区': '450000',
      '海南省': '460000',
      '四川省': '510000',
      '贵州省': '520000',
      '云南省': '530000',
      '西藏自治区': '540000',
      '陕西省': '610000',
      '甘肃省': '620000',
      '青海省': '630000',
      '宁夏回族自治区': '640000',
      '新疆维吾尔自治区': '650000',
      
      // 广东省下级市
      '广州市': '440100',
      '韶关市': '440200',
      '深圳市': '440300',
      '珠海市': '440400',
      '汕头市': '440500',
      '佛山市': '440600',
      '江门市': '440700',
      '湛江市': '440800',
      '茂名市': '440900',
      '肇庆市': '441200',
      '惠州市': '441300',
      '梅州市': '441400',
      '汕尾市': '441500',
      '河源市': '441600',
      '阳江市': '441700',
      '清远市': '441800',
      '东莞市': '441900',
      '中山市': '442000',
      '潮州市': '445100',
      '揭阳市': '445200',
      '云浮市': '445300'
    };
    
    return codeMap[regionName] || regionName;
  };

  // 检查是否可以导航到下级
  const canNavigateToNext = (region: string): boolean => {
    // 国家级可以进入省级
    if (region === 'china' || region === '100000') {
      return true;
    }
    
    // 省级可以进入市级（以0000结尾的6位代码）
    if (region.length === 6 && region.endsWith('0000')) {
      return true;
    }
    
    // 市级可以进入区县级（以00结尾但不以0000结尾的6位代码）
    if (region.length === 6 && region.endsWith('00') && !region.endsWith('0000')) {
      return true;
    }
    
    // 区县级不能再进入下级
    return false;
  };

  // 返回上级
  const goBack = useCallback(() => {
    if (regionHistory.length > 1) {
      const newHistory = [...regionHistory];
      newHistory.pop();
      const previousRegion = newHistory[newHistory.length - 1];
      
      setRegionHistory(newHistory);
      setCurrentRegion(previousRegion);
      onRegionChange?.(previousRegion);
    }
  }, [regionHistory, onRegionChange]);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始化和更新地图
  useEffect(() => {
    initMap();
  }, [initMap]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`dynamic-map-transition ${className} ${theme}`} style={style}>
      <div className="map-controls">
        <button 
          className="back-button"
          onClick={goBack}
          disabled={regionHistory.length <= 1 || loading}
        >
          ← 返回上级
        </button>
        <div className="region-path">
          {regionHistory.map((region, index) => (
            <span key={region} className="path-item">
              {getRegionTitle(region)}
              {index < regionHistory.length - 1 && ' > '}
            </span>
          ))}
        </div>
      </div>
      
      <div 
        ref={mapChartRef}
        className="map-container"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          position: 'relative'
        }}
      >
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <span>加载中...</span>
          </div>
        )}
      </div>
      
      <div className="map-info">
        <div className="current-region">
          当前区域: {getRegionTitle(currentRegion)}
        </div>
        <div className="interaction-hint">
          {canNavigateToNext(currentRegion) ? '点击区域查看详情' : '已到最底层级'}
        </div>
      </div>
    </div>
  );
};

export default DynamicMapTransition;