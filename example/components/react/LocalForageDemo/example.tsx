import React from 'react';
import LocalForageDemo from './index';

const LocalForageDemoExample: React.FC = () => {
	return (
		<div style={{ padding: '20px' }}>
			<h1>localForage 示例</h1>
			<LocalForageDemo dbName="demoDB" storeName="demoStore" width={600}  />
		</div>
	);
};

export default LocalForageDemoExample;
