const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
	it('Should reject non-string values', () => {
		const res = isRealString(69);
		expect(res).toBe(false);
	});

	it('Should reject string with only spaces', () => {
		const res = isRealString('    ');
		expect(res).toBe(false);
	});

	it('Should allow string with non-space characters', () => {
		const res = isRealString('  Real  ');
		expect(res).toBe(true);
	});
});