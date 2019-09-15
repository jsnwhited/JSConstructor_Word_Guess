var Word = require("./word.js");
var inquirer = require("inquirer");

var letterArray = "abcdefghijklmnopqrstuvwxyz";

var  wordsToGuess = [
    "cardinals", 
    "falcons", 
    "ravens", 
    "bills", 
    "panthers", 
    "bears", 
    "bengals", 
    "browns", 
    "cowboys", 
    "broncos", 
    "lions", 
    "packers", 
    "texans", 
    "colts", 
    "jaguars", 
    "chiefs", 
    "chargers", 
    "rams", 
    "dolphins", 
    "vikings",  
    "patriots", 
    "saints", 
    "giants",
    "jets",
    "raiders",
    "eagles",
    "steelers", 
    "49ers", 
    "buccaneers",
    "titans", 
    "redskins"
];

var randomIndex = Math.floor(Math.random() * wordsToGuess.length);
var randomWord = wordsToGuess[randomIndex];

var computerWord = new Word(randomWord);

var requireNewWord = false;

var incorrectLetters = [];
var correctLetters = [];

var guessesLeft = 10;

function theLogic() {
    if (requireNewWord) {
        var randomIndex = Math.floor(Math.random() * wordsToGuess.length);
        var randomWord = wordsToGuess[randomIndex];

        computerWord = new Word(randomWord);

        requireNewWord = false;
    }

    var wordComplete = [];
    computerWord.objArray.forEach(completeCheck);

    if (wordComplete.includes(false)) {
        inquirer.prompt([
            {
                type: "input",
                message: "Enter a letter to guess!",
                name: "userinput"
            }
        ]).then(function(input){
            if(
            !letterArray.includes(input.userinput) ||
            input.userinput.length > 1 
            ) {
                console.log("\nTry Another\n");
                theLogic();
            }else {
                if (
                    incorrectLetters.includes(input.userinput) ||
                    correctLetters.includes(input.userinput) ||
                    input.userinput === ""
                ) {
                    console.log("\nAlready guessed that one\n");
                    theLogic();
                } else {
                    var wordCheckArray = [];

                    computerWord.userGuess(input.userinput);

                    computerWord.objArray.forEach(wordCheck);
                    if(wordCheckArray.join("") === wordComplete.join("")) {
                        console.log("\nWrong\n");

                        incorrectLetters.push(input.userinput);
                        guessesLeft--;
                    } else{
                        console.log("\nCorrect\n");

                        correctLetters.push(input.userinput);
                    }

                    computerWord.log();

                    console.log("Guesses Left: " + guessesLeft + "\n");
                    
                    console.log("Letters Guessed: " + incorrectLetters.join( " ") + "\n");
                    
                    if(guessesLeft > 0) {
                        theLogic();
                    }else {
                        console.log("You Lose!\n");

                        restartGame();
                    }

                    function wordCheck(key){
                        wordCheckArray.push(key.guessed);
                    }
                }
             }

             });

    }else {
        console.log("You Won!\n");
    }

    function completeCheck(key){
        wordComplete.push(key.guessed);
    }
}

function restartGame () {
    inquirer.prompt([
        {
            type:"list",
            message: "would you like to:",
            choices: ["Play Again", "Exit"],
            name: "restart"
        }
    ]).then(function(input){
        if(input.restart === "Play Again") {
            requireNewWord = true;
            incorrectLetters = [];
            correctLetters = [];
            guessesLeft = 10;
            theLogic();
        } else {
            return;
        }
    });
}

theLogic();


process.on('unhandledRejection', function(err) {
    console.log(err);
});