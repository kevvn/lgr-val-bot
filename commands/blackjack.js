const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('@discordjs/builders');
const Deck = require('card-deck');
const { DECK } = require('../constants');

const getCardValue = (card) => {
  let cardValue;
  switch (card.substring(card.length - 1)) {
    case 'J':
    case 'Q':
    case 'K':
      cardValue = 10;
      break;
    case 'A':
      cardValue = 11;
      break;
    default:
      cardValue = parseInt(card.substring(card.length - 1));
      break;
  }

  return cardValue;
};

const execute = async (interaction, hand) => {
  if (hand) {
    if (hand.includes('hit')) {
      const cards = hand.split('-');
      let hitCustomIdKey = 'hit-';
      let stayCustomIdKey = 'stay-';
      let handContent = 'Hand: ';

      for (var i = 1; i < cards.length - 1; i++) {
        const index = DECK.indexOf(cards[i]);
        DECK.splice(index, 1);
        hitCustomIdKey = hitCustomIdKey.concat(cards[i], '-');
        stayCustomIdKey = stayCustomIdKey.concat(cards[i], '-');
        handContent = handContent.concat(cards[i], ', ');
      }

      const deck = new Deck(DECK);
      deck.shuffle();

      const card = deck.draw(1);
      handContent = handContent.concat(card);
      const cardValue = getCardValue(card);
      const cardSum = parseInt(cards[cards.length - 1]) + cardValue;

      if (cardSum > 21) {
        interaction.reply({
          content: `Blackjack\n${handContent} \nTotal: ${cardSum} \nSorry, you BUSTED`,
        });
        return;
      }

      hitCustomIdKey = hitCustomIdKey.concat(card, '-', cardSum);
      stayCustomIdKey = stayCustomIdKey.concat(card, '-', cardSum);

      const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId(hitCustomIdKey).setLabel('Hit').setStyle('Primary'),
        new ButtonBuilder().setCustomId(stayCustomIdKey).setLabel('Stay').setStyle('Primary'),
      ]);

      interaction.reply({
        content: `Blackjack\n${handContent} \nTotal: ${cardSum}`,
        components: [row],
      });
    } else {
      const cards = hand.split('-');
      let handContent = 'Hand: ';
      for (var i = 1; i < cards.length - 1; i++) {
        handContent = handContent.concat(cards[i], ', ');
      }
      const cardSum = cards[cards.length-1];
      interaction.reply({
        content: `Blackjack\n${handContent} \nTotal: ${cardSum} \nStaying.`,
      });
    }
  } else {
    const deck = new Deck(DECK);
    deck.shuffle();
    const [card1, card2] = deck.draw(2);
    const card1Value = getCardValue(card1);
    const card2Value = getCardValue(card2);
    const cardSum = card1Value + card2Value;

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setCustomId(`hit-${card1}-${card2}-${cardSum}`).setLabel('Hit').setStyle('Primary'),
      new ButtonBuilder().setCustomId(`stay-${card1}-${card2}-${cardSum}`).setLabel('Stay').setStyle('Primary'),
    ]);

    interaction.reply({
      content: `Blackjack\nHand: ${card1} and ${card2} \nTotal: ${cardSum}`,
      components: [row],
    });
  }
};

module.exports = {
  data: new SlashCommandBuilder().setName('blackjack').setDescription('Play a hand of blackjack'),
  execute,
};
