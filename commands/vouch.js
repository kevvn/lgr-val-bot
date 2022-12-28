const { SlashCommandBuilder } = require('@discordjs/builders');
const { db } = require('../services/firestore');
const DB_COLLECTION_NAME= "LGR_Users";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vouch')
		.setDescription('get user tree')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addUserOption(option => option.setName('invite_user').setDescription("User Invite if not current user").setRequired(false)),
	async execute(interaction) {
        let byProxy = false;
        let inviteUserId, inviteUsername;
        let {id: targetUserId, username: targetUsername} = interaction.options.getUser('user');
        const currentUser = interaction.user;
        const inviteUser= interaction.options.getUser('invite_user')
        if(!inviteUser) {
            inviteUserId = currentUser.id
            inviteUsername= currentUser.username
        } else {
            inviteUserId = inviteUser.id;
            inviteUsername = inviteUser.username
            byProxy = true
        }

        await db.collection(DB_COLLECTION_NAME).doc(`${targetUserId}`).update({
            inviteFrom: inviteUserId,
        })
        if(byProxy) {
            return interaction.reply({ content: `<@${currentUser.id}> claims <@${inviteUserId}> invited <@${targetUserId}>`})
        }
		return interaction.reply({ content: `<@${inviteUserId}> vouched for <@${targetUserId}>`});
	},
};