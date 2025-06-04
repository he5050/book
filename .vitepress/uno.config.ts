import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup
} from 'unocss';

export default defineConfig({
	theme: {
		fontSize: {
			icon: '1.125rem',
			'icon-large': '1.5rem',
			'icon-small': '1rem',
			'icon-xl': '2rem',
			'icon-xs': '0.875rem'
		}
	},
	content: {
		pipeline: {
			exclude: ['node_modules', 'dist']
		}
	},
	transformers: [transformerDirectives(), transformerVariantGroup()],
	presets: [
		presetWind3({ dark: 'class' }), // 基础原子类预设
		presetAttributify(), // 支持属性模式（如 text="red-500"）
		presetIcons() // 使用图标（如 i-heroicons-home）
	],
	shortcuts: [
		{
			'flex-center': 'flex justify-center items-center',
			'hw-full': 'h-full w-full',
			'hw-auto': 'h-auto w-auto',
			'hw-100': 'h-100 w-100',
			'hw-1/2': 'h-1/2 w-1/2',
			'bg-img-cover': 'bg-cover bg-center bg-no-repeat',
			'bg-img-contain': 'bg-contain bg-center bg-no-repeat',
			btn: 'px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'
		},
		{
			'bg-glass': 'bg-[rgba(255,255,255,0.92)]',
			'shadow-card': 'shadow-[0px_8px_24px_8px_rgba(0,0,0,0.08)]'
		},
		{
			'flex-1-hidden': 'flex-1 overflow-hidden',
			'flex-center': 'flex justify-center items-center',
			'flex-col': 'flex flex-col',
			'flex-col-center': 'flex-center flex-col',
			'flex-col-stretch': 'flex-col items-stretch',
			'flex-x-center': 'flex justify-center',
			'flex-y-center': 'flex items-center',
			'i-flex-center': 'inline-flex justify-center items-center',
			'i-flex-col': 'flex-col inline-flex',
			'i-flex-col-center': 'flex-col i-flex-center',
			'i-flex-col-stretch': 'i-flex-col items-stretch',
			'i-flex-x-center': 'inline-flex justify-center',
			'i-flex-y-center': 'inline-flex items-center'
		},
		{
			'absolute-bl': 'absolute-lb',
			'absolute-br': 'absolute-rb',
			'absolute-center': 'absolute-lt flex-center size-full',
			'absolute-lb': 'absolute left-0 bottom-0',
			'absolute-lt': 'absolute left-0 top-0',
			'absolute-rb': 'absolute right-0 bottom-0',
			'absolute-rt': 'absolute right-0 top-0',
			'absolute-tl': 'absolute-lt',
			'absolute-tr': 'absolute-rt',
			'fixed-bl': 'fixed-lb',
			'fixed-br': 'fixed-rb',
			'fixed-center': 'fixed-lt flex-center size-full',
			'fixed-lb': 'fixed left-0 bottom-0',
			'fixed-lt': 'fixed left-0 top-0',
			'fixed-rb': 'fixed right-0 bottom-0',
			'fixed-rt': 'fixed right-0 top-0',
			'fixed-tl': 'fixed-lt',
			'fixed-tr': 'fixed-rt'
		},
		{
			'ellipsis-text': 'nowrap-hidden text-ellipsis',
			'nowrap-hidden': 'overflow-hidden whitespace-nowrap'
		}
	]
});
