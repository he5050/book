import React, { useState, useEffect } from 'react';
import { pinyin } from 'pinyin-pro';
import './pinyin-converter.scss';

// 动态导入 pinyinjs，避免在模块加载时就执行可能导致错误的代码
let pinyinjs: any = null;
try {
	pinyinjs = require('pinyinjs');
} catch (e) {
	console.warn('pinyinjs 加载失败:', e);
}

interface PinyinConverterProps {
	text?: string;
	mode?: 'initial' | 'full' | 'tone';
	library?: 'localeCompare' | 'pinyin-pro' | 'pinyinjs';
	useUpperCase?: boolean;
	className?: string;
}

/**
 * 获取汉字的拼音首字母
 * @param chineseChar 中文字符串，若传入多字符则只取第一个字符
 * @param useUpperCase 是否返回大写字母，默认为false（小写）
 * @returns 拼音首字母，若无法识别则返回空字符串
 */
export const getTheFirstLetterForPinyin = (
	chineseChar: string = '',
	useUpperCase: boolean = false
): string => {
	// 兼容性检查：确保浏览器支持 localeCompare 方法
	if (!String.prototype.localeCompare) {
		return '';
	}

	// 参数验证：确保输入为有效字符串
	if (typeof chineseChar !== 'string' || !chineseChar.length) {
		return '';
	}

	// 准备用于比较的字母表和基准汉字
	// 注：这些基准汉字分别对应A、B、C...等拼音首字母的起始位置
	const letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('');
	const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');

	let firstLetter = '';
	const firstChar = chineseChar[0];

	// 处理字母和数字：直接返回原字符
	if (/^\w/.test(firstChar)) {
		firstLetter = firstChar;
	} else {
		// 处理汉字：通过比较确定拼音首字母范围
		letters.some((item, index) => {
			// 检查当前字符是否在当前基准汉字与下一个基准汉字之间
			if (
				firstChar.localeCompare(zh[index]) >= 0 &&
				(index === letters.length - 1 || firstChar.localeCompare(zh[index + 1]) < 0)
			) {
				firstLetter = item;
				return true;
			}
			return false;
		});
	}

	// 根据参数决定返回大写还是小写字母
	return useUpperCase ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
};

const PinyinConverter: React.FC<PinyinConverterProps> = ({
	text = '',
	mode = 'initial',
	library = 'pinyin-pro',
	useUpperCase = false,
	className = ''
}) => {
	const [result, setResult] = useState<string>('');

	useEffect(() => {
		let convertedText = '';

		switch (library) {
			case 'localeCompare':
				// 使用 localeCompare 方式
				if (mode === 'initial') {
					convertedText = text
						.split('')
						.map(char => getTheFirstLetterForPinyin(char, useUpperCase))
						.join('');
				} else {
					// localeCompare 方式不支持完整拼音和带音调拼音
					convertedText = '不支持该模式';
				}
				break;

			case 'pinyin-pro':
				// 使用 pinyin-pro 库
				try {
					switch (mode) {
						case 'initial':
							convertedText = pinyin(text, { pattern: 'first', toneType: 'none' });
							break;
						case 'full':
							convertedText = pinyin(text, { toneType: 'none' });
							break;
						case 'tone':
							convertedText = pinyin(text, { toneType: 'symbol' });
							break;
					}

					if (useUpperCase) {
						convertedText = convertedText.toUpperCase();
					}
				} catch (error) {
					convertedText = '转换出错: ' + (error as Error).message;
				}
				break;

			case 'pinyinjs':
				// 使用 pinyinjs 库
				if (!pinyinjs) {
					convertedText = 'pinyinjs库加载失败';
					break;
				}

				try {
					switch (mode) {
						case 'initial':
							convertedText = pinyinjs.getCamelChars(text);
							break;
						case 'full':
							convertedText = pinyinjs.getFullChars(text);
							break;
						case 'tone':
							// pinyinjs 不支持音调标注
							convertedText = pinyinjs.getFullChars(text);
							break;
					}

					if (useUpperCase) {
						convertedText = convertedText.toUpperCase();
					}
				} catch (error) {
					convertedText = '转换出错: ' + (error as Error).message;
				}
				break;
		}

		setResult(convertedText);
	}, [text, mode, library, useUpperCase]);

	return (
		<div className={`pinyin-converter ${className}`}>
			<div className="pinyin-result">{result}</div>
		</div>
	);
};

export default PinyinConverter;
