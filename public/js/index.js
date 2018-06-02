'use strict;'

var socket = io();
socket.on('connect', function() {
	console.log('Connected to server');

	socket.on('newMessage', function(payload) {
		console.log('newMessage', payload);
	});
});

socket.on('disconnect', function() {
	console.log('Server connection dropped');
});
