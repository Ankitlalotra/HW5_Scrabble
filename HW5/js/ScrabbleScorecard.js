/**
   AUTHOR:  Ankit Lalotra                    
   COPYRIGHT:
     Copyright (c) 2021 by Ankit Lalotra. All rights reserved.
 */

if (typeof ScrabbleScorecard == 'undefined') {
    var ScrabbleScorecard = function() {
        var scorecard;
        var scores = [];

        function init() {
            scorecard = $('<div class="scrabbleScorecard"><div class="scoresLabel">Scores</div></div>');
            return scorecard;
        }

        function populatePlayers(aNumberOfPlayers) {
            for (let i = 0; i < aNumberOfPlayers; i++) {
                scorecard.append('<div class="scoresPlayer">Player ' + (i + 1) + ': <span>0</span></div>');
                scores.push(0);
            }
        }

        function updateScore(playerId, value) {
            scores[playerId] += value;
            scorecard.find('span').eq(playerId).text(scores[playerId]);
        }

        return {
            init: init,
            updateScore: updateScore,
            populatePlayers: populatePlayers
        }
    };
}