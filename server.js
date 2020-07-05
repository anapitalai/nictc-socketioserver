const express = require('express')
const socket = require('socket.io')


const app = express()



const server = app.listen(4000, function () {
    console.log('Listening on port 4000')
})


//socket setup
const io = socket(server)


io.on('connection', function (socket) {
    console.log(
        'Connection made from the client', socket.id)

    //handle message from the client
    socket.on('chat', function (data) {
        //emits all chat message to all connected sockets
        io.sockets.emit('chat', data)
    })

        //handle message from the client
        socket.on('typing', function (data) {
            //emits all typing message to all connected sockets
            socket.broadcast.emit('typing', data)
        })
})



