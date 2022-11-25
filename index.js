const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, guildId } = require('./config.json');
const fs = require('fs')
const {messageCommandProvider} = require('./message-commands');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers] });

// Register Commands
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
		console.log(error)
	}
});

client.on('messageCreate', async message => {
	messageCommandProvider(message)
})

client.on('voiceStateUpdate', async (oldState, newState) => {
	
	let newUserChannel = newState.channel
  	let oldUserChannel = oldState.channel
	  // John, Kevin
	const usersToNotifyWhenChrisJoins = ['185960849318346752','111611545674375168']
	// This is specific to bucko joining the valorant voice channel
	if(oldUserChannel === null && newUserChannel !== undefined && newUserChannel.id === '745517708388597771') {
		usersToNotifyWhenChrisJoins.forEach(async user => {
			let currentUser = await client.users.fetch(user, false)
			// await currentUser.send('Chris has joined the valorant voice channel!')
		})
	}
})

client.login(token);