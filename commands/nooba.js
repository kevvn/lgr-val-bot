const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nooba')
		.setDescription('when you need a little bit of noobs'),
	async execute(interaction) {

		return interaction.reply({ content: `my favorite part of this clutch is when @nooba said its noobaing time and then nooba'd out and nooba'd all over them.`,  ephemeral: false });
	},
};