
/**
 * 将 PCM 数据编码为 MP3 格式
 * 基于你提供的 lamejs 使用方式进行实现
 * @param {DataView} pcmData - 16位 PCM 数据
 * @param {number} sampleRate - 采样率
 * @param {number} numChannels - 声道数 (1 或 2)
 * @param {number} bitrateKbps - MP3 比特率 (kbps)
 * @param {boolean} littleEndian - 字节序
 * @returns {Uint8Array[]} - MP3 数据块数组
 */
export function encodeMP3(
	pcmData: DataView,
	sampleRate: number,
	numChannels: number,
	bitrateKbps: number = 128,
	littleEndian: boolean = true
): Uint8Array[] {
	// 检查 lamejs 是否可用
	if (typeof (window as any).lamejs === 'undefined') {
		throw new Error('lamejs 库未加载，请确保已引入 lamejs');
	}

	const lamejs = (window as any).lamejs;

	try {
		// 检查是否存在 MPEGMode 问题
		if (typeof (window as any).MPEGMode === 'undefined') {
			// 尝试定义缺失的常量
			(window as any).MPEGMode = {
				STEREO: 0,
				JOINT_STEREO: 1,
				DUAL_CHANNEL: 2,
				MONO: 3,
				NOT_SET: 4
			};
		}
		
		// 创建 MP3 编码器
		const mp3enc = new lamejs.Mp3Encoder(numChannels, sampleRate, bitrateKbps);

		// 将 PCM DataView 转换为 Int16Array
		const samples = pcmData.byteLength / 2; // 16位 = 2字节

		// 创建左右声道数据
		let leftData: Int16Array;
		let rightData: Int16Array | null = null;

		if (numChannels === 1) {
			// 单声道
			leftData = new Int16Array(samples);
			for (let i = 0; i < samples; i++) {
				leftData[i] = pcmData.getInt16(i * 2, littleEndian);
			}
		} else {
			// 双声道 - 交错格式转换为分离格式
			const samplesPerChannel = samples / 2;
			leftData = new Int16Array(samplesPerChannel);
			rightData = new Int16Array(samplesPerChannel);

			for (let i = 0; i < samplesPerChannel; i++) {
				leftData[i] = pcmData.getInt16(i * 4, littleEndian);
				rightData[i] = pcmData.getInt16(i * 4 + 2, littleEndian);
			}
		}

		// 编码 MP3（参考你提供的原始代码逻辑）
		const buffer: Uint8Array[] = [];
		const maxSamples = 1152; // MP3 编码器的标准块大小
		const remaining = leftData.length;

		for (let i = 0; i < remaining; i += maxSamples) {
			const left = leftData.subarray(i, i + maxSamples);
			let mp3buf: Uint8Array;

			if (numChannels === 2 && rightData) {
				const right = rightData.subarray(i, i + maxSamples);
				mp3buf = mp3enc.encodeBuffer(left, right);
			} else {
				mp3buf = mp3enc.encodeBuffer(left);
			}

			if (mp3buf.length > 0) {
				buffer.push(mp3buf);
			}
		}

		// 刷新编码器缓冲区
		const enc = mp3enc.flush();
		if (enc.length > 0) {
			buffer.push(enc);
		}

		return buffer;
	} catch (error) {
		console.error('MP3 编码错误:', error);
		throw new Error(`MP3 编码失败: ${(error as Error).message}`);
	}
}
/**
 * 在 DataView 的指定偏移量处写入字符串。
 * @param {DataView} view - 要写入的 DataView 实例。
 * @param {number} offset - 开始写入的字节偏移量。
 * @param {string} str - 要写入的 ASCII 字符串。
 */
function writeString(view: DataView, offset: number, str: string): void {
	for (let i = 0; i < str.length; i++) {
		view.setUint8(offset + i, str.charCodeAt(i));
	}
}

/**
 * 通过重采样来压缩音频数据，实现输入采样率到输出采样率的转换。
 * 这是一个使用最近邻采样法的简单实现。
 *
 * @param {Float32Array | { left: Float32Array; right: Float32Array }} data - PCM 数据，范围在 [-1, 1] 之间，支持单声道或双声道。
 * @param {number} inputSampleRate - 输入采样率 (例如, 48000)。
 * @param {number} outputSampleRate - 期望的输出采样率 (例如, 16000)。
 * @returns {Float32Array} - 重采样后的音频数据，如果是双声道则为交错格式。
 */
export function compress(
	data: Float32Array | { left: Float32Array; right: Float32Array },
	inputSampleRate: number,
	outputSampleRate: number
): Float32Array {
	const rate = inputSampleRate / outputSampleRate;
	const compression = Math.max(rate, 1);

	let leftChannel: Float32Array;
	let rightChannel: Float32Array;

	if (data instanceof Float32Array) {
		leftChannel = data;
		rightChannel = new Float32Array(0);
	} else {
		leftChannel = data.left;
		rightChannel = data.right;
	}

	const newLength = Math.floor((leftChannel.length + rightChannel.length) / rate);
	const result = new Float32Array(newLength);

	let resultIndex = 0;
	let sourceIndex = 0;

	while (resultIndex < newLength) {
		const sampleIndex = Math.floor(sourceIndex);

		result[resultIndex++] = leftChannel[sampleIndex];

		if (rightChannel.length > 0) {
			result[resultIndex++] = rightChannel[sampleIndex];
		}

		sourceIndex += compression;
	}

	return result;
}

