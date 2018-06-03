const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('Should generate correct message object', () => {
		const from = 'Jen';
		const text = 'Some Message';
		const message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from,text});
	});
});

describe('generateLocationMessage', () => {
	it('Should generate a correct location message object', () => {
		const from = 'Admin';
		const latitude = 45.15;
		const longitude = -34.56;
		const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
		const message = generateLocationMessage(from, latitude, longitude);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, url});
	});
});