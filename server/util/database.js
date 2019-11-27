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
		client.query('DROP TABLE IF EXISTS players', (err, res) => {
			checkErr(err)
			log.info('Dropped players table')
			callThese(done, next)
		})
	})
}

createDatabase = next => {
	// Check and upgrade database
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query('SELECT count(table_name) FROM information_schema.tables WHERE table_name = \'players\'', (err, res) => {
			checkErr(err)
			if (res.rows[0].count === "0"){
				// Create missing table
				log.warn("Creating database tables")
				client.query('CREATE TABLE players (\
					id INT PRIMARY KEY,\
					civName VARCHAR(40),\
					discordName VARCHAR(40)\
				);', (err, res)=> {
					checkErr(err)
					log.info('Created players table')
					callThese(done, next)
				})
			} else {
				callThese(done, next)
			}
		})
	})
}

savePlayers = (players, next) => {
	// Store players
	log.debug("Saving players: ")
	pool.connect((err, client, done) => {
		checkErr(err)
		async.forEach(players, (player, callback)=>{
			client.query({
				text: 'INSERT INTO players (id, civName, discordName)\
					VALUES ($1, $2, $3)\
					ON CONFLICT (id) DO UPDATE\
						SET civName = $2, discordName = $3',
				values: [player.id, player.civName, player.discordName]
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

addPlayer = (player, next) => {
	// Add player
	log.debug("Saving player: ")
	pool.connect((err, client, done) => {
		checkErr(err)
		client.query({
			text: 'INSERT INTO players (id, civName, discordName)\
				SELECT COALESCE(MAX(id), 0)+1, $1, $2 from Players',
			values: [player.civName, player.discordName]
		}, err => {
			checkErr(err)
			callThese(done, next)
			log.info(`Saved player ${player.civName}:${player.discordName}`)
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
	createDatabase,
	clearDatabase,
	savePlayers,
	loadPlayers,
	addPlayer,
	getNextPlayerId,
	deletePlayer,
}
