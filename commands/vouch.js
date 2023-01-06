const { SlashCommandBuilder } = require('@discordjs/builders');
const { DB_USER_COLLECTION } = require('../constants');
const { db } = require('../services/firestore');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vouch')
		.setDescription('vouch for a user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
        let {id: targetUserId, username: targetUsername} = interaction.options.getUser('user');
        const currentUser = interaction.user;
        const inviteUserId = currentUser.id
       
        try{
            await db.collection(DB_USER_COLLECTION).doc(`${targetUserId}`).set({
                inviteFrom: inviteUserId,
            }, { merge: true })
        } catch(e) {
            console.error(`Attempted to vouch for [${targetUsername}, ${targetUserId}]`)
            return interaction.reply({content: `Bot encountered an Error, we'll take a look O_O. involved: <@${inviteUserId}>, <@${targetUserId}>`})
        }
        
		return interaction.reply({ content: `<@${inviteUserId}> vouched for <@${targetUserId}>`});
	},
};