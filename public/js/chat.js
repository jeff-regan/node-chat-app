'use strict;'

var socket = io();

function scrollToBottom() {
	// Selectors
	const messages = $('#messages');
	// Heights
	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = $('#messages li').last().height();
	let lastMessageHeight = $('#messages li:nth-last-child(2)').height();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

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
		scrollToBottom();
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
	scrollToBottom();
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

const locationButton = $('#send-location');
const locationButtonLabel = locationButton.text();

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