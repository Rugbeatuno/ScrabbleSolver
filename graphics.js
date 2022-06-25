import {dims, colorConversions, multipliers, letterPoints, hor, ver, wildcard} from './constants.js';
import {getBoard, getAllWords, getPrevSelectedTile, setSelectedTile, getSelectedTile, getTravelDirection, changeTravelDirection, setLetter, getInvalidWords, focusBoard, isBoardFocused, unfocusBoard, findMoves, getMoves} from './board.js';
import {focusDeck, getDeck, getSelectedDeckTile, isDeckFocused, setDeck, typeDeckLetter, unfocusDeck} from './deck.js';
import { makePossibleWords } from './algorithms.js';

// directional arrow
let arrow = document.createElement('img');
arrow.src = './arrow.png';
arrow.className = 'arrow';
document.body.appendChild(arrow);

// board
let board = document.createElement('div');
board.id = 'board';

let menu = document.createElement('div');
menu.id = 'menu';

let showLoader = true;
toggleLoader();


function initBoard() {
    document.body.addEventListener("keydown", function(event) {
        typeLetters(event);
    });

    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            let tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `${y}-${x}`;

            let letter = document.createElement('div');
            letter.className = 'tile-letter';
            tile.appendChild(letter);

            let points = document.createElement('div');
            points.className = 'tile-points'
            tile.appendChild(points);

            // tile colors based on multipliers
            tile.style.background = colorConversions[multipliers[y][x]];

            // event listener
            tile.addEventListener("click", () => {
                resetBackgroundColors();

                setSelectedTile(y, x);
                hightlightSelectedTile();
                focusBoard();
                unfocusDeck();
            });

            

            board.appendChild(tile);
        }
    }
    document.body.appendChild(board);


}

function drawDirectionalArrow() {
    let boardPos = board.getBoundingClientRect();
    let [boardX, boardY] = [boardPos.x, boardPos.y];
    let tileWidth = Math.floor(boardPos.width / dims);
    let [y, x] = getSelectedTile();
    if (y != null && x != null) {
        let [imgX, imgY] = [boardX + x * tileWidth, boardY + y * tileWidth];
        // horizontal
        let [travelY, travelX] = getTravelDirection();
        if (travelY == 0 && travelX == 1) {
            arrow.style.transform = `rotate(0deg)`;
            arrow.style.left = `${imgX + tileWidth}px`;
            arrow.style.top = `${imgY + tileWidth / 4}px`;
        }
        else if (travelY == 1 && travelX == 0) {
            arrow.style.transform = `rotate(90deg)`;
            arrow.style.left = `${imgX + tileWidth / 5}px`;
            arrow.style.top = `${imgY + tileWidth}px`;
        }
    }
}

function toggleLoader() {
    if (showLoader == true) {
        let loader = document.getElementsByClassName('loading-ring');
        for (let l of loader) {
            showLoader = false;
            // filter: blur(5px);
            l.style.top = `-100px`;
            l.style.left = `-100px`;
        }

    }
    else if (showLoader == false) {
        showLoader = true;
        let menu = document.getElementById('menu');
        let menuPos = menu.getBoundingClientRect();
        let [menuX, menuY] = [menuPos.x, menuPos.y];
        let [menuWidth, menuHeight] = [menuPos.width, menuPos.height];
        
        let loader = document.getElementsByClassName('loading-ring');
        for (let l of loader) {
            l.style.left = `${Math.floor(menuX + menuWidth / 2)}px`;
            l.style.top = `${Math.floor(menuY + menuHeight / 2)}px`;
        }

    }
}

function hightlightSelectedTile() {
    // reset the previous selected tile
    let [pY, pX] = getPrevSelectedTile();
    if (pY != null && pX != null) {
        let prevSelectedTile = document.getElementById(`${pY}-${pX}`);
        prevSelectedTile.className = 'tile';
    }

    // find the current selected tile
    let [y, x] = getSelectedTile();
    if (y == null || x == null) {
        return;
    }

    
    let selectedTile = document.getElementById(`${y}-${x}`);
    selectedTile.className = 'tile tile-selected';
    
    if (pX == x && pY == y) {
        changeTravelDirection();
    }
   drawDirectionalArrow();
}

