import React, { createContext, useContext, useState } from 'react';

export type PreviewType = 'lightbox' | 'photoSwipe' | 'modal' | 'lightGallery' | 'viewerjs';

export interface PreviewItem {
	src: string;
	index: number;
	list: string[];
}

interface PreviewContextValue {
	openPreview: (list: string[], index: number) => void;
	closePreview: () => void;
	updatePreview: (index: number) => void;
	current: PreviewItem | null;
	type: PreviewType;
}

const PreviewContext = createContext<PreviewContextValue | null>(null);

export const usePreview = () => {
	const ctx = useContext(PreviewContext);
	if (!ctx) throw new Error('usePreview must be used within PreviewProvider');
	return ctx;
};

interface PreviewProviderProps {
	children: React.ReactNode;
	type?: PreviewType;
}

export const PreviewProvider: React.FC<PreviewProviderProps> = ({
	children,
	type = 'modal'
}) => {
	const [preview, setPreview] = useState<PreviewItem | null>(null);

	/**
	 * 打开预览
	 * @param list 要预览的图片列表
	 * @param index 要预览的图片索引
	 */
	const openPreview = (list: string[], index: number) => {
		// 添加边界检查和空列表检查
		if (!list || list.length === 0 || index < 0 || index >= list.length) {
			return;
		}
		setPreview({ 
			src: list[index], 
			index, 
			list 
		});
	};

	const closePreview = () => setPreview(null);

	/**
	 * 更新预览索引
	 * @param index 新的索引
	 */
	const updatePreview = (index: number) => {
		if (!preview || !preview.list || index < 0 || index >= preview.list.length) {
			return;
		}
		setPreview({
			...preview,
			index,
			src: preview.list[index]
		});
	};

	return (
		<PreviewContext.Provider value={{ openPreview, closePreview, updatePreview, current: preview, type }}>
			{children}
		</PreviewContext.Provider>
	);
};
