import { useState, useCallback, useRef } from 'react';

interface Chunk {
	index: number;
	data: Blob;
}

interface UploadProgress {
	percent: number;
	uploadedChunks: number[];
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

/**
 * 大文件上传Hook
 * 支持秒传、分片上传、断点续传、并发控制
 */
export const useBigFileUpload = () => {
	const [progress, setProgress] = useState<UploadProgress>({ percent: 0, uploadedChunks: [] });
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 使用useRef存储abort controller，避免重新渲染时丢失
	const abortControllerRef = useRef<AbortController | null>(null);

	/**
	 * 计算文件Hash（模拟实现）
	 * 实际项目中应使用Web Worker和hash-wasm库
	 */
	const calculateFileHash = useCallback(async (file: File): Promise<string> => {
		// 模拟计算hash的过程
		return new Promise(resolve => {
			setTimeout(() => {
				// 简单模拟hash值
				resolve(`hash_${file.name}_${file.size}_${Date.now()}`);
			}, 1000);
		});
	}, []);

	/**
	 * 文件切片
	 */
	const createChunks = useCallback((file: File): Chunk[] => {
		const chunks: Chunk[] = [];
		let cur = 0;
		let index = 0;

		while (cur < file.size) {
			chunks.push({
				index,
				data: file.slice(cur, cur + CHUNK_SIZE)
			});
			cur += CHUNK_SIZE;
			index++;
		}

		return chunks;
	}, []);

	/**
	 * 检查文件是否已存在（秒传）
	 */
	const checkFileExists = useCallback(async (fileHash: string) => {
		try {
			const response = await fetch('/api/checkFile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileHash })
			});

			if (!response.ok) {
				throw new Error('检查文件失败');
			}

			const result = await response.json();
			return result;
		} catch (err) {
			console.error('检查文件是否存在时出错:', err);
			throw err;
		}
	}, []);

	/**
	 * 上传单个分片
	 */
	const uploadChunk = useCallback(async (chunk: Chunk, fileHash: string): Promise<void> => {
		const formData = new FormData();
		formData.append('file', chunk.data);
		formData.append('index', String(chunk.index));
		formData.append('fileHash', fileHash);

		const response = await fetch('/api/uploadChunk', {
			method: 'POST',
			body: formData,
			signal: abortControllerRef.current?.signal
		});

		if (!response.ok) {
			throw new Error(`分片 ${chunk.index} 上传失败`);
		}
	}, []);

	/**
	 * 并发控制上传
	 */
	const uploadChunksWithConcurrency = useCallback(
		async (chunks: Chunk[], fileHash: string, uploadedIndexes: number[], maxConcurrency = 3) => {
			let completed = uploadedIndexes.length;
			const total = chunks.length;

			// 更新初始进度
			setProgress({
				percent: Math.round((completed / total) * 100),
				uploadedChunks: [...uploadedIndexes]
			});

			// 递归上传函数
			const uploadNext = async (): Promise<void> => {
				const chunk = chunks.find(c => !uploadedIndexes.includes(c.index));

				// 如果没有需要上传的分片，结束递归
				if (!chunk) return;

				// 标记为已上传
				uploadedIndexes.push(chunk.index);

				try {
					await uploadChunk(chunk, fileHash);
					completed++;

					// 更新进度
					setProgress({
						percent: Math.round((completed / total) * 100),
						uploadedChunks: [...uploadedIndexes]
					});

					// 继续上传下一个
					await uploadNext();
				} catch (err) {
					// 上传失败，从uploadedIndexes中移除
					const index = uploadedIndexes.indexOf(chunk.index);
					if (index > -1) {
						uploadedIndexes.splice(index, 1);
					}

					throw err;
				}
			};

			// 创建并发任务
			const promises: Promise<void>[] = [];
			for (let i = 0; i < Math.min(maxConcurrency, chunks.length); i++) {
				promises.push(uploadNext());
			}

			// 等待所有任务完成
			await Promise.all(promises);
		},
		[uploadChunk]
	);

	/**
	 * 主上传函数
	 */
	const upload = useCallback(
		async (file: File) => {
			// 重置状态
			setIsUploading(true);
			setError(null);
			setProgress({ percent: 0, uploadedChunks: [] });

			// 创建abort controller用于取消上传
			abortControllerRef.current = new AbortController();

			try {
				// 1. 计算文件hash
				const fileHash = await calculateFileHash(file);

				// 2. 检查文件是否已存在（秒传）
				try {
					const checkResult = await checkFileExists(fileHash);

					if (checkResult.exist) {
						// 秒传成功
						setProgress({ percent: 100, uploadedChunks: [] });
						return { success: true, message: '秒传成功' };
					}

					// 获取已上传的分片索引
					const uploadedIndexes = checkResult.uploadedIndexes || [];

					// 3. 文件切片
					const chunks = createChunks(file);

					// 4. 分片上传（支持断点续传和并发控制）
					await uploadChunksWithConcurrency(chunks, fileHash, uploadedIndexes);

					// 5. 通知服务端合并文件
					await fetch('/api/mergeChunks', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ fileHash, fileName: file.name })
					});

					return { success: true, message: '上传成功' };
				} catch (err: any) {
					setError(err.message || '上传失败');
					return { success: false, message: err.message || '上传失败' };
				}
			} catch (err: any) {
				setError(err.message || '上传失败');
				return { success: false, message: err.message || '上传失败' };
			} finally {
				setIsUploading(false);
				abortControllerRef.current = null;
			}
		},
		[calculateFileHash, checkFileExists, createChunks, uploadChunksWithConcurrency]
	);

	/**
	 * 取消上传
	 */
	const cancelUpload = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			setIsUploading(false);
			setError('上传已取消');
		}
	}, []);

	return {
		// 状态
		progress,
		isUploading,
		error,

		// 方法
		upload,
		cancelUpload
	};
};