function typeLetters(e) {
    let legalCharacters = 'abcdefghijklmnopqrstuvwxyzbackspacereturnenter8' + wildcard;
    let key = e.key.toLowerCase();
    let directionalMultiplier = 1;

    if (!legalCharacters.includes(key)) {
        return;
    }

    if (key == 'backspace') {
        key = '';
        directionalMultiplier = -1;
    }

    if (key == 'return' || key == 'enter') {
        toggleLoader();
    $(window).trigger('resize');
        findMoves();
        updateMoveMenu();
        scrollToMenuTop();
        toggleLoader();
        return;
    }

    

    if (isBoardFocused()) {
        if (key == '8' || key == wildcard) {
            return;
        }

        let [y, x] = getSelectedTile();
        if (y == null || x == null) {
            return false;
        }
        let selectedTile = document.getElementById(`${y}-${x}`);
        let [tileLetter, tilePoints] = selectedTile.children;
        tileLetter.innerHTML = key;
        tilePoints.innerHTML = letterPoints[key];
    
        setLetter(y, x, key);
        highlightInvalidWords();
        shiftSelectedTile(directionalMultiplier);
    }
    else if (isDeckFocused()) {
        if (key == '8' || key == '*') {
            key = '*'
        }
        typeDeckLetter(key);
        for (let i=0; i < getDeck().length; i++) {
            let tile = document.getElementById(`deck-${i}`);
            tile.innerHTML = getDeck()[i];
            tile.className = 'deck-tile';
        }
        let tile = document.getElementById(`deck-${getSelectedDeckTile()}`);
        tile.className += ' deck-tile-selected';

    }
}

function shiftSelectedTile(multiplier) {
    let [y, x] = getSelectedTile();
    if (y == null || x == null) {
        return false;
    }

    let [deltaY, deltaX] = getTravelDirection();
    let [newY, newX] = [y + deltaY * multiplier, x + deltaX * multiplier];

    if (newX < dims && newY < dims && newX >= 0 && newY >= 0) {
        setSelectedTile(newY, newX);
        hightlightSelectedTile();
    }

}

function resetBackgroundColors() {
    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            let id = `${y}-${x}`;
            let element = document.getElementById(id);
            element.style.background = colorConversions[multipliers[y][x]];

            // reset to actual board values
            // this wipes any previews of invalid words
            let [tileLetter, tilePoints] = element.children;
            let actualLetter = getBoard()[y][x];
            tileLetter.innerHTML = actualLetter;
            tilePoints.innerHTML = letterPoints[actualLetter];
        }
    }
}

function highlightInvalidWords() {
    // reset invalid words before redrawing
    resetBackgroundColors();

    let invalidWords = getInvalidWords(getBoard());
    invalidWords.forEach(element => {
        for (let i=0; i < element.word.length; i++) {
            let tileId;
            if (element.dir == hor) {
                tileId = `${element.row}-${element.col + i}`
            }
            else {
                tileId = `${element.row + i}-${element.col}`
            }
            let invalidTile = document.getElementById(tileId);
            invalidTile.style.background = `rgba(255, 30, 0, 0.9)`;
        }
    });
}

function previewPossibleMove(move) {
    // reset any previous coloring before redrawing
    resetBackgroundColors();

    for (let i=0; i < move.word.length; i++) {
        let tileId;
        if (move.dir == hor) {
            tileId = `${move.row}-${move.col + i}`
        }
        else {
            tileId = `${move.row + i}-${move.col}`
        }
        let tile = document.getElementById(tileId);
        tile.style.background = `rgba(0, 255, 0, 0.9)`;

        let [tileLetter, tilePoints] = tile.children;
        tileLetter.innerHTML = move.word[i];
        tilePoints.innerHTML = letterPoints[move.word[i]];
    }
}

