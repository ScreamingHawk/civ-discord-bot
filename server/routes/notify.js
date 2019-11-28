const discordjs = require('discord.js')
const discord = new discordjs.Client()

const log = require('../util/logger')

const discordToken = process.env.DISCORD_TOKEN
const discPrefix = process.env.DISCORD_PREFIX || ""

configureDiscord = () => {
	discord.on('ready', () => {
		log.info('Discord login successful!')
	})
	discord.on('message', msg => {
		if (msg.author.id === discord.user.id){
			log.debug('Ignoring myself')
			return
		}
		const c = msg.content
		if (c === `Morning`){
			msg.channel.send('Morning')
			return
		}
		if (c.startsWith(discPrefix)){
			if (c === `${discPrefix}ChannelId`){
				msg.channel.send(`Channel Id is: ${msg.channel.id}`)
				log.debug(`Channel Id is: ${msg.channel.id}`)
				return
			}
		}
	})
}

module.exports = configureNotify = (app, store) => {
	app.post('/notify/turn', (req, res) => {
		log.debug(JSON.stringify(req.body))
		let gameName = req.body.value1
		let playerName = req.body.value2
		if (!gameName || ! playerName){
			res.sendStatus(400)
			return
		}
		log.info(`Notifying ${playerName} of turn in game ${gameName}`)
		//TODO Add discord notification here
		res.sendStatus(200)
		return
	})
	app.post('/notify/send', (req, res) => {
		const content = req.body.content
		if (content === null || content === ""){
			// Fail no content
			res.sendStatus(400)
			return
		}
		const channel = req.body.channel || '478506811238907904'
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

if (!discordToken) {
	for (let i = 10; i --; ) log.error('NO DISCORD TOKEN!!!')
} else {
	configureDiscord()
	discord.login(discordToken)
}