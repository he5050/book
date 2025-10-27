import React from 'react';
import MovieSeatSelection from './index';

const MovieSeatSelectionExample: React.FC = () => {
	const handleSeatSelect = (seats: any[]) => {
		console.log('选中座位:', seats);
	};

	return (
		<div
			className="movie-seat-selection-demo"
			style={{ width: '600px', height: '500px', margin: '0 auto' }}
		>
			<MovieSeatSelection
				width={600}
				height={500}
				onSeatSelect={handleSeatSelect}
				userId="user123"
			/>
		</div>
	);
};

export default MovieSeatSelectionExample;
