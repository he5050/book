import React from 'react';
import ThreeDGlassCard from './index';

const TestPage: React.FC = () => {
  const testData = {
    title: '测试卡片',
    description: '这是一个测试用的3D玻璃卡片，鼠标悬停可以看到3D旋转效果和眩光。',
    imageUrl: 'https://picsum.photos/seed/test123/300/260'
  };

  const handleCardClick = (card: any) => {
    alert(`你点击了卡片: ${card.title}`);
  };

  const handleTiltChange = (values: any) => {
    console.log('倾斜值:', {
      tiltX: Math.round(values.tiltX * 100) / 100,
      tiltY: Math.round(values.tiltY * 100) / 100,
      percentageX: Math.round(values.percentageX * 100) / 100,
      percentageY: Math.round(values.percentageY * 100) / 100
    });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>
        <h1 style={{ marginBottom: '30px' }}>3D玻璃卡片测试</h1>
        <p style={{ marginBottom: '40px', fontSize: '1.1em' }}>
          将鼠标悬停在卡片上体验3D旋转和玻璃态效果
        </p>
        
        <ThreeDGlassCard
          data={testData}
          tiltConfig={{
            max: 25,
            speed: 400,
            glare: true,
            maxGlare: 0.8,
            scale: 1.1,
            reverse: false
          }}
          theme="light"
          onCardClick={handleCardClick}
          onTiltChange={handleTiltChange}
        />
        
        <div style={{ marginTop: '30px', fontSize: '0.9em', opacity: 0.8 }}>
          <p>✅ 鼠标跟随3D旋转</p>
          <p>✅ 玻璃态半透明效果</p>
          <p>✅ 实时眩光效果</p>
          <p>✅ 点击交互反馈</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;