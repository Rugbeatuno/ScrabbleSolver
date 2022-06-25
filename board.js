import {dims, doubleLetterScore, doubleWordScore, hor, letterPoints, multipliers, normal, scrabbleWords, scrabbleWordsLength, trippleLetterScore, trippleWordScore, ver, wildcard,} from './constants.js';
import {getDeck, getLettersInDeck} from './deck.js';
import {makePossibleWords} from './algorithms.js';

let board = [
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
]


let prevSelectedTile = [null, null];  // y, x
let selectedTile = [null, null];
let travelDirection = [0, 1];
let isFocused = false;
let moves = [];

// setters and getters
export function getSelectedTile() {
    return selectedTile;
}

export function setSelectedTile(y, x) {
    prevSelectedTile = selectedTile;
    selectedTile = [y, x]; 
}

export function getPrevSelectedTile() {
    return prevSelectedTile;
}

export function getTravelDirection() {
    return travelDirection;
}

export function changeTravelDirection() {
    travelDirection = [travelDirection[1], travelDirection[0]];
}

export function setLetter(y, x, letter) {
    board[y][x] = letter;
}

export function unfocusBoard() {
    isFocused = false;
}

export function focusBoard() {
    isFocused = true;
}

export function isBoardFocused() {
    return isFocused;
}
export function getBoard() {
    return board;
}

export function getMoves() {
    return moves;
}

function isBoardEmpty() {
    // vertical words
    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            if (board[y][x] != '') {
                return false;
            }
        }
    }
    return true;
}

// word object
function createWord(word, row, col, dir) {
    return {
        word: word,
        row: row,
        col: col,
        dir: dir,
        score: 0,
        lettersPlaced: [],
        wildcards: [],
    }
}

// we will look at each line individually and empty spaces become spaces and letters are words
// then we will split the string by spaces and anything with a length greater than 1 is a word
function getWordsInLine(lineArr) {
    let line = "";
    for (let i=0; i<lineArr.length; i++) {
        if (lineArr[i] === '') {
            line += ' ';
        }
        else {
            line += lineArr[i];
        }
    }
    let words = line.split(' ');
    words = words.filter(word => word.length > 1);

    // now that we have the words we now have to find the index they are in the array
    let wordObjs = []
    words.forEach((word) => {
        let pos = line.indexOf(word);
        wordObjs.push([word, pos]);
    });

    return wordObjs;
}

export function getAllWords(hypotheticalBoard) {
    let allWords = [];

    // all horizontal words
    for (let y=0; y<dims; y++) {
        let wordAndPos = getWordsInLine(hypotheticalBoard[y]);
        wordAndPos.forEach(element => {
            let [word, pos] = element;
            allWords.push(createWord(word, y, pos, hor));
        });
    }

    // vertical words
    for (let x=0; x<dims; x++) {
        let line = [];
        for (let y=0; y<dims; y++) {
            line.push(hypotheticalBoard[y][x]);
        }
        let wordAndPos = getWordsInLine(line);
        wordAndPos.forEach(element => {
            let [word, pos] = element;
            allWords.push(createWord(word, pos, x, ver));
        });
    }
    return allWords;
}


export function getInvalidWords(hypotheticalBoard) {
    let invalidWords = [];
    let allWords = getAllWords(hypotheticalBoard);

    if (allWords.length < 1) {
        return [];
    }

    allWords.forEach(element => {
        if (!scrabbleWordsLength[element.word.length].includes(element.word)) {
            invalidWords.push(element);
        }
    });
    return invalidWords;
}

function getConnectableNodes() {
    // start off by collecting center nodes, only (x)
    //
    //   #
    //  #x#
    //   #
    //
    // adjacent nodes/ neighbor nodes (#)

    let centralNodes = [];
    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            if (board[y][x] != '') {
                centralNodes.push([y, x]);
            }
        }
    }

    let adjacentNodes = [...centralNodes];
    centralNodes.forEach(node => {
        let [y, x] = node;
        let up = [y - 1, x];
        let down = [y + 1, x];
        let left = [y, x - 1];
        let right = [y, x + 1];
        
        if (up[0] >= 0) {adjacentNodes.push(up);}
        if (down[0] < dims) {adjacentNodes.push(down);}
        if (left[1] >= 0) {adjacentNodes.push(left);}
        if (right[1] < dims) {adjacentNodes.push(right);}
    });

    return adjacentNodes;
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}

function getPlaceableWords(wordOptions) {
    let placeableWords = [];
    let boardEmpty = isBoardEmpty();
    let boardCenter = [Math.floor(dims / 2), Math.floor(dims / 2)];
    let deck = getLettersInDeck();

    let connectableNodesMap = new Map()
    getConnectableNodes().forEach(element => {
        connectableNodesMap.set(JSON.stringify(element), 0);
    });

    wordOptions.forEach(element => {
        let boardCopy = board.map(function(arr) {
            return arr.slice();
        });
        let deckCopy = [...deck];
      
        let centralNodes = [];
        let lettersPlaced = []; // this is a count of letters placed from your deck, not letters that are already ont he board
        // check if the word can be placed
        
        for (let i = 0; i < element.word.length; i++) {
            let letter = element.word[i];

            let y = 0;
            let x = 0;
            if (element.dir == hor) {
                x = i;
            }
            else if (element.dir == ver) {
                y = i;
            }
            
            let testingTile = boardCopy[element.row + y][element.col + x];
            if (testingTile != '' && testingTile != letter) {
                return;
            }

            centralNodes.push([element.row +y , element.col + x]);
            if (testingTile == '') {
                if (deckCopy.includes(letter)) {
                    deckCopy.splice(deckCopy.indexOf(letter), 1);
                    boardCopy[element.row + y][element.col + x] = letter;
                    lettersPlaced.push(letter);
                }
                else if (deckCopy.includes(wildcard)) {
                    deckCopy.splice(deckCopy.indexOf(wildcard), 1);
                    boardCopy[element.row + y][element.col + x] = letter;
                    lettersPlaced.push(letter);   
                    element.wildcards.push(i);
                } 
                else {
                    return;
                }
            }
        }

        element.lettersPlaced = lettersPlaced;

        // force words to be placed going through center when board is empty
        if (boardEmpty) {
            for (let i = 0; i < centralNodes.length; i++) {
                let node = centralNodes[i];
                if (arrayEquals(node, boardCenter)) {
                    placeableWords.push(element);
                    return
                }
            }
        }   
        
        for (let i = 0; i < centralNodes.length; i++) {
            let node = centralNodes[i];
            if (connectableNodesMap.has(JSON.stringify(node))) {
                if (getInvalidWords(boardCopy).length == 0) {
                    placeableWords.push(element);
                    return;
                }
            }
        }
    });
    
    return placeableWords;
}

