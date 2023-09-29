'use strict';
import { createAndInsertElement } from './utils.js';

export class Category {
    /**
     * Represents a category.
     * @param {string} categoryName - The name of the category.
     * @param {string} ImagePath - The image path for the category.
     */
    constructor(categoryName, ImagePath) {
        this.categoryName = categoryName;
        this.ImagePath = ImagePath;
        this.childrenCollection = [];
    }

    /**
     * Creates the HTML structure for the category card.
     * @returns {HTMLElement} - The category card element.
     */
    createCardHTML() {
        const categoryCard = document.createElement('div');

        categoryCard.classList.add('card', 'category-card');
        categoryCard.setAttribute('id', this.categoryName);

        const cardCategoryFigure = createAndInsertElement('figure', categoryCard, 'card-figure');

        const cardCategoryImg = createAndInsertElement('img', cardCategoryFigure, 'card-img');
        cardCategoryImg.setAttribute('src', this.ImagePath);
        cardCategoryImg.setAttribute('alt', this.categoryName);

        const cardTitle = createAndInsertElement('figcaption', cardCategoryFigure, 'card-title');
        cardTitle.innerHTML = this.categoryName;

        const playBtn = createAndInsertElement('button', categoryCard, 'card-play-btn');
        playBtn.setAttribute('type', 'button');
        playBtn.innerHTML = 'Play';

        return categoryCard;
    }

    /**
     * Adds a child element to the children collection.
     * @param {object} child - The child element to be added.
     */
    addChildToCollection(child) {
        this.childrenCollection.push(child);
    }
}