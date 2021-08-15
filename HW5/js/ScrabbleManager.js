/**
   AUTHOR:  Ankit Lalotra                    
   COPYRIGHT:
     Copyright (c) 2021 by Ankit Lalotra. All rights reserved.
 */

const TILES = {
    'A': { "value": 1, "count": 9 },
    'B': { "value": 3, "count": 2 },
    'C': { "value": 3, "count": 2 },
    'D': { "value": 2, "count": 4 },
    'E': { "value": 1, "count": 12 },
    'F': { "value": 4, "count": 2 },
    'G': { "value": 2, "count": 3 },
    'H': { "value": 4, "count": 2 },
    'I': { "value": 1, "count": 9 },
    'J': { "value": 8, "count": 1 },
    'K': { "value": 5, "count": 1 },
    'L': { "value": 1, "count": 4 },
    'M': { "value": 3, "count": 2 },
    'N': { "value": 1, "count": 6 },
    'O': { "value": 1, "count": 8 },
    'P': { "value": 3, "count": 2 },
    'Q': { "value": 10, "count": 1 },
    'R': { "value": 1, "count": 6 },
    'S': { "value": 1, "count": 4 },
    'T': { "value": 1, "count": 6 },
    'U': { "value": 1, "count": 4 },
    'V': { "value": 4, "count": 2 },
    'W': { "value": 4, "count": 2 },
    'X': { "value": 8, "count": 1 },
    'Y': { "value": 4, "count": 2 },
    'Z': { "value": 10, "count": 1 },
    '_': { "value": 0, "count": 2 },
};

