const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs')
const path = require("path")
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		await interaction.reply({ content: 'There was an error while executing this command!' });
	}
});

client.on('messageCreate', async message => {
	// 835044781839089664 is the valorant channel
	if(message.channelId === '835044781839089664' && /lf\dm/.test(message.content.toLocaleLowerCase())){
		let rawdata = fs.readFileSync(path.join(__dirname, 'looking-for-queue.json'))
		let lookingForQueue = await JSON.parse(rawdata);
		let mentionString = ''

		if(lookingForQueue.length === 0) {
			message.channel.send('No one is on deck')
			return
		}
		for(index in lookingForQueue){
			mentionString += ` <@${lookingForQueue[index]}>`
		}
		mentionString += ' WAKE UP BITCHES ITS VALOTIME'
		message.channel.send(mentionString)

	}
})

client.login(token);