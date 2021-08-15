/**
   AUTHOR:  Ankit Lalotra                    
   COPYRIGHT:
     Copyright (c) 2021 by Ankit Lalotra. All rights reserved.
 */

if (typeof ScrabbleTile == 'undefined') {
    var ScrabbleTile = function(aLetter, aValue, aId) {
        var tile;
        var letter = aLetter;
        var value = aValue;
        var id = aId;

        function init() {
            tile = $('<div id="' + id + '" class="scrabbleTile"><span>' + letter + '</span><span>' + value + '</span></div>');
            tile.draggable({
                    revert: true,
                    revertDuration: 0,
                    addClasses: false
                }

            ).disableSelection();

            $.data(tile[0], 'jsObject', this);

            return tile;
        }

        function getLetter() {
            return letter;
        }

        function getValue() {
            return value;
        }

        function getId() {
            return id;
        }
        return {
            init: init,
            getLetter: getLetter,
            getValue: getValue,
            getId: getId
        }
    };
}