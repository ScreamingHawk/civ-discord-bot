require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const log = require('./util/logger')
const database = require('./util/database')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const configureDataRoutes = require('./routes/data')

const clientFolder = path.join(__dirname, '..', 'client/build')

// Accept json
app.use(bodyParser.json())

// Serve static files
app.use(express.static(clientFolder))

const store = {
	games: [],
	players : [],
}
// Init data from database
database.init(store, (err) => {
	if (err){
		log.error('Unable to load players on init')
	}
})

io.on('connection', socket => {
	configureDataRoutes(io, socket, store)
})

require('./routes/notify')(app, store)

// Fail over
app.get('*', (req, res)=>{
	res.sendFile(path.join(clientFolder, 'index.html'))
})

// Start up
const port = process.env.PORT || 5000
server.listen(port)

log.info(`Listing on port ${port}`)
