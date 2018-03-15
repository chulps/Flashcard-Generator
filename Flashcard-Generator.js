var BasicFlashcard = require('./BasicCard.js');
var ClozeFlashcard = require('./ClozeCard.js');
var inquirer = require('inquirer');
var fs = require('fs');

console.log(' ');
console.log("••••••••••••• Let's begin! •••••••••••••");
console.log(' ');

inquirer.prompt([{
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: [{
        name: 'Show flashcards?'
    }, {
        name: 'Add a flashcard?'
    }, {
        name: 'Clear all flashcards?'
    },]
}]).then(function(answer) {
    if (answer.command === 'Clear all flashcards?') {
        clearCards();
    }
    if (answer.command === 'Add a flashcard?') {
        addCard();
    } else if (answer.command === 'Show flashcards?') {
        showCards();
    }
});

var addCard = function() {

    inquirer.prompt([{
        name: 'cardType',
        message: 'Basic or Cloze?',
        type: 'list',
        choices: [{
            name: 'Basic.'
        }, {
            name: 'Cloze.'
        }]

    }]).then(function(answer) {
        if (answer.cardType === 'Basic.') {
            inquirer.prompt([{
                name: 'front',
                message: 'Enter a question for the front of the card?',
                validate: function(input) {
                    if (input === '') {
                        console.log(' ');
                        console.log('... provide a question.');
                        console.log(' ');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'Enter the answer?',
                validate: function(input) {
                    if (input === '') {
                        console.log(' ');
                        console.log('... provide an answer.');
                        console.log(' ');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasic = new BasicFlashcard(answer.front, answer.back);
                newBasic.create();
                whatsNext();
            });
        } else if (answer.cardType === 'Cloze.') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full text?',
                validate: function(input) {
                    if (input === '') {
                        console.log(' ');
                        console.log('••••••• Please provide the full text •••••••');
                        console.log(' ');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze portion?',
                validate: function(input) {
                    if (input === '') {
                        console.log(' ');
                        console.log('Please provide the cloze portion');
                        console.log(' ');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeFlashcard(text, cloze);
                    newCloze.create();
                    whatsNext();
                } else {
                    console.log(' ');
                    console.log('••••••••• The cloze portion you provided is not found in the full text. Please try again. •••••••••');
                    console.log(' ');
                    addCard();
                }
            });
        }
    });
};

var whatsNext = function() {

    inquirer.prompt([{
        name: 'nextAction',
        message: 'What would you like to do next?',
        type: 'list',
        choices: [{
            name: 'Create another card?'
        }, {
            name: 'Show cards?'
        }, {
            name: 'Exit?'
        }]

    }]).then(function(answer) {
        if (answer.nextAction === 'Create another card?') {
            addCard();
        } else if (answer.nextAction === 'Show cards?') {
            showCards();
        } else if (answer.nextAction === 'Exit?') {
            return;
        }
    });
};

var showCards = function() {
    fs.readFile('./log.txt', 'utf8', function(error, data) {

        if (error) {
            console.log(' ');
            console.log('•••••••••• Error occurred: ' + error + '••••••••••');
            console.log(' ');
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);  
    });
};

var showQuestion = function(array, index) {
    question = array[index];
    var parsedQuestion = JSON.parse(question);
    var questionText;
    var correctReponse;
    if (parsedQuestion.type === 'basic') {
        questionText = parsedQuestion.front;
        correctReponse = parsedQuestion.back;
    } else if (parsedQuestion.type === 'cloze') {
        questionText = parsedQuestion.clozeDeleted;
        correctReponse = parsedQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log(' ');
            console.log('•••••••••• Correct! ••••••••••');
            console.log(' ');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            } else {
                whatsNext();
            }
        } else {
            console.log(' ');
            console.log('•••••••••• Incorrect ••••••••••');
            console.log(' ');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            } else {
                whatsNext();
            }
        }
    });
};

var clearCards = function (){
    fs.truncate('./log.txt', 0, function(){
    });
    console.log(' ');
    console.log('•••••••••• All flashcards cleared. ••••••••••');
    console.log(' ');
    whatsNext(); 
}