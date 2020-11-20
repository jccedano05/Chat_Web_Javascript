const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//settings
app.set('port', process.env.PORT || 4000)




// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


//Run when client connect
require('./sockets.js')(io);  //manera de requerir cuando meto un parametro


//Start Server
server.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`));