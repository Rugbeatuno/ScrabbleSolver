import {dims, doubleLetterScore, doubleWordScore, hor, letterPoints, activeMultipliers, trippleLetterScore, trippleWordScore, ver} from './constants.js';
import {getDeck} from './deck.js';
import {computeMoves} from './solver/index.js';
import {lookupWord} from './solver/letterTree.js';

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

let wildcardMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]


let prevSelectedTile = [null, null];  // y, x
let selectedTile = [0, 0];
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

export function isBoardEmpty() {
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
export function setBoard(b) {
    board = b;
}

export function getPlacedWilcards() {
    let placedWilcards = [];
    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            if (wildcardMap[y][x]) {
                placedWilcards.push([y, x]);
            }
        }
    }
    return placedWilcards;
}

export function setPlacedWildcard(pos) {
    wildcardMap[pos[0]][pos[1]] = 1;
}

export function resetBoard() {
    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            board[y][x] = '';
            wildcardMap[y][x] = 0;
        }
    }
    moves = [];
}

// word object
export function createWord(word, row, col, dir, w) {
    return {
        word: word,
        row: row,
        col: col,
        dir: dir,
        score: 0,
        wildcards: w,
        bingo: false,
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
        let word = lookupWord(element.word);
        if (!word || word && !word.isWord) {
            invalidWords.push(element);
        }
    });
    return invalidWords;
}


export function findMoves() {
    let placeableMoves = computeMoves(board, [...getDeck()]);
    let scoredMoves = calculateScores(placeableMoves);
    moves = scoredMoves;
    console.log('Moves found:', scoredMoves.length);
}


export function calculateScores(placeableWords) {
    let currentWords = getAllWords(board);
    let scoredWords = [];
    let boardEmpty = isBoardEmpty();
    let placedWilcards = getPlacedWilcards();

    for (let word of placeableWords) {
        let wildcards = [...placedWilcards];

        let boardCopy = board.map(function(arr) {
            return arr.slice();
        });
        for (let i = 0; i < word.word.length; i++) {
            let letter = word.word[i];
            if (word.dir == hor) {
                boardCopy[word.row][word.col + i] = letter;
                if (word.wildcards.includes(i)) {
                    wildcards.push([word.row, word.col + i]);
                }
            }
            else if (word.dir == ver) {
                boardCopy[word.row + i][word.col] = letter;
                if (word.wildcards.includes(i)) {
                    wildcards.push([word.row + i, word.col]);
                }
            }
        }


        for (let newWord of getAllWords(boardCopy)) {
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
            let tilesPlaced = 0;

            for (let i = 0; i < newWord.word.length; i++) {
                let [y, x] = [newWord.row, newWord.col + i];
                if (newWord.dir == ver) {
                    [y, x] = [newWord.row + i, newWord.col];
                }
                
                let isWildcard = false;
                for (let pos of wildcards) {
                    if (y == pos[0] && x == pos[1]) {
                        isWildcard = true;
                        break;
                    }
                }
                // current tile is empty so use activeactiveMultipliers
                let letterScore = letterPoints[boardCopy[y][x]];
                // score wildcards as 0 points
                if (board[y][x] == '') {
                    tilesPlaced += 1;
                    if (!isWildcard) {
                        let multiplier = activeMultipliers[y][x];
                        if (multiplier == doubleWordScore) {wordMultiplier *= 2;}
                        else if (multiplier == trippleWordScore) {wordMultiplier *= 3;}
                        else if (multiplier == doubleLetterScore) {letterScore *= 2;}
                        else if (multiplier == trippleLetterScore) {letterScore *= 3;}
                    }
                    else {
                        continue;
                    }
                }
                
                totalScore += letterScore;
                
            }

            totalScore *= wordMultiplier;
            word.score += totalScore;
            if (boardEmpty) {
                word.score *= 2;
            }
            if (tilesPlaced == 7) {
                word.bingo = true;
                word.score += 50;
            }
        }
        if (word.score > 0) {
            scoredWords.push(word);
        }
    }
    scoredWords.sort((a, b) => a.word.length > b.word.length ? -1 : 1);
    scoredWords.sort((a, b) => a.score > b.score ? 1 : -1);
    return scoredWords;
}
