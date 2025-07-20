import { createVNode, render, getCurrentInstance } from "vue";

/**
 * 在 tk-article div 内、main 前，插入组件实例
 * @param {Object} options
 * @param {HTMLElement} options.targetParent - `.tk-article > div` 容器
 * @param {Object} options.component - 要插入的组件
 * @param {Object} [options.props] - 组件 props
 * @returns {Function} - cleanup 函数，销毁组件节点
 */
export function insertComponent({ targetParent, component, props = {} }) {
  const vnode = createVNode(component, props);
  const internal = getCurrentInstance();
  if (internal) vnode.appContext = internal.appContext;
  
  const placeholder = document.createElement("div");
  placeholder.className="w-full"
  targetParent.insertBefore(placeholder, targetParent.querySelector(".main"));
  
  render(vnode, placeholder);
  
  return () => {
    render(null, placeholder);
    placeholder.remove();
  };
}