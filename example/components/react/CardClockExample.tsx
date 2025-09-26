import React, { useState } from 'react';
import CardClock, { DateFormatOptions } from './CardClock';

/**
 * 卡片时钟使用示例组件
 */
export const CardClockExample: React.FC = () => {
  const [customDate, setCustomDate] = useState<string>('');
  const [formatOptions, setFormatOptions] = useState<DateFormatOptions>({
    showFullDate: true,
    showTime: true,
    showWeekday: true,
    showYearMonth: false,
    showWeekNumber: false,
  });
  const [theme, setTheme] = useState<'light' | 'dark' | 'gradient'>('gradient');

  const handleFormatChange = (key: keyof DateFormatOptions) => {
    setFormatOptions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>卡片时钟组件示例</h1>

      {/* 配置面板 */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        <div>
          <h3>日期格式配置</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(formatOptions).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleFormatChange(key as keyof DateFormatOptions)}
                />
                <span>{getFormatLabel(key)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3>自定义日期</h3>
          <input
            type="text"
            placeholder="yyyy-mm-dd 或 YYYY-MM"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
            支持格式：2024-03-15 或 2024-03
          </small>
        </div>

        <div>
          <h3>主题选择</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {(['light', 'dark', 'gradient'] as const).map((t) => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="radio"
                  name="theme"
                  value={t}
                  checked={theme === t}
                  onChange={(e) => setTheme(e.target.value as any)}
                />
                <span style={{ textTransform: 'capitalize' }}>{t}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 示例展示 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '30px',
        justifyItems: 'center'
      }}>
        {/* 实时时钟 */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>实时时钟</h3>
          <CardClock
            formatOptions={formatOptions}
            theme={theme}
            title="实时数字时钟"
            animated={true}
          />
        </div>

        {/* 自定义日期时钟 */}
        {customDate && (
          <div>
            <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>自定义日期</h3>
            <CardClock
              customDate={customDate}
              formatOptions={formatOptions}
              theme={theme}
              title="自定义时钟"
              animated={true}
            />
          </div>
        )}

        {/* 预设示例 */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>简洁模式</h3>
          <CardClock
            formatOptions={{
              showTime: true,
              showWeekday: true,
            }}
            theme="light"
            title="简洁时钟"
            animated={false}
          />
        </div>

        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>完整信息</h3>
          <CardClock
            formatOptions={{
              showFullDate: true,
              showYearMonth: true,
              showTime: true,
              showWeekday: true,
              showWeekNumber: true,
            }}
            theme="dark"
            title="完整信息时钟"
            animated={true}
          />
        </div>
      </div>

      {/* 使用说明 */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#e8f4fd',
        borderRadius: '12px',
        borderLeft: '4px solid #007acc'
      }}>
        <h3>使用说明</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>日期格式配置</strong>：通过 formatOptions 控制显示哪些日期信息</li>
          <li><strong>自定义日期</strong>：支持 yyyy-mm-dd 和 YYYY-MM 两种格式</li>
          <li><strong>主题切换</strong>：提供 light、dark、gradient 三种主题</li>
          <li><strong>动画效果</strong>：可通过 animated 属性控制是否启用动画</li>
          <li><strong>实时更新</strong>：未设置自定义日期时，每秒自动更新时间</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * 获取格式选项的中文标签
 */
const getFormatLabel = (key: string): string => {
  const labels: Record<string, string> = {
    showFullDate: '显示完整日期 (yyyy-mm-dd)',
    showYearMonth: '显示年月 (YYYY-MM)',
    showTime: '显示时分秒',
    showWeekday: '显示星期几',
    showWeekNumber: '显示当前周数',
  };
  return labels[key] || key;
};

export default CardClockExample;