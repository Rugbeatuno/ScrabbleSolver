let deck = ['', '', '', '', '', '', ''];
let selectedTile = 0;
let isFocused = false;



export function getDeck() {
    // while (deck.includes('')) {
    //     deck.splice(deck.indexOf(''), 1);
    // }
    // while (deck.length < 7) {
    //     deck.push('');
    // }
    return deck;
}
export function setDeck(d) {
    deck = d;
    selectedTile = deck.indexOf('');
}

export function getSelectedDeckTile() {
    if (selectedTile < 0) {
        if (deck.indexOf('')) {
            selectedTile = deck.indexOf('');
        }
        selectedTile = deck.length - 1;
    }
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