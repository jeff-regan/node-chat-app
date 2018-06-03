'use strict;'

var socket = io();
socket.on('connect', function() {
	console.log('Connected to server');

	socket.on('newMessage', function(payload) {
		let formattedTime = moment(payload.createdAt).format('h:mm a');
		let li = $('<li></li>');
		li.text(`${payload.from} ${formattedTime}: ${payload.text}`);
		$('#messages').append(li);
	});
});

socket.on('newLocationMessage', function(message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');
	let li = $('<li></li>');
	let a = $('<a target="_blank">My Current Location</a>');
	li.text(`${message.from}  ${formattedTime}: `);
	a.attr('href', message.url);
	li.append(a);
	$('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
	const messageTextbox = $('input[name=message]')
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val(),
	}, function() {
		messageTextbox.val('');
	});
});

let locationButton = $('#send-location');
let locationButtonLabel = locationButton.text();

locationButton.on('click', function(e) {
	e.preventDefault();
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');
	navigator.geolocation.getCurrentPosition(
		function(position) {
			locationButton.removeAttr('disabled').text(locationButtonLabel);
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		},
		function() {
			locationButton.removeAttr('disabled').text(locationButtonLabel);
			alert('Unable to fetch location. Boo Hoo');
		}
	);
});
