'use strict;'

var socket = io();
socket.on('connect', function() {
	console.log('Connected to server');

	socket.on('newMessage', function(message) {
		let formattedTime = moment(message.createdAt).format('h:mm a');
		let template = $('#message-template').html();
		let html = Mustache.render(template, {
			text: message.text,
			from: message.from,
			createdAt: formattedTime,
		});

		$('#messages').append(html);
	});
});

socket.on('newLocationMessage', function(message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');
	let template = $('#location-message-template').html();
	let html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime,
	});

	$('#messages').append(html);
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
