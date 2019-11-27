const log = require('../util/logger')
const database = require('../util/database')

module.exports = (io, socket, store) => {
	socket.on('add game', newGame => {
		log.info(`Adding game ${newGame}`)
		store.games.push({
			name: newGame
		})
		io.emit('games', store.games)
	})
	socket.on('add player', player => {
		if (!player.civName || !player.discordName){
			log.error(`Unable to add incomplete player ${JSON.stringify(player)}`)
			return
		}
		log.info(`Adding player ${JSON.stringify(player)}`)
		database.addPlayer(player, (err) => {
			if (err){
				log.error('Unable to add player')
				return
			}
			// Update store and emit
			database.loadPlayers((err, loaded) => {
				if (err){
					log.error('Unable to load players')
					return
				}
				if (loaded){
					store.players = loaded
					io.emit('players', store.players)
				}
			})
		})
	})
}
