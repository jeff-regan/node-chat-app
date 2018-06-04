const expect = require('expect');

const {Users} = require('./users');


beforeEach(() => {
	users = new Users();
	users.users = [
		{id: '1', name: 'Mike', room: 'Node Course' },
		{id: '2', name: 'Ben', room: 'React Course' },
		{id: '3', name: 'Julie', room: 'Node Course' },
	];
});

describe('Users', () => {
	it('Should add new user', () => {
		const users = new Users();
		const user = {
			id: '123',
			name: 'Andrew',
			room: 'The Office Fans',
		}
		const res = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('Should remove a user', () => {
		const userId = '1';
		const user = users.removeUser(userId);

		expect(user.id).toBe(userId);
		expect(users.users.length).toBe(2);
	});

	it('Should not remove a user', () => {
		const userId = '44';
		const user = users.removeUser(userId);

		expect(user).toNotExist();
		expect(users.users.length).toBe(3);
	});

	it('Should find a user', () => {
		const userId = '2';
		const user = users.getUser(userId);

		expect(user.id).toBe(userId);
	});

	it('Should not find a user', () => {
		const userId = '44';
		const user = users.getUser(userId);

		expect(user).toNotExist();
	});

	it('Should return names for Node Course', () => {
		const userList = users.getUserList('Node Course');

		expect(userList).toEqual(['Mike', 'Julie']);
	});

	it('Should return names for React Course', () => {
		const userList = users.getUserList('React Course');

		expect(userList).toEqual(['Ben']);
	});
});