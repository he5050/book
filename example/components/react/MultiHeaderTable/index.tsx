import React, { useEffect, useRef } from 'react';

interface HeaderConfig {
	name: string;
	key?: string;
	children?: HeaderConfig[];
	level?: number;
	rowspan?: number;
	colspan?: number;
}

interface TableData {
	[key: string]: any;
}

interface MultiHeaderTableProps {
	headers: HeaderConfig[];
	data: TableData[];
	containerId?: string;
}

/**
 * 计算表头的最大层级
 */
const calculateHeaderLevels = (headers: HeaderConfig[]): number => {
	let maxLevel = 1;

	const traverse = (header: HeaderConfig, currentLevel: number) => {
		if (currentLevel > maxLevel) {
			maxLevel = currentLevel;
		}
		if (header.children && header.children.length) {
			header.children.forEach(child => traverse(child, currentLevel + 1));
		}
	};

	headers.forEach(header => traverse(header, 1));
	return maxLevel;
};

/**
 * 计算叶子节点数量（用于确定colspan）
 */
const countLeafNodes = (headers: HeaderConfig[]): number => {
	let count = 0;

	const traverse = (headers: HeaderConfig[]) => {
		headers.forEach(header => {
			if (!header.children || !header.children.length) {
				count++;
			} else {
				traverse(header.children);
			}
		});
	};

	traverse(headers);
	return count;
};

/**
 * 处理表头，计算每个单元格的rowspan和colspan
 */
const processHeaders = (headers: HeaderConfig[], totalLevels: number): HeaderConfig[] => {
	const result: HeaderConfig[] = [];

	const traverse = (headers: HeaderConfig[], currentLevel: number) => {
		headers.forEach(header => {
			// 标记当前层级
			header.level = currentLevel;

			// 没有子项的单元格需要跨越多行
			if (!header.children || !header.children.length) {
				header.rowspan = totalLevels - currentLevel + 1;
				header.colspan = 1;
				result.push(header);
			} else {
				// 有子项的单元格只占当前行
				header.rowspan = 1;
				// 计算需要横跨的列数（子项总数量）
				header.colspan = countLeafNodes(header.children);
				result.push(header);

				// 递归处理子项
				traverse(header.children, currentLevel + 1);
			}
		});
	};

	traverse(headers, 1);
	return result;
};

/**
 * 生成表头HTML
 */
const generateThead = (headers: HeaderConfig[], totalLevels: number): string => {
	let thead = '<thead>';

	// 为每个层级生成一行
	for (let level = 1; level <= totalLevels; level++) {
		const levelHeaders = headers.filter(header => header.level === level);
		thead += '<tr>';

		levelHeaders.forEach(header => {
			thead += `<th rowspan="${header.rowspan}" colspan="${header.colspan}">${header.name}</th>`;
		});

		thead += '</tr>';
	}

	thead += '</thead>';
	return thead;
};

/**
 * 生成表格内容HTML
 */
const generateTbody = (data: TableData[], headers: HeaderConfig[]): string => {
	// 获取所有叶子节点（最终列）
	const leafHeaders = headers.filter(header => !header.children || !header.children.length);

	let tbody = '<tbody>';

	data.forEach(row => {
		tbody += '<tr>';

		leafHeaders.forEach(header => {
			tbody += `<td>${row[header.key!] !== undefined ? row[header.key!] : ''}</td>`;
		});

		tbody += '</tr>';
	});

	tbody += '</tbody>';
	return tbody;
};

/**
 * 动态生成多层表头表格组件
 */
const MultiHeaderTable: React.FC<MultiHeaderTableProps> = ({
	headers,
	data,
	containerId = 'multiHeaderTableContainer'
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// 1. 计算表头层级和每个单元格的合并属性
		const headerLevels = calculateHeaderLevels(headers);
		const processedHeaders = processHeaders(headers, headerLevels);

		// 2. 生成表头HTML
		const theadHtml = generateThead(processedHeaders, headerLevels);

		// 3. 生成表格内容HTML
		const tbodyHtml = generateTbody(data, processedHeaders);

		// 4. 组合成完整表格并渲染
		const tableHtml = `
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        ${theadHtml}
        ${tbodyHtml}
      </table>
    `;

		container.innerHTML = tableHtml;
	}, [headers, data]);

	return <div ref={containerRef} id={containerId} style={{ width: '100%' }} />;
};

export default MultiHeaderTable;
