const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
const path = require("path")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lfadd')
		.setDescription('adds yourself to the looking for queue'),
		// .addUserOption(option => option.setName('target').setDescription('Select a user')),
	async execute(interaction) {
		let currentUserId = interaction.user.id
		// const {user: {id}} = interaction.options.getUser()
		// if (interaction.options.getSubcommand() === 'target') {
		// 	currentUserId = id
		// }

		let rawdata = fs.readFileSync(path.join(__dirname, '..', 'looking-for-queue.json'))
		let lookingForQueue = await JSON.parse(rawdata)
		if (lookingForQueue.includes(currentUserId)) {
			return interaction.reply({ content: `You're already in the queue you silly goose! :goose:`, ephemeral: true})
		}
		lookingForQueue.push(currentUserId)
		let updatedLookingForQueue = await JSON.stringify(lookingForQueue);
		await fs.writeFileSync(path.join(__dirname, '..', '/looking-for-queue.json'), updatedLookingForQueue);
		return interaction.reply({ content: `You've been added to the queue.`, ephemeral: true});
	},
};