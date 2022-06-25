import { dims, scrabbleWordsLength, wildcard } from "./constants.js";


// this will make 2 arrays a-z 0-25
// then the value at a given index is how many occurences that letter appeared in the word
// these 2 arrays will be subtracted from one another and if the sum of the word trying to be made is 0 then the word can be made
function makeWords(letters) {
    let legalWords = [];
    let possibleWords = [];

    for (let i = 1; i <= letters.length; i++) {
        if (i <= 15) {
            legalWords.push(...scrabbleWordsLength[i]);
        }
    }

    let heldLetterOccurences = new Map();
    for (let i=0; i < letters.length; i++) {
        let letter = letters[i];
        if (!heldLetterOccurences.has(letter)) {
            heldLetterOccurences.set(letter, 1);
        }
    }

    for (let i=0; i < legalWords.length; i++) {
        let testingWord = legalWords[i];
        if (testingWord.length > letters.length) {
            continue;
        }

        // this throws out all words that we dont have the letters to make
        let canBeMade = true;
        for (let i=0; i < testingWord.length; i++) {
            let letter = testingWord.charAt(i);
            if (!heldLetterOccurences.has(letter)) {
                canBeMade = false;
                break;
            }
        }
        if (!canBeMade) {
            continue;
        }


        // all this hashing is expensive so we try to filter out words that we know cant be made
        let letterOccurences = new Map();

        let sum = 0;
        for (let i=0; i < testingWord.length; i++) {
            let letter = testingWord.charAt(i);
            sum += 1;

            if (!letterOccurences.has(letter)) {
                letterOccurences.set(letter, 1);
            }
            else {
                letterOccurences.set(letter, letterOccurences.get(letter)+ 1);
            }
        }

        for (let i=0; i < letters.length; i++) {
            let letter = letters[i];
            if (letterOccurences.has(letter)) {
                if (letterOccurences.get(letter) > 0) {
                    letterOccurences.set(letter, letterOccurences.get(letter) - 1);
                    sum -= 1;
                    if (sum <= 0) {
                        break;
                    }
                }
                else {
                    letterOccurences.delete(letter);
                }
            }
        }
        
        if (sum <= 0) {
            possibleWords.push(testingWord);
        }
    }
    return possibleWords;
}


export function makePossibleWords(letterArr) {
    let allLegalWords = [];
    let totalWildcards = 0;
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    letterArr.forEach(letter => {
        if (letter == wildcard) {
            totalWildcards += 1;
        }
    });

    if (totalWildcards == 0) {
        return makeWords(letterArr);
    }
    else {
        // worst case is 175k * 30 = 5.2m
        let totalLetters = letterArr.length;
        for (let i = 2; i <= totalLetters; i++) {
            if (i <= dims) {
                allLegalWords.push(...scrabbleWordsLength[i]);
            }
            
        }
        return allLegalWords;
    }
    // if (totalWildcards == 1) {
    //     letterArr.splice(letterArr.indexOf(wildcard), 1);
    //     alphabet.forEach(alphLetter => {
    //         let letterArrCopy = letterArr.map(function(arr) {
    //             return arr.slice();
    //         });
    //         letterArrCopy.push(alphLetter);
    //         allLegalWords.push(...makeWords(letterArrCopy));
    //     });
    //     return allLegalWords;
    // }

    // if (totalWildcards == 2) {
    //     // remove both wildcards
    //     letterArr.splice(letterArr.indexOf(wildcard), 1);
    //     letterArr.splice(letterArr.indexOf(wildcard), 1);

    //     // time complexity is bad 26^2 about 30 times
    //     // determine first wild card
    //     alphabet.forEach(alphLetter => {
    //         let letterArrCopy = letterArr.map(function(arr) {
    //             return arr.slice();
    //         });
    //         letterArrCopy.push(alphLetter);

    //         // second wild card
    //         alphabet.forEach(secondAlphLetter => {
    //             letterArrCopy.push(secondAlphLetter);
    //             allLegalWords.push(...makeWords(letterArrCopy));
    //         })

    //     });
    //     return allLegalWords;
    // }


    
    
}
