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
	mode?: 'initial' | 'full' | 'tone' | 'annotated' | 'phonetic';
	library?: 'localeCompare' | 'pinyin-pro' | 'pinyinjs';
	useUpperCase?: boolean;
	className?: string;
	showAnnotated?: boolean;
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

// 常用汉字拼音映射表（带声调）
const chinesePinyinMap: { [key: string]: string } = {
	// 基础词汇
	你: 'nǐ',
	好: 'hǎo',
	世: 'shì',
	界: 'jiè',
	旁: 'páng',
	边: 'biān',
	学: 'xué',
	习: 'xí',
	汉: 'hàn',
	语: 'yǔ',
	拼: 'pīn',
	音: 'yīn',
	春: 'chūn',
	天: 'tiān',
	来: 'lái',
	了: 'le',

	// 四声示例
	妈: 'mā',
	麻: 'má',
	马: 'mǎ',
	骂: 'mà',

	// 常用字符
	中: 'zhōng',
	国: 'guó',
	人: 'rén',
	大: 'dà',
	小: 'xiǎo',
	上: 'shàng',
	下: 'xià',
	左: 'zuǒ',
	右: 'yòu',
	前: 'qián',
	后: 'hòu',
	里: 'lǐ',
	外: 'wài',
	东: 'dōng',
	西: 'xī',
	南: 'nán',
	北: 'běi',
	一: 'yī',
	二: 'èr',
	三: 'sān',
	四: 'sì',
	五: 'wǔ',
	六: 'liù',
	七: 'qī',
	八: 'bā',
	九: 'jiǔ',
	十: 'shí',
	年: 'nián',
	月: 'yuè',
	日: 'rì',
	分: 'fēn',
	秒: 'miǎo',
	今: 'jīn',
	昨: 'zuó',
	早: 'zǎo',
	晚: 'wǎn',
	午: 'wǔ',
	夜: 'yè',
	家: 'jiā',
	校: 'xiào',
	老: 'lǎo',
	师: 'shī',
	同: 'tóng',
	朋: 'péng',
	友: 'yǒu',
	爱: 'ài',
	喜: 'xǐ',
	欢: 'huān',
	快: 'kuài',
	乐: 'lè',
	高: 'gāo',
	兴: 'xìng',
	开: 'kāi',
	心: 'xīn',
	美: 'měi',
	丽: 'lì',
	漂: 'piào',
	亮: 'liàng',
	聪: 'cōng',
	智: 'zhì',
	慧: 'huì'
};

/**
 * 获取汉字的带声调拼音（备用方案）
 * @param char 汉字
 * @returns 带声调的拼音
 */
const getManualPinyin = (char: string): string => {
	const result = chinesePinyinMap[char] || char;
	console.log(
		`备用映射查询 - 字符: ${char}, 映射结果: ${result}, 是否在映射表中: ${char in chinesePinyinMap}`
	);
	return result;
};

/**
 * 根据拼音声调获取对应的CSS类名
 * @param pinyinText 拼音文本
 * @returns 对应声调的CSS类名
 */
const getToneClass = (pinyinText: string): string => {
	// 第一声（ā, ē, ī, ō, ū, ǖ）：蓝色
	if (/[āēīōūǖ]/.test(pinyinText)) {
		return 'tone-1';
	}
	// 第二声（á, é, í, ó, ú, ǘ）：绿色
	if (/[áéíóúǘ]/.test(pinyinText)) {
		return 'tone-2';
	}
	// 第三声（ǎ, ě, ǐ, ǒ, ǔ, ǚ）：橙色
	if (/[ǎěǐǒǔǚ]/.test(pinyinText)) {
		return 'tone-3';
	}
	// 第四声（à, è, ì, ò, ù, ǜ）：红色
	if (/[àèìòùǜ]/.test(pinyinText)) {
		return 'tone-4';
	}
	// 轻声或无声调：灰色
	return 'tone-neutral';
};

