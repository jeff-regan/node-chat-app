'use strict;'

var socket = io();

function scrollToBottom() {
	// Selectors
	const messages = $('#messages');
	// Heights
	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = $('#messages li').last().innerHeight();
	let lastMessageHeight = $('#messages li:nth-last-child(2)').innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	const params = $.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No errors');
		}
	});
});

socket.on('updateUserList', function(users) {
	let ol = $('<ol></ol>');
	users.forEach(function(user) {
		ol.append($('<li></li>').text(user));
	});
	$('#users').html(ol);
});

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

socket.on('newLocationMessage', function(message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');
	let template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

$('#message-form').on('submit', function(e) {
	const messageTextbox = $('input[name=message]')
	e.preventDefault();
	socket.emit('createMessage', {
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
