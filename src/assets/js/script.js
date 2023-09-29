'use strict';

import categories from '../JSON/categories'
import '../scss/styles.scss';
import {
    toggleBurgerMenu,
    createCategoriesAndWords,
    createAndInsertCardsOnPage,
    cardBackRotate,
    clickHandlerPlaySound,
    switchMode,
    startGame,
    showStatistic,
    movingToCategory,
    markMenuItems,
} from "./utils.js";

const mainContainer = document.querySelector('.main-container');
const switcher = document.querySelector('.switch');
const bigPlayButton = document.querySelector('.play-button');

// Create an array of category objects.
const categoryObjectsArray = createCategoriesAndWords(categories);

// Add category cards to the page.
createAndInsertCardsOnPage(categoryObjectsArray);

// Add global click event listener.
document.body.addEventListener('click', event => {
    const target = event.target;

    // Toggle the burger menu.
    if (target.closest('.burger-btn') || target.id === 'menu-container') {
        toggleBurgerMenu();
        // Clear localStorage when the clear button is clicked.
    } else if (target.id === 'clearBtn') {
        localStorage.clear();
        showStatistic(categoryObjectsArray);
        // Show the statistic table when the statistic button is clicked.
    } else if (target.id === 'statistic') {
        markMenuItems(event);
        showStatistic(categoryObjectsArray);
        // Add event handler to the card rotate buttons for flipping.
    } else if (target.closest('.card-rotate-btn')) {
        target.closest('.word-card').classList.add('card-reverse');
        // Add event handler to the card container for playing sound.
    } else if (event.target.closest('.word-card')) {
        clickHandlerPlaySound(event);
        // Handle clicking on category menu items or category cards for navigation.
    } else if (event.target.closest('.brgr-menu-item') || event.target.closest('.category-card')) {
        markMenuItems(event);
        movingToCategory(event, categoryObjectsArray);
        // Reload the page if clicked inside the popup container.
    } else if (event.target.closest('.popup-container')) {
        location.reload();
    }
});

// Flip the cards back when the cursor is moved away.
mainContainer.addEventListener('mouseout', event => cardBackRotate(event));

// Handle switcher toggle.
switcher.addEventListener('change', switchMode);

// Get the play button and add a click event listener for starting the game.
bigPlayButton.addEventListener('click', startGame, {
    once: true
});

import '../images/animals.png'
import '../images/vegetables.png'
import '../images/colors.png'
import '../images/insects.png'
import '../images/birds.png'
import '../images/clothes.png'
import '../images/transport.png'
import '../images/fruits.png'
import '../images/dog.png'
import '../images/cat.png'
import '../images/elephant.png'
import '../images/lion.png'
import '../images/giraffe.png'
import '../images/monkey.png'
import '../images/bear.png'
import '../images/tiger.png'
import '../images/potato.png'
import '../images/cucumber.png'
import '../images/tomato.png'
import '../images/pumpkin.png'
import '../images/carrot.png'
import '../images/onion.png'
import '../images/cabbage.png'
import '../images/garlic.png'
import '../images/red.png'
import '../images/blue.png'
import '../images/yellow.png'
import '../images/green.png'
import '../images/orange.png'
import '../images/pink.png'
import '../images/purple.png'
import '../images/brown.png'
import '../images/butterfly.png'
import '../images/bee.png'
import '../images/ant.png'
import '../images/ladybug.png'
import '../images/spider.png'
import '../images/grasshopper.png'
import '../images/mosquito.png'
import '../images/beetle.png'
import '../images/crow.png'
import '../images/duck.png'
import '../images/hen.png'
import '../images/ostrich.png'
import '../images/owl.png'
import '../images/parrot.png'
import '../images/peacock.png'
import '../images/pigeon.png'
import '../images/t-shirt.png'
import '../images/dress.png'
import '../images/sweater.png'
import '../images/jacket.png'
import '../images/hat.png'
import '../images/socks.png'
import '../images/pants.png'
import '../images/car.png'
import '../images/bus.png'
import '../images/bicycle.png'
import '../images/truck.png'
import '../images/sneakers.png'
import '../images/motorcycle.png'
import '../images/train.png'
import '../images/helicopter.png'
import '../images/apple.png'
import '../images/banana.png'
import '../images/pear.png'
import '../images/strawberry.png'
import '../images/grape.png'
import '../images/pineapple.png'
import '../images/airplane.png'
import '../images/watermelon.png'
import '../images/apricot.png'