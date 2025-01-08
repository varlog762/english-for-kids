"use strict";

import { Category } from "./Category.js";
import { createAndInsertElement, setMultipleAttributes } from "./utils.js";

/**
 * Represents a Word Card, which is a subclass of Category.
 */
export class WordCard extends Category {
  /**
   * Constructs a new Word Card object.
   * @param {string} categoryName - The category name of the word card.
   * @param {string} ImagePath - The image path of the word card.
   * @param {string} word - The word on the card.
   * @param {string} wordTranslation - The translation of the word.
   * @param {string} soundPath - The path to the sound associated with the word.
   */
  constructor(categoryName, ImagePath, word, wordTranslation, soundPath) {
    super(categoryName, ImagePath);
    this.word = word;
    this.wordTranslation = wordTranslation;
    this.soundPath = soundPath;
    this.clickedOnTrainMode;
    this.correctAnswersNum;
    this.incorrectAnswersNum;
    this.winRate;
  }

  get clickedOnTrainMode() {
    const objFromLocalStorage =
      JSON.parse(localStorage.getItem(this.word)) ?? false;

    return objFromLocalStorage ? objFromLocalStorage.trained : 0;
  }
  set clickedOnTrainMode(value) {
    this.clickedOnTrainMode = value;
  }
  get correctAnswersNum() {
    const objFromLocalStorage =
      JSON.parse(localStorage.getItem(this.word)) ?? false;

    return objFromLocalStorage ? objFromLocalStorage.correct : 0;
  }
  set correctAnswersNum(value) {
    this.correctAnswersNum = value;
  }
  get incorrectAnswersNum() {
    const objFromLocalStorage =
      JSON.parse(localStorage.getItem(this.word)) ?? false;

    return objFromLocalStorage ? objFromLocalStorage.incorrect : 0;
  }
  set incorrectAnswersNum(value) {
    this.incorrectAnswersNum = value;
  }
  get winRate() {
    const total = this.correctAnswersNum + this.incorrectAnswersNum;

    return total === 0 ? 0 : Math.round((this.correctAnswersNum / total) * 100);
  }
  set winRate(value) {
    this.winRate = value;
  }

  /**
   * Plays the sound associated with the word card.
   */
  playSound() {
    const audio = new Audio(this.soundPath);
    audio.play();
  }

  /**
   * Creates the HTML representation of the word card.
   * @returns {HTMLElement} The HTML element representing the word card.
   */
  createCardHTML() {
    const wordCard = document.createElement("div");
    wordCard.parent = this;

    wordCard.classList.add("card", "word-card");
    setMultipleAttributes(wordCard, {
      id: this.word,
      category: this.categoryName,
    });

    const frontSide = createAndInsertElement(
        "div",
        wordCard,
        "word-card-front-side"
      ),
      backSide = createAndInsertElement("div", wordCard, "word-card-back-side"),
      wordCardFrontFigure = createAndInsertElement(
        "figure",
        frontSide,
        "card-figure"
      ),
      rotateButton = createAndInsertElement(
        "button",
        frontSide,
        "card-rotate-btn"
      ),
      wordCardBackFigure = createAndInsertElement(
        "figure",
        backSide,
        "card-figure"
      );

    const wordCardFrontImg = createAndInsertElement(
        "img",
        wordCardFrontFigure,
        "card-img"
      ),
      wordCardBackImg = createAndInsertElement(
        "img",
        wordCardBackFigure,
        "card-img"
      );
    setMultipleAttributes(wordCardFrontImg, {
      src: this.ImagePath,
      alt: this.word,
    });
    setMultipleAttributes(wordCardBackImg, {
      src: this.ImagePath,
      alt: this.word,
    });

    const cardTitle = createAndInsertElement(
        "figcaption",
        wordCardFrontFigure,
        "card-title"
      ),
      cardTranslation = createAndInsertElement(
        "figcaption",
        wordCardBackFigure,
        "card-title"
      );
    cardTitle.classList.add("word-card-title");
    cardTitle.innerHTML = this.word;
    cardTranslation.innerHTML = this.wordTranslation;

    return wordCard;
  }
}