// 1) traverse through each row and column adding up those letters and adding letters from the deck
// 2) calculate all words that can be made and try to place them on the board
// 3) calculate the score of the moves that can be placed
// 4) sort by score
export function findMoves() {
    let connectableNodes = getConnectableNodes();

    if (getLettersInDeck().length < 1) {
        return [];
    }

    let allMoves = [];
    // horizontal first
    for (let y=0; y<dims; y++) {
        
        // we check if at least one connectable node is in this row
        let isConnected = false;
        connectableNodes.forEach(connectableNode => {
            if (connectableNode[0] == y) {
                isConnected = true;
            }
        })
        if (y != Math.floor(dims / 2) && !isConnected) {
            continue;
        }

        let letters = getLettersInDeck();
        board[y].forEach(element => {
            if (element != '') {
                letters.push(element);
            }
        });
        let options = makePossibleWords(letters);
        options.forEach(option => {
            for (let i = 0; i <= dims - option.length; i++) {
                allMoves.push(createWord(option, y, i, hor));
            }
        });
    }

    // vertically
    for (let x=0; x<dims; x++) {
        // we check if at least one connectable node is in this col
        let isConnected = false;
        connectableNodes.forEach(connectableNode => {
            if (connectableNode[1] == x) {
                isConnected = true;
            }
        });
        if (x != Math.floor(dims / 2) && !isConnected) {
            continue;
        }

        let line = [];
        let letters = getLettersInDeck();
        for (let y=0; y<dims; y++) {
            line.push(board[y][x]);
        }
        line.forEach(element => {
            if (element != '') {
                letters.push(element);
            }
        });
        let options = makePossibleWords(letters);
        options.forEach(option => {
            for (let i = 0; i <= dims - option.length; i++) {
                allMoves.push(createWord(option, i, x, ver));
            }
        });
    }

    let placeableWords = getPlaceableWords(allMoves);
    let scoredMoves = calculateScores(placeableWords);
    moves = scoredMoves;
    console.log(scoredMoves);
}

export function calculateScores(placeableWords) {
    let currentWords = getAllWords(board);
    let scoredWords = [];
    let boardEmpty = isBoardEmpty();

    placeableWords.forEach(word => {
        let boardCopy = board.map(function(arr) {
            return arr.slice();
        });
        for (let i = 0; i < word.word.length; i++) {
            let letter = word.word[i];
            if (word.dir == hor) {
                boardCopy[word.row][word.col + i] = letter;
            }
            else if (word.dir == ver) {
                boardCopy[word.row + i][word.col] = letter;
            }
        }

        let newTotalWords = getAllWords(boardCopy);
        for (let i=0; i < newTotalWords.length; i++) {
            let newWord = newTotalWords[i];

            // skip over already existing words
            let skip = false;
            for (let k = 0; k < currentWords.length; k++) {
                let oldWord = currentWords[k];
                if (JSON.stringify(oldWord) == JSON.stringify(newWord)) {
                    skip = true;
                    break;
                }
            }

            if (skip) {
                continue;
            }

            let wordMultiplier = 1;
            let totalScore = 0;

            for (let i = 0; i < newWord.word.length; i++) {
                let [y, x] = [newWord.row, newWord.col + i];
                if (newWord.dir == ver) {
                    [y, x] = [newWord.row + i, newWord.col];
                }
        
                // current tile is empty so use multipliers
                let letterScore = letterPoints[boardCopy[y][x]];

                // score wildcards as 0 points
                if (word.wildcards.length > 0 && word.wildcards.includes(i)) {
                    letterScore = 0;
                }

                if (board[y][x] == '') {
                    let multiplier = multipliers[y][x];
                    if (multiplier == doubleWordScore) {wordMultiplier *= 2;}
                    else if (multiplier == trippleWordScore) {wordMultiplier *= 3;}
                    else if (multiplier == doubleLetterScore) {letterScore *= 2;}
                    else if (multiplier == trippleLetterScore) {letterScore *= 3;}
                }

                totalScore += letterScore;
                
            }

            totalScore *= wordMultiplier;
            word.score += totalScore;
            if (boardEmpty) {
                word.score *= 2;
            }
            if (word.lettersPlaced.length == getDeck().length) {
                word.score += 50;
            }
        }
        if (word.score > 0) {
            scoredWords.push(word);
        }
    });
    scoredWords.sort((a, b) => a.word.length > b.word.length ? -1 : 1);
    scoredWords.sort((a, b) => a.score > b.score ? 1 : -1);
    return scoredWords;
}