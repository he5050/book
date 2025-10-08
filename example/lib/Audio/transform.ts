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
export function encodePCM(pcmData: Float32Array, sampleBits: number, littleEndian: boolean = true): DataView {
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