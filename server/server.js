const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const log = require('./util/logger')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const configureExample = require('./routes/example')

const clientFolder = path.join(__dirname, '..', 'client/build')

// Accept json
app.use(bodyParser.json())

// Serve static files
app.use(express.static(clientFolder))

let connectedCount = 0

const store = {
	users: [],
}
const common = {
	countActiveUsers: () => {
		if (store.users.length > 1){
			return store.users.reduce((a, u) => a + (u.active ? 1 : 0), 0)
		} else if (store.users.length == 1){
			return store.users[0].active ? 1 : 0
		}
		return 0
	}
}

io.on('connection', socket => {
	log.debug("A user connected")
	connectedCount++
	log.debug(`There are ${connectedCount} connected users`)

	socket.on('disconnect', () => {
		log.debug("A user disconnected")
		connectedCount--
		log.debug(`There are ${connectedCount} connected users`)
		// Deactivate user
		const user = store.users.find(u => u.id === socket.id)
		if (user){
			user.active = false
		}
		io.emit('users is', store.users)
	})

	configureExample(io, socket, store)
})

// Fail over
app.get('*', (req, res)=>{
	res.sendFile(path.join(clientFolder, 'index.html'))
})

// Start up
const port = process.env.PORT || 5000
server.listen(port)

log.info(`Listing on port ${port}`)
