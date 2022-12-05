const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const BlackjackGames = require('../util/blackjack-games');

const games = new BlackjackGames();

const execute = async (interaction, button) => {
  // continuing a hand
  if (button) {
    // player clicked hit
    if (button.includes('hit')) {
      const { playerHand, playerSum, dealerHand } = games.handleHit(interaction.user.id);

      if (playerSum > 21) {
        interaction.update({
          content: `**Playing Blackjack**\n\nYour Hand: ${playerHand} \nTotal: ${playerSum} \n\n**Sorry, you BUSTED**`,
          components: [],
        });

        return;
      }

      const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId('hit').setLabel('Hit').setStyle('Primary'),
        new ButtonBuilder().setCustomId('stay').setLabel('Stay').setStyle('Primary'),
      ]);

      interaction.update({
        content: `**Playing Blackjack** \n\nYour Hand: ${playerHand} \nTotal: ${playerSum} \n\nDealer's Hand: ${dealerHand[0]}`,
        components: [row],
      });

      return;
    }
    // player clicked stay
    else {
      const { playerHand, playerSum, dealerHand, dealerSum, results } = games.handleStay(interaction.user.id);

      interaction.update({
        content: `**Playing Blackjack**\n\nYour Hand: ${playerHand} \nTotal: ${playerSum} \n\nDealer's Hand: ${dealerHand} \nDealer's Total: ${dealerSum}\n\n**Result: ${results}**`,
        components: [],
      });
    }
  }
  // new player hand
  else {
    const { playerHand, playerSum, dealerHand } = games.newGame(interaction.user.id);

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setCustomId(`hit`).setLabel('Hit').setStyle('Primary'),
      new ButtonBuilder().setCustomId(`stay`).setLabel('Stay').setStyle('Primary'),
    ]);

    interaction.reply({
      content: `**Playing Blackjack** \n\nYour Hand: ${playerHand} \nTotal: ${playerSum} \n\nDealer's Hand: ${dealerHand[0]}`,
      components: [row],
    });
  }
};

module.exports = {
  data: new SlashCommandBuilder().setName('blackjack').setDescription('Play a hand of blackjack'),
  execute,
};
