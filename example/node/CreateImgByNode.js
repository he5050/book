// 如何用 Node.JS 和 Canvas 自动生成图片
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // 用于图像格式转换和优化

// 注册字体 - 实际使用时需要确保这些字体文件存在
// 如果没有这些字体文件，请下载或使用系统可用的字体
try {
	// 注册字体路径 - 实际使用时请修改为你的字体路径
	GlobalFonts.registerFromPath(path.join(__dirname, 'fonts/Inter-ExtraBold.ttf'), 'InterBold');
	GlobalFonts.registerFromPath(path.join(__dirname, 'fonts/Inter-Medium.ttf'), 'InterMedium');
	GlobalFonts.registerFromPath(path.join(__dirname, 'fonts/Apple-Emoji.ttf'), 'AppleEmoji');
	console.log('字体注册成功');
} catch (error) {
	console.log('字体注册失败，将使用系统默认字体', error);
}

/**
 * 文本自动换行函数
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {string} text - 需要换行的文本
 * @param {number} x - 文本起始 x 坐标
 * @param {number} y - 文本起始 y 坐标
 * @param {number} maxWidth - 最大宽度
 * @param {number} lineHeight - 行高
 * @returns {Array} - 包含每行文本及其坐标的数组和总行高
 */
const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
	// 参数验证
	if (!text || typeof text !== 'string') {
		return [[], 0];
	}

	// 按空格分割单词，过滤空字符串
	let words = text.split(' ').filter(word => word.length > 0);

	// 如果没有单词，返回空结果
	if (words.length === 0) {
		return [[], 0];
	}

	let line = '';
	let testLine = '';
	let wordArray = [];
	let totalLineHeight = 0;

	// 遍历每个单词
	for (let n = 0; n < words.length; n++) {
		// 测试当前行加上新单词的长度
		testLine += `${words[n]} `;
		let metrics = ctx.measureText(testLine);
		let testWidth = metrics.width;

		// 如果超过最大宽度，则换行
		if (testWidth > maxWidth && n > 0) {
			// 确保 line 不为空再添加
			if (line.trim().length > 0) {
				wordArray.push([line.trim(), x, y]);
				y += lineHeight;
				totalLineHeight += lineHeight;
			}
			line = `${words[n]} `;
			testLine = `${words[n]} `;
		} else {
			// 否则继续添加到当前行
			line += `${words[n]} `;
		}

		// 处理最后一个单词
		if (n === words.length - 1) {
			if (line.trim().length > 0) {
				wordArray.push([line.trim(), x, y]);
			}
		}
	}

	// 返回包含单词的数组和总行高
	return [wordArray, totalLineHeight];
};

/**
 * 生成文章缩略图
 * @param {string} outputName - 输出文件名
 * @param {Array} gradientColors - 渐变颜色数组 [color1, color2]
 * @param {string} title - 文章标题
 * @param {string} category - 文章分类
 * @param {string} emoji - 显示的 emoji
 * @param {Object} options - 额外选项
 * @param {string} options.format - 输出格式 ('png', 'webp', 'jpeg', 'avif')
 * @param {number} options.quality - 图片质量 (1-100)
 * @param {boolean} options.createMultipleFormats - 是否同时创建多种格式
 * @param {boolean} options.overwrite - 是否覆盖已存在的文件
 * @returns {Promise<string|Object>} - 操作结果消息或生成的文件路径对象
 */
