/**
   AUTHOR:  Ankit Lalotra                    
   COPYRIGHT:
     Copyright (c) 2021 by Ankit Lalotra. All rights reserved.
 */
if (typeof ScrabbleBoard == 'undefined') {
    var ScrabbleBoard = function() {
        var board; // JQuery object of the board.
        var boardSize = 15; // Single value for square board size.
        var boardCenter = Math.floor(boardSize / 2); // Center board space
        var boardSpaces = []; // 2D array of all board spaces.
        var boardSpacesUsedThisTurn = []; // 1D array.

        function init() {

            // board.
            board = $('<table id="scrabbleBoard"></table>');

            for (let r = 0; r < boardSize; r++) {

                // rows.
                boardSpaces.push([]);
                let row = $('<tr></tr>');

                for (let c = 0; c < boardSize; c++) {
                    let type = '';


                    if (c % 4 == 1 && r % 4 == 1) {
                        type = 'Lx3'; // Letter value x 3.
                    }
                    if (c == r || c + r == 14) {
                        type = 'Wx2'; // Word value x 2.
                    }
                    if (c % 7 == 0 && r % 7 == 0) {
                        type = 'Wx3'; // Word value x 3.
                    }
                    if ((c % 8 == 3 && r % 7 == 0) ||
                        (c % 7 == 0 && r % 8 == 3) ||
                        ((c == 2 || c == 6 || c == 8 || c == 12) &&
                            (r == 6 || r == 8)) ||
                        ((c == 6 || c == 8) && (r == 2 || r == 12))) {
                        type = 'Lx2'; // Letter value x 2.        
                    }

                    if (c == boardCenter && r == boardCenter) {
                        type = 'Star';
                    }
                    // Create a space, attach data to it.
                    let cell = $('<td class="' + type + '"></td>');
                    let boardSpace = $('<div class="boardSpace"></div>');
                    let boardSpaceData = {
                        row: r,
                        col: c,
                        type: type
                    };
                    $.data(boardSpace[0], 'jsObject', boardSpaceData);
                    cell.append(boardSpace);

                    // Make the current space able to be dropped on by tiles.
                    boardSpace.droppable({
                        accept: '.scrabbleTile', // Accept only tiles.
                        drop: function(e, ui) {

                            // If a tile is already in this space, do nothing.
                            if ($(this).children().length !== 0) {
                                return;
                            }

                            // Remove the tile from the DOM.
                            let tile = ui.draggable.detach();


                            // add it to the list.
                            if ($.inArray(this, boardSpacesUsedThisTurn) === -1) {
                                boardSpacesUsedThisTurn.push(this);
                            }

                            // Reattach the tile to the DOM, but in this space.
                            tile.appendTo(this);
                            tile.css({ top: '0', left: '0' }); // Reset position.

                        }
                    });
                    boardSpaces[r].push(boardSpace); // Store the space.
                    row.append(cell); // Add the space's cell to the current row.
                }
                board.append(row); // Add the row to the board.
            }
            return board; // Return the board.
        }

        function getNewWordsAndVals() {
            var newWords = []; // New words in form [{word: word}, {value: value}].
            var areTilesAligned = true; // Are all new tiles on the same x or y axis.
            var areTilesVertical = false; // Are new tiles aligned vertically or horizontally.
            var isDirectionKnown = false; // Is vertical or horizontal placement known.
            var startRow = -1; // First tile's row, if tiles aligned vertically.
            var startCol = -1; // First tile's column, if tiles aligned horizontally.
            var end = -1; // End tile's row or column, depending on alignment.
            var isFirstTurn = false; // Is this the first turn
            var isConnected = false; // Is the new word connected to exitsing words.
            var centerSpace = boardSpaces[boardCenter][boardCenter]; // The center space

            // If the center space is empty there is an error
            if ($(centerSpace).children().length === 0) {
                throw 'A tile must be placed in the center to start the game.';
            }

            // If a tile was placed in the center space this turn, it is the first turn
            if ($.inArray(centerSpace[0], boardSpacesUsedThisTurn) !== -1) {
                isFirstTurn = true;
                // If this is the first time, isConnected is forced to true
                isConnected = true;
            }

            var i = -1;

            // While all found tiles are aligned, keep checking spaces.
            while (areTilesAligned && ++i < boardSpacesUsedThisTurn.length) {
                let boardSpace = boardSpacesUsedThisTurn[i];

                // If the space doesn't have a tile, move on.
                if ($(boardSpace).children().length === 0) {
                    continue;
                }

                let boardSpaceData = $.data(boardSpace, 'jsObject');

                // If this is the first space with a tile...
                if (startRow === -1) {

                    // Set the initial values.
                    startRow = boardSpaceData.row;
                    startCol = boardSpaceData.col;
                    end = startRow;

                    // If this is not the first space with a tile...
                } else {

                    // If a direction had not been found previously...
                    if (!isDirectionKnown) {

                        // If space doesn't have same row as previous spaces...
                        if (startRow !== boardSpaceData.row) {

                            // Two spaces with different rows implies vertical placement.
                            areTilesVertical = true;
                            isDirectionKnown = true;

                            // Keep track of the start and end values.
                            if (startRow > boardSpaceData.row) {
                                end = startRow;
                                startRow = boardSpaceData.row;
                            } else {
                                end = boardSpaceData.row;
                            }
                        }

                        // If space doesn't have same column as previous spaces...
                        if (startCol !== boardSpaceData.col) {

                            // If direction was previously known, spaces differ in
                            // both horizontal and vertical values. Invalid tiles.
                            if (isDirectionKnown) {
                                isDirectionKnown = false;
                                areTilesAligned = false;

                                // If direction wasn't previously known,
                                // the direction is horizontal.
                            } else {
                                areTilesVertical = false;
                                isDirectionKnown = true;

                                // Keep track of the start and end values.
                                if (startCol > boardSpaceData.col) {
                                    end = startCol;
                                    startCol = boardSpaceData.col;
                                } else {
                                    end = boardSpaceData.col;
                                }
                            }
                        }

                        // If a direction had been found to be vertical previously...
                    } else if (areTilesVertical) {

                        // If space is not vertically aligned too, invalid tiles.
                        if (startCol !== boardSpaceData.col) {
                            areTilesAligned = false;

                            // If space is vertically aligned too...
                        } else {

                            // Update the starting or ending row if necessary.
                            if (startRow > boardSpaceData.row) {
                                startRow = boardSpaceData.row;
                            } else if (end < boardSpaceData.row) {
                                end = boardSpaceData.row;
                            }
                        }

                        // If a direction had been found to be horizontal previously...
                    } else {

                        // If space is not horizontally aligned too, invalid tiles.
                        if (startRow !== boardSpaceData.row) {
                            areTilesAligned = false;

                            // If space is not horizontally aligned too...
                        } else {

                            // Update the starting or ending column if necessary.
                            if (startCol > boardSpaceData.col) {
                                startCol = boardSpaceData.col;
                            } else if (end < boardSpaceData.col) {
                                end = boardSpaceData.col;
                            }
                        }
                    }
                }

            }

            // If tiles weren't found to be aligned, throw an error.
            if (!areTilesAligned) {
                throw 'Tiles can only be placed on a single row or column per turn.';
            }
            // If no tiles were found, throw an error.
            if (startRow <= -1) {
                throw 'No new tiles were placed.';
            }

            // If direction still isn't known, there's only one tile. set end = startCol.
            if (!isDirectionKnown) {
                end = startCol;
            }

            //Get the main word and its value
            let wordData = getWordData(startRow, startCol, end, areTilesVertical, isFirstTurn, isConnected);
            isConnected = wordData.isConnected;
            newWords.push(wordData.newWord); // Store word and value.

            //Get the words running the opposite direction of new tiles
            for (let i = 0; i < boardSpacesUsedThisTurn.length; i++) {
                let boardSpace = boardSpacesUsedThisTurn[i];

                // If the space doesn't have a tile, move on.
                if ($(boardSpace).children().length === 0) {
                    continue;
                }

                let boardSpaceData = $.data(boardSpace, 'jsObject');
                let end = !areTilesVertical ? startRow : startCol;
                let wordData = getWordData(boardSpaceData.row, boardSpaceData.col, end, !areTilesVertical, isFirstTurn, isConnected);
                //If we find more than just the new letter it is a word
                if (wordData.newWord.word.length > 1) {
                    newWords.push(wordData.newWord); // Store word and value.
                    isConnected = wordData.isConnected;
                }
            }

            if (!isConnected) {
                throw 'New words must be in contact with existing words';
            }

            console.log('New words found:');
            for (let i = 0; i < newWords.length; i++) {
                console.log('Word: "' + newWords[i].word + '" ' +
                    'Value: ' + newWords[i].value);
            }
            return newWords;
        }

        function getWordData(startRow, startCol, end, areTilesVertical, isFirstTurn, isConnected) {
            var start = areTilesVertical ? startRow : startCol;
            var nextStart = start--;
            var nextSpace;

            // Starting at the earliest new tile, look back for first empty space.
            while (nextStart >= 0) {

                // Get the next space.
                if (areTilesVertical) {
                    nextSpace = boardSpaces[nextStart][startCol];
                } else {
                    nextSpace = boardSpaces[startRow][nextStart];
                }

                // If the next space is empty, stop looking.
                if (nextSpace.children().length === 0) {
                    break;
                }

                // If the next space is not empty, set a new start and keep looking.
                start = nextStart;
                nextStart--;
            }

            let word = '';
            let wordValue = 0;
            let wordBonuses = { Wx2: 0, Wx3: 0 };

            // Compute the score of the word until an empty space is reached.
            while (start < boardSize) {

                // Get the next space.
                if (areTilesVertical) {
                    nextSpace = boardSpaces[start][startCol];
                } else {
                    nextSpace = boardSpaces[startRow][start];
                }

                // If the next space is empty, stop looking.
                if (nextSpace.children().length === 0) {

                    // If the empty space came before the last tile placed,
                    // invalid tiles, throw error.
                    if (start <= end) {
                        throw 'Tiles must be placed consecutively.';
                    }
                    break;
                }

                // If the word has not been detected as connected already
                if (!isConnected) {
                    // If the current tile was not placed this turn, the word is connected
                    if ($.inArray(nextSpace[0], boardSpacesUsedThisTurn) === -1) {
                        isConnected = true;
                    }
                }

                // If the next space is not empty...
                let tile = $.data(nextSpace.children()[0], 'jsObject');
                let letter = tile.getLetter();
                word += letter;

                let letterValue = tile.getValue();
                let boardSpaceData = $.data(nextSpace[0], 'jsObject');

                switch (boardSpaceData.type) {
                    case 'Lx2': // x2 to letter value.
                        letterValue *= 2;
                        break;
                    case 'Lx3': // x3 to letter value.
                        letterValue *= 3;
                        break;
                    case 'Wx2': // Store presence of x2 word bonus.
                        wordBonuses.Wx2++;
                        break;
                    case 'Star': // Store presence of star word bonus.
                        // If this is the first turn apply the bonus
                        if (isFirstTurn) {
                            wordBonuses.Wx2++;
                        }
                        break
                    case 'Wx3': // Store presence of x2 word bonus.
                        wordBonuses.Wx3++;
                        break;
                }
                console.log('Found letter ' + letter +
                    ' with value ' + letterValue + '.');
                wordValue += letterValue; // Add letter's value to word's value.

                start++; // Go to the next letter.
            }

            // Apply accumulated word bonuses.
            if (wordBonuses.Wx2 !== 0) {
                wordValue *= wordBonuses.Wx2 * 2;
            }
            if (wordBonuses.Wx3 !== 0) {
                wordValue *= wordBonuses.Wx3 * 3;
            }

            return {
                newWord: { word: word, value: wordValue },
                isConnected: isConnected
            };
        }

        function getAndClearNewTiles() {
            var newTiles = [];
            for (let i = 0; i < boardSpacesUsedThisTurn.length; i++) {
                let boardSpace = boardSpacesUsedThisTurn[i];

                // If the space doesn't have a tile, move on.
                if ($(boardSpace).children().length === 0) {
                    continue;
                }

                let tile = $(boardSpace).children().first();
                newTiles.push(tile);
            }

            boardSpacesUsedThisTurn = [];
            return newTiles;
        }

        return {
            init: init,
            getNewWordsAndVals: getNewWordsAndVals,
            getAndClearNewTiles: getAndClearNewTiles
        }
    };
}