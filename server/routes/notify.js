const log = require('../util/logger')

module.exports = configureNotify = (app, store) => {
	app.post('/notify', (req, res) => {
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
	// Set up stuff here
}
