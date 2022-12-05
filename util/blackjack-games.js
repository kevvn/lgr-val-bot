const Deck = require('card-deck');
const _ = require('lodash');
const { DECK } = require('../constants');

class BlackjackGames {
  Games;
  constructor() {
    this.Games = {};
  }

  getCardValue = (card) => {
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

  convertAceToOne = (hand, handSum) => {
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].includes('A')) {
        hand[i] = hand[i].replace('A', '1');
        handSum = handSum - 10;
        break;
      }
    }

    return { convertedHand: hand, convertedSum: handSum };
  };

  playDealerHand = (userId) => {
    let { deck, dealerHand, dealerSum } = this.Games[userId];

    while (dealerSum < 17) {
      const card = deck.draw(1);
      const cardValue = this.getCardValue(card);
      dealerSum = dealerSum + cardValue;
      dealerHand.push(card);

      if (dealerSum > 21) {
        // does the dealer have an Ace?
        const { convertedHand, convertedSum } = this.convertAceToOne(dealerHand, dealerSum);

        if (convertedSum > 21) {
          this.Games[userId].dealerHand = convertedHand;
          this.Games[userId].dealerSum = convertedSum;
          return;
        }

        dealerHand = convertedHand;
        dealerSum = convertedSum;
      }
    }

    this.Games[userId].dealerHand = dealerHand;
    this.Games[userId].dealerSum = dealerSum;
    return;
  };

  handleStay = (userId) => {
    this.playDealerHand(userId);

    const { playerSum, dealerSum } = this.Games[userId];

    let resultContent;
    if (dealerSum < playerSum || dealerSum > 21) {
      resultContent = 'PLAYER WINS!';
    } else if (dealerSum === playerSum) {
      resultContent = 'YALL PUSHED!';
    } else {
      resultContent = 'DEALER WINS!';
    }

    this.Games[userId].results = resultContent;

    return this.Games[userId];
  };

  handleHit = (userId) => {
    let { deck, playerHand, playerSum } = this.Games[userId];

    // draw the next card
    const card = deck.draw(1);
    const cardValue = this.getCardValue(card);
    playerSum = playerSum + cardValue;
    playerHand.push(card);

    // player bust
    if (playerSum > 21) {
      // does the player have an Ace?
      const { convertedHand, convertedSum } = this.convertAceToOne(playerHand, playerSum);

      this.Games[userId].playerHand = convertedHand;
      this.Games[userId].playerSum = convertedSum;
      return this.Games[userId];
    }

    this.Games.deck = deck;
    this.Games[userId].playerHand = playerHand;
    this.Games[userId].playerSum = playerSum;

    return this.Games[userId];
  };

  newGame = (userId) => {
    const deckOf52Cards = _.clone(DECK);
    const deck = new Deck(deckOf52Cards);
    deck.shuffle();
    const [playerCard1, playerCard2, dealerCard1, dealerCard2] = deck.draw(4);
    const playerCardSum = this.getCardValue(playerCard1) + this.getCardValue(playerCard2);
    const dealerCardSum = this.getCardValue(dealerCard1) + this.getCardValue(dealerCard2);

    this.Games[userId] = {
      deck: deck,
      playerHand: [playerCard1, playerCard2],
      playerSum: playerCardSum,
      dealerHand: [dealerCard1, dealerCard2],
      dealerSum: dealerCardSum,
    };

    return this.Games[userId];
  };
}

module.exports = BlackjackGames;
