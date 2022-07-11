import {dims, colorConversions, multipliers, letterPoints, hor, ver, wildcard} from './constants.js';
import {getBoard, getAllWords, getPrevSelectedTile, setSelectedTile, getSelectedTile, getTravelDirection, changeTravelDirection, setLetter, getInvalidWords, focusBoard, isBoardFocused, unfocusBoard, findMoves, getMoves, setBoard} from './board.js';
import {focusDeck, getDeck, getSelectedDeckTile, isDeckFocused, setDeck, typeDeckLetter, unfocusDeck} from './deck.js';
import { makePossibleWords } from './algorithms.js';
import { createIcon } from './sidebar.js';



// board
let board = document.createElement('div');
board.id = 'board';

let menu = document.createElement('div');
menu.id = 'menu';


let showLoader = false;
toggleLoader();

let apiURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
let hoveredWord;

function initBoard() {
    document.body.addEventListener("keydown", function(event) {
        typeLetters(event);
    }); 
   
    let boardValues = getBoard();

    for (let y=0; y<dims; y++) {
        for (let x=0; x<dims; x++) {
            let tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `${y}-${x}`;

            let letter = document.createElement('div');
            letter.className = 'tile-letter';
            letter.innerHTML = boardValues[y][x];
            tile.appendChild(letter);

            let points = document.createElement('div');
            points.className = 'tile-points'
            points.innerHTML = letterPoints[boardValues[y][x]];

            tile.appendChild(points);

            // tile colors based on multipliers
            tile.style.background = colorConversions[multipliers[y][x]];

            // event listener
            tile.addEventListener("click", () => {
                resetBackgroundColors();
                highlightInvalidWords();

                setSelectedTile(y, x);
                hightlightSelectedTile();
                focusBoard();
                unfocusDeck();

                let tile = document.getElementById(`deck-${getSelectedDeckTile()}`);
                tile.className = ' deck-tile';
            });

            

            board.appendChild(tile);
        }
    }
    document.body.appendChild(board);


}

function drawDirectionalArrow(selectedTile=undefined) {

    if (!selectedTile) {
        selectedTile = document.getElementsByClassName('tile tile-selected');
    }
    let [y, x] = getSelectedTile();
    if (y != null && x != null) {
        // horizontal
        let [travelY, travelX] = getTravelDirection();
        if (travelY == 0 && travelX == 1) {
            selectedTile.style.backgroundImage = 'url("./images/rightArrow.png")';

        }
        else if (travelY == 1 && travelX == 0) {
            selectedTile.style.backgroundImage = 'url("./images/downArrow.png")';
        }
        selectedTile.style.backgroundSize = 'cover';
        // selectedTile.style.color = 'rgb(150, 10, 10)';
    }
}

function toggleLoader() {
    if (showLoader == false) {
        let definitions = document.getElementById('definitions');
        if (definitions) {
            definitions.style.filter = '';
        }

        let loader = document.getElementsByClassName('loading-ring');
        for (let l of loader) {
            // filter: blur(5px);
            l.style.top = `-100px`;
            l.style.left = `-100px`;
        }

    }
    else if (showLoader == true) {
        let definitions = document.getElementById('definitions');
        definitions.style.filter = 'blur(3px)';
        let defPos = definitions.getBoundingClientRect();
        let [menuX, menuY] = [defPos.x, defPos.y];
        let [menuWidth, menuHeight] = [defPos.width, defPos.height];
        
        let loader = document.getElementsByClassName('loading-ring');
        for (let l of loader) {
            l.style.left = `${Math.floor(menuX + menuWidth / 2 - 40)}px`;
            l.style.top = `${Math.floor(menuY + menuHeight / 2 - 40)}px`;
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
   
   drawDirectionalArrow(selectedTile);
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
        // document.getElementById('menu').style.filter = 'blur(3px)';
        findMoves();
        updateMoveMenu();
        scrollToMenuTop();
        save();
          
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
    let invalidWords = getInvalidWords(getBoard());
    if (invalidWords) {
        resetBackgroundColors();
    }
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
        tile.style.background = `rgba(0, 225, 0, 0.9)`;

        let [tileLetter, tilePoints] = tile.children;
        tileLetter.innerHTML = move.word[i];
        tilePoints.innerHTML = letterPoints[move.word[i]];
    }
}

function placeWord(move) {
    let remainingLetters = [...getDeck()];
    for (let i=0; i < move.word.length; i++) {
        if (move.dir == hor) {
            setLetter(move.row, move.col + i, move.word[i]);
        }
        else {
            setLetter(move.row + i, move.col, move.word[i]);
        }
        // subtract used letters from deck 
        let deck = getDeck();
        if (deck.includes(move.word[i])) {
            remainingLetters.splice(deck.lastIndexOf(move.word[i]), 1);
        }
        else if (deck.includes(wildcard)) {
            remainingLetters.splice(deck.lastIndexOf(wildcard), 1);
        }
    }
    // while (remainingLetters.length < 7) {
    //     remainingLetters.push('');
    // }
    // setDeck(remainingLetters);
}

function initDeck() {
    let deck = document.createElement('div');
    deck.id = 'deck';
    let deckValues = getDeck();

    for (let i=0; i < getDeck().length; i++) {
        let deckTile = document.createElement('div');
        deckTile.className = 'deck-tile';
        deckTile.id = `deck-${i}`;
        deckTile.innerHTML = deckValues[i];

        deckTile.addEventListener('click', () => {
            resetBackgroundColors();
            highlightInvalidWords();
            focusDeck();
            unfocusBoard();

            let tile = document.getElementById(`deck-${getSelectedDeckTile()}`);
            tile.className += ' deck-tile-selected';

            let [selectedY, selectedX] = getSelectedTile();
            if (selectedY == null || selectedX == null) {
                return;
            }
            let selectedTile = document.getElementById(`${selectedY}-${selectedX}`);
            selectedTile.className = 'tile';
        });
        deck.appendChild(deckTile);
    }
    document.body.appendChild(deck);
}

function scrollToMenuTop() {
    let top = document.getElementById('menu');
    if (top) {
        top.scroll({
            top: 0,
            behavior: 'smooth',
        })
    }
}

function updateMoveMenu() {
    menu.innerHTML = '';
    
    let moves = getMoves().reverse();
    moves = moves.slice(0, 300);

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
        if (moves[i].bingo) {
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

            hoveredWord = moves[i].word;
            showLoader = true;
            toggleLoader();

            let word = document.getElementById('def-word');
            if (word.innerHTML != moves[i].word) {
                setTimeout(() => {
                    if (hoveredWord == moves[i].word) {
                        getDefinition(moves[i].word);
                    }
                    showLoader = false;
                    toggleLoader();
                }, 2000);
            }
        });

        moveItem.addEventListener('dblclick', () => {
            placeWord(moves[i]);
            highlightInvalidWords();
        })

        menu.appendChild(moveItem);
    }

    // defenition section
    let definitions = document.createElement('div');
    definitions.className = 'definitions';
    definitions.id = 'definitions';

    let word = document.createElement('div');
    word.id = 'def-word';
    let phonetic = document.createElement('div');
    phonetic.id = 'def-phonetic';
    phonetic.className = 'small-text';

    let definition = document.createElement('div');
    definition.id = 'def-def';

    definitions.appendChild(word);
    definitions.appendChild(phonetic);
    definitions.appendChild(definition);

    menu.appendChild(definitions);


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

