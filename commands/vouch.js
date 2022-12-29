const { SlashCommandBuilder } = require('@discordjs/builders');
const { DB_USER_COLLECTION } = require('../constants');
const { db } = require('../services/firestore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vouch')
		.setDescription('vouch for a user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
        let {id: targetUserId} = interaction.options.getUser('user');
        const currentUser = interaction.user;
        const inviteUserId = currentUser.id
       

        await db.collection(DB_USER_COLLECTION).doc(`${targetUserId}`).update({
            inviteFrom: inviteUserId,
        })
		return interaction.reply({ content: `<@${inviteUserId}> vouched for <@${targetUserId}>`});
	},
};