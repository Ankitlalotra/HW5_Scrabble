/**
   AUTHOR:  Ankit Lalotra                    
   COPYRIGHT:
     Copyright (c) 2021 by Ankit Lalotra. All rights reserved.
 */
/* i copied this from my comp 2 hangman project. */
if (typeof ScrabbleDictionary == 'undefined') {
    var ScrabbleDictionary = function() {
        var dictionary = {};

        function init() {
            // Get dictionary file.
            $.get('txt/dictionary.txt', function(txt) {


                let words = txt.split("\n");


                for (let i = 0; i < words.length; i++) {
                    dictionary[words[i]] = true;
                }
            });
        }

        function validateWord(aWord) {

            // If word is in dictionary, return true. Otherwise return false.
            return (dictionary[aWord.toLowerCase()]) ? true : false;
        }

        return {
            init: init,
            validateWord: validateWord
        }
    };
}