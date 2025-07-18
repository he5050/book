import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './framer.scss';

/**
 * Framer Motion 动画示例组件
 * 展示了 Framer Motion 库的各种动画效果
 */
const FramerMotionDemo: React.FC = () => {
  // 状态管理
  const [clicked, setClicked] = useState(false);
  const [isTrans, setIsTrans] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // 变体定义
  const boxVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  // 卡片变体
  const cardVariants = {
    offscreen: {
      y: 300,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="framer-motion-container">
      <h1>Framer Motion 动画示例</h1>
      
      {/* 标签页导航 */}
      <div className="tabs">
        <button 
          className={activeTab === 'basic' ? 'active' : ''} 
          onClick={() => setActiveTab('basic')}
        >
          基础动画
        </button>
        <button 
          className={activeTab === 'interactive' ? 'active' : ''} 
          onClick={() => setActiveTab('interactive')}
        >
          交互动画
        </button>
        <button 
          className={activeTab === 'advanced' ? 'active' : ''} 
          onClick={() => setActiveTab('advanced')}
        >
          高级动画
        </button>
      </div>

      {/* 基础动画示例 */}
      {activeTab === 'basic' && (
        <div className="demo-section">
          <h2>基础过渡动画</h2>
          <div className="demo-box">
            <motion.div
              className="fade-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
            >
              <h3>淡入淡出效果</h3>
              <p>透明度从0到1的过渡，持续3秒</p>
            </motion.div>
          </div>

          <h2>变体动画</h2>
          <div className="demo-box">
            <motion.div
              className="variant-box"
              variants={boxVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              从左侧滑入的盒子
            </motion.div>
          </div>

          <h2>曲线动画</h2>
          <div className="demo-box curve-demo">
            <motion.div
              className="curve-ball"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: isTrans ? 200 : 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            />
            <button className="action-button" onClick={() => setIsTrans(!isTrans)}>
              {isTrans ? '返回' : '移动'}
            </button>
          </div>
        </div>
      )}

      {/* 交互动画示例 */}
      {activeTab === 'interactive' && (
        <div className="demo-section">
          <h2>按钮悬停与点击效果</h2>
          <div className="demo-box">
            <motion.button
              className="hover-button"
              whileHover={{ 
                scale: 1.2, 
                backgroundColor: "#ff4081", 
                color: "#fff" 
              }}
              whileTap={{ scale: 0.9 }}
            >
              悬停在我上面
            </motion.button>
          </div>

          <h2>动画组合</h2>
          <div className="demo-box">
            <div className="combined-animation">
              <motion.button
                className="click-button"
                onClick={() => setClicked(!clicked)}
                animate={{ 
                  scale: clicked ? 1.3 : 1, 
                  color: clicked ? "#ff4081" : "#6200ea" 
                }}
                transition={{ duration: 0.2 }}
              >
                点击我
              </motion.button>
              <motion.div
                className="click-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: clicked ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <p>按钮已点击！</p>
              </motion.div>
            </div>
          </div>

          <h2>拖拽动画</h2>
          <div className="demo-box drag-container">
            <motion.div
              className="drag-box"
              drag={true}
              dragConstraints={{ 
                left: -100, 
                right: 100, 
                top: -50, 
                bottom: 50 
              }}
              dragElastic={0.2}
              whileDrag={{ scale: 1.1, boxShadow: "0px 10px 25px rgba(0,0,0,0.3)" }}
            >
              拖拽我
            </motion.div>
            <div className="drag-boundary"></div>
          </div>
        </div>
      )}

      {/* 高级动画示例 */}
      {activeTab === 'advanced' && (
        <div className="demo-section">
          <h2>滚动动画</h2>
          <div className="demo-box scroll-container">
            <motion.div
              className="scroll-item"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.8 }}
              variants={cardVariants}
            >
              <div className="card">
                <h3>滚动时显示</h3>
                <p>当元素进入视口时触发动画</p>
              </div>
            </motion.div>
            
            <motion.div
              className="scroll-item"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.8 }}
              variants={cardVariants}
              transition={{ delay: 0.2 }}
            >
              <div className="card">
                <h3>延迟动画</h3>
                <p>这个元素有0.2秒的延迟</p>
              </div>
            </motion.div>
            
            <motion.div
              className="scroll-item"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.8 }}
              variants={cardVariants}
              transition={{ delay: 0.4 }}
            >
              <div className="card">
                <h3>更多延迟</h3>
                <p>这个元素有0.4秒的延迟</p>
              </div>
            </motion.div>
          </div>

          <h2>SVG 动画</h2>
          <div className="demo-box">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                stroke="#6200ea"
                strokeWidth="5"
                fill="transparent"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.path
                d="M 75,125 L 100,75 L 125,125"
                stroke="#ff4081"
                strokeWidth="5"
                fill="transparent"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
              />
            </svg>
          </div>

          <h2>手势动画</h2>
          <div className="demo-box">
            <motion.div
              className="gesture-box"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, rotate: 5 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
            >
              <p>悬停、点击或拖拽我</p>
            </motion.div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h2>关于 Framer Motion</h2>
        <p>
          Framer Motion 是一个用于 React 的开源动画库，专为创建高性能、流畅的动画效果而设计。
          它的核心优势在于其直观的 API、流畅的动画效果以及强大的功能集，从简单的平移到复杂的交互动画，
          Framer Motion 都能轻松实现。
        </p>
        <p>
          <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer">
            访问官方文档
          </a>
        </p>
      </div>
    </div>
  );
};

export default FramerMotionDemo;