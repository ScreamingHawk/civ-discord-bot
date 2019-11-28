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

const StyledNoPlayers = styled.span`
	width: 100%;
	font-style: italic;
	text-align: center;
`

const ListPlayers = () => {

	const [players, setPlayers] = useState([])

	useEffect(() => {
		// Listen for players
		socket.on('players are', c => {
			setPlayers(c)
		})

		// Unsub
		return () => {
			socket.off('players are')
		}
	})

	if (players.length === 0){
		return (
			<Wrapper>
				<H2>Players List</H2>
				<StyledNoPlayers>No players...</StyledNoPlayers>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			<H2>Players List</H2>
			<StyledTable>
				<tr>
					<th>Civ Name</th>
					<th>Discord Name</th>
				</tr>
				{players.map((player, i) => (
					<tr key={i}>
						<td>{player.civname}</td>
						<td>{player.discordname}</td>
					</tr>
				))}
			</StyledTable>
		</Wrapper>
	)

}

export default ListPlayers