const generateArticleImage = async function (
	outputName,
	gradientColors,
	title,
	category,
	emoji,
	options = {}
) {
	// 参数验证
	if (!outputName || typeof outputName !== 'string') {
		throw new Error('输出文件名必须是非空字符串');
	}

	if (!title || typeof title !== 'string') {
		throw new Error('文章标题必须是非空字符串');
	}

	if (!category || typeof category !== 'string') {
		throw new Error('文章分类必须是非空字符串');
	}

	if (!emoji || typeof emoji !== 'string') {
		throw new Error('Emoji 必须是非空字符串');
	}

	// 设置默认选项
	const defaultOptions = {
		format: 'png',
		quality: 80,
		createMultipleFormats: false,
		overwrite: false
	};

	// 合并选项
	const finalOptions = { ...defaultOptions, ...options };

	// 验证格式
	const supportedFormats = ['png', 'webp', 'jpeg', 'jpg', 'avif'];
	if (!supportedFormats.includes(finalOptions.format.toLowerCase())) {
		throw new Error(
			`不支持的格式: ${finalOptions.format}。支持的格式: ${supportedFormats.join(', ')}`
		);
	}

	// 验证质量参数
	if (finalOptions.quality < 1 || finalOptions.quality > 100) {
		throw new Error('图片质量必须在 1-100 之间');
	}

	// 将分类转为大写
	category = category.toUpperCase();

	// 设置默认渐变颜色
	if (!gradientColors || !Array.isArray(gradientColors) || gradientColors.length < 2) {
		gradientColors = ['#8005fc', '#073bae']; // 默认渐变色
	}

	// 验证颜色格式
	const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	if (!colorRegex.test(gradientColors[0]) || !colorRegex.test(gradientColors[1])) {
		console.warn('渐变颜色格式可能不正确，使用默认颜色');
		gradientColors = ['#8005fc', '#073bae'];
	}

	// 创建画布
	const canvas = createCanvas(1342, 853);
	const ctx = canvas.getContext('2d');

	// 绘制渐变背景
	const grd = ctx.createLinearGradient(0, 853, 1342, 0);
	grd.addColorStop(0, gradientColors[0]);
	grd.addColorStop(1, gradientColors[1]);
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 1342, 853);

	// 绘制 Emoji
	ctx.fillStyle = 'white';
	try {
		ctx.font = '95px AppleEmoji';
	} catch (e) {
		ctx.font = '95px sans-serif'; // 如果 AppleEmoji 字体不可用，使用默认字体
	}
	ctx.fillText(emoji, 85, 700);

	// 绘制标题文本
	try {
		ctx.font = '95px InterBold';
	} catch (e) {
		ctx.font = '95px bold sans-serif'; // 如果 InterBold 字体不可用，使用默认字体
	}
	ctx.fillStyle = 'white';

	// 处理标题文本换行
	const wrappedText = wrapText(ctx, title, 85, 753, 1200, 100);
	wrappedText[0].forEach(function (item) {
		// 绘制每行文本，调整位置以适应多行文本
		ctx.fillText(item[0], item[1], item[2] - wrappedText[1] - 200);
	});

	// 绘制分类文本
	try {
		ctx.font = '50px InterMedium';
	} catch (e) {
		ctx.font = '50px sans-serif'; // 如果 InterMedium 字体不可用，使用默认字体
	}
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	ctx.fillText(category, 85, 553 - wrappedText[1] - 100);

	// 确保输出目录存在
	const outputDir = path.join(__dirname, 'output');
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	try {
		// 将画布编码为 PNG 缓冲区
		const buffer = await canvas.encode('png');

		// 如果需要创建多种格式
		if (finalOptions.createMultipleFormats) {
			const formats = ['png', 'webp', 'jpeg', 'avif'];
			const results = {};
			const skipped = [];

			// 为每种格式创建图片
			for (const format of formats) {
				const outputPath = path.join(outputDir, `${outputName}.${format}`);

				// 检查文件是否已存在
				if (fs.existsSync(outputPath) && !finalOptions.overwrite) {
					skipped.push(format);
					results[format] = outputPath;
					continue;
				}

				try {
					// 使用 sharp 转换格式，修复格式调用方式
					let sharpInstance = sharp(buffer);

					switch (format) {
						case 'png':
							// PNG 是无损格式，不支持 quality 参数
							await sharpInstance.png({ compressionLevel: 9 }).toFile(outputPath);
							break;
						case 'webp':
							await sharpInstance.webp({ quality: finalOptions.quality }).toFile(outputPath);
							break;
						case 'jpeg':
							await sharpInstance.jpeg({ quality: finalOptions.quality }).toFile(outputPath);
							break;
						case 'avif':
							await sharpInstance
								.avif({ quality: finalOptions.quality, effort: 9 })
								.toFile(outputPath);
							break;
						default:
							throw new Error(`不支持的格式: ${format}`);
					}

					results[format] = outputPath;
				} catch (formatError) {
					console.error(`创建 ${format} 格式图片时出错:`, formatError);
					// 继续处理其他格式，不中断整个流程
				}
			}

			return {
				message: `已成功创建多种格式的图片！${
					skipped.length > 0 ? ` (跳过已存在的: ${skipped.join(', ')})` : ''
				}`,
				files: results,
				skipped: skipped
			};
		} else {
			// 创建单一格式
			let format = finalOptions.format.toLowerCase();
			// 处理 jpg 别名
			if (format === 'jpg') format = 'jpeg';

			const outputPath = path.join(outputDir, `${outputName}.${finalOptions.format.toLowerCase()}`);

			// 检查文件是否已存在
			if (fs.existsSync(outputPath) && !finalOptions.overwrite) {
				return `图片已存在！没有创建新图片: ${outputPath}`;
			}

			// 使用 sharp 转换为指定格式，修复格式调用方式
			let sharpInstance = sharp(buffer);

			switch (format) {
				case 'png':
					// PNG 是无损格式，不支持 quality 参数
					await sharpInstance.png({ compressionLevel: 9 }).toFile(outputPath);
					break;
				case 'webp':
					await sharpInstance.webp({ quality: finalOptions.quality }).toFile(outputPath);
					break;
				case 'jpeg':
					await sharpInstance.jpeg({ quality: finalOptions.quality }).toFile(outputPath);
					break;
				case 'avif':
					await sharpInstance.avif({ quality: finalOptions.quality, effort: 9 }).toFile(outputPath);
					break;
				default:
					throw new Error(`不支持的格式: ${format}`);
			}

			return `图片已成功创建！保存在 ${outputPath}`;
		}
	} catch (e) {
		console.error('创建图片时出错:', e);
		throw new Error(`无法创建图片: ${e.message}`);
	}
};

/**
 * 示例用法
 */
async function runExample() {
	// 示例1: 默认格式 (PNG)
	const result1 = await generateArticleImage(
		'article-thumbnail-png',
		['#FF6B6B', '#4ECDC4'],
		'如何用 Node.JS 和 Canvas 自动生成精美的文章缩略图',
		'技术教程',
		'🎨'
	);
	console.log(result1);

	// 示例2: WebP 格式 (更小的文件大小)
	const result2 = await generateArticleImage(
		'article-thumbnail-webp',
		['#3A86FF', '#FF006E'],
		'WebP格式的图片体积更小，加载更快',
		'性能优化',
		'⚡',
		{ format: 'webp', quality: 85 }
	);
	console.log(result2);

	// 示例3: 生成多种格式
	const result3 = await generateArticleImage(
		'article-thumbnail-multi',
		['#8338EC', '#FFBE0B'],
		'一次生成多种格式的缩略图',
		'效率工具',
		'🚀',
		{ createMultipleFormats: true, quality: 90 }
	);
	console.log(result3);
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
	runExample().catch(console.error);
}

// 导出函数以便其他模块使用
module.exports = {
	generateArticleImage,
	wrapText
};
