const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const  {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', (newMessage,  callback) => {
		io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