/**
 * 将原始 PCM 数据 (Float32Array) 编码为 8 位或 16 位的 PCM DataView。
 *
 * @param {Float32Array} pcmData - 原始 PCM 数据，范围在 [-1, 1] 之间。
 * @param {number} sampleBits - 期望的采样位数 (8 或 16)。
 * @param {boolean} [littleEndian=true] - 为 16 位编码指定字节序。
 * @returns {DataView} - 编码后的 PCM 数据。
 */
export function encodePCM(
	pcmData: Float32Array,
	sampleBits: number,
	littleEndian: boolean = true
): DataView {
	const dataLength = pcmData.length * (sampleBits / 8);
	const buffer = new ArrayBuffer(dataLength);
	const view = new DataView(buffer);
	let offset = 0;

	if (sampleBits === 8) {
		for (let i = 0; i < pcmData.length; i++, offset++) {
			// 将值限制在 [-1, 1] 范围内
			const s = Math.max(-1, Math.min(1, pcmData[i]));
			// 转换为 8 位无符号 PCM (0-255)
			const val = s < 0 ? s * 128 : s * 127;
			view.setUint8(offset, val + 128);
		}
	} else {
		// 16-bit
		for (let i = 0; i < pcmData.length; i++, offset += 2) {
			// 将值限制在 [-1, 1] 范围内
			const s = Math.max(-1, Math.min(1, pcmData[i]));
			// 转换为 16 位有符号 PCM (-32768 to 32767)
			const val = s < 0 ? s * 0x8000 : s * 0x7fff;
			view.setInt16(offset, val, littleEndian);
		}
	}

	return view;
}

/**
 * 通过在 PCM 数据前添加 44 字节的 WAV 头，将其编码为 WAV 格式。
 *
 * @param {DataView} pcmData - 要编码的 PCM 数据。
 * @param {number} inputSampleRate - 输入采样率 (为保持 API 兼容性而保留，但未使用)。
 * @param {number} outputSampleRate - PCM 数据的实际采样率。
 * @param {number} numChannels - 声道数 (1 为单声道, 2 为双声道)。
 * @param {number} outputSampleBits - 采样位数 (8 或 16)。
 * @param {boolean} [littleEndian=true] - 为头部字段指定字节序。
 * @returns {DataView} - 完整的 WAV 文件数据 (DataView)。
 */
export function encodeWAV(
	pcmData: DataView,
	inputSampleRate: number, // 未使用，但为保持兼容性而保留
	outputSampleRate: number,
	numChannels: number = 1,
	outputSampleBits: number,
	littleEndian: boolean = true
): DataView {
	const pcmByteLength = pcmData.byteLength;
	const buffer = new ArrayBuffer(44 + pcmByteLength);
	const view = new DataView(buffer);
	let offset = 0;

	// 资源交换文件标识符 (RIFF)
	writeString(view, offset, 'RIFF');
	offset += 4;
	// 文件大小 (ChunkSize)，即文件总大小 - 8
	view.setUint32(offset, 36 + pcmByteLength, littleEndian);
	offset += 4;
	// WAV 文件标志
	writeString(view, offset, 'WAVE');
	offset += 4;

	// "fmt " 子块
	writeString(view, offset, 'fmt ');
	offset += 4;
	// 子块大小 (Subchunk1Size)，对于 PCM 总是 16
	view.setUint32(offset, 16, littleEndian);
	offset += 4;
	// 音频格式 (AudioFormat)，对于 PCM 总是 1
	view.setUint16(offset, 1, littleEndian);
	offset += 2;
	// 声道数 (NumChannels)
	view.setUint16(offset, numChannels, littleEndian);
	offset += 2;
	// 采样率 (SampleRate)
	view.setUint32(offset, outputSampleRate, littleEndian);
	offset += 4;
	// 字节率 (ByteRate) = SampleRate * NumChannels * (BitsPerSample/8)
	const byteRate = outputSampleRate * numChannels * (outputSampleBits / 8);
	view.setUint32(offset, byteRate, littleEndian);
	offset += 4;
	// 块对齐 (BlockAlign) = NumChannels * (BitsPerSample/8)
	const blockAlign = numChannels * (outputSampleBits / 8);
	view.setUint16(offset, blockAlign, littleEndian);
	offset += 2;
	// 采样位数 (BitsPerSample)
	view.setUint16(offset, outputSampleBits, littleEndian);
	offset += 2;

	// "data" 子块
	writeString(view, offset, 'data');
	offset += 4;
	// 数据大小 (Subchunk2Size)
	view.setUint32(offset, pcmByteLength, littleEndian);
	offset += 4;

	// 写入 PCM 数据
	for (let i = 0; i < pcmByteLength; i++) {
		view.setUint8(offset + i, pcmData.getUint8(i));
	}

	return view;
}
