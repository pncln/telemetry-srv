const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const events = require('events')

const app = express();
const server = http.Server(app);
const websocket = socketio(server);
const localEmitter = new events.EventEmitter();
server.listen(3000, () => {
    console.log('Listening on port 3000');
})

websocket.on('connection' , (socket) => {
    console.log('Client joined:', socket.id);
    // websocket.on('manual-disconnection' , (data) => {
    //     console.log('Client disconnected:', data);
    // })
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    });    

    socket.on('send_location', (loc) => {
        console.log(loc);
    })
})


