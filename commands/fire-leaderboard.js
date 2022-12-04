const { db } = require('../services/firestore.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const fs = require('fs')
const path = require("path")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fire-leaderboard')
		.setDescription('gets the current leaderboard for the fires'),
	async execute(interaction) {

        const leaderboard = {}
        // Queries firebase for all the entries
        const countQuery = await db.collection('fire-log').get()
        
        // Creates a map to increment on the user
        countQuery.docs.forEach(doc => {
            const data = doc.data()
            if (leaderboard[data.user]) {
                leaderboard[data.user] += 1
            } else {
                leaderboard[data.user] = 1
            }
        })
        // sorts the values from highest to lowest
        const sortable = Object.entries(leaderboard)
            .sort(([,a],[,b]) => b-a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    
        let leaderboardOutput = `\`\`\`\n`
        leaderboardOutput += `User: Fired Amount \n`
        
        // Iterates through to create the formatted string
        const users = Object.keys(sortable)
        users.forEach(userKey => {
            leaderboardOutput +=`${userKey}: ${sortable[userKey]}\n`
        })
        leaderboardOutput += `\`\`\`\n`
        return interaction.reply({ content: leaderboardOutput, ephemeral: false})
	},
};
