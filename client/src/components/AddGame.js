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
		name: "",
		channel: "",
	}

	updateName = e => {
		this.setState({
			name: e.target.value,
		})
	}
	updateChannel = e => {
		this.setState({
			channel: e.target.value,
		})
	}

	handleSubmit = e => {
		if (e){
			e.preventDefault();
		}
		const { name, channel } = this.state
		if (name === "" || channel === ""){
			return
		}
		this.setState({
			loaded: false,
		}, () => {
			socket.emit('add game', {
				name,
				channel,
			})
			this.setState({
				loaded: true,
				name: "",
				channel: "",
			})
		})
	}

	render() {
		const {
			loaded,
			name,
			channel,
		} = this.state;
		return (
			<StyledAddGame>
				{loaded ? (
					<StyledForm onSubmit={this.handleSubmit}>
						<Input
							value={name}
							placeholder="Game's Name"
							onChange={this.updateName} />
						<Input
							value={channel}
							placeholder="Discord Channel Id"
							onChange={this.updateChannel} />
						<Button
								type="submit">
							Add Game
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
