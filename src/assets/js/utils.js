"use strict";

import { Category } from "./Category.js";
import { WordCard } from "./WordCard.js";
import { Game } from "./Game.js";
import { StatisticTable } from "./StatisticTable.js";

const main = document.querySelector(".main");
const mainContainer = document.querySelector(".main-container");
const trainMode = document.querySelector(".train-mode");
const playMode = document.querySelector(".play-mode");
const burgerBtn = document.querySelector(".burger-btn");
const burgerMenuContainer = document.querySelector(".burger-menu-container");
const bigPlayButtonContainer = document.querySelector(".play-button-container");
const gameElementsContainer = document.querySelector(
  ".game-elements-container"
);
const burgerMenuListItemsCollection = Array.from(
  document.querySelector(".burger-menu-list").children
);

/**
 * Creates category & word objects.
 * @param {Object} categoriesCollection - Object containing category names and corresponding word arrays.
 * @returns {Array} - Array of Category objects.
 */
export function createCategoriesAndWords(categoriesCollection) {
  const keysCollection = Object.keys(categoriesCollection);

  const categoryObjectsArray = keysCollection.map((key) => {
    const categoryObject = new Category(key, `./assets/images/${key}.png`);

    categoriesCollection[key].forEach((item) => {
      const word = new WordCard(
        key,
        `./assets/images/${item[0].toLowerCase()}.png`,
        item[0],
        item[1],
        `./assets/audio/${item[0].toLowerCase()}.mp3`
      );
      categoryObject.addChildToCollection(word);
    });
    return categoryObject;
  });

  return categoryObjectsArray;
}

/**
 * Creates and inserts a new HTML element.
 * @param {string} tagName - The HTML tag name of the element to create.
 * @param {Object} parent - The parent element to which the new element will be appended.
 * @param {string} elementClass - The CSS class to assign to the new element.
 * @returns {Object} - The newly created HTML element.
 */
export function createAndInsertElement(tagName, parent, elementClass = "") {
  const elem = document.createElement(tagName);

  parent.append(elem);
  elem.classList.add(elementClass);

  return elem;
}

/**
 * Sets multiple attributes for an HTML element.
 * @param {Object} element - The HTML element to which attributes will be applied.
 * @param {Object} attributesCollection - An object containing attribute names and their values.
 */
export function setMultipleAttributes(element, attributesCollection) {
  for (let key in attributesCollection) {
    element.setAttribute(key, attributesCollection[key]);
  }
}

/**
 * Creates and inserts word cards on the page.
 * @param {*} collection - The collection of word cards to create and insert.
 */
export function createAndInsertCardsOnPage(collection) {
  const fragment = document.createDocumentFragment();

  collection.forEach((category) => {
    const wordCard = category.createCardHTML();

    if (isPlayModeChecked()) {
      wordCard.classList.add("word-card-in-play-mode", "unplayed-word");
      bigPlayButtonContainer.classList.add("play-button-container-visible");
      mainContainer.classList.add("main-container-play-mode");
    } else {
      wordCard.classList.add("word-card-in-train-mode");
    }

    fragment.append(wordCard);
  });

  mainContainer.append(fragment);
}

/**
 * Toggles the visibility of the burger menu.
 */
export function toggleBurgerMenu() {
  burgerMenuContainer.classList.toggle("burger-menu-container--active");
  burgerBtn.classList.toggle("burger-btn--active");
  document.body.classList.toggle("body-not-scroll");
}

/**
 * Hides the burger menu.
 */
function hideBurgerMenu() {
  burgerMenuContainer.classList.remove("burger-menu-container--active");
  burgerBtn.classList.remove("burger-btn--active");
  document.body.classList.remove("body-not-scroll");
}

/**
 * Moves to the selected category.
 * @param {*} event - The click event.
 * @param {*} categoryObjectsArray - The array of category objects.
 */
export function movingToCategory(event, categoryObjectsArray) {
  main.classList.remove("main-for-statistic");
  gameElementsContainer.classList.remove("game-elements-container-invisible");

  let categoryName = "";

  event.target.closest(".category-card")
    ? (categoryName = event.target.closest(".category-card").id)
    : (categoryName = event.target
        .closest(".category-menu-item")
        .firstChild.innerText.toLowerCase());
  hideBurgerMenu();

  categoryObjectsArray.forEach((categoryObject) => {
    if (categoryObject.categoryName === categoryName) {
      mainContainer.innerHTML = "";
      createAndInsertCardsOnPage(categoryObject.childrenCollection);
    }
  });
}

/**
 * Rotates the word card back when the mouse leaves.
 * @param {*} event - The mouseleave event.
 */
export function cardBackRotate(event) {
  if (event.target.closest(".word-card") && event.relatedTarget) {
    const target = event.target.closest(".word-card");
    const relatedTarget = event.relatedTarget.closest(".word-card");

    if (relatedTarget?.id !== target.id) {
      target.classList.remove("card-reverse");
    }
  }
}

/**
 * Plays the audio of the word when a card is clicked.
 * @param {*} event - The click event.
 */
export const clickHandlerPlaySound = (event) => {
  const clickedCard = event.target.closest(".word-card-in-train-mode");
  if (clickedCard) {
    const parent = event.target.closest(".word-card").parent;
    parent.playSound();

    createOrUpdateLocalStorage(clickedCard.id, 1, 0, 0);
  }
};

