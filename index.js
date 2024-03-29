const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const {messageCommandProvider} = require('./message-commands');
const { db } = require('./services/firestore');
const { DB_USER_COLLECTION } = require('./constants');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
	GatewayIntentBits.MessageContent
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

client.on('messageCreate', async message => {
	messageCommandProvider(message)
})

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
client.on('guildMemberAdd', member => {
    db.collection(DB_USER_COLLECTION).doc(member.id).set({
		wallet: 0,
		inviteFrom: "",
		username: member.user.username
	});
});
client.login(token);
