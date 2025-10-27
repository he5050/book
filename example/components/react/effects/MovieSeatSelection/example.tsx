import React from 'react';
import MovieSeatSelection from './index';

const MovieSeatSelectionExample: React.FC = () => {
	const handleSeatSelect = (seats: any[]) => {
		console.log('选中的座位:', seats);
	};

	return (
		<div style={{ padding: '20px' }}>
			<h2>电影选座示例</h2>
			<div style={{ width: '100%', height: '500px' }}>
				<MovieSeatSelection
					width={800}
					height={500}
					onSeatSelect={handleSeatSelect}
					userId="currentUser"
				/>
			</div>
		</div>
	);
};

export default MovieSeatSelectionExample;
