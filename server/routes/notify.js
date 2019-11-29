const log = require('../util/logger')
const discord = require('../util/discord')

const DEFAULT_CHANNEL = '478506811238907904'

module.exports = configureNotify = (app, store) => {
	app.post('/notify/turn', (req, res) => {
		log.debug(JSON.stringify(req.body))
		let gameName = req.body.value1
		let civPlayer = req.body.value2
		if (!gameName || ! civPlayer){
			res.sendStatus(400)
			return
		}
		log.info(`Notifying ${civPlayer} of turn in game ${gameName}`)

		let player = store.players.filter(p => p.civname === civPlayer)[0]

		if (!player){
			log.warn(`Unable to find player with civName ${civPlayer}`)
			player = civPlayer
		} else {
			player = `<@${player.discordid}>`
		}
		
		let channel = store.games.filter(g => g.name === gameName)[0]
		channel = discord.channels.get(channel)
		if (!channel){
			channel = discord.channels.get(DEFAULT_CHANNEL)
		}
		
		const message = `Hey ${player}! It's your turn in Civ 6 game ${gameName}`
		log.debug(message)
		channel.send(message);
		res.sendStatus(200)
		return
	})
	app.post('/notify/send', (req, res) => {
		const content = req.body.content
		if (!content){
			// Fail no content
			res.sendStatus(400)
			return
		}
		const channel = req.body.channel || DEFAULT_CHANNEL
		log.debug(`Sending: ${content}`)
		let chan = discord.channels.get(channel)
		if (chan == null){
			// Fail invalid channel
			log.error('Attempt to send to invalid channel')
			res.sendStatus(400)
			return
		}
		discord.channels.get(channel).send(content)
		res.sendStatus(200)
	})
}
