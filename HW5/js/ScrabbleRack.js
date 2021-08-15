/**
   AUTHOR:  Ankit Lalotra                    
   COPYRIGHT:
     Copyright (c) 2021 by Ankit Lalotra. All rights reserved.
 */

if (typeof ScrabbleRack == 'undefined') {
    var ScrabbleRack = function(aPlayerId) {
        var rack;
        var playerId = aPlayerId;

        function init() {
            rack = $('<div class="scrabbleRack hidden" data-owner="' + playerId + '">' +
                '<div class="rackLabel"><h3>Player ' + (playerId + 1) + '</h3></div>' +
                '<div class="rackDrop"></div></div>');
            rack.find('.rackDrop').droppable({
                addClasses: false,
                accept: '.scrabbleTile', // Accepts just tiles.
                drop: function(e, ui) {

                    let tile = ui.draggable.detach(); //removes title


                    tile.attr('data-owner', playerId); //owner to title

                    tile.appendTo(this);
                    tile.css({ top: '0', left: '0' }); // Reset position.

                }
            });
            return rack;
        }

        function addTiles(aTiles) {
            console.log('a');
            for (let i = 0; i < aTiles.length; i++) {
                aTiles[i].attr('data-owner', playerId);
                rack.find('.rackDrop').append(aTiles[i]);
            }
        }

        function getRack() {
            return rack;
        }

        return {
            init: init,
            addTiles: addTiles,
            getRack: getRack
        }
    };
}