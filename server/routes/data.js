const log = require('../util/logger')
const database = require('../util/database')

module.exports = (io, socket, store) => {
	socket.emit('games are', store.games)
	socket.emit('players are', store.players)
	socket.on('add game', newGame => {
		log.info(`Adding game ${newGame}`)
		database.addGame(newGame, (err) => {
			if (err){
				log.error('Unable to add game')
				return
			}
			// Update store and emit
			database.loadGames((err, loaded) => {
				if (err){
					log.error('Unable to load games')
					return
				}
				if (loaded){
					store.games = loaded
					io.emit('games are', store.games)
				}
			})
		})
	})
	socket.on('add player', player => {
		if (!player.civname || !player.discordname){
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
					io.emit('players are', store.players)
				}
			})
		})
	})
}
