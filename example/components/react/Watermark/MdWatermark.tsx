import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type WatermarkAlign = 'left' | 'right' | 'top' | 'bottom' | 'center';
type WatermarkRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
type WatermarkAnimation = 'fade' | 'rotate' | 'none';

interface WatermarkOffset {
    x: number;
    y: number;
}

interface WatermarkResponsiveOptions {
    /** 基准宽度，用于计算缩放比例 */
    baseWidth?: number;
    /** 水印是否响应容器尺寸变化 */
    responsive?: boolean;
}

interface WatermarkProps {
    /** 水印文本内容，可以是字符串或字符串数组（多行文本） */
    content?: string | string[];
    /** 多行文本行间距 */
    lineHeight?: number;
    /** 水印图片URL或Base64字符串 */
    imageUrl?: string;
    /** 水印图片宽度 */
    imageWidth?: number;
    /** 水印图片高度 */
    imageHeight?: number;
    /** 水印文本颜色 */
    color?: string;
    /** 水印文本字体大小 */
    fontSize?: number;
    /** 水印旋转角度（度） */
    rotate?: number;
    /** 容器类名 */
    className?: string;
    /** 容器样式 */
    style?: React.CSSProperties;
    /** 子元素 */
    children: React.ReactNode;
    /** 水印间距 [x, y] */
    gap?: [number, number];
    /** 水印应用的容器，默认为组件自身的容器 */
    container?: React.RefObject<HTMLElement> | null;
    /** 水印透明度（0-1） */
    opacity?: number;
    /** 水印对齐方式 */
    align?: WatermarkAlign;
    /** 水印重复模式 */
    repeat?: WatermarkRepeat;
    /** 水印偏移量 */
    offset?: WatermarkOffset;
    /** 水印层级 */
    zIndex?: number;
    /** 响应式配置 */
    responsiveOptions?: WatermarkResponsiveOptions;
    /** 是否启用性能优化 */
    optimizePerformance?: boolean;
    /** 动画类型 */
    animation?: WatermarkAnimation;
    /** 动画持续时间（毫秒） */
    animationDuration?: number;
    /** 动画延迟（毫秒） */
    animationDelay?: number;
}

/**
 * 水印缓存键类型
 */
type WatermarkCacheKey = string;

/**
 * 水印缓存项类型
 */
interface WatermarkCacheItem {
    backgroundImage: string;
    timestamp: number;
}

/**
 * 全局水印缓存
 */
const watermarkCache = new Map<WatermarkCacheKey, WatermarkCacheItem>();

/**
 * 一个在子元素或指定容器上渲染重复水印的 React 组件
 * @param props - 配置水印的属性
 */
