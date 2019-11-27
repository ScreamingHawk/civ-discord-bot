import React from 'react';
import logo from './logo.svg';
import './App.css';

import socket from './global/socket'
import AddGame from './components/AddGame';

function App() {
	return (
		<div>
			<AddGame />
		</div>
	);
}

export default App;
