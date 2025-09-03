import React, { useEffect, useRef, useState } from 'react';

/**
 * 高清屏适配 Canvas 组件 - 展示 devicePixelRatio 适配
 * 
 * 展示三种不同的 Canvas 配置：
 * 1. 普通 Canvas - 未进行高清屏适配
 * 2. 高清屏适配方案一 - 调整画布尺寸并使用 CSS 控制显示尺寸
 * 3. 高清屏适配方案二 - 调整画布尺寸并使用 scale 缩放绘制内容
 */
const HiDPICanvas: React.FC = () => {
  // 引用三个不同的 Canvas 元素
  const normalCanvasRef = useRef<HTMLCanvasElement>(null);
  const hiDPICanvasRef1 = useRef<HTMLCanvasElement>(null);
  const hiDPICanvasRef2 = useRef<HTMLCanvasElement>(null);
  
  // 设备像素比
  const [dpr, setDpr] = useState<number>(1);
  
  useEffect(() => {
    // 获取设备像素比
    const devicePixelRatio = window.devicePixelRatio || 1;
    setDpr(devicePixelRatio);
    
    // 绘制普通 Canvas
    if (normalCanvasRef.current) {
      const ctx = normalCanvasRef.current.getContext('2d');
      if (ctx) {
        drawDetailedImage(ctx, false);
      }
    }
    
    // 绘制高清屏适配方案一 - 调整画布尺寸并使用 CSS 控制显示尺寸
    if (hiDPICanvasRef1.current) {
      const canvas = hiDPICanvasRef1.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 设置画布尺寸为 CSS 尺寸的 devicePixelRatio 倍
        const width = 200;
        const height = 150;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        
        // 使用 CSS 控制显示尺寸
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // 绘制图像
        drawDetailedImage(ctx, false);
      }
    }
    
    // 绘制高清屏适配方案二 - 调整画布尺寸并使用 scale 缩放绘制内容
    if (hiDPICanvasRef2.current) {
      const canvas = hiDPICanvasRef2.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 设置画布尺寸为 CSS 尺寸的 devicePixelRatio 倍
        const width = 200;
        const height = 150;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        
        // 使用 CSS 控制显示尺寸
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // 使用 scale 缩放绘制内容
        ctx.scale(devicePixelRatio, devicePixelRatio);
        
        // 绘制图像
        drawDetailedImage(ctx, true);
      }
    }
  }, []);
  
  /**
   * 绘制详细图像
   * @param ctx Canvas 上下文
   * @param isScaled 是否已经进行了缩放
   */
const drawDetailedImage = (ctx: CanvasRenderingContext2D, isScaled: boolean) => {
    const canvas = ctx.canvas;
    const width = isScaled ? canvas.width / dpr : canvas.width;
    const height = isScaled ? canvas.height / dpr : canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制网格
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // 绘制垂直线
    for (let x = 0; x <= width; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // 绘制水平线
    for (let y = 0; y <= height; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // 绘制文本
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('高清文本示例', width / 2, height / 2 - 20);
    
    // 绘制小字体文本（测试清晰度）
    ctx.font = '9px Arial';
    ctx.fillText('小字体测试 1234567890', width / 2, height / 2);
    
    // 绘制细线圆形
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 20, 15, 0, Math.PI * 2);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#ff6b6b';
    ctx.stroke();
    
    // 绘制对角线（测试锯齿）
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#4ecdc4';
    ctx.stroke();
    
    // 绘制细节丰富的图形
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.8);
    ctx.lineTo(width * 0.3, height * 0.6);
    ctx.lineTo(width * 0.4, height * 0.7);
    ctx.lineTo(width * 0.5, height * 0.5);
    ctx.lineTo(width * 0.6, height * 0.7);
    ctx.lineTo(width * 0.7, height * 0.6);
    ctx.lineTo(width * 0.8, height * 0.8);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#8338ec';
    ctx.stroke();
  };
  
  return (
    <div className="hidpi-canvas-demo">
      <div className="device-info">
        <span>当前设备像素比 (devicePixelRatio): {dpr.toFixed(2)}</span>
      </div>
      
      <div className="canvas-examples">
        {/* 普通 Canvas */}
        <div className="canvas-wrapper">
          <canvas 
            ref={normalCanvasRef}
            width="200"
            height="150"
          ></canvas>
          <div className="canvas-label">普通 Canvas</div>
          <div className="canvas-info">未进行高清屏适配</div>
        </div>
        
        {/* 高清屏适配方案一 */}
        <div className="canvas-wrapper">
          <canvas ref={hiDPICanvasRef1}></canvas>
          <div className="canvas-label">高清屏适配方案一</div>
          <div className="canvas-info">调整画布尺寸 × {dpr.toFixed(2)}</div>
        </div>
        
        {/* 高清屏适配方案二 */}
        <div className="canvas-wrapper">
          <canvas ref={hiDPICanvasRef2}></canvas>
          <div className="canvas-label">高清屏适配方案二</div>
          <div className="canvas-info">调整画布尺寸 + scale({dpr.toFixed(2)})</div>
        </div>
      </div>
    </div>
  );
};

export default HiDPICanvas;