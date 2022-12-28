const { SlashCommandBuilder } = require('@discordjs/builders');
const { createGraph } = require('../services/graphviz-helper');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tree')
		.setDescription('get user tree'),
	async execute(interaction) {
		return interaction.reply({ content: `Here is the Current Tree`}).then(
            () => {
                createGraph({
                    guild: interaction.member.guild,
                    channel: interaction.member.guild.channels.cache.get(interaction.channelId)
                })
            }
        );
	},
};