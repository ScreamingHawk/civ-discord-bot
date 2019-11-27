import React, { Component } from 'react'
import styled from 'styled-components'

import socket from '../global/socket'

import Button from './base/Button'
import Input from './base/Input'

const StyledAddPlayer = styled.div`
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

class AddPlayer extends Component {
	state = {
		loaded: true,
		civName: "",
		discordName: "",
	}

	updateCivName = e => {
		this.setState({
			civName: e.target.value,
		})
	}
	updateDiscordName = e => {
		this.setState({
			discordName: e.target.value,
		})
	}

	handleSubmit = e => {
		if (e){
			e.preventDefault();
		}
		const { civName, discordName } = this.state
		if (civName === "" || discordName === ""){
			return
		}
		this.setState({
			loaded: false,
		}, () => {
			socket.emit('add player', {
				civName,
				discordName,
			})
			this.setState({
				loaded: true,
				civName: "",
				discordName: "",
			})
		})
	}

	render() {
		const {
			loaded,
			civName,
			discordName,
		} = this.state;
		return (
			<StyledAddPlayer>
				{loaded ? (
					<StyledForm onSubmit={this.handleSubmit}>
						<Input
							value={civName}
							placeholder="Player's Civ Name"
							onChange={this.updateCivName} />
						<Input
							value={discordName}
							placeholder="Player's Discord Name"
							onChange={this.updateDiscordName} />
						<Button
								type="submit">
							Add Player
						</Button>
					</StyledForm>
				) : (
					<StyledSending>Sending...</StyledSending>
				)}
			</StyledAddPlayer>
		)
	}
}

export default AddPlayer