function placeWord(move) {
    for (let i=0; i < move.word.length; i++) {
        if (move.dir == hor) {
            setLetter(move.row, move.col + i, move.word[i]);
        }
        else {
            setLetter(move.row + i, move.col, move.word[i]);
        }
        // subtract used letters from deck 
        let deck = getDeck();
        if (deck.includes(move[i])) {
            setDeck(deck.slice(deck.lastIndexOf(move[i]), 1));
        }
    }
}

function initDeck() {
    let deck = document.createElement('div');
    deck.id = 'deck';

    for (let i=0; i < getDeck().length; i++) {
        let deckTile = document.createElement('div');
        deckTile.className = 'deck-tile';
        deckTile.id = `deck-${i}`;

        deckTile.addEventListener('click', () => {
            resetBackgroundColors();
            focusDeck();
            unfocusBoard();
        });
        deck.appendChild(deckTile);
    }
    document.body.appendChild(deck);
}

function scrollToMenuTop() {
    document.getElementById('menu-0').scrollIntoView({ 
        behavior: 'smooth' 
      });
}

function updateMoveMenu() {
    menu.innerHTML = '';
    
    let moves = getMoves().reverse();
    if (moves.length > 300) {
        moves = moves.slice(0, 300);
    }
    for (let i = 0; i < moves.length; i++) {
        let moveItem = document.createElement('div');
        moveItem.className = 'menu-item';
        moveItem.id = `menu-${i}`;

        let ranking = document.createElement('div');
        ranking.className = 'move-ranking';
        ranking.innerHTML = `${i + 1}.`;

        let score = document.createElement('div');
        score.className = 'move-score';
        score.innerHTML = moves[i].score;

        let word = document.createElement('div');
        word.className = 'move-word';
        word.innerHTML = moves[i].word;

        let pos = document.createElement('div');
        pos.className = 'move-pos';
        let [row, col] = [moves[i].row, moves[i].col]
        pos.innerHTML = `(${col}, ${row})`;

        let dir = document.createElement('div');
        dir.className = 'move-dir';
        let text = 'Horizontal';
        if (moves[i].dir == ver) {
            text = "Vertical";
        }
        dir.innerHTML = text;

        let bingo = document.createElement('div');
        bingo.className = 'move-bingo';
        let value = 'F';
        if (moves[i].lettersPlaced.length == getDeck().length) {
            value = "T";
        }
        bingo.innerHTML = value;


        moveItem.appendChild(ranking);
        moveItem.appendChild(word);
        moveItem.appendChild(pos);
        moveItem.appendChild(dir);
        moveItem.appendChild(bingo);
        moveItem.appendChild(score);

        moveItem.addEventListener('mouseover', () => {
            highlightInvalidWords();
            previewPossibleMove(moves[i]);
        });

        moveItem.addEventListener('dblclick', () => {
            placeWord(moves[i]);
            highlightInvalidWords();
        })

        menu.appendChild(moveItem);
    }

    document.body.appendChild(menu);
}
function initMoveMenu() {
    let key = document.createElement('div');
    key.id = 'key';

    let col0 = document.createElement('div');
    col0.innerHTML = 'Ranking';

    let col1 = document.createElement('div');
    col1.innerHTML = 'Word';

    let col2 = document.createElement('div');
    col2.innerHTML = 'Position';

    let col3 = document.createElement('div');
    col3.innerHTML = 'Direction';

    let col4 = document.createElement('div');
    col4.innerHTML = 'Bingo';

    let col5 = document.createElement('div');
    col5.innerHTML = 'Points';

    key.appendChild(col0);
    key.appendChild(col1);
    key.appendChild(col2);
    key.appendChild(col3);
    key.appendChild(col4);
    key.appendChild(col5);
    document.body.appendChild(key);

    document.body.appendChild(menu);
    
    
}


initBoard();
initMoveMenu();
initDeck();