import React from 'react';
import CardHoverEffect from './index';

const CardHoverEffectExample: React.FC = () => {
  const sampleCards = [
    {
      id: '1',
      title: 'New Design',
      subtitle: '2 Hours ago',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere consequuntur magni assumenda distinctio nobis inventore iure?',
      imageUrl: 'https://picsum.photos/300/260?random=1'
    },
    {
      id: '2',
      title: 'CSS Only',
      subtitle: '5 Hours ago',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere consequuntur magni assumenda distinctio nobis inventore iure?',
      imageUrl: 'https://picsum.photos/300/260?random=2'
    }
  ];

  return (
    <div style={{ 
      background: '#333', 
      padding: '40px 20px', 
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h2 style={{ color: '#fff', marginBottom: '30px' }}>
        卡片设计带悬停效果示例
      </h2>
      <CardHoverEffect
        cards={sampleCards}
        cardWidth={300}
        cardHeight={300}
        expandedHeight={420}
        blurAmount={25}
        borderRadius={40}
        transitionDuration={0.5}
        theme="light"
      />
    </div>
  );
};

export default CardHoverEffectExample;