const { SlashCommandBuilder } = require('@discordjs/builders');
const { VAL_MAPS } = require('../constants')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pickicebox')
		.setDescription('randomly picks an icebox for inhouses'),
	async execute(interaction) {

		return interaction.reply({ content: `Youve selected Icebox!`, ephemeral: false });
	},
};