const log = require('../util/logger')

module.exports = configureGames = (io, socket, store) => {
	socket.on('add game', newGame => {
		log.info(`Adding game ${newGame}`)
		store.games.push({
			name: newGame
		})
		io.emit('games', store.games)
	})
}
