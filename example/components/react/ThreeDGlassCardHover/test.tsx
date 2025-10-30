import React from 'react';
import ThreeDGlassCard from './index';

// 简单测试组件
const TestThreeDGlassCard: React.FC = () => {
  const testData = {
    title: '测试卡片',
    description: '这是一个测试用的3D玻璃卡片',
    imageUrl: 'https://picsum.photos/seed/test/300/260'
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <ThreeDGlassCard
        data={testData}
        tiltConfig={{
          max: 20,
          speed: 300,
          glare: true,
          scale: 1.1
        }}
        theme="light"
        onCardClick={(card) => {
          console.log('卡片被点击:', card.title);
        }}
      />
    </div>
  );
};

export default TestThreeDGlassCard;