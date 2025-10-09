declare module 'pinyinjs' {
	interface PinyinJS {
		getFullChars: (str: string) => string;
		getCamelChars: (str: string) => string;
	}

	const pinyin: PinyinJS;
	export default pinyin;
}

// 为可能的动态导入添加声明
declare module 'pinyinjs' {
	interface PinyinJS {
		getFullChars: (str: string) => string;
		getCamelChars: (str: string) => string;
	}

	const pinyin: PinyinJS;
	export = pinyin;
}
