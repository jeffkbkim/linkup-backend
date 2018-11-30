let express = require('express');
const kafka = require('./kafka.js');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);
let userIdCounter = 0;
const port = process.env.PORT || 3000;


function getLastPosition(userId) {
    console.log('user: ' + userId + ' disconnected.');
    const JSONbody = kafka.getLastPosition(userId, (JSONbody) => {
        const lastPosition = JSON.parse(JSONbody.value)
        lastPosition.isDisconnected = true;
        console.log('lastPosition', lastPosition);
        io.sockets.emit('groupId: 100', lastPosition);
    });
}

io.on('connection', (socket) => {
    console.log('user connected');    
    const userId = userIdCounter;
    console.log(userId);
    socket.emit('userId', userId);
    kafka.createTopic(userId);
    userIdCounter++;

    socket.on('disconnect', (socket) => {
        getLastPosition(userId);
    });

    socket.on('groupId: 100', (position) => {
        console.log(position);
        io.sockets.emit('groupId: 100', position);
        kafka.writeToTopic(userId, position);
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
