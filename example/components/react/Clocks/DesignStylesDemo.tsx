import React, { useState } from 'react';
import SkeuomorphismClock from './SkeuomorphismClock';
import FlatDesignClock from './FlatDesignClock';
import MaterialDesignClock from './MaterialDesignClock';
import NeumorphismClock from './NeumorphismClock';
import GlassmorphismClock from './GlassmorphismClock';
import ClaymorphismClock from './ClaymorphismClock';
import NeoBrutalismClock from './NeoBrutalismClock';
import MinimalismClock from './MinimalismClock';

/**
 * 时钟样式配置接口
 */
interface ClockStyle {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
}

/**
 * 设计风格时钟博物馆演示组件
 * 展示所有8种设计风格的时钟，支持交互式切换和详细查看
 */
const DesignStylesDemo: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>('skeuomorphism');

  // 时钟样式配置
  const clockStyles: ClockStyle[] = [
    {
      id: 'skeuomorphism',
      name: '拟物化设计',
      description: '模拟真实物理对象的外观和质感，使用阴影、纹理和深度创造熟悉的触感界面。',
      component: SkeuomorphismClock
    },
    {
      id: 'flat',
      name: '扁平化设计',
      description: '简洁明快，去除多余装饰元素，使用纯色和清晰的形状。',
      component: FlatDesignClock
    },
    {
      id: 'material',
      name: '材料设计',
      description: 'Google的设计语言，强调层次和动效，使用分层元素和一致的阴影。',
      component: MaterialDesignClock
    },
    {
      id: 'neumorphism',
      name: '新拟物化',
      description: '柔和的阴影和高光营造立体感，元素看起来像是从背景中挤压出来的。',
      component: NeumorphismClock
    },
    {
      id: 'glassmorphism',
      name: '玻璃拟态',
      description: '透明玻璃质感，模糊背景效果，营造出磨砂玻璃的视觉效果。',
      component: GlassmorphismClock
    },
    {
      id: 'claymorphism',
      name: '粘土拟态',
      description: '柔软的粘土质感，温暖的色调，厚实圆润的边缘和柔和的阴影。',
      component: ClaymorphismClock
    },
    {
      id: 'neobrutalism',
      name: '新野兽主义',
      description: '大胆的色彩和强烈的对比，原始的设计风格，拥抱最小样式和粗糙视觉。',
      component: NeoBrutalismClock
    },
    {
      id: 'minimalism',
      name: '极简主义',
      description: '去繁就简，只保留最核心的元素，专注于清晰的线条、开放空间和功能性。',
      component: MinimalismClock
    }
  ];

  // 样式定义
  const containerStyle: React.CSSProperties = {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    marginBottom: '40px',
    lineHeight: '1.6'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '60px'
  };

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#fff'
  };

  const activeCardStyle: React.CSSProperties = {
    ...cardStyle,
    border: '2px solid #4CAF50',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
    transform: 'translateY(-2px)'
  };

  const detailSectionStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 20px',
    background: '#f9f9f9',
    borderRadius: '12px',
    marginTop: '40px'
  };

  // 获取选中的时钟样式
  const selectedClockStyle = clockStyles.find(style => style.id === selectedStyle) || clockStyles[0];
  const SelectedClockComponent = selectedClockStyle.component;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>设计风格时钟博物馆</h1>
      <p style={subtitleStyle}>
        探索8种不同的设计风格，每种都有其独特的美学理念和视觉表现。
        点击下方的时钟卡片来查看详细信息和大尺寸预览。
      </p>

      {/* 时钟网格展示 */}
      <div style={gridStyle}>
        {clockStyles.map(style => {
          const ClockComponent = style.component;
          const isActive = selectedStyle === style.id;

          return (
            <div
              key={style.id}
              style={isActive ? activeCardStyle : cardStyle}
              onClick={() => setSelectedStyle(style.id)}
            >
              <h3 style={{ marginTop: 0, color: '#333' }}>{style.name}</h3>
              <div style={{ margin: '20px 0' }}>
                <ClockComponent size={200} />
              </div>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.4',
                margin: '10px 0 0 0'
              }}>
                {style.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 详细展示区域 */}
      <div style={detailSectionStyle}>
        <h2 style={{
          fontSize: '28px',
          marginBottom: '20px',
          color: '#333'
        }}>
          {selectedClockStyle.name}
        </h2>
        <div style={{ marginBottom: '20px' }}>
          <SelectedClockComponent size={300} />
        </div>
        <p style={{
          fontSize: '16px',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          {selectedClockStyle.description}
        </p>
      </div>
    </div>
  );
};

export default DesignStylesDemo;