import {initLetterTree, lookupWord} from './letterTree.js';
import {dims, hor, ver, wildcard} from '../constants.js';
import {isBoardEmpty, createWord} from '../board.js';
let root = initLetterTree();

let boardEmpty = false;
let moves = [];
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

// to prevent repeats we store 2 tables of seen words - ver and hor
let foundWordsHor = [
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
]
let foundWordsVer = [
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
    [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()],
]

let verCrossChecks = [
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
let horCrossChecks = [
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


let rack = [];
function findMoves(currentNode, partialWord, nextPos, dir, wildcards, ignorePartial=false) {
    let nextPosVal = '';
    if (inBounds(nextPos)) {
        nextPosVal = getValue(nextPos);
    } 
    if (currentNode.children.size == 0 && nextPosVal != '') {
        return;
    }
    // (currentNode.children.has(nextPosVal) && currentNode.children.get(nextPosVal).isWord)|| 
    if (currentNode.isWord &&
        (currentNode.children.size == 0 || nextPosVal == '') &&
        isConnected(partialWord, getStartOfWord(nextPos, dir, partialWord), dir) &&
        !ignorePartial) 
        {
            let startOfWord = getStartOfWord(nextPos, dir, partialWord);
            let [startY, startX] = startOfWord;
            if (dir == hor && !foundWordsHor[startY][startX].has(partialWord)) {
                foundWordsHor[startY][startX].set(partialWord, 0);
                // console.log(`found word ${partialWord} - ${startOfWord}, ${dir}`);
                moves.push(createWord(partialWord, startY, startX, dir, [...wildcards]));
            }
            if (dir == ver && !foundWordsVer[startY][startX].has(partialWord)) {
                foundWordsVer[startY][startX].set(partialWord, 0);
                // console.log(`found word ${partialWord} - ${startOfWord}, ${dir}`);
                // console.log(wildcards);
                moves.push(createWord(partialWord, startY, startX, dir, [...wildcards]));
            }
    }


    if (inBounds(nextPos)) {
        for (let [letter, child] of currentNode.children) {
    
            let boardValue = getValue(nextPos);
            if (dir == ver && !horCrossChecks[nextPos[0]][nextPos[1]].includes(letter)) {
                continue;
            }
            if (dir == hor && !verCrossChecks[nextPos[0]][nextPos[1]].includes(letter)) {
                continue;
            }
            if ((rack.includes(letter) && boardValue == '') || boardValue == letter || rack.includes(wildcard)) {
                let usedWildcard = false;
                let letterIndex = rack.indexOf(letter);
                if (!rack.includes(letter) && boardValue == '' && rack.includes(wildcard)) {
                    letterIndex = rack.indexOf(wildcard);
                    rack[letterIndex] = '';
                    
                    wildcards.push(partialWord.length);
                    usedWildcard = true;
                }

                else if (boardValue == '') {
                    rack[letterIndex] = '';
                    // rack.splice(rack.indexOf(letter), 1);
                }
                let possibleNextPos = getNextPos(nextPos, dir);
                findMoves(child, partialWord + letter, possibleNextPos, dir, wildcards);
                
    
                if (boardValue == '' && !usedWildcard) {
                    rack[letterIndex] = letter;
                }
                if (usedWildcard) {
                    wildcards.splice(-1, 1);
                    rack[letterIndex] = wildcard;
                }
            }
                    
        }
    }
}

function isConnected(word, pos, dir) {
    let deltaX = 0;
    let deltaY = 0;
    let startingPos = pos;

    if (dir == hor) {deltaX = 1}
    if (dir == ver) {deltaY = 1}

    for (let i = 0; i < word.length; i++) {
        let [y, x] = startingPos;
        let up = [y - 1, x];
        let down = [y + 1, x];
        let left = [y, x - 1];
        let right = [y, x + 1];
        
        for (let pos of [up, down, left, right, startingPos]) {
            if (inBounds(pos) && !isEmpty(pos)) {
                return true;
            }
            if (inBounds(pos) && boardEmpty && pos[0] == 7 && pos[1] == 7) {
                return true;
            }
        }
        startingPos = [startingPos[0] + deltaY, startingPos[1] + deltaX];
    }
    return false;
}

function getNextPos(currentPos, dir) {
    if (dir == hor) {
        return [currentPos[0], currentPos[1] + 1];
    }
    if (dir == ver) {
        return [currentPos[0] + 1, currentPos[1]];

    }
}

function getPrevPos(currentPos, dir) {
    if (dir == hor) {
        return [currentPos[0], currentPos[1] - 1];
    }
    if (dir == ver) {
        return [currentPos[0] - 1, currentPos[1]];

    }
}

function getStartOfWord(currentPos, dir, word) {
    let wordLength = word.length;
    if (dir == hor) {
        return [currentPos[0], currentPos[1] - wordLength];
    }
    if (dir == ver) {
        return [currentPos[0] - wordLength, currentPos[1]];

    }

}

function isEmpty(pos) {
    return board[pos[0]][pos[1]] == '';
}


function getValue(pos) {
    return board[pos[0]][pos[1]];
}

function inBounds(pos) {
    if (pos == undefined) {
        return false;
    }
    let [row, col] = [pos[0], pos[1]];
    return (row >= 0 && row < dims && col >= 0 && col < dims);
}


function getAnchorNodes() {
    // start off by collecting center nodes, only (x)
    //
    //   #
    //  #x#
    //   #
    //
    // anchor nodes/ neighbor nodes (#)
    let anchors = [
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

    let centralNodes = [];
    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            if (board[y][x] != '') {
                centralNodes.push([y, x]);
            }
        }
    }
    
    let anchorNodes = [];
    centralNodes.forEach(node => {
        let [y, x] = node;
        let up = [y - 1, x];
        let down = [y + 1, x];
        let left = [y, x - 1];
        let right = [y, x + 1];
        
        for (let pos of [up, down, left, right]) {
            if (inBounds(pos) && isEmpty(pos) && anchors[pos[0]][pos[1]] == 0) {
                anchorNodes.push(pos);
                anchors[pos[0]][pos[1]] = 1;
            }

        }
    });

    if (boardEmpty) {
        anchorNodes.push([7, 7]);
    }
    
    return anchorNodes;
}

function crossCheck() {
    // iterate through the normal board 
    // if all adjacent nodes are empty then available letters is abcd...z
    // otherwise find the vertical prefix, vertical suffix, horizontal prefix and horizontal suffix 
    // iterate through all letters in the alphabet and sandwhich it between both sets of prefixes and suffixes
    // if both come back as legal words than that letter will be stored
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let y = 0; y < dims; y++) {
        for (let x = 0; x < dims; x++) {
            if (isEmpty([y, x])) {
                let up = [y - 1, x];
                let down = [y + 1, x];
                let left = [y, x - 1];
                let right = [y, x + 1];
                let adjacentNodesPresent = false;
                verCrossChecks[y][x] = '';
                horCrossChecks[y][x] = '';

                for (let dir of [up, down, left, right]) {
                    if (inBounds(dir) && !isEmpty(dir)) {
                        adjacentNodesPresent = true;
                    }
                }

                if (!adjacentNodesPresent) {
                    verCrossChecks[y][x] = alphabet;
                    horCrossChecks[y][x] = alphabet;
                    continue;
                }

                let verticalPrefix = '';
                let verticalSuffix = '';
                let horizontalPrefix = '';
                let horizontalSuffix = '';

                // vertical
                let currentPos = getPrevPos([y, x], ver);
                while (inBounds(currentPos) && !isEmpty(currentPos)) {
                    verticalPrefix = getValue(currentPos) + verticalPrefix;
                    currentPos = getPrevPos(currentPos, ver);
                }

                currentPos = getNextPos([y, x], ver);
                while (inBounds(currentPos) && !isEmpty(currentPos)) {
                    verticalSuffix += getValue(currentPos);
                    currentPos = getNextPos(currentPos, ver);
                }
                // horizontal
                currentPos = getPrevPos([y, x], hor);
                while (inBounds(currentPos) && !isEmpty(currentPos)) {
                    horizontalPrefix = getValue(currentPos) + horizontalPrefix;
                    currentPos = getPrevPos(currentPos, hor);
                }

                currentPos = getNextPos([y, x], hor);
                while (inBounds(currentPos) && !isEmpty(currentPos)) {
                    horizontalSuffix += getValue(currentPos);
                    currentPos = getNextPos(currentPos, hor);
                }
                
                // just vertical
                for (let i in alphabet) {
                    let passedVerticalTest = false;
                    let passedHorizontalTest = false;

                    let letter = alphabet[i];
                    let verticalTestWord = verticalPrefix + letter + verticalSuffix;
                    let horizontalTestWord = horizontalPrefix + letter + horizontalSuffix;

                    let verticalWord = lookupWord(verticalTestWord);
                    let horizontalWord = lookupWord(horizontalTestWord);
                    if (verticalTestWord.length > 1 && verticalWord && verticalWord.isWord) {
                        passedVerticalTest = true;
                    } 
                    if (horizontalTestWord.length > 1 && horizontalWord && horizontalWord.isWord) {
                        passedHorizontalTest = true;
                    }
                    
                    // this would indicate that both prefixes and suffixes are empty
                    if (verticalTestWord.length == 1) {
                        passedVerticalTest = true;
                    }
                    if (horizontalTestWord.length == 1) {
                        passedHorizontalTest = true;
                    }

                    if (passedHorizontalTest) {
                        horCrossChecks[y][x] += letter;
                    }
                    if (passedVerticalTest) {
                        verCrossChecks[y][x]+= letter;
                    }
                }
            } else {
                let valueAtPos = getValue([y, x]);
                horCrossChecks[y][x] = valueAtPos;
                verCrossChecks[y][x] = valueAtPos;

            }
            
        }
    }
}


