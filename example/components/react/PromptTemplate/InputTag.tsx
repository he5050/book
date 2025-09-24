import React, { useRef, useEffect, useState } from 'react';
import { useFocused, useSelected } from 'slate-react';

interface InputTagProps {
  element: {
    label: string;
    children: Array<{ text: string }>;
  };
  attributes: any;
  children: React.ReactNode;
}

const InputTag: React.FC<InputTagProps> = ({ element, attributes, children }) => {
  const measureLabelRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [measureWidth, setMeasureWidth] = useState<string>('auto');
  const [showLabel, setShowLabel] = useState(true);
  const [labelWidth, setLabelWidth] = useState('auto');
  const selected = useSelected();
  const focused = useFocused();

  // 测量标签宽度
  useEffect(() => {
    if (measureLabelRef.current && element.label) {
      const width = measureLabelRef.current.offsetWidth + 24;
      setMeasureWidth(`${width}px`);
    }
  }, [element.label]);

  // 监听子节点文本内容变化
  useEffect(() => {
    const textContent = element.children
      .map(child => child.text)
      .join('')
      .replace(/\uFEFF/g, ''); // 移除零宽空格

    const isEmpty = textContent.trim() === '';
    setShowLabel(isEmpty);

    // 有内容时重置宽度为 auto
    if (!isEmpty) {
      setLabelWidth('auto');
    } else {
      setLabelWidth(measureWidth);
    }
  }, [element.children, measureWidth]);

  return (
    <span 
      {...attributes} 
      ref={containerRef}
      data-slate-inline="true" 
      className={`input-tag ${selected && focused ? 'highlight' : ''}`}
      style={{ minWidth: labelWidth }}
    >
      {/* 测量元素 */}
      <span ref={measureLabelRef} className="measure-label">{element.label}</span>

      {/* 标签部分 - 只在没有内容时显示 */}
      {showLabel && (
        <div contentEditable={false} className="label-placeholder">
          <div className="placeholder">{element.label}</div>
        </div>
      )}

      {/* 可编辑区域 */}
      <span className="editable-content">{children}</span>
    </span>
  );
};

export default InputTag;