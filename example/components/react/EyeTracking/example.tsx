import React from 'react';
import EyeTracking from './index';

const EyeTrackingExample: React.FC = () => {
	return (
		<div
			className="eye-tracking-demo"
			style={{
				width: '600px',
				height: '500px',
				margin: '0 auto',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<EyeTracking
				eyeSize={100}
				pupilSize={35}
				eyeColor="#f8f8f8"
				pupilColor="#333333"
				borderColor="#cccccc"
				pupilBorderWidth={8}
				pupilBorderColor="#999999"
			/>
		</div>
	);
};

export default EyeTrackingExample;
