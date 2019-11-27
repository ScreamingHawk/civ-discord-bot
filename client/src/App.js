import React from 'react';

import H1 from './components/base/H1'

import AddGame from './components/AddGame'
import AddPlayer from './components/AddPlayer'

function App() {
	return (
		<div>
			<H1>Civ Discord notification service</H1>
			<AddGame />
			<AddPlayer />
		</div>
	)
}

export default App
