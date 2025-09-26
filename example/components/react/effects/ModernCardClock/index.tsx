import React, { useState, useEffect } from 'react';
import './index.scss';

/**
 * 日期格式配置选项
 */
export interface DateFormatOptions {
  /** 显示年月日 (yyyy-mm-dd) */
  showFullDate?: boolean;
  /** 显示年月 (YYYY-MM) */
  showYearMonth?: boolean;
  /** 显示时分秒 */
  showTime?: boolean;
  /** 显示星期几 */
  showWeekday?: boolean;
  /** 显示当前周数 */
  showWeekNumber?: boolean;
}

/**
 * 卡片时钟组件属性
 */
export interface ModernCardClockProps {
  /** 自定义日期值，支持 yyyy-mm-dd 或 YYYY-MM 格式 */
  customDate?: string;
  /** 日期格式配置 */
  formatOptions?: DateFormatOptions;
  /** 时钟标题 */
  title?: string;
  /** 主题样式 */
  theme?: 'light' | 'dark' | 'gradient';
  /** 是否显示动画效果 */
  animated?: boolean;
}

/**
 * 获取周数
 */
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

/**
 * 格式化日期
 */
const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];

  switch (format) {
    case 'yyyy-mm-dd':
      return `${year}-${month}-${day}`;
    case 'YYYY-MM':
      return `${year}-${month}`;
    case 'time':
      return `${hours}:${minutes}:${seconds}`;
    case 'weekday':
      return weekday;
    case 'week':
      return `第${getWeekNumber(date)}周`;
    default:
      return '';
  }
};

/**
 * 解析自定义日期字符串
 */
const parseCustomDate = (dateStr: string): Date => {
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // yyyy-mm-dd 格式
    return new Date(dateStr);
  } else if (dateStr.match(/^\d{4}-\d{2}$/)) {
    // YYYY-MM 格式，默认为该月第一天
    return new Date(`${dateStr}-01`);
  }
  return new Date();
};

/**
 * 现代卡片时钟组件
 */
export const ModernCardClock: React.FC<ModernCardClockProps> = ({
  customDate,
  formatOptions = {
    showFullDate: true,
    showTime: true,
    showWeekday: true,
  },
  title = '数字时钟',
  theme = 'gradient',
  animated = true,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    if (customDate) {
      // 使用自定义日期
      setCurrentTime(parseCustomDate(customDate));
      return;
    }

    // 实时更新时间
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [customDate]);

  const renderDateInfo = () => {
    const items = [];

    if (formatOptions.showFullDate) {
      items.push(
        <div key="fullDate" className="date-item">
          <span className="date-label">日期</span>
          <span className="date-value">{formatDate(currentTime, 'yyyy-mm-dd')}</span>
        </div>
      );
    }

    if (formatOptions.showYearMonth) {
      items.push(
        <div key="yearMonth" className="date-item">
          <span className="date-label">年月</span>
          <span className="date-value">{formatDate(currentTime, 'YYYY-MM')}</span>
        </div>
      );
    }

    if (formatOptions.showTime) {
      items.push(
        <div key="time" className="date-item time-display">
          <span className="date-label">时间</span>
          <span className="date-value time-value">{formatDate(currentTime, 'time')}</span>
        </div>
      );
    }

    if (formatOptions.showWeekday) {
      items.push(
        <div key="weekday" className="date-item">
          <span className="date-label">星期</span>
          <span className="date-value">{formatDate(currentTime, 'weekday')}</span>
        </div>
      );
    }

    if (formatOptions.showWeekNumber) {
      items.push(
        <div key="weekNumber" className="date-item">
          <span className="date-label">周数</span>
          <span className="date-value">{formatDate(currentTime, 'week')}</span>
        </div>
      );
    }

    return items;
  };

  return (
    <div className={`modern-card-clock ${theme} ${animated ? 'animated' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        {renderDateInfo()}
      </div>
      <div className="card-footer">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">
            {customDate ? '自定义时间' : '实时更新'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModernCardClock;