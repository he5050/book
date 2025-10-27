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
				eyeColor="#ffffff"
				pupilColor="#000000"
				borderColor="#f2761e"
				pupilBorderWidth={8}
				pupilBorderColor="#2196f3"
			/>
		</div>
	);
};

export default EyeTrackingExample;
