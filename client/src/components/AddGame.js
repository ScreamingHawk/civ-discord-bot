import React, { Component } from 'react'
import styled from 'styled-components'

import socket from '../global/socket'

import Button from './base/Button'
import Input from './base/Input'

const StyledAddGame = styled.div`
	width: 100%
	display: flex;
	flex-direction: column;
`

const StyledForm = styled.form`
	text-align: center;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
`

const StyledSending = styled.span`
	width: 100%;
	text-align: center;
	font-style: italic;
	font-size: 1.2em;
`

class AddGame extends Component {
	state = {
		loaded: true,
		newGame: "",
	}

	updateNewGame = e => {
		this.setState({
			newGame: e.target.value,
		})
	}

	handleSubmit = e => {
		if (e){
			e.preventDefault();
		}
		const { newGame } = this.state
		if (newGame === ""){
			return
		}
		this.setState({
			loaded: false,
		}, () => {
			socket.emit('add game', newGame)
			this.setState({
				loaded: true,
				newGame: "",
			})
		})
	}

	render() {
		const {
			loaded,
			newGame,
		} = this.state;
		return (
			<StyledAddGame>
				{loaded ? (
					<StyledForm onSubmit={this.handleSubmit}>
						<Input
							value={newGame}
							placeholder="Add a game"
							onChange={this.updateNewGame} />
						<Button
								type="submit">
							Submit
						</Button>
					</StyledForm>
				) : (
					<StyledSending>Sending...</StyledSending>
				)}
			</StyledAddGame>
		)
	}
}

export default AddGame
