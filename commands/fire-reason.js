const { db } = require('../services/firestore.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fire-reason')
		.setDescription('used to inquire why you were fired')
		.addIntegerOption(option => option.setName('limit').setDescription('Input an optional limit for historical firings')),
	async execute(interaction) {
		let currentUsername = interaction.user.username
	
		const queryLimit = interaction.options.getInteger('limit') ?? 1
		if (queryLimit < 1) {
			return interaction.reply({ content: 'Limit amount can not be less than 1', ephemeral: true})
		}
        const lastReasonQuery = await db.collection('fire-log').where('user', '==', currentUsername).orderBy('created_at','desc').limit(queryLimit).get()
		let lastReason = ''
		if(queryLimit === 1){
			lastReasonQuery.forEach((doc) => {
				lastReason = doc.data().reason
			})
			return interaction.reply({ content: `You were last fired because of the following reason given by shiny, ${lastReason} `, ephemeral: false})
		} else {
			let listOfReasons = `\`\`\`\n`
			listOfReasons += `Reason ----- Date of Firing \n`
			lastReasonQuery.forEach((doc) => {
				const firingReason = doc.data().reason
				const dateOfFiring = new Date(doc.data().created_at.seconds * 1000)
				if(firingReason !== '' || firingReason !== 'No reason provided'){
					listOfReasons +=`${firingReason}, ${dateOfFiring.toUTCString()}\n`
				}
			})
			listOfReasons += `\`\`\`\n`
			return interaction.reply({ content: listOfReasons, ephemeral: false})
		}
		
	},
};
