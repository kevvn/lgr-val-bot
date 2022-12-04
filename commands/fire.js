const { db } = require('../services/firestore.js')
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
		.addUserOption(option => option.setName('user').setDescription('Select a user'))
		.addStringOption(option => option.setName('reason').setDescription('Input an optional reason')),
	async execute(interaction) {
		let currentUserId = interaction.user.id
		if( currentUserId !== '204486743020273664'){
			return interaction.reply({ content: `You can't fire people!`, ephemeral: true})
		}
		let targetUser = interaction.options.getUser('user')
		if(targetUser){
			const targetUsername = targetUser.username
			const targetUserId = targetUser.id
			const reason = interaction.options.getString('reason') ?? 'No reason provided'
			await db.collection('fire-log').add({
				'user': targetUsername,
				'reason': reason,
				'created_at': new Date()
			})
			const countQuery = await db.collection('fire-log').where('user', '==', targetUsername).count().get()
			const countResponse = countQuery.data().count
			return interaction.reply({ content: `<@${targetUserId}> YOU'RE FIRED! You have been fired ${countResponse} time${countResponse > 1 ? 's': ''}`, ephemeral: false})
		}
	},
};
