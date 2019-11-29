const {
	Pool,
} = require('pg')
const async = require('async')

const log = require('./logger')

const connectionString = process.env.DATABASE_URL || 'postgresql://civ:civ@localhost/civ'

const pool = new Pool({
	connectionString: connectionString,
	//ssl: true,
})

init = (store, next) => {
	createDatabase(err => {
		if (err){
			log.error('Unable to init database', err)
			return next(err)
		}
		async.parallel([
			callback => {
				loadPlayers((err, players) => {
					if (err){
						return callback(err)
					}
					store.players = players
				})
			},
			callback => {
				loadGames((err, games) => {
					if (err){
						return callback(err)
					}
					store.games = games
				})
			},
		], err => {
			if (err){
				log.error('Initialisation completed with errors')
			} else {
				log.info('Initialisation completed successfully')
			}
			next(err)
		})
	})
}

checkErr = err => {
	if (err){
		log.error(err)
		throw err
	}
}

callThese = (done, next) => {
	if (done){
		done()
	}
	if (next){
		next()
	}
}

clearDatabase = next => {
	// Clear
	log.warn("Dropping database tables")
	pool.connect((err, client, done) => {
		checkErr(err)
		async.parallel(
			[
				callback => {
					client.query('DROP TABLE IF EXISTS players', (err, res) => {
						log.info('Dropped players table')
						callback(err)
					})
				},
				callback => {
					client.query('DROP TABLE IF EXISTS games', (err, res) => {
						log.info('Dropped games table')
						callback(err)
					})
				},
			], err => {
				checkErr(err)
				callThese(done, next)
			}
		)
	})
}

createDatabase = next => {
	// Check and upgrade database
	pool.connect((err, client, done) => {
		checkErr(err)
		async.parallel(
			[
				callback => {
					client.query('SELECT count(table_name) FROM information_schema.tables WHERE table_name = \'players\'', (err, res) => {
						if (err){
							return callback(err)
						}
						if (res.rows[0].count === "0"){
							// Create missing table
							log.warn("Creating database table players")
							client.query('CREATE TABLE players (\
								id INT PRIMARY KEY,\
								civname VARCHAR(40),\
								discordid VARCHAR(40)\
							);', (err, res)=> {
								if (err){
									return callback(err)
								}
								log.info('Created players table')
								callback()
							})
						} else {
							callback()
						}
					})
				},
				callback => {
					client.query('SELECT count(table_name) FROM information_schema.tables WHERE table_name = \'games\'', (err, res) => {
						if (err){
							return callback(err)
						}
						if (res.rows[0].count === "0"){
							// Create missing table
							log.warn("Creating database table games")
							client.query('CREATE TABLE games (\
								id INT PRIMARY KEY,\
								name VARCHAR(40),\
								channel VARCHAR(20)\
							);', (err, res)=> {
								if (err){
									return callback(err)
								}
								log.info('Created games table')
								callback()
							})
						} else {
							callback()
						}
					})
				},
			], err => {
				checkErr(err)
				callThese(done, next)
			}
		)
	})
}

savePlayers = (players, next) => {
	// Store players
	log.debug("Saving players: ")
	pool.connect((err, client, done) => {
		checkErr(err)
		async.forEach(players, (player, callback)=>{
			client.query({
				text: 'INSERT INTO players (id, civname, discordid)\
					VALUES ($1, $2, $3)\
					ON CONFLICT (id) DO UPDATE\
						SET civname = $2, discordid = $3',
				values: [player.id, player.civname, player.discordid]
			}, err => {
				callback(err)
			})
		}, err => {
			checkErr(err)
			callThese(done, next)
			log.info(`Saved ${players.length} players`)
		})
	})
}

loadPlayers = next => {
	// Load players
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query('SELECT * FROM players', (err, res) => {
			checkErr(err)
			done()
			next(err, res.rows)
			log.info(`Loaded ${res.rows.length} players`)
		})
	})
}

loadGames = next => {
	// Load games
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query('SELECT * FROM games', (err, res) => {
			checkErr(err)
			done()
			next(err, res.rows)
			log.info(`Loaded ${res.rows.length} games`)
		})
	})
}

addPlayer = (player, next) => {
	// Add player
	log.debug("Saving player: ")
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query({
			text: 'INSERT INTO players (id, civname, discordid)\
				SELECT COALESCE(MAX(id), 0)+1, $1, $2 from Players',
			values: [player.civname, player.discordid]
		}, err => {
			checkErr(err)
			callThese(done, next)
			log.info(`Saved player ${player.civname}:${player.discordid}`)
		})
	})
}

addGame = (game, next) => {
	// Add game
	log.debug("Saving game: ")
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query({
			text: 'INSERT INTO games (id, name, channel)\
				SELECT COALESCE(MAX(id), 0)+1, $1, $2 from games',
			values: [game.name, game.channel]
		}, err => {
			checkErr(err)
			callThese(done, next)
			log.info(`Saved game ${game.name}`)
		})
	})
}

getNextPlayerId = next => {
	// Get next id
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query('SELECT COALESCE(MAX(id), 0)+1 as nextId FROM players', (err, res) => {
			checkErr(err)
			done()
			const nextId = res.rows[0].nextId
			next(err, nextId)
			log.debug(`Next player id is ${nextId}`)
		})
	})
}

deletePlayer = (playerId, next) => {
	// Delete player
	log.debug(`Deleting player with id ${playerId}`)
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query({
			text: 'DELETE FROM players WHERE id = $1',
			values: [playerId],
		}, (err, res) => {
			checkErr(err)
			callThese(done, next)
			log.info(`Deleted player with id ${playerId}`)
		})
	})
}

module.exports = {
	init,
	createDatabase,
	clearDatabase,
	savePlayers,
	loadPlayers,
	loadGames,
	addPlayer,
	addGame,
	getNextPlayerId,
	deletePlayer,
}
