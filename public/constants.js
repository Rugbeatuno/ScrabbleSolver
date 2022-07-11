export const hor = 0;
export const ver = 1;



export const lettersToNumbers = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
    'i': 8,
    'j': 9,
    'k': 10,
    'l': 11,
    'm': 12,
    'n': 13,
    'o': 14,
    'p': 15,
    'q': 16,
    'r': 17,
    's': 18,
    't': 19,
    'u': 20,
    'v': 21,
    'w': 22,
    'x': 23,
    'y': 24,
    'z': 25,
}

export let letterPoints = {
    '': '',
    'a': 1,
    'b': 3,
    'c': 3,
    'd': 2,
    'e': 1,
    'f': 4,
    'g': 2,
    'h': 4,
    'i': 1,
    'j': 8,
    'k': 5,
    'l': 1,
    'm': 3,
    'n': 1,
    'o': 1,
    'p': 3,
    'q': 10,
    'r': 1,
    's': 1,
    't': 1,
    'u': 1,
    'v': 4,
    'w': 4,
    'x': 8,
    'y': 4,
    'z': 10,
}

export const wildcard = '*';
export const normal = 0;
export const doubleWordScore = 1;
export const trippleWordScore = 2;
export const doubleLetterScore = 3;
export const trippleLetterScore = 4;

export const multipliers = [
    [2, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 2],
    [0, 1, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 3, 0, 3, 0, 0, 0, 1, 0, 0],
    [3, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 3],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0],
    [0, 0, 3, 0, 0, 0, 3, 0, 3, 0, 0, 0, 3, 0, 0],
    [2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2],
    [0, 0, 3, 0, 0, 0, 3, 0, 3, 0, 0, 0, 3, 0, 0],
    [0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [3, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 3],
    [0, 0, 1, 0, 0, 0, 3, 0, 3, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 1, 0],
    [2, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 2],
]

export const colorConversions = {
    0: '#C0C0C0',
    2: '#FFA500',
    4: '#A878A8',
    1: '#FFC0CB',
    3: '#ADD8E6'
}

export const dims = 15;

export let scrabbleWords;
// await fetch('./scrabble_words.txt')
//   .then(response => response.text())
//   .then((data) => {
//       console.log(data);
//     scrabbleWords = data.split('\n');
// });

await fetch('./scrabble_words.txt')
  .then(response => response.text())
  .then((data) => {
    scrabbleWords = data.split('\n');
});

export const scrabbleWordsLength = {
    1: scrabbleWords.filter(word => word.length == 1),
    2: scrabbleWords.filter(word => word.length == 2),
    3: scrabbleWords.filter(word => word.length == 3),
    4: scrabbleWords.filter(word => word.length == 4),
    5: scrabbleWords.filter(word => word.length == 5),
    6: scrabbleWords.filter(word => word.length == 6),
    7: scrabbleWords.filter(word => word.length == 7),
    8: scrabbleWords.filter(word => word.length == 8),
    9: scrabbleWords.filter(word => word.length == 9),
    10: scrabbleWords.filter(word => word.length == 10),
    11: scrabbleWords.filter(word => word.length == 11),
    12: scrabbleWords.filter(word => word.length == 12),
    13: scrabbleWords.filter(word => word.length == 13),
    14: scrabbleWords.filter(word => word.length == 14),
    15: scrabbleWords.filter(word => word.length == 15),
}
