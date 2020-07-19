module.exports = {
	name: 'role',
	description: 'Specify a role for the user. Doesn\'t work, yet.',
	guildOnly: true,
	cooldown: 5,
	usage: '<user> <role>',
	execute(message) {
		console.log(message);
	},
};