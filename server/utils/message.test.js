const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('Should generate correct message object', () => {
		const from = 'Jen';
		const text = 'Some Message';
		const message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from,text});
	});
});