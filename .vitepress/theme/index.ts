import 'uno.css';
import Teek from 'vitepress-theme-teek';
import { onMounted } from 'vue';
import 'vitepress-theme-teek/index.css';
import '../styles/public.scss';
import 'vitepress-theme-teek/theme-chalk/tk-code-block-mobile.css';
import 'vitepress-theme-teek/theme-chalk/tk-sidebar.css';
import 'vitepress-theme-teek/theme-chalk/tk-nav.css';
import 'vitepress-theme-teek/theme-chalk/tk-aside.css';
import 'vitepress-theme-teek/theme-chalk/tk-doc-h1-gradient.css';
import 'vitepress-theme-teek/theme-chalk/tk-table.css';
import 'vitepress-theme-teek/theme-chalk/tk-mark.css';
import 'vitepress-theme-teek/theme-chalk/tk-blockquote.css';
import 'vitepress-theme-teek/theme-chalk/tk-index-rainbow.css';
import 'vitepress-theme-teek/theme-chalk/tk-doc-fade-in.css';
import 'vitepress-theme-teek/theme-chalk/tk-banner-desc-gradient.css';
import TipsBoxInfo from './TipsBoxInfo.vue';

import { setupImageErrorPatch } from '../tools/image-error-handler';
import { setupInitBG } from '../tools/init-bg';
import { insertComponent } from './insertComponent';
export default {
	extends: Teek,
	markdown: {
		// 开启行号
		lineNumbers: true,
		image: {
			// 默认禁用；设置为 true 可为所有图片启用懒加载。
			lazyLoading: true
		},
		// 更改容器默认值标题
		container: {
			tipLabel: '提示',
			warningLabel: '警告',
			dangerLabel: '危险',
			infoLabel: '信息',
			detailsLabel: '详细信息'
		}
	},
	setup() {
		onMounted(() => {
			setupImageErrorPatch();
			setupInitBG();

			// Insert TipsBoxInfo component into tk-article-analyze element
			const insertTipsBoxInfo = () => {
				// Find the target element
				const targetElement = document.querySelector('.tk-article-analyze');
				if (targetElement) {
					// Insert the TipsBoxInfo component
					insertComponent({
						targetParent: targetElement,
						component: TipsBoxInfo,
						props: {}
					});

					console.log('TipsBoxInfo component inserted successfully');
				} else {
					// If the target element doesn't exist yet, try again after a short delay
					console.log('Target element .tk-article-analyze not found, retrying...');
					setTimeout(insertTipsBoxInfo, 500);
				}
			};

			// Start the insertion process with a slight delay to ensure DOM is ready
			setTimeout(insertTipsBoxInfo, 100);
		});
	}
};
