const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const fs = require('fs')
const path = require("path")

function getUserFromMention(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(USERS_PATTERN);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// The first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fire')
		.setDescription('reserved only for Shiny to fire people')
		.addUserOption(option => option.setName('user').setDescription('Select a user')),
	async execute(interaction) {
		let currentUserId = interaction.user.id
		

		if(currentUserId !== '204486743020273664'){
			return interaction.reply({ content: `You can't fire people!`, ephemeral: true})
		}
		let targetUser = interaction.options.getUser('user')
		if(targetUser){
			const targetUserId = targetUser.id
			let rawdata = fs.readFileSync(path.join(__dirname, '..', 'fired-db.json'))
			let firedDb = await JSON.parse(rawdata)
			if(firedDb[targetUserId]){
				const value = firedDb[targetUserId] + 1
				firedDb[targetUserId] = value 
				let updatedFiredDb = await JSON.stringify(firedDb);
				console.log(updatedFiredDb)
				await fs.writeFileSync(path.join(__dirname, '..', '/fired-db.json'), updatedFiredDb);
				return interaction.reply({ content: `<@${targetUserId}> YOU'RE FIRED! You have been fired ${value} time${value > 1 ? 's': ''}`, ephemeral: false})
			} else {
				firedDb[targetUserId] = 1
				let updatedFiredDb = await JSON.stringify(firedDb);
				await fs.writeFileSync(path.join(__dirname, '..', '/fired-db.json'), updatedFiredDb);
				return interaction.reply({ content: `<@${targetUserId}> YOU'RE FIRED! You have been fired 1 time`, ephemeral: false})
			}
		}
	},
};