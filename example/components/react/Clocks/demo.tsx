import React from 'react';
import SkeuomorphismClock from './SkeuomorphismClock';
import FlatDesignClock from './FlatDesignClock';
import MaterialDesignClock from './MaterialDesignClock';
import NeumorphismClock from './NeumorphismClock';
import GlassmorphismClock from './GlassmorphismClock';
import ClaymorphismClock from './ClaymorphismClock';
import NeoBrutalismClock from './NeoBrutalismClock';
import MinimalismClock from './MinimalismClock';

// 拟物化设计时钟演示
export const SkeuomorphismClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>拟物化设计时钟</h3>
    <p>模拟真实物理对象的外观和质感</p>
    <SkeuomorphismClock size={280} />
  </div>
);

// 扁平化设计时钟演示
export const FlatDesignClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>扁平化设计时钟</h3>
    <p>简洁明快，去除多余装饰元素</p>
    <FlatDesignClock size={280} />
  </div>
);

// 材料设计时钟演示
export const MaterialDesignClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>材料设计时钟</h3>
    <p>Google的设计语言，强调层次和动效</p>
    <MaterialDesignClock size={280} />
  </div>
);

// 新拟物化时钟演示
export const NeumorphismClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>新拟物化时钟</h3>
    <p>柔和的阴影和高光营造立体感</p>
    <NeumorphismClock size={280} />
  </div>
);

// 玻璃拟态时钟演示
export const GlassmorphismClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>玻璃拟态时钟</h3>
    <p>透明玻璃质感，模糊背景效果</p>
    <GlassmorphismClock size={280} />
  </div>
);

// 粘土拟态时钟演示
export const ClaymorphismClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>粘土拟态时钟</h3>
    <p>柔软的粘土质感，温暖的色调</p>
    <ClaymorphismClock size={280} />
  </div>
);

// 新野兽主义时钟演示
export const NeoBrutalismClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>新野兽主义时钟</h3>
    <p>大胆的色彩和强烈的对比</p>
    <NeoBrutalismClock size={280} />
  </div>
);

// 极简主义时钟演示
export const MinimalismClockDemo: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>极简主义时钟</h3>
    <p>去繁就简，只保留最核心的元素</p>
    <MinimalismClock size={280} />
  </div>
);

// 默认导出所有演示组件
const ClockDemos = {
  SkeuomorphismClockDemo,
  FlatDesignClockDemo,
  MaterialDesignClockDemo,
  NeumorphismClockDemo,
  GlassmorphismClockDemo,
  ClaymorphismClockDemo,
  NeoBrutalismClockDemo,
  MinimalismClockDemo
};

export default ClockDemos;