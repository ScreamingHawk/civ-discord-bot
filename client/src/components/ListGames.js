import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import socket from '../global/socket'

import H2 from './base/H2'

const Wrapper = styled.div`
	width: 100%
	display: flex;
	flex-direction: column;
`

const StyledTable = styled.table`
	width: 100%;
	max-width: 920px;
	margin: 0 auto 20px;
	table-layout: fixed;
	border-spacing: 0;
	border-collapse: collapse;
	td, th {
		padding: 4px;
	}
	th {
		text-align: left;
		border-bottom: 1px solid lightgrey;
	}
	th:first-child,
	td:first-child {
		text-align: right;
		border-right: 1px solid lightgrey;
	}
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

	if (games.length === 0){
		return (
			<Wrapper>
				<H2>Games List</H2>
				<StyledNoGames>No games...</StyledNoGames>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			<H2>Games List</H2>
			<StyledTable>
				<tr>
					<th>Name</th>
					<th>Discord Channel Id</th>
				</tr>
				{games.map((game, i) => (
					<tr key={i}>
						<td>{game.name}</td>
						<td>{game.channel}</td>
					</tr>
				))}
			</StyledTable>
		</Wrapper>
	)

}

export default ListGames
