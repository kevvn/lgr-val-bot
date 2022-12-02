const fs = require('fs')
const path = require("path")
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nooba')
		.setDescription('when you need a little bit of noobs'),
	async execute(interaction) {
		let image = fs.readFileSync(path.join(__dirname, 'nooba.png'))
		return interaction.reply({ files: [{
			attachment: image,
			name: 'file.png',
			description: 'A description of the file'
		  }],content: `my favorite part of this clutch is when <@142127964870410241> said its noobaing time and then nooba'd out and nooba'd all over them.`,  ephemeral: false });
	},
};