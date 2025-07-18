// docs/.vitepress/image-error-handler.ts

/**
 * 替换加载失败的图片为 CDN 镜像地址
 */
function handleImageError(img: HTMLImageElement) {
    const originalSrc = img.getAttribute("data-original-src") || img.src;
  
    if (img.dataset.errorHandled) return;
  
    img.dataset.errorHandled = "true";
    img.setAttribute("data-original-src", originalSrc);
  
    img.src = `https://cdn.cdnjson.com/pic.html?url=${encodeURIComponent(originalSrc)}`;
  }
  
  /**
   * 初始化监听所有 img 元素
   */
  function initImageErrorHandler() {
    const imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
      img.addEventListener("error", () => handleImageError(img as HTMLImageElement));
    });
  }
  
  /**
   * 监听 DOM 新增的 img 元素
   */
  function observeNewImages() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            node.addEventListener("error", () => handleImageError(node));
          } else if (node instanceof HTMLElement) {
            const imgs = node.querySelectorAll("img");
            imgs.forEach((img) => {
              img.addEventListener("error", () => handleImageError(img));
            });
          }
        });
      });
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
  
  export function setupImageErrorPatch() {
    if (typeof window !== "undefined") {
        initImageErrorHandler();
        observeNewImages();
    }
  }