const { SlashCommandBuilder } = require('@discordjs/builders');
const { DB_USER_COLLECTION } = require('../constants');
const { db } = require('../services/firestore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vouch')
		.setDescription('get user tree')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addUserOption(option => option.setName('invite_user').setDescription("User Invite if not current user").setRequired(false)),
	async execute(interaction) {
        let byProxy = false;
        let inviteUserId;
        let {id: targetUserId} = interaction.options.getUser('user');
        const currentUser = interaction.user;
        const inviteUser= interaction.options.getUser('invite_user')
        if(!inviteUser) {
            inviteUserId = currentUser.id
        } else {
            inviteUserId = inviteUser.id;
            byProxy = true
        }

        await db.collection(DB_USER_COLLECTION).doc(`${targetUserId}`).update({
            inviteFrom: inviteUserId,
        })
        if(byProxy) {
            return interaction.reply({ content: `<@${currentUser.id}> claims <@${inviteUserId}> invited <@${targetUserId}>`})
        }
		return interaction.reply({ content: `<@${inviteUserId}> vouched for <@${targetUserId}>`});
	},
};