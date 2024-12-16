"use strict";
import { createOrUpdateLocalStorage, startGame } from "./utils.js";

export class Game {
  /**
   * Represents a game.
   * @param {Array} wordCardsCollection - Collection of word cards for the game.
   */
  constructor(wordCardsCollection) {
    this.mainContainer = document.querySelector(".main-container");
    this.badgesContainer = document.querySelector(".badges-container");
    this.badgesCollection = [];
    this.wordCardsCollection = wordCardsCollection;
    this.playingCard;
    this.attemptsToWin = this.wordCardsCollection.length;
    this.attempts = 0;
    this.bigPlayButton = document.querySelector(".play-button");
    this.popupContainer = document.querySelector(".popup-container");
  }

  /**
   * Starts the game.
   */
  startGame() {
    this.playCard();
    this.playSound("start-game");
    this.changePlayButton("gameStarted");

    this.mainContainer.addEventListener(
      "click",
      this.clickHandlerForCheckAnswer
    );

    document.body.addEventListener("click", (event) => {
      if (
        event.target.closest(".switch") ||
        event.target.closest(".brgr-menu-item")
      ) {
        this.stopGame();
      }
    }),
      { once: true };
  }

  /**
   * Handles the click event for checking the answer.
   * @param {Event} event - The click event.
   */
  clickHandlerForCheckAnswer = (event) => this.checkAnswer(event);

  /**
   * Generates a random index for selecting a card from the collection.
   * @param {number} collectionLength - The length of the collection.
   * @returns {number} - The random index.
   */
  getRandomCardIndex(collectionLength) {
    return Math.floor(Math.random() * collectionLength);
  }

  /**
   * Plays a card by selecting a random card from the collection.
   */
  playCard() {
    const index = this.getRandomCardIndex(this.wordCardsCollection.length);
    this.playingCard = this.wordCardsCollection[index];

    setTimeout(() => this.playingCard.parent.playSound(), 1500);
  }

  /**
   * Checks the clicked card for correctness and takes appropriate action.
   * @param {Event} event - The click event.
   */
  checkAnswer(event) {
    const clickedCard = event.target.closest(".unplayed-word");

    if (clickedCard) {
      if (clickedCard === this.playingCard) {
        this.indicatePositiveAnswer();
      } else {
        this.indicateNegativeAnswer();
      }
    }
  }

  /**
   * Indicates a positive answer by playing sound, creating a badge, and updating local storage.
   */
  indicatePositiveAnswer() {
    this.playSound("positive-answer");
    this.createBadgeAndShow("positive");
    this.attempts++;
    createOrUpdateLocalStorage(this.playingCard.parent.word, 0, 1, 0);
    this.playingCard.classList.add("played-card");
    this.playingCard.classList.remove("unplayed-word");
    this.checkGameOver();
  }

  /**
   * Indicates a negative answer by playing sound, creating a badge, and updating local storage.
   */
  indicateNegativeAnswer() {
    this.playSound("negative-answer");
    this.createBadgeAndShow("negative");
    this.attempts++;
    createOrUpdateLocalStorage(this.playingCard.parent.word, 0, 0, 1);
  }

  /**
   * Creates a badge element and displays it in the badges container.
   * @param {string} answerResult - The result of the answer ('positive' or 'negative').
   */
  createBadgeAndShow(answerResult) {
    const badge = this.createBadge(answerResult);
    const fragment = document.createDocumentFragment();
    this.badgesCollection.push(badge);
    this.badgesCollection.forEach((badge) => fragment.append(badge));
    this.badgesContainer.innerHTML = "";
    this.badgesContainer.append(fragment);
  }

  /**
   * Creates a badge element based on the answer result.
   * @param {string} answerResult - The result of the answer ('positive' or 'negative').
   * @returns {HTMLElement} - The badge element.
   */
  createBadge(answerResult) {
    const badge = document.createElement("div");
    badge.classList.add(`${answerResult}-badge`);

    return badge;
  }

  /**
   * Checks if the game is over and takes appropriate action.
   */
  checkGameOver() {
    if (this.wordCardsCollection.length === 0) {
      this.gameOver();
    } else {
      this.playCard();
    }
  }

  /**
   * Handles the game over state by showing the appropriate popup and reloading the page.
   */
  gameOver() {
    setTimeout(() => {
      this.bigPlayButton.style.visibility = "hidden";
      this.badgesContainer.style.visibility = "hidden";
      this.mainContainer.innerHTML = "";
      document.body.classList.add("body-not-scroll");
      if (this.attempts > this.attemptsToWin) {
        const mistakesNumElem = document.querySelector(".mistakes-number");
        const mistakesNum = this.attempts - this.attemptsToWin;
        console.log(mistakesNum, this.attempts, this.attemptsToWin);

        this.playSound("lose");
        this.popupContainer.classList.add("popup-container-visible-lose");
        mistakesNum === 1
          ? (mistakesNumElem.innerHTML = `1 mistake`)
          : (mistakesNumElem.innerHTML = `${mistakesNum} mistakes`);
      } else {
        this.playSound("win");
        this.popupContainer.classList.add("popup-container-visible-win");
      }
    }, 1000);
    setTimeout(() => location.reload(), 5000);
  }

  /**
   * Plays the sound based on the provided name.
   * @param {string} name - The name of the sound file.
   */
  playSound(name) {
    const audio = new Audio(`./assets/audio/${name}.mp3`);
    audio.play();
  }

  /**
   * Handles the repeat button click by playing the sound of the current card.
   */
  repeatButtonClickHandler = () => this.playingCard.parent.playSound();

  /**
   * Changes the play button state based on the provided state.
   * @param {string} state - The state of the play button ('gameStarted' or 'gameStopped').
   */
  changePlayButton(state) {
    if (state === "gameStarted") {
      this.bigPlayButton.classList.add("play-button-to-repeat");
      this.bigPlayButton.innerHTML = "repeat";
      this.bigPlayButton.addEventListener(
        "click",
        this.repeatButtonClickHandler
      );
    } else {
      this.bigPlayButton.classList.remove("play-button-to-repeat");
      this.bigPlayButton.innerHTML = "play";

      this.bigPlayButton.removeEventListener(
        "click",
        this.repeatButtonClickHandler
      );
    }
  }

  /**
   * Stops the game and resets the necessary variables and event listeners.
   */
  stopGame() {
    this.mainContainer.removeEventListener(
      "click",
      this.clickHandlerForCheckAnswer
    );
    this.playingCard;
    this.badgesContainer.innerHTML = "";
    this.badgesCollection = [];
    this.attempts = 0;
    this.changePlayButton("gameStopped");
    this.bigPlayButton.addEventListener("click", startGame, { once: true });
  }
}
