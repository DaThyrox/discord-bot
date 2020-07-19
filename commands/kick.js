module.exports = {
	name: 'kick',
	description: 'Kicks a specific user, currently not doing it, though.',
	cooldown: 5,
	guildOnly: true,
	usage: '<@user>',
	execute(message){
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}
		if (message.member.hasPermission('ADMINISTRATOR')) {
			const taggedUser = message.mentions.users.first();
			// taggedUser.kick();
			message.channel.send(`Kicking user: ${taggedUser.username}`);
		}
	},
};