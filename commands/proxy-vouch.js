const { SlashCommandBuilder } = require('@discordjs/builders');
const { DB_USER_COLLECTION } = require('../constants');
const { db } = require('../services/firestore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('proxy-vouch')
		.setDescription('Vouch as third party')
        .addUserOption(option => option.setName('invitee').setDescription("User who sent the invite").setRequired(true))
        .addUserOption(option => option.setName('invited_user').setDescription('User who was invited').setRequired(true)),
	async execute(interaction) {
        let {id: invitedUserId} = interaction.options.getUser('invited_user');
        const currentUser = interaction.user;
        const inviteeUser= interaction.options.getUser('invitee')
        const inviteeUserId = inviteeUser.id;        

        await db.collection(DB_USER_COLLECTION).doc(`${invitedUserId}`).update({
            inviteFrom: inviteeUserId,
        })
        return interaction.reply({ content: `<@${currentUser.id}> claims <@${inviteeUserId}> invited <@${invitedUserId}>`})
	},
};