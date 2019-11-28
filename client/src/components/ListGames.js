import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import socket from '../global/socket'

import H2 from './base/H2'

const Wrapper = styled.div`
	width: 100%
	display: flex;
	flex-direction: column;
`

const StyledGame = styled.span`
	width: 100%;
	text-align: center;
`

const StyledNoGames = styled.span`
	width: 100%;
	font-style: italic;
	text-align: center;
`

const ListGames = () => {

	const [games, setGames] = useState([])

	useEffect(() => {
		// Listen for games
		socket.on('games are', c => {
			setGames(c)
		})

		// Unsub
		return () => {
			socket.off('games are')
		}
	})

	return (
		<Wrapper>
			<H2>Games List</H2>
			{games.length > 0 ?
				games.map((game, i) => (
					<StyledGame key={i}>
						{game.name}
					</StyledGame>
				))
			 : (
				<StyledNoGames>No games...</StyledNoGames>
			 )}
		</Wrapper>
	)

}

export default ListGames