// 注音显示组件
const AnnotatedText: React.FC<{ text: string; pinyinArray: string[] }> = ({
	text,
	pinyinArray
}) => {
	return (
		<div className="annotated-text">
			{text.split('').map((char, index) => (
				<span key={index} className="annotated-char">
					<span className="pinyin-annotation">{pinyinArray[index] || ''}</span>
					<span className="chinese-char">{char}</span>
				</span>
			))}
		</div>
	);
};

// 音标显示组件
const PhoneticText: React.FC<{ text: string; pinyinArray: string[] }> = ({ text, pinyinArray }) => {
	return (
		<div className="phonetic-text">
			{text.split('').map((char, index) => {
				const pinyinText = pinyinArray[index] || '';
				const toneClass = getToneClass(pinyinText);

				// 调试信息（可以在浏览器控制台查看）
				console.log(`字符: ${char}, 拼音: ${pinyinText}, 声调类: ${toneClass}`);

				return (
					<span key={index} className="phonetic-char">
						<span className={`pinyin-phonetic ${toneClass}`}>{pinyinText}</span>
						<span className="chinese-char-phonetic">{char}</span>
					</span>
				);
			})}
		</div>
	);
};

const PinyinConverter: React.FC<PinyinConverterProps> = ({
	text = '',
	mode = 'initial',
	library = 'pinyin-pro',
	useUpperCase = false,
	className = '',
	showAnnotated = false
}) => {
	const [result, setResult] = useState<string>('');
	const [pinyinArray, setPinyinArray] = useState<string[]>([]);

	useEffect(() => {
		let convertedText = '';
		let pinyinResults: string[] = [];

		// 如果是注音模式或音标模式，获取每个字符的拼音
		if (mode === 'annotated' || mode === 'phonetic' || showAnnotated) {
			try {
				if (library === 'pinyin-pro') {
					// 为每个字符获取拼音
					pinyinResults = text.split('').map(char => {
						if (/^\w/.test(char)) {
							return char;
						}
						// 根据模式获取拼音
						const toneType = mode === 'phonetic' ? 'symbol' : 'none';
						const result = pinyin(char, { toneType });
						return result;
					});
				}
			} catch (error) {
				console.error('注音获取失败:', error);
				pinyinResults = [];
			}
		}

		switch (library) {
			case 'localeCompare':
				// 使用 localeCompare 方式
				if (mode === 'initial') {
					convertedText = text
						.split('')
						.map(char => getTheFirstLetterForPinyin(char, useUpperCase))
						.join('');
				} else if (mode === 'annotated') {
					convertedText = '不支持该模式';
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
						case 'annotated':
							convertedText = pinyin(text, { toneType: 'none' });
							break;
						case 'phonetic':
							convertedText = pinyin(text, { toneType: 'symbol' });
							break;
					}

					if (useUpperCase && mode !== 'annotated' && mode !== 'phonetic') {
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
						case 'annotated':
							convertedText = '不支持该模式';
							break;
						case 'phonetic':
							convertedText = '不支持该模式';
							break;
					}

					if (useUpperCase && mode !== 'annotated' && mode !== 'phonetic') {
						convertedText = convertedText.toUpperCase();
					}
				} catch (error) {
					convertedText = '转换出错: ' + (error as Error).message;
				}
				break;
		}

		setResult(convertedText);
		setPinyinArray(pinyinResults);
	}, [text, mode, library, useUpperCase, showAnnotated]);

	return (
		<div className={`pinyin-converter ${className}`}>
			{mode === 'phonetic' ? (
				<PhoneticText text={text} pinyinArray={pinyinArray} />
			) : mode === 'annotated' || showAnnotated ? (
				<AnnotatedText text={text} pinyinArray={pinyinArray} />
			) : (
				<div className="pinyin-result">{result}</div>
			)}
		</div>
	);
};

export default PinyinConverter;