export default function MdWatermark(props: WatermarkProps) {
    const {
        content = 'XueRen',
        lineHeight = 1.5, // 默认行高
        imageUrl = '',
        imageWidth = 100,
        imageHeight = 40,
        color = 'rgba(0, 0, 0, 0.15)',
        fontSize = 16,
        rotate = -22,
        children,
        className,
        style,
        gap = [40, 40],
        container = null,
        opacity = 0.15, // 默认透明度与原组件保持一致
        align = 'center', // 默认对齐方式
        repeat = 'repeat', // 默认重复模式
        offset = { x: 0, y: 0 }, // 默认无偏移
        zIndex = -1, // 默认层级在内容下方
        responsiveOptions = {
            baseWidth: 1920, // 默认基准宽度为1920px
            responsive: true // 默认启用响应式
        },
        optimizePerformance = true, // 默认启用性能优化
        animation = 'none', // 默认无动画
        animationDuration = 3000, // 默认动画持续时间3秒
        animationDelay = 0 // 默认无动画延迟
    } = props;

    // 将内容统一处理为数组
    const contentLines = useCallback(() => {
        if (Array.isArray(content)) {
            return content;
        } else if (typeof content === 'string') {
            return content.split('\n');
        }
        return ['XueRen'];
    }, [content]);

    // 用于绘制水印的 canvas 引用
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // 默认容器引用
    const frameRef = useRef<HTMLDivElement>(null);
    // 当前水印应用容器引用
    const currentContainerRef = useRef<HTMLElement | null>(null);
    // MutationObserver 引用
    const observerRef = useRef<MutationObserver | null>(null);
    // 存储生成的背景图片 URL
    const imageStr = useRef<string>('');
    // 水印层引用
    const watermarkLayerRef = useRef<HTMLDivElement>(null);
    // 图片加载状态
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    // 图片加载错误
    const [imageError, setImageError] = useState<Error | null>(null);
    // 容器尺寸
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    // 用于防抖的定时器ID
    const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
    // 水印绘制缓存键
    const cacheKey = useRef<WatermarkCacheKey | null>(null);
    // 动画帧ID
    const animationFrameId = useRef<number | null>(null);
    // 动画开始时间
    const animationStartTime = useRef<number | null>(null);
    // 旋转动画角度
    const [rotationAngle, setRotationAngle] = useState(0);

    // 计算缩放比例
    const calculateScale = useCallback(() => {
        if (!responsiveOptions.responsive || containerSize.width <= 0) {
            return 1;
        }

        return containerSize.width / responsiveOptions.baseWidth;
    }, [responsiveOptions, containerSize.width]);

    // 生成缓存键
    const generateCacheKey = useCallback(() => {
        const scale = calculateScale();
        const scaledImageWidth = imageWidth * scale;
        const scaledImageHeight = imageHeight * scale;
        const scaledFontSize = fontSize * scale;
        const [scaledGapX, scaledGapY] = [gap[0] * scale, gap[1] * scale];
        const scaledLineHeight = lineHeight * scaledFontSize;

        return JSON.stringify({
            content: contentLines(),
            imageUrl,
            scaledImageWidth,
            scaledImageHeight,
            color,
            scaledFontSize,
            rotate,
            opacity,
            align,
            repeat,
            scaledLineHeight
        });
    }, [contentLines, imageUrl, imageWidth, imageHeight, color, fontSize, rotate, opacity, align, repeat, lineHeight, calculateScale, gap]);

    // 从缓存中获取水印
    const getWatermarkFromCache = useCallback((key: WatermarkCacheKey) => {
        const cacheItem = watermarkCache.get(key);
        if (cacheItem) {
            // 检查缓存是否过期（10分钟）
            const now = Date.now();
            if (now - cacheItem.timestamp < 10 * 60 * 1000) {
                return cacheItem.backgroundImage;
            }
            // 移除过期缓存
            watermarkCache.delete(key);
        }
        return null;
    }, []);

    // 将水印保存到缓存
    const saveWatermarkToCache = useCallback((key: WatermarkCacheKey, backgroundImage: string) => {
        watermarkCache.set(key, {
            backgroundImage,
            timestamp: Date.now()
        });

        // 限制缓存大小，超过100个则删除最旧的
        if (watermarkCache.size > 100) {
            const oldestKey = watermarkCache.keys().next().value;
            watermarkCache.delete(oldestKey);
        }
    }, []);

    // 创建离屏Canvas用于绘制
    const createOffscreenCanvas = useCallback(() => {
        const offscreenCanvas = document.createElement('canvas');
        return offscreenCanvas;
    }, []);

    // 绘制水印并应用到容器的回调函数
    const drawWatermarkCallback = useCallback(() => {
        const canvas = canvasRef.current;
        const watermarkLayer = watermarkLayerRef.current;
        if (!canvas || !watermarkLayer) return;

        // 生成缓存键
        const key = generateCacheKey();
        cacheKey.current = key;

        // 检查缓存
        if (optimizePerformance) {
            const cachedImage = getWatermarkFromCache(key);
            if (cachedImage) {
                imageStr.current = cachedImage;
                watermarkLayer.style.backgroundImage = imageStr.current;
                return;
            }
        }

        // 计算缩放比例
        const scale = calculateScale();

        // 应用缩放后的参数
        const scaledImageWidth = imageWidth * scale;
        const scaledImageHeight = imageHeight * scale;
        const scaledFontSize = fontSize * scale;
        const [scaledGapX, scaledGapY] = [gap[0] * scale, gap[1] * scale];
        const scaledOffset = { x: offset.x * scale, y: offset.y * scale };
        const scaledLineHeight = lineHeight * scaledFontSize;

        const ratio = window.devicePixelRatio || 1; // 处理高 DPI 显示

        let ctx: CanvasRenderingContext2D | null = null;
        let canvasToUse = canvas;

        // 使用离屏Canvas进行绘制以提高性能
        if (optimizePerformance) {
            const offscreenCanvas = createOffscreenCanvas();
            ctx = offscreenCanvas.getContext('2d');
            canvasToUse = offscreenCanvas;
        } else {
            ctx = canvas.getContext('2d');
        }

        if (!ctx) return;

        // 清空画布
        ctx.clearRect(0, 0, canvasToUse.width, canvasToUse.height);

        // 配置绘制样式
        ctx.globalAlpha = opacity;

        // 计算旋转角度（弧度）
        const angleRadians = (Math.PI / 180) * rotate;

        // 根据对齐方式计算偏移量
        let offsetX = 0;
        let offsetY = 0;

        // 计算对齐所需的偏移量
        switch (align) {
            case 'left':
                offsetX = -scaledGapX;
                break;
            case 'right':
                offsetX = scaledGapX;
                break;
            case 'top':
                offsetY = -scaledGapY;
                break;
            case 'bottom':
                offsetY = scaledGapY;
                break;
            case 'center':
            default:
                // 默认居中，无需偏移
                break;
        }

        // 应用用户定义的偏移
        const userOffsetX = scaledOffset.x * ratio;
        const userOffsetY = scaledOffset.y * ratio;

        // 如果有图片URL且已加载，则绘制图片水印
        if (imageUrl && isImageLoaded && !imageError) {
            const img = new Image();

            // 添加crossOrigin属性以请求跨域资源
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                // 计算旋转后的图片尺寸
                const scaledWidth = scaledImageWidth * ratio;
                const scaledHeight = scaledImageHeight * ratio;

                // 设置画布大小
                canvasToUse.width = 2 * (scaledWidth + scaledGapX * ratio);
                canvasToUse.height = 2 * (scaledHeight + scaledGapY * ratio);

                // 在指定位置绘制旋转图片的函数
                const drawRotatedImage = (centerX: number, centerY: number) => {
                    ctx?.save();
                    ctx?.translate(centerX, centerY);
                    ctx?.rotate(angleRadians);
                    ctx?.drawImage(img, -scaledWidth/2, -scaledHeight/2, scaledWidth, scaledHeight);
                    ctx?.restore();
                };

                if (ctx) {
                    // 根据对齐方式和用户偏移绘制水印
                    drawRotatedImage(canvasToUse.width / 4 + offsetX + userOffsetX, canvasToUse.height / 4 + offsetY + userOffsetY);
                    drawRotatedImage((canvasToUse.width * 3) / 4 + offsetX + userOffsetX, (canvasToUse.height * 3) / 4 + offsetY + userOffsetY);

                    try {
                        // 尝试将画布内容转换为URL
                        const imageDataUrl = canvasToUse.toDataURL();

                        // 如果使用了离屏Canvas，将结果复制到主Canvas
                        if (optimizePerformance && canvas.getContext('2d')) {
                            canvas.width = canvasToUse.width;
                            canvas.height = canvasToUse.height;
                            canvas.getContext('2d')?.drawImage(canvasToUse, 0, 0);
                        }

                        // 应用到水印层
                        imageStr.current = `url(${imageDataUrl})`;
                        watermarkLayer.style.backgroundImage = imageStr.current;

                        // 保存到缓存
                        if (optimizePerformance && cacheKey.current) {
                            saveWatermarkToCache(cacheKey.current, imageStr.current);
                        }
                    } catch (error) {
                        console.error('无法从Canvas生成数据URL，可能是跨域图片问题:', error);
                        // 跨域图片加载失败时，回退到文本水印
                        setIsImageLoaded(false);
                        setImageError(new Error('无法使用跨域图片生成水印，已回退到文本水印'));
                        drawWatermarkCallback();
                    }
                }
            };

            img.onerror = (error) => {
                console.error('Failed to load watermark image:', error);
                setImageError(new Error('Failed to load watermark image'));
                // 加载失败时回退到文本水印
                drawWatermarkCallback();
            };

            img.src = imageUrl;
        } else {
            // 否则绘制文本水印
            const lines = contentLines();

            // 配置字体
            const scaledFontSizeWithRatio = scaledFontSize * ratio;
            ctx.font = `${scaledFontSizeWithRatio}px sans-serif`;

            // 测量所有行的最大宽度
            let maxTextWidth = 0;
            lines.forEach(line => {
                const metrics = ctx.measureText(line);
                maxTextWidth = Math.max(maxTextWidth, metrics.width);
            });

            // 计算文本块的总高度
            const totalTextHeight = scaledLineHeight * lines.length * ratio;

            // 计算旋转后的文本尺寸
            const rotatedTextWidth =
                Math.abs(maxTextWidth * Math.cos(angleRadians)) + Math.abs(totalTextHeight * Math.sin(angleRadians));
            const rotatedTextHeight =
                Math.abs(maxTextWidth * Math.sin(angleRadians)) + Math.abs(totalTextHeight * Math.cos(angleRadians));

            // 计算带间距的画布尺寸
            const canvasGapX = scaledGapX * ratio;
            const canvasGapY = scaledGapY * ratio;
            const tileWidth = 2 * (rotatedTextWidth + canvasGapX);
            const tileHeight = 2 * (rotatedTextHeight + canvasGapY);

            // 设置画布大小
            canvasToUse.width = tileWidth;
            canvasToUse.height = tileHeight;

            // 配置绘制样式
            ctx.font = `${scaledFontSizeWithRatio}px sans-serif`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 在指定位置绘制旋转文本的函数
            const drawRotatedText = (centerX: number, centerY: number) => {
                ctx?.save();
                ctx?.translate(centerX, centerY);
                ctx?.rotate(angleRadians);

                // 绘制多行文本
                lines.forEach((line, index) => {
                    // 计算每行的垂直位置，从文本块顶部开始
                    const yPos = -(totalTextHeight / 2) + (index * scaledLineHeight * ratio) + (scaledLineHeight * ratio / 2);
                    ctx?.fillText(line, 0, yPos);
                });

                ctx?.restore();
            };

            if (ctx) {
                // 根据对齐方式和用户偏移绘制水印
                drawRotatedText(tileWidth / 4 + offsetX + userOffsetX, tileHeight / 4 + offsetY + userOffsetY);
                drawRotatedText((tileWidth * 3) / 4 + offsetX + userOffsetX, (tileHeight * 3) / 4 + offsetY + userOffsetY);

                // 将画布内容转换为URL
                const imageDataUrl = canvasToUse.toDataURL();

                // 如果使用了离屏Canvas，将结果复制到主Canvas
                if (optimizePerformance && canvas.getContext('2d')) {
                    canvas.width = canvasToUse.width;
                    canvas.height = canvasToUse.height;
                    canvas.getContext('2d')?.drawImage(canvasToUse, 0, 0);
                }

                // 应用到水印层
                imageStr.current = `url(${imageDataUrl})`;
                watermarkLayer.style.backgroundImage = imageStr.current;

                // 保存到缓存
                if (optimizePerformance && cacheKey.current) {
                    saveWatermarkToCache(cacheKey.current, imageStr.current);
                }
            }
        }

        // 根据重复模式设置背景重复
        watermarkLayer.style.backgroundRepeat = repeat;

        // 根据对齐方式设置背景位置，并添加用户偏移
        const backgroundPositionX =
            align === 'left' ? 'left' :
            align === 'right' ? 'right' :
            'center';

        const backgroundPositionY =
            align === 'top' ? 'top' :
            align === 'bottom' ? 'bottom' :
            'center';

        // 使用原始偏移值而非缩放后的偏移值
        watermarkLayer.style.backgroundPosition = `${backgroundPositionX} ${offset.x}px ${backgroundPositionY} ${offset.y}px`;

        // 设置水印层的层级
        watermarkLayer.style.zIndex = zIndex.toString();
    }, [contentLines, color, fontSize, rotate, gap, opacity, align, repeat, offset, zIndex, imageUrl, imageWidth, imageHeight, isImageLoaded, imageError, calculateScale, lineHeight, optimizePerformance, generateCacheKey, getWatermarkFromCache, saveWatermarkToCache, createOffscreenCanvas]);

    // 淡入淡出动画
    const startFadeAnimation = useCallback(() => {
        const watermarkLayer = watermarkLayerRef.current;
        if (!watermarkLayer) return;

        // 设置初始透明度
        watermarkLayer.style.opacity = '0';

        // 创建动画
        watermarkLayer.animate(
            [
                { opacity: '0' },
                { opacity: opacity.toString() },
                { opacity: '0' }
            ],
            {
                duration: animationDuration,
                delay: animationDelay,
                iterations: Infinity,
                easing: 'ease-in-out'
            }
        );
    }, [opacity, animationDuration, animationDelay]);

    // 旋转动画
    const startRotationAnimation = useCallback(() => {
        const animateRotation = (timestamp: number) => {
            if (!animationStartTime.current) {
                animationStartTime.current = timestamp;
            }

            const elapsed = timestamp - animationStartTime.current;
            const angle = (elapsed / animationDuration) * 360; // 每animationDuration毫秒旋转360度

            setRotationAngle(angle % 360);

            animationFrameId.current = requestAnimationFrame(animateRotation);
        };

        animationFrameId.current = requestAnimationFrame(animateRotation);
    }, [animationDuration]);

    // 停止动画
    const stopAnimation = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }

        animationStartTime.current = null;

        const watermarkLayer = watermarkLayerRef.current;
        if (watermarkLayer) {
            watermarkLayer.style.opacity = opacity.toString();
            watermarkLayer.style.transform = '';
        }
    }, [opacity]);

    // 管理动画的副作用
    useEffect(() => {
        const watermarkLayer = watermarkLayerRef.current;
        if (!watermarkLayer) return;

        // 先停止任何现有动画
        stopAnimation();

        // 根据动画类型启动相应动画
        if (animation === 'fade') {
            startFadeAnimation();
        } else if (animation === 'rotate') {
            startRotationAnimation();
        } else {
            // 无动画，设置默认样式
            watermarkLayer.style.opacity = opacity.toString();
            watermarkLayer.style.transform = '';
        }

        // 清理函数
        return () => {
            stopAnimation();
        };
    }, [animation, opacity, animationDuration, animationDelay, startFadeAnimation, startRotationAnimation, stopAnimation]);

    // 应用旋转动画到水印层
    useEffect(() => {
        const watermarkLayer = watermarkLayerRef.current;
        if (watermarkLayer && animation === 'rotate') {
            watermarkLayer.style.transform = `rotate(${rotationAngle}deg)`;
            watermarkLayer.style.transformOrigin = 'center';
            watermarkLayer.style.willChange = 'transform';
        }
    }, [rotationAngle, animation]);

    // 加载图片的副作用
    useEffect(() => {
        if (!imageUrl) {
            setIsImageLoaded(false);
            setImageError(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setIsImageLoaded(true);
            setImageError(null);
        };
        img.onerror = (error) => {
            console.error('Failed to preload watermark image:', error);
            setIsImageLoaded(false);
            setImageError(new Error('Failed to preload watermark image'));
        };
        img.src = imageUrl;

        // 如果图片加载失败或URL变更，重置状态
        return () => {
            setIsImageLoaded(false);
            setImageError(null);
        };
    }, [imageUrl]);

    // 监听容器尺寸变化的副作用
    useEffect(() => {
        const containerElement = container?.current || frameRef.current;
        if (!containerElement) return;

        // 初始设置容器尺寸
        setContainerSize({
            width: containerElement.clientWidth,
            height: containerElement.clientHeight
        });

        // 创建 ResizeObserver 监听容器尺寸变化
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                // 使用防抖避免频繁更新
                if (resizeTimeout.current) {
                    clearTimeout(resizeTimeout.current);
                }

                resizeTimeout.current = setTimeout(() => {
                    setContainerSize({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    });
                }, 100);
            }
        });

        resizeObserver.observe(containerElement);

        // 清理函数
        return () => {
            resizeObserver.disconnect();
            if (resizeTimeout.current) {
                clearTimeout(resizeTimeout.current);
            }
        };
    }, [container]);

    // 管理水印应用和观察器的副作用
    useEffect(() => {
        const containerElement = container?.current || frameRef.current;
        const watermarkLayer = watermarkLayerRef.current;
        if (!containerElement || !watermarkLayer) return;

        // 如果容器变更，清理旧容器的背景
        if (currentContainerRef.current && currentContainerRef.current !== containerElement) {
            if (currentContainerRef.current === watermarkLayer.parentElement) {
                // 如果水印层在旧容器中，移除它
                watermarkLayer.remove();
            }
        }

        // 设置新容器并绘制水印
        currentContainerRef.current = containerElement;

        // 如果水印层还未添加到容器中，添加它
        if (!containerElement.contains(watermarkLayer)) {
            // 设置水印层样式
            watermarkLayer.style.position = 'absolute';
            watermarkLayer.style.inset = '0';
            watermarkLayer.style.pointerEvents = 'none'; // 让水印层不阻挡点击事件

            // 添加到容器
            containerElement.appendChild(watermarkLayer);
        }

        // 绘制水印
        drawWatermarkCallback();

        // 断开旧的观察器
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // 为当前容器创建并设置新的观察器
        observerRef.current = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const expectedPosition =
                        align === 'left' ? 'left' :
                        align === 'right' ? 'right' :
                        'center';

                    const expectedPositionY =
                        align === 'top' ? 'top' :
                        align === 'bottom' ? 'bottom' :
                        'center';

                    const expectedBackgroundPosition = `${expectedPosition} ${offset.x}px ${expectedPositionY} ${offset.y}px`;

                    if (
                        watermarkLayer.style.backgroundImage !== imageStr.current ||
                        watermarkLayer.style.backgroundRepeat !== repeat ||
                        watermarkLayer.style.backgroundPosition !== expectedBackgroundPosition ||
                        watermarkLayer.style.zIndex !== zIndex.toString()
                    ) {
                        drawWatermarkCallback();
                    }
                    break;
                }
            }
        });

        // 观察水印层
        observerRef.current.observe(watermarkLayer, {
            attributes: true,
            attributeFilter: ['style']
        });

        // 清理函数，移除水印层并断开观察器
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            if (watermarkLayer && watermarkLayer.parentElement === containerElement) {
                watermarkLayer.remove();
            }
            currentContainerRef.current = null;
        };
    }, [container, drawWatermarkCallback, zIndex, isImageLoaded, imageError, containerSize]);

    // 组件卸载时清理缓存和动画
    useEffect(() => {
        return () => {
            if (cacheKey.current) {
                watermarkCache.delete(cacheKey.current);
            }

            stopAnimation();
        };
    }, [stopAnimation]);

    return (
        <div ref={frameRef} className={clsx('w-full h-full relative', className)} style={style}>
            {/* 隐藏的画布用于生成水印 */}
            <canvas className="hidden" ref={canvasRef} />
            {/* 水印层 */}
            <div ref={watermarkLayerRef} />
            {children}
        </div>
    );
}