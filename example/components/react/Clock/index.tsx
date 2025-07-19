import React, { useEffect, useRef, FC } from 'react';
import './index.scss';

/**
 * 时钟元素位置计算参数接口
 */
interface PositionParams {
  phase: number; // 相位，范围0-1，表示在圆周上的位置
  radius: number; // 半径，元素距离中心的距离
}

/**
 * 时钟组件 - 显示一个模拟时钟，带有小时、分钟和秒针
 * 
 * 该组件使用原生DOM操作和requestAnimationFrame来创建和动画化时钟元素
 * 组件会在窗口大小改变时重新初始化，并在卸载时清理所有资源
 */
const ClockWarp: FC = () => {
  // 引用时钟容器DOM元素
  const clockRef = useRef<HTMLDivElement>(null);
  
  // 存储动画帧ID，用于在组件卸载或重新初始化时取消动画
  const animationFrameId = useRef<number | null>(null);

  /**
   * 初始化时钟
   * 清除之前的动态元素和动画，然后重新创建时钟
   */
  const initClock = (): void => {
    const clockElement = clockRef.current;

    if (clockElement) {
      // 清除之前的动态元素，避免重复创建
      const dynamicElement = clockElement.querySelector('.dynamic');
      if (dynamicElement) {
        dynamicElement.innerHTML = '';
      }
      
      // 如果存在之前的动画，取消它
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      
      // 初始化时钟
      createUtilityClock(clockElement);
    }
  };

  useEffect(() => {
    // 初始化时钟
    initClock();

    // 添加resize事件监听，在窗口大小改变时重新初始化时钟
    window.addEventListener('resize', initClock);

    // 清理函数 - 移除事件监听器并取消动画
    return () => {
      window.removeEventListener('resize', initClock);
      
      // 取消动画帧，防止内存泄漏
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, []);
  /**
   * 创建并初始化时钟
   * @param container 时钟容器DOM元素
   */
  function createUtilityClock(container: HTMLDivElement): void {
    // 获取时钟的关键元素
    const dynamic = container.querySelector('.dynamic') as HTMLDivElement | null;
    const hourElement = container.querySelector('.hour') as HTMLDivElement | null;
    const minuteElement = container.querySelector('.minute') as HTMLDivElement | null;
    const secondElement = container.querySelector('.second') as HTMLDivElement | null;
    
    // 如果任何必要的元素不存在，则提前返回
    if (!dynamic || !hourElement || !minuteElement || !secondElement) {
      console.error('Clock elements not found');
      return;
    }
    
    /**
     * 创建分钟标记
     * @param minuteNumber 分钟数（1-60）
     */
    const createMinuteMark = function(minuteNumber: number): void {
      // 每5分钟创建文本标记，其他分钟创建线条标记
      minuteNumber % 5 === 0 
        ? createMinuteTextMark(minuteNumber) 
        : createMinuteLineMark(minuteNumber);
    };
    
    /**
     * 创建分钟文本标记（每5分钟一个）
     * @param minuteNumber 分钟数
     */
    const createMinuteTextMark = function(minuteNumber: number): void {
      const element = document.createElement('div');
      element.className = 'minute-text';
      // 确保分钟数显示为两位数
      element.innerHTML = (minuteNumber < 10 ? '0' : '') + minuteNumber;
      // 定位元素
      positionElement(element, { phase: minuteNumber / 60, radius: 135 });
      dynamic.appendChild(element);
    };
    
    /**
     * 创建分钟线条标记
     * @param minuteNumber 分钟数
     */
    const createMinuteLineMark = function(minuteNumber: number): void {
      const anchors = document.createElement('div');
      anchors.className = 'anchors';
      
      const element = document.createElement('div');
      element.className = 'element minute-line';
      
      rotateElement(anchors, minuteNumber);
      anchors.appendChild(element);
      dynamic.appendChild(anchors);
    };
    
    /**
     * 创建小时标记
     * @param hourNumber 小时数（1-12）
     */
    const createHourMark = function(hourNumber: number): void {
      const element = document.createElement('div');
      element.className = 'hour-text hour-' + hourNumber;
      element.innerHTML = hourNumber.toString();
      // 定位元素
      positionElement(element, { phase: hourNumber / 12, radius: 105 });
      dynamic.appendChild(element);
    };
    
    /**
     * 根据相位和半径定位元素
     * @param element 要定位的DOM元素
     * @param params 位置参数（相位和半径）
     */
    const positionElement = function(element: HTMLElement, params: PositionParams): void {
      const theta = params.phase * 2 * Math.PI;
      // 计算元素的top和left位置
      element.style.top = (-params.radius * Math.cos(theta)).toFixed(1) + 'px';
      element.style.left = (params.radius * Math.sin(theta)).toFixed(1) + 'px';
    };
    
    /**
     * 旋转元素
     * @param element 要旋转的DOM元素
     * @param degrees 旋转角度（以度为单位）
     */
    const rotateElement = function(element: HTMLElement, degrees: number): void {
      // 设置CSS transform属性来旋转元素
      const rotation = `rotate(${degrees * 6}deg)`;
      element.style.transform = rotation;
      element.style.webkitTransform = rotation; // 兼容旧版WebKit浏览器
    };
    /**
     * 动画函数 - 更新时钟指针位置
     */
    const animateClock = function(): void {
      // 检查元素是否存在
      if (!secondElement || !minuteElement || !hourElement) {
        return;
      }
      
      // 获取当前时间
      const now = new Date();
      
      // 计算时间（转换为秒）
      const time =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds() +
        now.getMilliseconds() / 1000;
      
      // 旋转时钟指针
      rotateElement(secondElement, time);
      rotateElement(minuteElement, time / 60);
      rotateElement(hourElement, time / 60 / 12);
      
      // 请求下一帧动画并存储ID
      animationFrameId.current = requestAnimationFrame(animateClock);
    };
    
    // 创建时钟标记
    if (dynamic) {
      // 创建60个分钟标记
      for (let i = 1; i <= 60; i++) {
        createMinuteMark(i);
      }
      
      // 创建12个小时标记
      for (let i = 1; i <= 12; i++) {
        createHourMark(i);
      }
    }
    
    // 开始时钟动画
    animateClock();
  }
  // 渲染时钟组件
  return (
    <div className="clock-warp">
      <div className="fill">
        <div className="reference"></div>
        {/* 时钟主体 */}
        <div className="clock" id="utility-clock" ref={clockRef}>
          <div className="centre">
            {/* 动态生成的时钟标记将被插入到这个div中 */}
            <div className="dynamic"></div>
            {/* 时钟装饰元素 */}
            <div className="expand round circle-1"></div>
            {/* 时针 */}
            <div className="anchors hour">
              <div className="element thin-hand"></div>
              <div className="element fat-hand"></div>
            </div>
            {/* 分针 */}
            <div className="anchors minute">
              <div className="element thin-hand"></div>
              <div className="element fat-hand minute-hand"></div>
            </div>
            {/* 秒针 */}
            <div className="anchors second">
              <div className="element second-hand"></div>
            </div>
            {/* 时钟装饰元素 */}
            <div className="expand round circle-2"></div>
            <div className="expand round circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockWarp;