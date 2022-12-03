const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('@discordjs/builders');
const _ = require('lodash');
const Deck = require('card-deck');
const { DECK } = require('../constants');

let deckOf52Cards;

const convertAceToOne = (cards, cardSum) => {
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].includes('A')) {
      cards[i] = cards[i].replace('A', '1');
      cardSum = cardSum - 10;
      break;
    }
  }

  return [cards, cardSum];
};

const getCardValue = (card) => {
  let cardValue;
  switch (card.substring(card.length - 1)) {
    case 'T':
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

const playDealersHand = (dealersCards) => {
  const deck = new Deck(deckOf52Cards);
  deck.shuffle();

  let dealersCardSum = getCardValue(dealersCards[0]) + getCardValue(dealersCards[1]);

  while (dealersCardSum < 17) {
    const card = deck.draw(1);
    const cardValue = getCardValue(card);
    dealersCardSum = dealersCardSum + cardValue;
    dealersCards.push(card);

    if (dealersCardSum > 21) {
      // does the dealer have an Ace?
      [dealersCards, dealersCardSum] = convertAceToOne(dealersCards, dealersCardSum);
      // player still bust
      if (dealersCardSum > 21) {
        return dealersCardSum;
      }
    }
  }

  return dealersCardSum;
};

const handleStay = (interaction, handData) => {
  let handDataParse = handData.split('-');
  let dealersCards = [handDataParse[1], handDataParse[2]];
  let playersCards = '';
  let playersCardSum = parseInt(handDataParse[handDataParse.length - 1]);

  // parse player hand
  for (var i = 3; i < handDataParse.length - 1; i++) {
    playersCards = playersCards.concat(handDataParse[i], ', ');
  }

  let dealersCardSum = playDealersHand(dealersCards);
  
  let resultContent;
  if (dealersCardSum < playersCardSum || dealersCardSum > 21) {
    resultContent = 'PLAYER WINS!'
  } else if (dealersCardSum === playersCardSum) {
    resultContent = 'YALL PUSHED!';
  } else {
    resultContent = 'DEALER WINS!';
  }
  interaction.update({
    content: `**Playing Blackjack**\n\nYour Hand: ${playersCards} \nTotal: ${playersCardSum} \n\nDealer's Hand: ${dealersCards} \nDealer's Total: ${dealersCardSum}\n\n**Result: ${resultContent}**`,
    components: [],
  });
};

const handleHit = (interaction, handData) => {
  let handDataParse = handData.split('-');
  let cards = [];
  let cardSum = parseInt(handDataParse[handDataParse.length - 1]);
  let handContent = '';

  for (var i = 3; i < handDataParse.length - 1; i++) {
    // parse player hand
    if (i !== 1 && i !== 2) {
      cards.push(handDataParse[i]);
      handContent = handContent.concat(handDataParse[i], ', ');
    }
  }

  const deck = new Deck(deckOf52Cards);
  deck.shuffle();

  // draw the next card
  const card = deck.draw(1);
  const cardValue = getCardValue(card);
  cardSum = cardSum + cardValue;
  cards.push(card);

  // player bust
  if (cardSum > 21) {
    // does the player have an Ace?
    [cards, cardSum] = convertAceToOne(cards, cardSum);
    // player still bust
    if (cardSum > 21) {
      handContent = handContent.concat(card);
      interaction.update({
        content: `**Playing Blackjack**\n\n${handContent} \nTotal: ${cardSum} \nSorry, you BUSTED`,
        components: [],
      });
      return;
    }
  }

  let hitCustomIdKey = 'hit-';
  let stayCustomIdKey = 'stay-';
  handContent = '';

  // add dealers cards to customId
  for (var i = 1; i < 3; i++) {
    hitCustomIdKey = hitCustomIdKey.concat(handDataParse[i], '-');
    stayCustomIdKey = stayCustomIdKey.concat(handDataParse[i], '-');
  }

  // add players cards to customId and handContent
  for (var i = 0; i < cards.length; i++) {
    hitCustomIdKey = hitCustomIdKey.concat(cards[i], '-');
    stayCustomIdKey = stayCustomIdKey.concat(cards[i], '-');
    handContent = handContent.concat(cards[i], ', ');
  }

  hitCustomIdKey = hitCustomIdKey.concat(cardSum);
  stayCustomIdKey = stayCustomIdKey.concat(cardSum);

  const row = new ActionRowBuilder().addComponents([
    new ButtonBuilder().setCustomId(hitCustomIdKey).setLabel('Hit').setStyle('Primary'),
    new ButtonBuilder().setCustomId(stayCustomIdKey).setLabel('Stay').setStyle('Primary'),
  ]);

  interaction.update({
    content: `**Playing Blackjack**\n\nYour Hand: ${handContent} \nTotal: ${cardSum}\n\nDealer's Hand: ${handDataParse[1]}`,
    components: [row],
  });
};

const execute = async (interaction, handData) => {
  // continuing a hand
  if (handData) {
    // player clicked hit
    if (handData.includes('hit')) {
      handleHit(interaction, handData);
      return;
    }
    // player clicked stay
    else {
      handleStay(interaction, handData);
    }
  }
  // new player hand
  else {
    deckOf52Cards = _.clone(DECK);
    const deck = new Deck(deckOf52Cards);
    deck.shuffle();
    const [playerCard1, playerCard2, dealerCard1, dealerCard2] = deck.draw(4);
    const playerCard1Value = getCardValue(playerCard1);
    const playerCard2Value = getCardValue(playerCard2);
    const playerCardSum = playerCard1Value + playerCard2Value;

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setCustomId(`hit-${dealerCard1}-${dealerCard2}-${playerCard1}-${playerCard2}-${playerCardSum}`).setLabel('Hit').setStyle('Primary'),
      new ButtonBuilder().setCustomId(`stay-${dealerCard1}-${dealerCard2}-${playerCard1}-${playerCard2}-${playerCardSum}`).setLabel('Stay').setStyle('Primary'),
    ]);

    interaction.reply({
      content: `**Playing Blackjack**\n\nYour Hand: ${playerCard1} and ${playerCard2} \nTotal: ${playerCardSum} \n\nDealer's Hand: ${dealerCard1}`,
      components: [row],
    });
  }
};

module.exports = {
  data: new SlashCommandBuilder().setName('blackjack').setDescription('Play a hand of blackjack'),
  execute,
};
