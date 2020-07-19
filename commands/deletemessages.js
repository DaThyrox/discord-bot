module.exports = {
	name: 'deletemessages',
	description: 'Deletes the previous X messages in that channel. Minimum 2, maximum 100.',
	args: true,
	cooldown: 5,
	guildOnly: true,
	execute(message, args){
		const amount = parseInt(args[0]);

		if(isNaN(amount)) {
			return message.reply('You need to specify the amount of past messages you would like to delete.');
		} else if (amount < 2 || amount > 100){
			return message.reply('Please enter a number between 2 and 100.');
		}
		message.channel.bulkDelete(amount);
	},
};