let deck = ['', '', '', '', '', '', ''];
let selectedTile = 0;
let isFocused = false;



export function getDeck() {
    return deck;
}
export function setDeck(deck) {
    deck = deck;
}

export function getSelectedDeckTile() {
    return selectedTile; 
}

export function typeDeckLetter(letter) {
    deck[selectedTile] = letter;
    if (letter != '' && selectedTile < deck.length - 1) {
        selectedTile += 1;
    }
    else if (letter == '' && selectedTile > 0) {
        selectedTile -= 1;
    }
}


export function unfocusDeck() {
    isFocused = false;
}

export function focusDeck() {
    isFocused = true;
}

export function isDeckFocused() {
    return isFocused;
}

export function getLettersInDeck() {
    let letters = [];
    deck.forEach(element => {
        if (element != '') {
            letters.push(element);
        }
    });
    return letters;
}