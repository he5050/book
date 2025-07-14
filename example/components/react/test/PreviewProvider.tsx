import React, { createContext, useContext, useState } from 'react';

export type PreviewType = 'lightbox' | 'photosSwipe' | 'modal' | 'lightGallery' | 'viewerjs';

export interface PreviewItem {
	src: string;
	index: number;
	list: string[];
}

interface PreviewContextValue {
	openPreview: (list: string[], index: number) => void;
	closePreview: () => void;
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
	type: PreviewType;
}

export const PreviewProvider: React.FC<PreviewProviderProps> = ({
	children,
	type = 'modal'
}: {
	children: React.ReactNode;
	type?: PreviewType;
}) => {
	const [preview, setPreview] = useState<PreviewItem | null>(null);

	const openPreview = (list: string[], index: number) => {
		setPreview({ src: list[index], index, list });
	};

	const closePreview = () => setPreview(null);

	return (
		<PreviewContext.Provider value={{ openPreview, closePreview, current: preview, type }}>
			{children}
		</PreviewContext.Provider>
	);
};
