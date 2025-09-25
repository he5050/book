import React from 'react';
import './index.scss';

const SimpleCubeLoader: React.FC = () => {
	return (
		<div className="simple-cube-loader-wrapper">
			<div className="loader3d">
				<div className="cube">
					<div className="face"></div>
					<div className="face"></div>
					<div className="face"></div>
					<div className="face"></div>
					<div className="face"></div>
					<div className="face"></div>
				</div>
			</div>
		</div>
	);
};

export default SimpleCubeLoader;
