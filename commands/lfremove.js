const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
const path = require("path")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lfremove')
		.setDescription('removes yourself from the looking for queue'),
	async execute(interaction) {
		const currentUserId = interaction.user.id
		let rawdata = fs.readFileSync(path.join(__dirname, '..', 'looking-for-queue.json'))
		let lookingForQueue = await JSON.parse(rawdata)
		const index = lookingForQueue.indexOf(currentUserId);
		if (currentUserId > -1 && lookingForQueue.length > 0) {
			lookingForQueue.splice(index, 1);
			let updatedLookingForQueue = await JSON.stringify(lookingForQueue);
			await fs.writeFileSync(path.join(__dirname, '..', '/looking-for-queue.json'), updatedLookingForQueue);
			return interaction.reply({ content: `You've been removed from the queue!`, ephemeral: true})
		} else {
			return interaction.reply({ content: `You're not in the queue you silly goose! :goose:`, ephemeral: true})
		}

	},
};