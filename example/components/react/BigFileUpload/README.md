---
date: 2025-09-12 22:47:23
title: README
permalink: /pages/f91b57
categories:
  - example
  - components
  - react
  - BigFileUpload
---

# BigFileUpload 大文件上传组件

## 简介

BigFileUpload 是一个用于处理大文件上传的 React 组件，支持以下功能：

- 秒传（快速上传）
- 分片上传
- 断点续传
- 并发控制
- 上传进度展示
- 取消上传

## 功能说明

### 1. 秒传（快速上传）

通过计算文件 Hash 值判断服务端是否已存在相同文件，如果存在则直接完成上传，避免重复上传。

### 2. 分片上传

将大文件切分为多个小块（默认 5MB），逐个上传，提高上传成功率。

### 3. 断点续传

记录已上传的分片，在上传中断后可以从中断处继续上传，无需重新上传整个文件。

### 4. 并发控制

限制同时上传的分片数量（默认为 3），避免过多请求导致浏览器或服务器压力过大。

### 5. 上传进度展示

实时显示上传进度百分比和进度条。

### 6. 取消上传

支持取消正在进行的上传任务。

## 使用方法

### 1. 使用 Hook

```tsx
import { useBigFileUpload } from './useBigFileUpload';

const MyComponent = () => {
	const { progress, isUploading, error, upload, cancelUpload } = useBigFileUpload();

	const handleUpload = async () => {
		const file = document.querySelector('input[type="file"]').files[0];
		const result = await upload(file);
		if (result.success) {
			console.log('上传成功');
		}
	};

	return (
		<div>
			<input type="file" />
			<button onClick={handleUpload}>上传</button>
			{isUploading && <button onClick={cancelUpload}>取消</button>}
			<div>进度: {progress.percent}%</div>
			{error && <div>错误: {error}</div>}
		</div>
	);
};
```

### 2. 使用示例组件

```tsx
import BigFileUploadExample from './example';

const App = () => {
	return (
		<div>
			<h1>大文件上传示例</h1>
			<BigFileUploadExample />
		</div>
	);
};
```

## API

### useBigFileUpload Hook

#### 返回值

| 属性         | 类型                                                             | 说明         |
| ------------ | ---------------------------------------------------------------- | ------------ | -------- |
| progress     | `{ percent: number, uploadedChunks: number[] }`                  | 上传进度信息 |
| isUploading  | `boolean`                                                        | 是否正在上传 |
| error        | `string                                                          | null`        | 错误信息 |
| upload       | `(file: File) => Promise<{ success: boolean, message: string }>` | 上传函数     |
| cancelUpload | `() => void`                                                     | 取消上传函数 |

#### upload 方法参数

| 参数 | 类型   | 说明         |
| ---- | ------ | ------------ |
| file | `File` | 要上传的文件 |

#### upload 方法返回值

| 属性    | 类型      | 说明         |
| ------- | --------- | ------------ |
| success | `boolean` | 是否上传成功 |
| message | `string`  | 上传结果信息 |

## 注意事项

1. 实际使用时需要实现对应的后端接口：

   - `/api/checkFile` - 检查文件是否存在
   - `/api/uploadChunk` - 上传分片
   - `/api/mergeChunks` - 合并分片

2. 文件 Hash 计算在示例中使用了模拟实现，实际项目中建议使用 `hash-wasm` 库配合 Web Worker 实现。

3. 并发数默认为 3，可通过修改 `uploadChunksWithConcurrency` 函数的 `maxConcurrency` 参数调整。

## 依赖

- React 16.8+
- TypeScript 3.0+（如果使用 TypeScript）
