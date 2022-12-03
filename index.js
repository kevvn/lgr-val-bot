const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Register Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isButton()) {
      const buttonUser = interaction.user.id;
      const commandUser = interaction.message.interaction.user.id;
      if (buttonUser === commandUser) {
        if (interaction.message.content.includes('Blackjack')) {
          const command = client.commands.get('blackjack');
          if (!command) return;

          await command.execute(interaction, interaction.customId);
          return;
        }
      }
    }

    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      await command.execute(interaction);
    }
  } catch (error) {
    console.log(error);
  }
});

client.on('messageCreate', async (message) => {
  // 835044781839089664 is the valorant channel
  // if(message.channelId === '835044781839089664' && /lf\dm/.test(message.content.toLocaleLowerCase())){
  // 	let rawdata = fs.readFileSync(path.join(__dirname, 'looking-for-queue.json'))
  // 	let lookingForQueue = await JSON.parse(rawdata);
  // 	let mentionString = ''
  // 	if(lookingForQueue.length === 0) {
  // 		message.channel.send('No one is on deck')
  // 		return
  // 	}
  // 	for(index in lookingForQueue){
  // 		mentionString += ` <@${lookingForQueue[index]}>`
  // 	}
  // 	mentionString += ' WAKE UP BITCHES ITS VALOTIME'
  // 	message.channel.send(mentionString)
  // }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  let newUserChannel = newState.channel;
  let oldUserChannel = oldState.channel;
  // John, Kevin
  const usersToNotifyWhenChrisJoins = ['185960849318346752', '111611545674375168'];
  // This is specific to bucko joining the valorant voice channel
  if (oldUserChannel === null && newUserChannel !== undefined && newUserChannel.id === '745517708388597771') {
    usersToNotifyWhenChrisJoins.forEach(async (user) => {
      let currentUser = await client.users.fetch(user, false);
      // await currentUser.send('Chris has joined the valorant voice channel!')
    });
  }
});

client.login(token);
