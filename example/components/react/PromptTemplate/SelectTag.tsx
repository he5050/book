import React, { useState, useEffect } from 'react';
import { useSlateStatic, useFocused, useSelected } from 'slate-react';
import { Transforms } from 'slate';
import type { CustomEditor, SelectTagElement } from './types';

interface SelectTagProps {
  element: SelectTagElement;
  attributes: any;
  children: React.ReactNode;
}

const SelectTag: React.FC<SelectTagProps> = ({ element, attributes, children }) => {
  const [selectedValue, setSelectedValue] = useState(element.value || element.options[0]?.value);
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  // 当元素值变化时更新
  useEffect(() => {
    if (element.value) {
      setSelectedValue(element.value);
    }
  }, [element.value]);

  // 选择变化时触发
  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    
    // 更新slate编辑器中的节点
    const path = ReactEditor.findPath(editor as any, element);
    Transforms.setNodes(editor, { value } as Partial<SelectTagElement>, { at: path });
  };

  return (
    <div 
      {...attributes} 
      data-slate-inline="true" 
      className={`select-tag ${selected && focused ? 'highlight' : ''}`}
      contentEditable={false}
    >
      <select 
        value={selectedValue} 
        onChange={onSelectChange} 
        className="custom-select"
      >
        {element.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {children}
    </div>
  );
};

// 添加ReactEditor导入
import { ReactEditor } from 'slate-react';

export default SelectTag;