if (typeof ScrabbleManager == 'undefined') {
    var ScrabbleManager = (function() {
        var scrabbleManager;
        var scrabbleContainer;
        var scrabbleBoard;
        var scrabbleBag;
        var scrabbleRacks = [];
        var scrabbleScorecard;
        var scrabbleDictionary;
        var scrabblePopup;

        var numberOfPlayers = 1;
        var currentPlayerId;

        function init() {
            scrabbleManager = this;

            // Get the container, empty!
            scrabbleContainer = $(document.body);
            scrabbleContainer.empty();

            // Create the board.
            scrabbleBoard = new ScrabbleBoard();
            scrabbleContainer.append(scrabbleBoard.init());

            // Create the scorecard.
            scrabbleScorecard = new ScrabbleScorecard();
            scrabbleContainer.append(scrabbleScorecard.init());

            // Create the dictionary.
            scrabbleDictionary = new ScrabbleDictionary();
            scrabbleDictionary.init();

            // Create the tile bag.
            scrabbleBag = new ScrabbleBag(scrabbleManager);
            scrabbleContainer.append(scrabbleBag.init());

            // Create tiles and put them in the bag.
            let tiles = [];
            for (let letter in TILES) {
                let value = TILES[letter]['value'];
                let count = TILES[letter]['count'];
                for (let i = 0; i < count; i++) {
                    let tile = new ScrabbleTile(letter, value, 'tile-' + letter + i).init();
                    tiles.push(tile);
                }
            }
            scrabbleBag.addTiles(tiles);

            // Create end turn button.
            let endTurnBtn = $('<input id="endTurnBtn" type="submit">');
            endTurnBtn.button({
                label: 'End Turn'
            });
            endTurnBtn.click(function(e) {
                let allWordsValid = true;
                let invalidWords = [];

                // Check validity of new words on the board.
                try {
                    // Get all new words made on the board and their values.
                    var newWordsAndVals = scrabbleBoard.getNewWordsAndVals();

                    // Check each new word against the dictionary.
                    for (let i = 0; i < newWordsAndVals.length; i++) {
                        let newWord = newWordsAndVals[i].word;
                        let isValidWord = scrabbleDictionary.validateWord(newWord);

                        // Keep track of invalid words.
                        if (!isValidWord) {
                            allWordsValid = false;
                            invalidWords.push(newWord);
                        }
                    }
                } catch (error) {
                    allWordsValid = false;
                    console.log(error);
                    alert(error);
                }

                let newTiles = scrabbleBoard.getAndClearNewTiles();

                // If all new words are valid...
                if (allWordsValid) {

                    // Prevent dragging of new tiles.
                    for (let i = 0; i < newTiles.length; i++) {
                        newTiles[i].draggable('disable');
                    }

                    // Calculate the total value of the new words.
                    let value = 0;
                    for (let i = 0; i < newWordsAndVals.length; i++) {
                        value += newWordsAndVals[i].value;
                    }

                    // Update the player's score.
                    scrabbleScorecard.updateScore(currentPlayerId, value);

                    // Pull new tiles onto the rack
                    let tiles = [];
                    for (let j = 0; j < newTiles.length; j++) {
                        let tile = scrabbleBag.removeRandomTile();
                        if (tile !== null) {
                            tiles.push(tile);
                        }
                    }
                    scrabbleRacks[currentPlayerId].addTiles(tiles);

                    // If at least one new word was invalid...
                } else {

                    let error = '';
                    // If there are invalid words to display, display them.
                    if (invalidWords.length !== 0) {
                        // Print invalid words to the console.
                        console.log('Invalid words:');
                        error += 'Invalid words:\n';
                        for (let i = 0; i < invalidWords.length; i++) {
                            console.log('"' + invalidWords[i] + '"');
                            error += '"' + invalidWords[i] + '"\n'
                        }
                        alert(error);
                    }

                    // Put new tiles back on the player's rack.
                    scrabbleRacks[currentPlayerId].addTiles(newTiles);
                }

                scrabbleManager.endTurn();
                e.preventDefault();
            });
            scrabbleContainer.append(endTurnBtn);

            // Create the popup.
            scrabblePopup = new ScrabblePopup(this);
            scrabbleContainer.append(scrabblePopup.init());

        }

        function restart() {
            // Add ability to restart.
            // 1. Put tiles from board and player rack(s) back in bag.
            // 2. call start();
        }

        function start(aNumberOfPlayers) {
            numberOfPlayers = aNumberOfPlayers;
            currentPlayerId = 0; // Could randomize starting player in the future.

            // Create player rack(s).
            for (let i = 0; i < numberOfPlayers; i++) {
                let scrabbleRack = new ScrabbleRack(i);
                scrabbleRacks.push(scrabbleRack);
                scrabbleContainer.append(scrabbleRack.init());
            }

            scrabbleScorecard.populatePlayers(numberOfPlayers);

            // Take tiles from the bag and put them on the rack(s).
            for (let i = 0; i < numberOfPlayers; i++) {
                let tiles = [];
                for (let j = 0; j < 7; j++) {
                    let tile = scrabbleBag.removeRandomTile();
                    if (tile !== null) {
                        tiles.push(tile);
                    }
                }
                scrabbleRacks[i].addTiles(tiles);
            }

            // Show the current player's rack
            scrabbleRacks[currentPlayerId].getRack().removeClass('hidden');
        }

        function forfeitTurn() {
            let newTiles = scrabbleBoard.getAndClearNewTiles();
            // Put new tiles back on the player's rack.
            scrabbleRacks[currentPlayerId].addTiles(newTiles);
            endTurn();
        }

        function endTurn() {
            // Hide the current player's rack
            scrabbleRacks[currentPlayerId].getRack().addClass('hidden');

            // Switch to the next player
            currentPlayerId = (currentPlayerId + 1) % numberOfPlayers;

            // Show the new current player's rack
            scrabbleRacks[currentPlayerId].getRack().removeClass('hidden');
        }

        return {
            init: init,
            start: start,
            forfeitTurn: forfeitTurn,
            endTurn: endTurn
        }
    })();
}

$(document).ready(function() {
    ScrabbleManager.init();
});