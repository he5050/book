import React, { useState } from 'react';
import MultiHeaderTable from './index';

const MultiHeaderTableExample: React.FC = () => {
	// 表头配置
	const headers = [
		{
			name: '日期',
			key: 'date'
		},
		{
			name: '产品A',
			children: [
				{ name: '销量', key: 'a_sales' },
				{ name: '销售额', key: 'a_revenue' }
			]
		},
		{
			name: '产品B',
			children: [
				{ name: '销量', key: 'b_sales' },
				{ name: '销售额', key: 'b_revenue' },
				{
					name: '增长率',
					children: [
						{ name: '周环比', key: 'b_week_growth' },
						{ name: '月环比', key: 'b_month_growth' }
					]
				}
			]
		},
		{
			name: '总计',
			key: 'total'
		}
	];

	// 表格数据
	const [tableData, setTableData] = useState([
		{
			date: '2023-01-01',
			a_sales: 120,
			a_revenue: 6000,
			b_sales: 80,
			b_revenue: 4000,
			b_week_growth: '12%',
			b_month_growth: '8%',
			total: 10000
		},
		{
			date: '2023-01-02',
			a_sales: 150,
			a_revenue: 7500,
			b_sales: 95,
			b_revenue: 4750,
			b_week_growth: '8%',
			b_month_growth: '5%',
			total: 12250
		},
		{
			date: '2023-01-03',
			a_sales: 180,
			a_revenue: 9000,
			b_sales: 110,
			b_revenue: 5500,
			b_week_growth: '15%',
			b_month_growth: '10%',
			total: 14500
		}
	]);

	// 添加新数据
	const addNewRow = () => {
		const newData = {
			date: `2023-01-0${tableData.length + 1}`,
			a_sales: Math.floor(Math.random() * 200),
			a_revenue: Math.floor(Math.random() * 10000),
			b_sales: Math.floor(Math.random() * 150),
			b_revenue: Math.floor(Math.random() * 8000),
			b_week_growth: `${Math.floor(Math.random() * 20)}%`,
			b_month_growth: `${Math.floor(Math.random() * 15)}%`,
			total: 0
		};

		newData.total = newData.a_revenue + newData.b_revenue;

		setTableData([...tableData, newData]);
	};

	// 更新第一行数据
	const updateFirstRow = () => {
		if (tableData.length > 0) {
			const updatedData = [...tableData];
			updatedData[0] = {
				...updatedData[0],
				a_sales: Math.floor(Math.random() * 200),
				a_revenue: Math.floor(Math.random() * 10000)
			};
			setTableData(updatedData);
		}
	};

	return (
		<div
			className="multi-header-table-demo"
			style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}
		>
			<h2>动态生成多层表头表格示例</h2>

			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={addNewRow}
					style={{
						marginRight: '10px',
						padding: '8px 16px',
						backgroundColor: '#4CAF50',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					添加新数据
				</button>
				<button
					onClick={updateFirstRow}
					style={{
						padding: '8px 16px',
						backgroundColor: '#2196F3',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					更新第一行数据
				</button>
			</div>

			<div style={{ width: '100%', overflow: 'auto' }}>
				<MultiHeaderTable headers={headers} data={tableData} />
			</div>

			<div
				style={{
					marginTop: '20px',
					padding: '15px',
					backgroundColor: '#f5f5f5',
					borderRadius: '4px'
				}}
			>
				<h3>说明</h3>
				<p>
					这是一个动态生成多层表头表格的示例，展示了如何根据配置动态生成具有复杂表头结构的表格。
				</p>
				<p>特点：</p>
				<ul>
					<li>支持任意层级的表头嵌套</li>
					<li>自动计算行合并和列合并属性</li>
					<li>支持动态数据更新</li>
					<li>响应式设计，适配不同屏幕尺寸</li>
				</ul>
			</div>
		</div>
	);
};

export default MultiHeaderTableExample;
