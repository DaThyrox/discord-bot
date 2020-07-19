/* eslint-disable no-undef */
require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Get the necessary .env variables
const {
	token,
	prefix
} = require('./config');

// Get all the command files imported
for (const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Bot has connected and is ready.
client.once('ready', () => {
	client.user.setActivity('how to code a bot', { type: 'WATCHING' });
	console.log('ThyBot is ready to work.');
});

// Websocket and network errors
client.on('shardError', error => {
	console.error('Websocket error:', error);
});

// API Error handling
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

// If a new message has been sent to the channel, check if it is a command and execute the command.
client.on('message', message => {
	// Message must start with the set prefix and cannot be send by the Bot itself.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Split the arguments into args
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	// Lower case the command
	const commandName = args.shift().toLowerCase();

	// Command doesn't exist
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	// Check if a command can only be executed in a specific guild.
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	/* if (command.args && !args.length){
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	} */

	// Cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Execute command, currently limited to a specific channel.
	try{
		if(message.channel.name === 'thybot_test') command.execute(message, args);
	} catch (error){
		console.error(error);
		message.reply('An error occurred.');
	}
});

// Automatically assign a role to a new joined user in the Discord. Currently deactivated.
client.on('guildMemberAdd', guildMember => {
	console.log(guildMember.guild.name);
	if(guildMember.guild.name === 'NoobEliteTeam') console.log('');
	// let role = guildMember.guild.roles.find('name', 'EliteNoob');
	// guildMember.addRole(role);
});
client.login(token);