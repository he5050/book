import path from 'path';
import unocss from 'unocss/vite';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import unoConfig from './uno.config';
// Teek 主题配置
const teekConfig = defineTeekConfig({});

export default defineConfig({
	extends: teekConfig,
	title: '点滴',
	description: '点滴-笔记',
	markdown: {
		config(md) {
			md.use(vitepressDemoPlugin, {
				demoDir: path.resolve(__dirname, '../.scripts/components')
			});
		}
	},
	vite: {
		plugins: [unocss(unoConfig)],
		css: {
			preprocessorOptions: {
				// scss: {
				// 	additionalData: `@use './styles/index.scss' as *;` // 全局SCSS变量
				// }
			}
		}
	}
});
