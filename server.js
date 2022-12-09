import './config.js'
import app from './app.js'
import mongoose from 'mongoose'
import WebSocket, { WebSocketServer } from 'ws'
import http from 'http'

const port = process.env.PORT || 8080
const dbConnection = process.env.DATABASE_CONNECTION_STRING.replace('<password>', process.env.PASSWORD)
mongoose.connect(dbConnection).then(conn => {
    console.log('Connection established')
})

// app.listen(port, () => {
//     console.log(`Listening to ${port}...`)
// })

const server = http.createServer(app)

const wss = new WebSocketServer({ server })

wss.on('connection', function(ws){
    console.log('Socket open')
    ws.on('message', function(data, isBinary) {
        wss.clients.forEach(function(client) {
            if(client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary})
            }
        })
    })
})

server.listen(port, () => console.log('Listening to the port'))