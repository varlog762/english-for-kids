'use strict';

import {
    createAndInsertElement,
    createAndInsertCardsOnPage,
} from "./utils.js";

export class StatisticTable {
    /**
     * Represents a statistic table for tracking word statistics.
     * @param {HTMLElement} mainContainer - The container element for the statistic table.
     * @param {Array} categoryObjectsArray - An array of category objects containing word data.
     */
    constructor(mainContainer, categoryObjectsArray) {
        this.main = document.querySelector('.main');
        this.mainContainer = mainContainer;
        this.difficultWordsCollection = [];
        this.wordsCollection = categoryObjectsArray.flatMap(category => category.childrenCollection || []);
        console.log(Array.isArray(this.wordsCollection));
        this.statisticTableHeaders = ['category', 'word', 'translation', 'trained', 'correct', 'incorrect', '%'];
        this.statisticTable;
        this.trainDifficultBtn;
        this.gameElementsContainer = document.querySelector('.game-elements-container');
    }

    /**
     * Creates and displays the statistic buttons in the main container.
     */
    createAndShowStatisticButtons() {
        const statisticBtnsContainer = document.createElement('div');
        statisticBtnsContainer.classList.add('statistic-btns-container');

        //Creates button for localStorage clearing.
        const statisticClearBtn = createAndInsertElement('button', statisticBtnsContainer, 'statistic-clear-btn');
        statisticClearBtn.classList.add('statistic-btn');
        statisticClearBtn.setAttribute('type', 'button');
        statisticClearBtn.id = 'clearBtn';
        statisticClearBtn.innerText = 'reset';

        //Creates button for difficult words training.
        this.trainDifficultBtn = createAndInsertElement('button', statisticBtnsContainer, 'train-difficult-btn');
        this.trainDifficultBtn.classList.add('statistic-btn');
        this.trainDifficultBtn.setAttribute('type', 'button');
        this.trainDifficultBtn.innerText = 'train difficult';

        this.mainContainer.innerHTML = '';
        this.main.classList.add('main-for-statistic');
        this.mainContainer.append(statisticBtnsContainer);
    }

    /**
     * Creates and displays the header of the statistic table.
     * @returns {HTMLElement} - The created statistic table element.
     */
    createAndShowStatisticHead() {
        this.statisticTable = document.createElement('div');
        this.statisticTable.classList.add('statistic-table');

        const statisticTableHead = createAndInsertElement('thead', this.statisticTable, 'statistic-table-head');
        const statisticTableHeadRow = createAndInsertElement('tr', statisticTableHead, 'statistic-table-head-row');

        this.statisticTableHeaders.forEach(item => {
            const tHeader = createAndInsertElement('th', statisticTableHeadRow, 'statistic-table-head-item');
            tHeader.id = item;
            if (item === 'trained' || item === 'correct' || item === 'incorrect') {
                tHeader.innerHTML = `<div class="${item}-table-header"></div>`;
            } else {
                tHeader.innerHTML = item;
            }
        });

        statisticTableHead.addEventListener('click', event => this.sortStatisticTable(event));

        this.mainContainer.append(this.statisticTable);

        return this.statisticTable;
    }

    /**
     * Creates and displays the body of the statistic table.
     */
    createAndShowStatisticBody() {
        const statisticTableBody = createAndInsertElement('tbody', this.statisticTable, 'statistic-table-body');

        this.wordsCollection.forEach(word => {
            const statisticTableBodyRow = createAndInsertElement('tr', statisticTableBody, 'statistic-table-body-row');

            const tableDataCategory = createAndInsertElement('td', statisticTableBodyRow, 'statistic-table-body-data');
            const tableDataWord = createAndInsertElement('td', statisticTableBodyRow, 'statistic-table-body-data');
            const tableDataTranslation = createAndInsertElement('td', statisticTableBodyRow, 'statistic-table-body-data');
            const tableDataTrained = createAndInsertElement('td', statisticTableBodyRow, 'statistic-table-body-data');
            const tableDataCorrect = createAndInsertElement('td', statisticTableBodyRow, 'statistic-table-body-data');
            const tableDataIncorrect = createAndInsertElement('td', statisticTableBodyRow, 'statistic-table-body-data');
            const tableDataPercents = createAndInsertElement('td', statisticTableBodyRow, 'statistic-table-body-data');

            tableDataCategory.innerText = word.categoryName;
            tableDataWord.innerText = word.word;
            tableDataTranslation.innerText = word.wordTranslation;
            tableDataTrained.innerText = word.clickedOnTrainMode;
            tableDataCorrect.innerText = word.correctAnswersNum;
            tableDataIncorrect.innerText = word.incorrectAnswersNum;
            tableDataPercents.innerText = word.winRate;
        });

        this.statisticTable.append(statisticTableBody);

        this.trainDifficultBtn.addEventListener('click', () => this.createDifficultWordsCollection());
    }

