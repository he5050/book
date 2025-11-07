import React, { useRef, useEffect, useState } from 'react';
import './index.scss';

interface CanvasAdvancedRendererProps {
  width?: number;
  height?: number;
  className?: string;
}

interface ImageRenderConfig {
  src: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface RichTextConfig {
  text: string;
  x: number;
  y: number;
  maxWidth?: number;
  lineHeight?: number;
  font?: string;
  fillStyle?: string;
}

interface SVGRenderConfig {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PathRenderConfig {
  pathData: string;
  x: number;
  y: number;
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

const CanvasAdvancedRenderer: React.FC<CanvasAdvancedRendererProps> = ({
  width = 600,
  height = 400,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDemo, setActiveDemo] = useState<'image' | 'text' | 'svg' | 'path'>('image');
  const [imageConfig, setImageConfig] = useState<ImageRenderConfig>({
    src: 'https://picsum.photos/100/100',
    x: 50,
    y: 50,
    width: 100,
    height: 100
  });
  const [textConfig, setTextConfig] = useState<RichTextConfig>({
    text: '这是一段很长的中文文本，需要自动换行显示。Canvas文本渲染是纯状态驱动的。',
    x: 20,
    y: 50,
    maxWidth: 200,
    lineHeight: 24,
    font: '16px Arial',
    fillStyle: '#333'
  });
  const [svgConfig, setSvgConfig] = useState<SVGRenderConfig>({
    content: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="#4a90e2" /></svg>',
    x: 300,
    y: 50,
    width: 100,
    height: 100
  });
  const [pathConfig, setPathConfig] = useState<PathRenderConfig>({
    pathData: 'M10 10 L100 50 C150 70 180 30 200 50 Z',
    x: 50,
    y: 200,
    fillStyle: 'rgba(0, 100, 200, 0.3)',
    strokeStyle: '#0066cc',
    lineWidth: 2
  });

  // 图像加载函数
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  };

  // 绘制图像
  const drawImage = async (ctx: CanvasRenderingContext2D, config: ImageRenderConfig) => {
    try {
      const image = await loadImage(config.src);
      if (config.width && config.height) {
        ctx.drawImage(image, config.x, config.y, config.width, config.height);
      } else {
        ctx.drawImage(image, config.x, config.y);
      }
    } catch (error) {
      console.error('图像加载失败:', error);
      // 绘制错误占位符
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(config.x, config.y, config.width || 100, config.height || 100);
      ctx.fillStyle = '#999';
      ctx.font = '12px Arial';
      ctx.fillText('加载失败', config.x + 10, config.y + 20);
    }
  };

  // 自动换行文本绘制
  const wrapText = (ctx: CanvasRenderingContext2D, config: RichTextConfig) => {
    const { text, x, y, maxWidth = 200, lineHeight = 24, font = '16px Arial', fillStyle = '#333' } = config;
    
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    
    const words = text.split('');
    let line = '';
    let currentY = y;

    for (const char of words) {
      const testLine = line + char;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = char;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      ctx.fillText(line, x, currentY);
    }
  };

  // SVG转Data URL
  const svgToDataUrl = (svgContent: string): string => {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
  };

  // 绘制SVG
  const drawSVG = async (ctx: CanvasRenderingContext2D, config: SVGRenderConfig) => {
    try {
      const dataUrl = svgToDataUrl(config.content);
      const image = await loadImage(dataUrl);
      ctx.drawImage(image, config.x, config.y, config.width, config.height);
    } catch (error) {
      console.error('SVG渲染失败:', error);
      // 绘制错误占位符
      ctx.strokeStyle = '#999';
      ctx.strokeRect(config.x, config.y, config.width, config.height);
    }
  };

  // 绘制SVG路径
  const drawSVGPath = (ctx: CanvasRenderingContext2D, config: PathRenderConfig) => {
    try {
      const path = new Path2D(config.pathData);
      
      ctx.save();
      ctx.translate(config.x, config.y);
      
      if (config.fillStyle) {
        ctx.fillStyle = config.fillStyle;
        ctx.fill(path);
      }
      
      if (config.strokeStyle) {
        ctx.strokeStyle = config.strokeStyle;
        ctx.lineWidth = config.lineWidth || 1;
        ctx.stroke(path);
      }
      
      ctx.restore();
    } catch (error) {
      console.error('路径渲染失败:', error);
    }
  };

  // 设置高DPI Canvas
  const setupHighDPICanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = width;
    const displayHeight = height;

    // 设置实际大小（考虑设备像素比）
    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;

    // 设置显示大小
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    // 缩放绘图上下文以匹配设备像素比
    ctx.scale(devicePixelRatio, devicePixelRatio);

    return ctx;
  };

