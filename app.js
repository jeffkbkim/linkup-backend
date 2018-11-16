let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);
let userIdCounter = 1;
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('user connected');
    socket.in('groupId: 100').emit('event', 'message');
    socket.emit('userId', userIdCounter);
    console.log(userIdCounter);
    userIdCounter++;
    socket.on('userId: 1', (position) => {
        console.log(position);
        //         
    });
    socket.on('disconnect', (socket) => {
        console.log('user disconnected.');
    });
    socket.on('groupId: 100', (position) => {
        console.log(position);
        io.sockets.emit('groupId: 100', position);
    });
});


server.listen(port, () => {
    console.log(`started on port: ${port}`);
});