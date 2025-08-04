import { useEffect, useRef, useState, useCallback } from 'react';

// 自定义 Hook：useMutationObserver
export const useMutationObserver = (
  callback: MutationCallback,
  options: MutationObserverInit = {}
) => {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new MutationObserver(callback);
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      ...options,
    });

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return targetRef;
};

// DOM 变化监控组件
const DOMChangeTracker = () => {
  const [mutations, setMutations] = useState<string[]>([]);
  const [itemCount, setItemCount] = useState(0);

  const handleMutation = useCallback((mutationsList: MutationRecord[]) => {
    const newMutations: string[] = [];
    
    mutationsList.forEach((mutation) => {
      const timestamp = new Date().toLocaleTimeString();
      
      switch (mutation.type) {
        case 'childList':
          if (mutation.addedNodes.length > 0) {
            newMutations.push(`[${timestamp}] 添加了 ${mutation.addedNodes.length} 个子节点`);
          }
          if (mutation.removedNodes.length > 0) {
            newMutations.push(`[${timestamp}] 删除了 ${mutation.removedNodes.length} 个子节点`);
          }
          break;
        case 'attributes':
          newMutations.push(`[${timestamp}] 属性 "${mutation.attributeName}" 发生变化`);
          break;
        case 'characterData':
          newMutations.push(`[${timestamp}] 文本内容发生变化`);
          break;
      }
    });

    setMutations(prev => [...newMutations, ...prev].slice(0, 10));
  }, []);

  const targetRef = useMutationObserver(handleMutation, {
    childList: true,
    attributes: true,
    subtree: true,
  });

  const addItem = () => {
    const newCount = itemCount + 1;
    setItemCount(newCount);
  };

  const removeItem = () => {
    if (itemCount > 0) {
      setItemCount(itemCount - 1);
    }
  };

  const changeStyle = () => {
    const element = targetRef.current;
    if (element) {
      const colors = ['#ffebee', '#e8f5e8', '#e3f2fd', '#fff3e0'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      element.style.backgroundColor = randomColor;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h4>DOM 操作区域</h4>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={addItem} style={{ marginRight: '10px', padding: '5px 10px' }}>
            添加项目
          </button>
          <button onClick={removeItem} style={{ marginRight: '10px', padding: '5px 10px' }}>
            删除项目
          </button>
          <button onClick={changeStyle} style={{ padding: '5px 10px' }}>
            改变样式
          </button>
        </div>
        
        <div
          ref={targetRef}
          style={{
            border: '2px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            minHeight: '200px',
            backgroundColor: '#f9f9f9',
            transition: 'background-color 0.3s ease',
          }}
        >
          <h5>监控目标区域</h5>
          {Array.from({ length: itemCount }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '8px',
                margin: '5px 0',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
              }}
            >
              项目 #{i + 1}
            </div>
          ))}
          {itemCount === 0 && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              点击按钮添加项目或改变样式
            </p>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h4>变化日志</h4>
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            height: '300px',
            overflow: 'auto',
            backgroundColor: '#f8f9fa',
            fontSize: '12px',
          }}
        >
          {mutations.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              暂无 DOM 变化记录
            </p>
          ) : (
            mutations.map((mutation, index) => (
              <div
                key={index}
                style={{
                  padding: '4px 0',
                  borderBottom: index < mutations.length - 1 ? '1px solid #eee' : 'none',
                  color: '#333',
                }}
              >
                {mutation}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setMutations([])}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          清空日志
        </button>
      </div>
    </div>
  );
};

// 内容变化监控组件
const ContentChangeTracker = () => {
  const [content, setContent] = useState('这是一段可编辑的文本内容');
  const [changes, setChanges] = useState<string[]>([]);

  const handleMutation = useCallback((mutationsList: MutationRecord[]) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'characterData') {
        const timestamp = new Date().toLocaleTimeString();
        const newValue = mutation.target.textContent || '';
        const oldValue = mutation.oldValue || '';
        setChanges(prev => [
          `[${timestamp}] 文本从 "${oldValue}" 改为 "${newValue}"`,
          ...prev
        ].slice(0, 5));
      }
    });
  }, []);

  const targetRef = useMutationObserver(handleMutation, {
    characterData: true,
    characterDataOldValue: true,
    subtree: true,
  });

  return (
    <div>
      <h4>文本内容变化监控</h4>
      <div
        ref={targetRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          minHeight: '100px',
          backgroundColor: 'white',
          marginBottom: '10px',
        }}
        onInput={(e) => {
          setContent(e.currentTarget.textContent || '');
        }}
      >
        {content}
      </div>
      
      <div style={{ fontSize: '12px', color: '#666' }}>
        <strong>变化记录：</strong>
        {changes.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>编辑上方文本查看变化记录</p>
        ) : (
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {changes.map((change, index) => (
              <li key={index} style={{ margin: '2px 0' }}>{change}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const MutationObserverDemo = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>MutationObserver 示例</h2>
      
      <section style={{ marginBottom: '40px' }}>
        <h3>1. DOM 结构变化监控</h3>
        <p>监控 DOM 节点的添加、删除和属性变化：</p>
        <DOMChangeTracker />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>2. 文本内容变化监控</h3>
        <p>监控可编辑元素的文本内容变化：</p>
        <ContentChangeTracker />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3>使用场景说明</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>表单验证：</strong>监控表单字段的变化，实时进行验证</li>
            <li><strong>内容编辑器：</strong>监控富文本编辑器的内容变化</li>
            <li><strong>动态内容加载：</strong>监控第三方脚本动态添加的内容</li>
            <li><strong>UI 组件库：</strong>监控组件内部 DOM 结构的变化</li>
            <li><strong>调试工具：</strong>开发工具中监控页面 DOM 的实时变化</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default MutationObserverDemo;