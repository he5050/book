import react from '@vitejs/plugin-react'; // React 插件
import path from 'path';
import unocss from 'unocss/vite';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import unoConfig from './uno.config';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import { withMermaid } from 'vitepress-plugin-mermaid'; // ✅ 新增 Mermaid 插件

// Teek 主题配置
const teekConfig = defineTeekConfig({
	author: { name: 'he5050', link: 'https://github.com/he5050' },
	footerInfo: {
		theme: { name: 'Theme By Teek' },
		copyright: { createYear: 2024, suffix: 'LanLan' },
		customHtml: `<span id="runtime"></span>`
	},
	codeBlock: {
		copiedDone: TkMessage => TkMessage.success('复制成功！')
	},
	post: { showCapture: true },
	articleShare: { enabled: true },
	vitePlugins: {
		autoFrontmatter: true,
		permalinkOption: {
			ignoreList: ['.vitepress', 'sh', 'types', 'example', '.git', '.github', '.vscode']
		},
		sidebarOption: {
			ignoreList: ['.vitepress', 'sh', 'types', 'example', '.git', '.github', '.vscode'],
			initItems: false
		}
	},
	markdown: {
		demo: {
			githubUrl: 'https://github.com/he5050/book/tree/main/.scripts'
		}
	}
});

// ✅ 用 withMermaid 包裹
export default withMermaid(
	defineConfig({
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
			['meta', { property: 'og:description', content: '个人笔记' }],
			['meta', { name: 'description', content: '个人笔记' }],
			['meta', { name: 'author', content: 'Teek' }]
		],
		markdown: {
			config(md) {
				md.use(vitepressDemoPlugin, {
					demoDir: path.resolve(__dirname, '../example/components')
				});
			}
		},
		vite: {
			plugins: [react(), unocss(unoConfig), codeInspectorPlugin({ bundler: 'vite' })],
			optimizeDeps: {
				include: ['mermaid'] // ✅ Mermaid 需要
			}
		},
		themeConfig: {
			logo: '/teek-logo-mini.svg',
			darkModeSwitchLabel: '主题',
			sidebarMenuLabel: '菜单',
			returnToTopLabel: '返回顶部',
			lastUpdatedText: '上次更新时间',
			outline: { level: [2, 6], label: '当前目录' },
			docFooter: { prev: '上一页', next: '下一页' },
			nav: [
				{ text: '首页', link: '/' },
				{ text: '笔记', link: '/notes', activeMatch: '/01.笔记/' },
				{ text: '工具', link: '/tools', activeMatch: '/03.工具/' },
				{ text: '小朋友专用', link: '/wawa', activeMatch: '/09.字贴/' }
			],
			socialLinks: [{ icon: 'github', link: 'https://github.com/he5050/book' }],
			search: { provider: 'local' }
		},

		// ✅ Mermaid 配置项
		mermaid: {
			theme: 'default', // 可选 "dark" | "forest" | "neutral"
			securityLevel: 'loose',
			themeVariables: {
				primaryColor: '#42b883',
				primaryTextColor: '#333333',
				lineColor: '#666666'
			}
		}
	})
);