    /**
     * Sorts the statistic table based on the clicked table header.
     * @param {Event} event - The click event on the table header.
     */
    sortStatisticTable(event) {
        const target = event.target.closest('.statistic-table-head-item');

        if (target.classList.contains('sorted') || target.classList.contains('reverse')) {
            this.wordsCollection.reverse();
            this.markHeaderAsSorted(target, 'reverse');
        } else {
            switch (target.id) {
                case 'category':
                    this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'categoryName'));
                    this.markHeaderAsSorted(target, 'sorted');
                    break;
                case 'word':
                    this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'word'));
                    this.markHeaderAsSorted(target, 'sorted');
                    break;
                case 'translation':
                    this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'wordTranslation'));
                    this.markHeaderAsSorted(target, 'sorted');
                    break;
                case 'trained':
                    this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'clickedOnTrainMode')).reverse();
                    this.markHeaderAsSorted(target, 'sorted');
                    break;
                case 'correct':
                    this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'correctAnswersNum')).reverse();
                    this.markHeaderAsSorted(target, 'sorted');
                    break;
                case 'incorrect':
                    this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'incorrectAnswersNum')).reverse();
                    this.markHeaderAsSorted(target, 'sorted');
                    break;
                case '%':
                    this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'winRate')).reverse();
                    this.markHeaderAsSorted(target, 'sorted');
                    break;
            }
        }

        this.statisticTable.lastChild.remove();
        this.createAndShowStatisticBody();
    }

    /**
     * Marks the clicked header as sorted and adjusts the sorting direction.
     * @param {HTMLElement} header - The clicked table header element.
     * @param {string} className - The class name to apply for sorting direction ('sorted' or 'reverse').
     */
    markHeaderAsSorted(header, className) {
        const headersCollection = Array.from(this.statisticTable.firstChild.firstChild.children);

        headersCollection.forEach(item => item.classList.remove('sorted'));
        headersCollection.forEach(item => item.classList.remove('reverse'));
        header.classList.add(className);
    }

     /**
     * Sorts an array of objects based on a specific property.
     * @param {Object} a - The first object for comparison.
     * @param {Object} b - The second object for comparison.
     * @param {string} value - The property to compare.
     * @returns {number} - The comparison result (-1, 0, or 1).
     */
    sortArray(a, b, value) {
        const nameA = a[value];
        const nameB = b[value];

        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Creates a collection of difficult words based on incorrect answers and starts the training mode.
     */
    createDifficultWordsCollection() {
        this.wordsCollection.sort((a, b) => this.sortArray(a, b, 'incorrectAnswersNum')).reverse();
        this.difficultWordsCollection = this.wordsCollection.slice(0, 8).filter(word => word.incorrectAnswersNum > 0);

        if (this.difficultWordsCollection.length === 0) {
            this.createPopupForEmptyDifficultWords();
        } else {
            this.mainContainer.innerHTML = '';
            this.main.classList.remove('main-for-statistic');
            createAndInsertCardsOnPage(this.difficultWordsCollection);
            this.gameElementsContainer.classList.remove('game-elements-container-invisible');
        }
    }

    /**
     * Creates a popup message when there are no difficult words to train.
     */
    createPopupForEmptyDifficultWords() {
        const popupContainer = createAndInsertElement('div', this.mainContainer, 'popup-container-empty-difficult');
        const popupEmpty = createAndInsertElement('div', popupContainer, 'popup-empty-difficult');
        const popupEmptyTitle = createAndInsertElement('div', popupEmpty, 'popup-empty-title');
        popupEmptyTitle.innerText = 'No cards to show!';

        popupContainer.addEventListener('click', () => popupContainer.remove(), { once: true });
        
        setTimeout(() => popupContainer.remove(), 3000);
    }
}