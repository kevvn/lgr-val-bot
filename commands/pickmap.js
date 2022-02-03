const { SlashCommandBuilder } = require('@discordjs/builders');
const { VAL_MAPS } = require('../constants')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pickmap')
		.setDescription('randomly picks a map for inhouses'),
	async execute(interaction) {
        const randomMap = VAL_MAPS[Math.floor(Math.random() * VAL_MAPS.length)]

		return interaction.reply({ content: `Youve selected ${randomMap}`, ephemeral: false });
	},
};