  // 渲染Canvas内容
  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = setupHighDPICanvas(canvas);
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // 设置抗锯齿
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    switch (activeDemo) {
      case 'image':
        await drawImage(ctx, imageConfig);
        break;
      case 'text':
        wrapText(ctx, textConfig);
        break;
      case 'svg':
        await drawSVG(ctx, svgConfig);
        break;
      case 'path':
        drawSVGPath(ctx, pathConfig);
        break;
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [activeDemo, imageConfig, textConfig, svgConfig, pathConfig, width, height]);

  // 监听设备像素比变化（如用户缩放页面）
  useEffect(() => {
    const handleResize = () => {
      renderCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`canvas-advanced-renderer ${className}`}>
      <div className="demo-controls">
        <div className="demo-tabs">
          <button 
            className={activeDemo === 'image' ? 'active' : ''} 
            onClick={() => setActiveDemo('image')}
          >
            图像渲染
          </button>
          <button 
            className={activeDemo === 'text' ? 'active' : ''} 
            onClick={() => setActiveDemo('text')}
          >
            富文本渲染
          </button>
          <button 
            className={activeDemo === 'svg' ? 'active' : ''} 
            onClick={() => setActiveDemo('svg')}
          >
            SVG渲染
          </button>
          <button 
            className={activeDemo === 'path' ? 'active' : ''} 
            onClick={() => setActiveDemo('path')}
          >
            路径渲染
          </button>
        </div>

        {activeDemo === 'image' && (
          <div className="config-panel">
            <h4>图像渲染配置</h4>
            <div className="config-item">
              <label>X坐标:</label>
              <input 
                type="number" 
                value={imageConfig.x} 
                onChange={(e) => setImageConfig({...imageConfig, x: Number(e.target.value)})}
              />
            </div>
            <div className="config-item">
              <label>Y坐标:</label>
              <input 
                type="number" 
                value={imageConfig.y} 
                onChange={(e) => setImageConfig({...imageConfig, y: Number(e.target.value)})}
              />
            </div>
            <div className="config-item">
              <label>宽度:</label>
              <input 
                type="number" 
                value={imageConfig.width} 
                onChange={(e) => setImageConfig({...imageConfig, width: Number(e.target.value)})}
              />
            </div>
            <div className="config-item">
              <label>高度:</label>
              <input 
                type="number" 
                value={imageConfig.height} 
                onChange={(e) => setImageConfig({...imageConfig, height: Number(e.target.value)})}
              />
            </div>
          </div>
        )}

        {activeDemo === 'text' && (
          <div className="config-panel">
            <h4>富文本渲染配置</h4>
            <div className="config-item">
              <label>文本内容:</label>
              <textarea 
                value={textConfig.text} 
                onChange={(e) => setTextConfig({...textConfig, text: e.target.value})}
              />
            </div>
            <div className="config-item">
              <label>最大宽度:</label>
              <input 
                type="number" 
                value={textConfig.maxWidth} 
                onChange={(e) => setTextConfig({...textConfig, maxWidth: Number(e.target.value)})}
              />
            </div>
            <div className="config-item">
              <label>行高:</label>
              <input 
                type="number" 
                value={textConfig.lineHeight} 
                onChange={(e) => setTextConfig({...textConfig, lineHeight: Number(e.target.value)})}
              />
            </div>
            <div className="config-item">
              <label>字体:</label>
              <input 
                type="text" 
                value={textConfig.font} 
                onChange={(e) => setTextConfig({...textConfig, font: e.target.value})}
              />
            </div>
            <div className="config-item">
              <label>颜色:</label>
              <input 
                type="color" 
                value={textConfig.fillStyle} 
                onChange={(e) => setTextConfig({...textConfig, fillStyle: e.target.value})}
              />
            </div>
          </div>
        )}

        {activeDemo === 'path' && (
          <div className="config-panel">
            <h4>路径渲染配置</h4>
            <div className="config-item">
              <label>路径数据:</label>
              <textarea 
                value={pathConfig.pathData} 
                onChange={(e) => setPathConfig({...pathConfig, pathData: e.target.value})}
              />
            </div>
            <div className="config-item">
              <label>填充颜色:</label>
              <input 
                type="color" 
                value={pathConfig.fillStyle?.replace('rgba(0, 100, 200, 0.3)', '#0064c8') || '#0064c8'} 
                onChange={(e) => setPathConfig({...pathConfig, fillStyle: e.target.value})}
              />
            </div>
            <div className="config-item">
              <label>描边颜色:</label>
              <input 
                type="color" 
                value={pathConfig.strokeStyle} 
                onChange={(e) => setPathConfig({...pathConfig, strokeStyle: e.target.value})}
              />
            </div>
            <div className="config-item">
              <label>线宽:</label>
              <input 
                type="number" 
                value={pathConfig.lineWidth} 
                onChange={(e) => setPathConfig({...pathConfig, lineWidth: Number(e.target.value)})}
              />
            </div>
          </div>
        )}
      </div>

      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          className="render-canvas"
        />
      </div>
    </div>
  );
};

export default CanvasAdvancedRenderer;