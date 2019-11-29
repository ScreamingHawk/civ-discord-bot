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
			} else if (c === `${discPrefix}UserId`){
				msg.channel.send(`User Id is: ${msg.author.id}`)
				log.debug(`User Id is: ${msg.author.id}`)
				return
			}
		}
	})
}

if (!discordToken) {
	for (let i = 10; i --; ) log.error('NO DISCORD TOKEN!!!')
} else {
	configureDiscord()
	discord.login(discordToken)
}

module.exports = discord