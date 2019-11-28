import React from 'react';

import H1 from './components/base/H1'

import AddGame from './components/AddGame'
import AddPlayer from './components/AddPlayer'
import ListGames from './components/ListGames';
import HR from './components/base/HR';
import ListPlayers from './components/ListPlayers';

function App() {
	return (
		<div>
			<H1>Civ Discord notification service</H1>
			<HR />
			<ListGames />
			<AddGame />
			<HR />
			<ListPlayers />
			<AddPlayer />
		</div>
	)
}

export default App