function findAllWords() {
    let attemptedPositions = [
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

    for (let [row, col] of getAnchorNodes()) {

        for (let dir of [hor, ver]) {
            // first we check for suffix only
            let deltaX = 0;
            let deltaY = 0;
            if (dir == hor) {deltaX = 1}
            if (dir == ver) {deltaY = 1}

            let prevPos = getPrevPos([row, col], dir);
            if (inBounds(prevPos) && !isEmpty(prevPos)) {
                let currentRow = row - deltaY;
                let currentCol = col - deltaX; // we move "left" by 1 to avoid starting on the anchor
                let partialWord = '';
    
                while (currentCol >= 0 && currentRow >= 0) {
                    if (isEmpty([currentRow, currentCol])) {
                        break;
                    }
                    partialWord = board[currentRow][currentCol] + partialWord;
                    currentCol -= deltaX;
                    currentRow -= deltaY;
    
                }
                let currentNode = lookupWord(partialWord);
                if (currentNode) {
                    // console.log('partial word: ', row, col, partialWord);
                    findMoves(currentNode, partialWord, [row, col], dir, [], true);
                    // findMoves(currentNode, partialWord, getNextPos([row, col], ver), ver);
                }
            }
            else {
                // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
                // we start at one tile before f and move left until we hit another letter or the boundaries
                // however, to avoid running validity checks we just need to stop 2 tiles to the left of z
                // and the previous case above will handle the tile to the left of z
                // to do this we just remove the last element in the array when we hit a letter
    
                let currentCol = col; 
                let currentRow = row;
                let shiftedTiles = 0;
                let startingPositions = [];
                while (currentCol >= 0 && currentRow >= 0 && shiftedTiles <= rack.length) {
                    if (isEmpty([currentRow, currentCol])) {
                        startingPositions.push([currentRow, currentCol]);
                    } 
                    else {
                        startingPositions.splice(-1, 1);
                        break;
                    }
                    currentCol -= deltaX;
                    currentRow -= deltaY;
                    shiftedTiles += 1;
                }
                for (let pos of startingPositions) {
                    // this check avoids repeating identical words several times, greatly saving on compute time
                    // but we have to check both hor and ver before we can log this move, the order is in hor, ver
                    // so just log after ver
                    if (attemptedPositions[pos[0]][pos[1]] == 0) {
                        // console.log(pos, dir);
                        findMoves(root, '', pos, dir, []);
                    }
                    if (dir == ver) {
                        attemptedPositions[pos[0]][pos[1]] = 1
                    }
                }
            }
        }
    }
}



function reset() {
    moves = [];
    boardEmpty = isBoardEmpty();

    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            horCrossChecks[y][x] = '';
            verCrossChecks[y][x] = '';
            foundWordsHor[y][x] = new Map();
            foundWordsVer[y][x] = new Map();
        }
    }
}
export function computeMoves(b, r) {
    reset();

    board = b;
    rack = r;

    let s = performance.now();
    crossCheck();
    findAllWords();
    console.log(`compute time ${performance.now() - s}ms`);
    
    return moves;

}
// getMoves(board2, ['d', 'o', 'n', 'a', 'l', 'd', 's']);