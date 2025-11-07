export interface LayoutConfig {
	containerWidth: number;
	containerPadding?: number;
	boxSpacing?: number;
	targetRowHeight?: number;
	minScale?: number;
	maxScale?: number;
	showWidows?: boolean;
}

export interface LayoutItem<T = unknown> {
	id: string | number;
	aspectRatio: number;
	meta?: T;
}

export interface LayoutBox<T = unknown> {
	id: string | number;
	width: number;
	height: number;
	left: number;
	top: number;
	meta?: T;
}

export interface LayoutRowMeta {
	index: number;
	itemCount: number;
	height: number;
	totalWidth: number;
	isWidow: boolean;
}

export interface LayoutResult<T = unknown> {
	boxes: Array<LayoutBox<T>>;
	rows: LayoutRowMeta[];
	containerHeight: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function calculateJustifiedLayout<T = unknown>(
	items: Array<LayoutItem<T>>,
	config: LayoutConfig
): LayoutResult<T> {
	const {
		containerWidth,
		containerPadding = 16,
		boxSpacing = 12,
		targetRowHeight = 180,
		minScale = 0.7,
		maxScale = 1.4,
		showWidows = true
	} = config;

	const innerWidth = Math.max(containerWidth - containerPadding * 2, 100);
	const boxes: Array<LayoutBox<T>> = [];
	const rows: LayoutRowMeta[] = [];

	let currentRow: Array<LayoutItem<T>> = [];
	let ratioSum = 0;
	let cursorTop = containerPadding;
	let rowIndex = 0;

	const finalizeRow = (force: boolean) => {
		if (!currentRow.length || ratioSum === 0) {
			currentRow = [];
			ratioSum = 0;
			return;
		}

		const spacingTotal = Math.max(currentRow.length - 1, 0) * boxSpacing;
		const availableWidth = Math.max(innerWidth - spacingTotal, 40);
		const fittedHeight = availableWidth / ratioSum;

		let rowHeight = clamp(fittedHeight, targetRowHeight * minScale, targetRowHeight * maxScale);
		let isWidowRow = false;

		if (force) {
			if (showWidows) {
				isWidowRow = true;
				rowHeight = clamp(
					Math.min(targetRowHeight, fittedHeight),
					targetRowHeight * minScale,
					targetRowHeight * maxScale
				);
			} else {
				rowHeight = clamp(fittedHeight, targetRowHeight * minScale, targetRowHeight * maxScale);
			}
		}

		let cursorLeft = containerPadding;
		let rowWidth = 0;

		currentRow.forEach(item => {
			const width = rowHeight * item.aspectRatio;
			rowWidth += width;
			boxes.push({
				id: item.id,
				width,
				height: rowHeight,
				left: cursorLeft,
				top: cursorTop,
				meta: item.meta
			});
			cursorLeft += width + boxSpacing;
		});

		rows.push({
			index: rowIndex,
			itemCount: currentRow.length,
			height: rowHeight,
			totalWidth: rowWidth + spacingTotal,
			isWidow: isWidowRow
		});

		rowIndex += 1;
		cursorTop += rowHeight + boxSpacing;
		currentRow = [];
		ratioSum = 0;
	};

	items.forEach(item => {
		if (!Number.isFinite(item.aspectRatio) || item.aspectRatio <= 0) {
			return;
		}
		currentRow.push(item);
		ratioSum += item.aspectRatio;
		const spacingTotal = Math.max(currentRow.length - 1, 0) * boxSpacing;
		const estimatedWidth = ratioSum * targetRowHeight + spacingTotal;

		if (estimatedWidth >= innerWidth) {
			finalizeRow(false);
		}
	});

	if (currentRow.length) {
		finalizeRow(true);
	}

	const containerHeight = rows.length
		? cursorTop - boxSpacing + containerPadding
		: containerPadding * 2;

	return {
		boxes,
		rows,
		containerHeight
	};
}

