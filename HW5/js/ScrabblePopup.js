/**
   AUTHOR:  Ankit Lalotra                    
   COPYRIGHT:
     Copyright (c) 2021 by Ankit Lalotra. All rights reserved.
 */

if (typeof ScrabblePopup == 'undefined') {
    var ScrabblePopup = function(aScrabbleManager) {
        var scrabbleManager = aScrabbleManager;
        var popup;

        function init() {
            popup = $('<div id="scrabblePopup"></div>');
            //pregame window popup
            let pregamePopup =
                $('<div id="pregamePopup">' +
                    '<label for="inputNumberOfPlayers">Select Number of Players:</label>' +
                    '</div>');

            //number selection
            let inputNumberOfPlayers = $(
                '<select id="inputNumberOfPlayers" name="inputNumberOfPlayers">' +
                '<option selected>1</option>' +
                '<option>2</option>' +
                '<option>3</option>' +
                '<option>4</option>' +
                '</select>'
            );
            pregamePopup.append(inputNumberOfPlayers);
            inputNumberOfPlayers.selectmenu({ style: 'dropdown' });


            let startGameBtn = $('<input id="startGameBtn" type="submit">');
            startGameBtn.button({
                label: 'Start Game'
            }); //start button
            startGameBtn.click(function(e) {
                aScrabbleManager.start(inputNumberOfPlayers.val());
                popup.addClass('hidden');
                e.preventDefault();
            });
            pregamePopup.append(startGameBtn);
            popup.append(pregamePopup);

            return popup;
        }
        return {
            init: init
        }
    };
}