/**
 * Sets the play mode and modifies the interface accordingly.
 * @param {*} wordCardsCollection - The collection of word cards.
 * @param {*} playBtnsCollection - The collection of play buttons.
 */
function setPlayMode(wordCardsCollection, playBtnsCollection) {
  if (wordCardsCollection.length === 0) {
    playBtnsCollection.forEach((btn) => btn.classList.add("active"));
  } else {
    modifyInterfaceForPlayMode(wordCardsCollection, bigPlayButtonContainer);
  }
}

/**
 * Sets the train mode and modifies the interface accordingly.
 * @param {*} wordCardsCollection - The collection of word cards.
 * @param {*} playBtnsCollection - The collection of play buttons.
 */
function setTrainMode(wordCardsCollection, playBtnsCollection) {
  if (wordCardsCollection.length === 0) {
    playBtnsCollection.forEach((btn) => btn.classList.remove("active"));
  } else {
    modifyInterfaceForTrainMode(wordCardsCollection, bigPlayButtonContainer);
  }
}

/**
 * Modifies the interface for the train mode.
 * @param {*} wordCardsCollection - The collection of word cards.
 */
function modifyInterfaceForTrainMode(wordCardsCollection) {
  wordCardsCollection.forEach((card) =>
    card.classList.add("word-card-in-train-mode")
  );
  wordCardsCollection.forEach((card) =>
    card.classList.remove(
      "word-card-in-play-mode",
      "unplayed-word",
      "played-card"
    )
  );
  bigPlayButtonContainer.classList.remove("play-button-container-visible");
  mainContainer.classList.remove("main-container-play-mode");
}

/**
 * Modifies the interface for the play mode.
 * @param {*} wordCardsCollection - The collection of word cards.
 */
function modifyInterfaceForPlayMode(wordCardsCollection) {
  wordCardsCollection.forEach((card) =>
    card.classList.add("word-card-in-play-mode", "unplayed-word")
  );
  wordCardsCollection.forEach((card) =>
    card.classList.remove("word-card-in-train-mode")
  );
  bigPlayButtonContainer.classList.add("play-button-container-visible");
  mainContainer.classList.add("main-container-play-mode");
}

/**
 * Switches between play mode and train mode.
 */
export function switchMode() {
  const wordCardsCollection = Array.from(
    document.querySelectorAll(".word-card")
  );
  const playBtnsCollection = document.querySelectorAll(".card-play-btn");

  playMode.classList.toggle("active");
  trainMode.classList.toggle("active");

  if (isPlayModeChecked()) {
    setPlayMode(
      wordCardsCollection,
      playBtnsCollection,
      bigPlayButtonContainer
    );
  } else {
    setTrainMode(
      wordCardsCollection,
      playBtnsCollection,
      bigPlayButtonContainer
    );
  }
}

/**
 * Checks if the play mode checkbox is checked.
 * @returns {boolean} - Returns true if checked, false otherwise.
 */
export function isPlayModeChecked() {
  const switchCheckbox = document.querySelector(".switch-checkbox");
  return switchCheckbox.checked;
}

/**
 * Creates or updates the localStorage item for a word.
 * @param {string} word - The word.
 * @param {number} trained - The number of times trained.
 * @param {number} correct - The number of times answered correctly.
 * @param {number} incorrect - The number of times answered incorrectly.
 */
export function createOrUpdateLocalStorage(word, trained, correct, incorrect) {
  if (!localStorage[word]) {
    const storageItem = createObjectForLocalStorage(
      trained,
      correct,
      incorrect
    );

    localStorage[word] = JSON.stringify(storageItem);
  } else {
    const itemFromStorage = JSON.parse(localStorage[word]);

    itemFromStorage.trained += trained;
    itemFromStorage.correct += correct;
    itemFromStorage.incorrect += incorrect;

    localStorage[word] = JSON.stringify(itemFromStorage);
  }
}

/**
 * Creates an object for localStorage.
 * @param {number} trained - The number of times trained.
 * @param {number} correct - The number of times answered correctly.
 * @param {number} incorrect - The number of times answered incorrectly.
 * @returns {Object} - The localStorage object.
 */
function createObjectForLocalStorage(trained, correct, incorrect) {
  const storageItem = {
    trained: trained,
    correct: correct,
    incorrect: incorrect,
  };

  return storageItem;
}

/**
 * Shows the statistics.
 * @param {Array} data - The statistics data.
 */
export function showStatistic(data) {
  const statisticTable = new StatisticTable(mainContainer, data);

  statisticTable.createAndShowStatisticButtons();
  statisticTable.createAndShowStatisticHead();
  statisticTable.createAndShowStatisticBody();
  hideBurgerMenu();

  gameElementsContainer.classList.add("game-elements-container-invisible");
}

/**
 * Starts the game.
 */
export function startGame() {
  const playingCardsCollection =
    document.getElementsByClassName("unplayed-word");
  const game = new Game(playingCardsCollection);
  game.startGame();
}

/**
 * Marks the menu items based on the current selection.
 * @param {*} event - The click event.
 */
export function markMenuItems(event) {
  const menuItem = event.target.closest(".burger-menu-item");
  const categoryCard = event.target.closest(".category-card");

  burgerMenuListItemsCollection.forEach((item) => {
    item.firstElementChild.classList.remove("list-item-link-active");

    if (menuItem?.id === item.id || item.id.includes(categoryCard?.id)) {
      item.firstChild.classList.add("list-item-link-active");
    }
  });
}
