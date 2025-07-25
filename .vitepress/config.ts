import react from '@vitejs/plugin-react'; // 添加 React 插件
import path from 'path';
import unocss from 'unocss/vite';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import unoConfig from './uno.config';
import { codeInspectorPlugin } from 'code-inspector-plugin';
// Teek 主题配置
const teekConfig = defineTeekConfig({
	author: { name: 'he5050', link: 'https://github.com/he5050' },
	footerInfo: {
		theme: {
			name: `Theme By Teek`
		},
		copyright: {
			createYear: 2024,
			suffix: 'LanLan'
		},
		customHtml: `<span id="runtime"></span>`
	},
	codeBlock: {
		copiedDone: TkMessage => TkMessage.success('复制成功！')
	},
	post: {
		showCapture: true
	},
	articleShare: { enabled: true },
	vitePlugins: {
		sidebarOption: {
			initItems: false
		}
	},
	markdown: {
		demo: {
			githubUrl: 'https://github.com/he5050/book/tree/main/.scripts'
		}
	}
});

export default defineConfig({
	extends: teekConfig,
	title: '点滴',
	description: '点滴-笔记',
	lastUpdated: true,
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/teek-logo-mini.svg' }],
		['link', { rel: 'icon', type: 'image/png', href: '/teek-logo-mini.png' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:locale', content: 'zh-CN' }],
		['meta', { property: 'og:title', content: 'LanLan |  点滴' }],
		['meta', { property: 'og:site_name', content: ' LanLan |  点滴' }],
		['meta', { property: 'og:image', content: '' }],
		['meta', { property: 'og:url', content: '' }],
		['meta', { property: 'og:description', content: '个人笔记' }],
		['meta', { name: 'description', content: '个人笔记' }],
		['meta', { name: 'author', content: 'Teek' }],
		[
			'meta',
			{
				name: 'viewport',
				content:
					'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
			}
		],

		['meta', { name: 'keywords', content: '个人笔记' }],
		['script', { charset: 'UTF-8', id: 'sohu', src: '//pv.sohu.com/cityjson?ie=utf-8' }], 
		['script', { charset: 'UTF-8', id: 'qq', src: '//vv.video.qq.com/checktime?otype=json' }], 
	],
	markdown: {
		config(md) {
			md.use(vitepressDemoPlugin, {
				demoDir: path.resolve(__dirname, '../example/components')
			});
		}
	},
	vite: {
		plugins: [react(), unocss(unoConfig), codeInspectorPlugin({
			bundler: 'vite',
		  }),], // 注入 react 插件
		css: {
			preprocessorOptions: {
				// scss: {
				// 	additionalData: `@use '../styles/index.scss' as *;` // 全局SCSS变量
				// }
			}
		}
	},
	themeConfig: {
		logo: '/teek-logo-mini.svg',
		darkModeSwitchLabel: '主题',
		sidebarMenuLabel: '菜单',
		returnToTopLabel: '返回顶部',
		lastUpdatedText: '上次更新时间',
		outline: {
			level: [2, 6],
			label: '当前目录'
		},
		docFooter: {
			prev: '上一页',
			next: '下一页'
		},
		nav: [
			{ text: '首页', link: '/' },
			{
				text: '笔记',
				link: '/notes/typed',
				activeMatch: '/01.笔记/'
			},
			{
				text: '工具',
				link: '/tools/resource',
				activeMatch: '/03.工具/'
			},
			{
				text: '小朋友专用',
				link: '/wawa/resource',
				activeMatch: '/09.字贴/'
			}
		],
		socialLinks: [{ icon: 'github', link: 'https://github.com/he5050/book' }],
		search: {
			provider: 'local'
		}
	}
});
