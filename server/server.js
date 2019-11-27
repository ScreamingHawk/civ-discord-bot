const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const log = require('./util/logger')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const configureGames = require('./routes/games')

const clientFolder = path.join(__dirname, '..', 'client/build')

// Accept json
app.use(bodyParser.json())

// Serve static files
app.use(express.static(clientFolder))

const store = {
	games: [],
}

io.on('connection', socket => {
	configureGames(io, socket, store)
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
