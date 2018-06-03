'use strict;'

var socket = io();
socket.on('connect', function() {
	console.log('Connected to server');

	socket.on('newMessage', function(payload) {
		let li = $('<li></li>');
		li.text(`${payload.from}: ${payload.text}`);
		$('#messages').append(li);
	});
});

socket.on('newLocationMessage', function(message) {
	let li = $('<li></li>');
	let a = $('<a target="_blank">My Current Location</a>');
	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
	$('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: $('input[name=message]').val(),
	}, function() {
		$('input[name=message]').val('');
	});
});

$('#send-location').on('click', function(e) {
	e.preventDefault();
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}
	navigator.geolocation.getCurrentPosition(
		function(position) {
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		},
		function() {
			alert('Unable to fetch location. Boo Hoo');
		}
	);
});