function initResetButton() {
    let reset = document.createElement('button');
    let msg = document.createElement('p');
    msg.className = 'reset-msg';
    msg.innerHTML = 'Refresh page for changes to take affect.';

    reset.innerHTML = 'Reset';
    reset.className = 'reset';
    reset.addEventListener('click', () => {
        setDeck(['', '', '', '', '', '', '']);
        setBoard([
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
        ]);
        save();
    });

    document.body.appendChild(reset);
    document.body.appendChild(msg);
}

function loadSaved() {
    let board = JSON.parse(localStorage.getItem('board'));
    let deck = JSON.parse(localStorage.getItem('deck'));

    if (board && deck) {
        setBoard(board);
        setDeck(deck);
    }
}
function save() {
    localStorage.setItem('board', JSON.stringify(getBoard()));
    localStorage.setItem('deck', JSON.stringify(getDeck()));
}
  

function getDefinition(newWord) {
    let word = document.getElementById('def-word');
    let phonetic = document.getElementById('def-phonetic');
    let defElement = document.getElementById('def-def');

    fetch(apiURL + newWord)
    .then(response => response.json())
    .then((json) => {
        if (json.length > 1) {
            json = json[0];
        }

     
      

        // no definiton found
        if ('title' in json) {
            word.innerHTML = json.title;
            phonetic.innerHTML = '';
            defElement.innerHTML = '';
        }
        else {
            if (json.constructor === [].constructor) {
                json = json[0];
            }
            word.innerHTML = json.word;
            phonetic.innerHTML = '';
            defElement.innerHTML = '';

            if (json.phonetic) {
                phonetic.innerHTML = json.phonetic;
            }

            if ('meanings' in json) {
                for (let meaning of json.meanings) {
                    let container = document.createElement('div');
                    let partOfSpeech = document.createElement('div');
                    let definition = document.createElement('div');
                    let example = document.createElement('div');
    
                    partOfSpeech.className = 'small-text part-of-speech';
                    partOfSpeech.innerHTML = meaning.partOfSpeech;
    
                    definition.innerHTML = meaning.definitions[0].definition;
    
                    example.className = 'small-text';   
                    if ('example' in meaning.definitions[0]) {
                        example.innerHTML = meaning.definitions[0].example;
                    }
                    
                    container.appendChild(partOfSpeech);
                    container.appendChild(definition);
                    container.appendChild(example);
                    defElement.appendChild(container);
    
                }
            }
        }
    });
}


function initSidebar() {
    let sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    let helpMenu = createIcon('./images/help.png', () => {
        let img = document.createElement('div');
        img.className = 'fullscreen';
        img.style.backgroundImage = 'url("./images/instructions.png")';
        img.style.backgroundSize = 'cover';
        document.body.appendChild(img);

        img.addEventListener('click', () => {
            document.body.removeChild(img);
        })
    });
    sidebar.appendChild(helpMenu);
    document.body.appendChild(sidebar);
}


loadSaved();

initSidebar();
initBoard();
initMoveMenu();
initDeck();
initResetButton();

highlightInvalidWords();