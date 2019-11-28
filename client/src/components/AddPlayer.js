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
		civname: "",
		discordname: "",
	}

	updateCivname = e => {
		this.setState({
			civname: e.target.value,
		})
	}
	updateDiscordname = e => {
		this.setState({
			discordname: e.target.value,
		})
	}

	handleSubmit = e => {
		if (e){
			e.preventDefault();
		}
		const { civname, discordname } = this.state
		if (civname === "" || discordname === ""){
			return
		}
		this.setState({
			loaded: false,
		}, () => {
			socket.emit('add player', {
				civname,
				discordname,
			})
			this.setState({
				loaded: true,
				civname: "",
				discordname: "",
			})
		})
	}

	render() {
		const {
			loaded,
			civname,
			discordname,
		} = this.state;
		return (
			<StyledAddPlayer>
				{loaded ? (
					<StyledForm onSubmit={this.handleSubmit}>
						<Input
							value={civname}
							placeholder="Player's Civ Name"
							onChange={this.updateCivname} />
						<Input
							value={discordname}
							placeholder="Player's Discord Name"
							onChange={this.updateDiscordname} />
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
