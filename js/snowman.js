"use strict";

// Global variables
const arrSnowmanImgSrc = ['./images/snowman-melt-0.png', './images/snowman-melt-1.png', './images/snowman-melt-2.png', './images/snowman-melt-3.png', './images/snowman-melt-4.png', './images/snowman-melt-5.png', './images/snowman-melt-6.png', './images/snowman-melt-7-lose.png', './images/snowman-win.png'];
const arrAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// Array containing 28 word puzzles
const wordsArray = ['BANANA', 'GUITAR', 'RABBIT', 'DRAGON', 'RAINBOW', 'LIBRARY', 'OCTOPUS', 'CUPCAKE', 'DOLPHIN', 'ELEPHANT', 'STARFISH', 'DINOSAUR', 'KANGAROO', 'SQUIRREL', 'LEMONADE', 'JELLYFISH', 'ASTRONAUT', 'SUNFLOWER', 'BUTTERFLY', 'CROCODILE', 'ADVENTURE', 'CHOCOLATE', 'WATERFALL', 'WATERMELON', 'PLAYGROUND', 'STRAWBERRY', 'MARSHMALLOW', 'THUNDERSTORM'];
const wordsHint = ['A yellow fruit that monkeys love to eat.', 'A musical instrument.', 'A small animal with long ears who eats carrots.', 'A fairy tale creature with wings that can breathe fire.', 'A seven-colorful arc that appears in the sky after rain.', 'A quiet place filled with books where you can borrow stories to read.', 'A sea creature with eight long arms.', 'A small, sweet treat baked in a paper cup, often topped with frosting and sprinkles.', 'An intelligent marine mammal known for its playful behavior, often seen jumping out of the water.', 'A large, gray animal with a long trunk and big ears.', 'A sea creature with five arms that look like the points of a star.', 'A giant reptile that lived millions of years ago.', 'A bouncy animal, often found in Australia, that carries its baby in a special pocket called a pouch.', 'A small furry animal with a bushy tail, often seen running around trees and gathering nuts for the winter.', 'A refreshing drink made from squeezed lemons.', 'A squishy sea creature that looks like an umbrella floating in the water.', 'Explorer who travels to space in special suits and rockets.', 'A tall plant with a big, round flower that follows the sun, often having their seeds used to make oil.', 'Beautiful insect with colorful wings that flutter as it flies.', 'A large reptile with a long snout, sharp teeth, and armored skin, often found in rivers and swamps.', 'An exciting journey filled with new experiences and discoveries.', 'Sweet treat made from cocoa beans.', 'A giant water slide made by nature.', 'Big juicy fruit with green skin and red flesh.', 'Fun outdoor area filled with swings, slides, and climbing structures.', 'A delicious red fruit with tiny seeds on the outside.', 'A fluffy sweet treat that you can roast over a campfire to make s\'mores.', 'A big noisy sky show with loud booms and bright flashes, like nature\'s own fireworks display!'];

let word = "";
let noOfAttempts = 7;
let arrCorrectUsedLetters = [];
let starsTimer = null;

$(document).ready( () => {

    // Preload all snowman images found in array arrSnowmanImgSrc
    for (let imgSource of arrSnowmanImgSrc ) {
        const image = new Image();
        image.src = imgSource;
    }

    // Load word puzzle game
    loadPuzzle();

    // Construct alphabet container
    constructAlphabetsContainer();

    // Event Handler for alphabet click event
    $("#alphabets-container a").click( evt => {

        // Get alphabet element clicked
        const alphabetElClicked = evt.currentTarget;

        // Check if alphabet clicked is present in word
        checkAlphabetWord(word, alphabetElClicked);

        // Cancel default action of link
        evt.preventDefault();
    });

    // Event handler for "New Puzzle" button click event
    $("#new-puzzle-button").click ( evt => {
        reLoadNewPuzzle();
    });
});

// Check if alphabet is present in word
function checkAlphabetWord(word, alphabetElClicked) {

    // Retrieve alphabet value
    let alphabetClicked = $(alphabetElClicked).text();

    // Check if alphabet is present in word
    if(word.indexOf(alphabetClicked) !== -1) { // indexOf will return -1 if alphabet is not present in word
        
        /* Letter is correct */
        // 1. Update list of correctly used letters
        arrCorrectUsedLetters[arrCorrectUsedLetters.length] = alphabetClicked;

        // 2. Make letter visible in displayed word
        updateWord();

        // 3. Make stars blink once for a correct letter
        blinkStars();

        // Verify if game is WON by checking presence of underscores
        // Get displayed word
        let currentWord = $("#word-puzzle").text();
        if(currentWord.indexOf("_") == -1) { // no underscores found in word
            // Game is Won
            showOutcome(true);

            // Show happy snowman image
            $("#snowman").attr("src", arrSnowmanImgSrc[arrSnowmanImgSrc.length - 1]); // Last image in array is winning image

            // Animation for winning
            // 1. Show blinking stars repeatedly
            starsTimer = setInterval(blinkStars, 600);

            // 2. Header animation on win
            animateHeader(false);
        }
    }
    // Letter is not present in the word
    else {
        // Decrease number of attempts by 1
        noOfAttempts--;

        // Build snowman: change image displayed
        meltSnowman();
    }

    // Disable the used alphabet
    $(alphabetElClicked).addClass("alphabet-disabled"); // add class "alphabet-disabled" which makes alphabet button appear disabled
}

// Display blank word at the start of the puzzle
function displayBlankWord() {
    // Count number of letters in word
    let wordHtml = "";

    // Display underscores in spans; number of underscores = number of letters in word
    for(let i = 0; i < word.length; i++) {
        // Add underscore to show blank letters
        wordHtml += `<span>&#95;</span>`; 
    }

    displayWord(wordHtml);
}

// display whole word when game over
function displayWholeWord() {

    // Split string into array of characters
    let arrWord = word.split("");

    // Word variable to be displayed in #word-puzzle
    let wordHtml = "";

    for (let letter of arrWord) {
        wordHtml += `<span>${letter}</span>`;
    }

    // Display html
    displayWord(wordHtml);
}

// Display constructed html word in #word-puzzle
function displayWord(wordHtml) {
    $("#word-puzzle").html(wordHtml);
}

// Display each letter in word in spans
// Update word displayed if alphabet clicked is present in word
function updateWord() {

    // Split string into array of characters
    let arrWord = word.split("");

    // Word variable to be displayed in #word-puzzle
    let wordHtml = "";

    // Loop on every letter in arrWord
    for (let letter of arrWord) {

        // check if letter is already used in word
        if(isLetterUsed(letter)) {
            // Display letter if used
            wordHtml += `<span>${letter}</span>`;
        }
        // Letter not used yet, display underscores
        else {
            wordHtml += `<span>&#95;</span>`; // Add underscore to show blank letters
        }
    }

    // Display html
    displayWord(wordHtml);
}

// Melt snowman by changing images displayed
function meltSnowman() {

    // Display next image for melting snowman
    $("#snowman").attr("src", arrSnowmanImgSrc[7 - noOfAttempts]);

    // Game Over
    if(noOfAttempts == 0) {

        // show outcome when lost
        showOutcome(false);
    }
}

// Checks if parameter letter has already been used in word
function isLetterUsed(letter) {
    for(let letterUsed of arrCorrectUsedLetters) {
        if(letter == letterUsed) {
            return true;
        }
    }
    return false;
}

// Enable all letters displayed on new word puzzle
function enableAllLetters(){

    // Remove class "button-disabled" from all alphabets
    $("#alphabets-container a").each((index, link) => {
        $(link).removeClass("alphabet-disabled");
    });
}

// Show final outcome at end of game (win or lose)
function showOutcome(isWon) {
    let outcomeStr = "";
    let h1TextColor = "";
    
    if(isWon) {
        outcomeStr = "Congratulations!";
        h1TextColor = "gold";
    }
    else {
        outcomeStr = "Game Over!";
        h1TextColor = "coral";

        // Display whole word when game is over
        displayWholeWord();
    }

    // Make alphabets container invisible when game is over
    $("#alphabets-container").hide();

    // Change h1 heading text, color amd style
    updateHeader(outcomeStr, h1TextColor, "uppercase");

    // Show next word puzzle option
    $("#new-word-puzzle").show();

    // Header animation when won or lost
    animateHeader(false);
}

// Function to load word puzzle
function loadPuzzle() {

    // Choose random word
    let randomIndex = 0;
    
    randomIndex = getRandomNumber(); /* any number between 0 to 29 (wordsArray size) */
    word = wordsArray[randomIndex];
    console.log("Hidden word is", word);

    // Display hint of random word
    $("#span-hint").text(wordsHint[randomIndex]);

    // Display blank word at the start of the puzzle
    displayBlankWord();

    // Make star images invisible
    $(".stars").hide();

    // Make new puzzle button option invisible
    $("#new-word-puzzle").hide();
}

// Function to get a random index from 0 to size of wordsArray
function getRandomNumber() {

    /* Math.random() gives a random decimal number from 0 to 1 */
    return Math.floor(Math.random() * wordsArray.length);
}

// Function when reloading new puzzle game
function reLoadNewPuzzle() {

    // Clear Interval for displaying stars
    clearInterval(starsTimer);

    // Enable all alphabets
    enableAllLetters();

    // Make alphabets container visible when reloading new puzzle
    $("#alphabets-container").show();

    // Reset snowman image
    $("#snowman").attr("src", arrSnowmanImgSrc[0]);

    // Reset variables
    noOfAttempts = 7;
    arrCorrectUsedLetters = [];

    // Reset header size back to original using animation
    animateHeader(true);

    // Load Puzzle
    loadPuzzle();
}

// Make elements with class "stars" appear in a fading effect
function blinkStars() {
    // Make stars image appear/disappear within 0.6 second
    $(".stars").fadeIn(300);
    $(".stars").fadeOut(300);
}

// Update text, color and style of header
function updateHeader(displayStr, h1TextColor, h1FontStyle) {
    // Update header text
    $("#header").text(displayStr);

    // Set color of h1 text to white using jQuery
    $("#header").css("color", h1TextColor);
    $("#header").css("text-transform", h1FontStyle);
}

// Displays #header with an animation
function animateHeader(isReset) {

    if(isReset) {
        // Header reset to "Save the snowman.."
        $("h1").animate( { 
            fontSize: "250%", // original size of h1 is 200%
            opacity: 1, 
            left: "-=275"
        }, 200, "easeInExpo");

        // Update header text, color and style
        updateHeader("Save the Snowman!", "white", "capitalize");
    }
    else {
        // when game is won or lost
        $("h1").animate( { 
            fontSize: "380%", 
            opacity: 1, 
            left: "+=275"
        }, 1000, "easeInExpo");
    }
}

// Construct alphabets section
function constructAlphabetsContainer() {

    // Get alphabets container
    let mainAlphabetsContainer = $("#alphabets-container");

    // Create div elements for each row
    let firstRow = $('<div id="first-row"></div>');
    let secondRow = $('<div id="second-row"></div>');
    let thirdRow = $('<div id="third-row"></div>');

    for (let alphabetIndex in arrAlphabets) {
        let alphabetLink = $('<a href="#" class="alphabets">' + arrAlphabets[alphabetIndex] + '</a>');
        
        if(alphabetIndex < 10) { // First 10 alphabets in first row
            firstRow.append(alphabetLink);
        }
        else if (alphabetIndex < 20) { // 11th to 20th alphabet in second row
            secondRow.append(alphabetLink);
        }
        else { // 21st to 26th alphabet n third row
            thirdRow.append(alphabetLink);
        }
    }
    // Append alphabets to main container
    mainAlphabetsContainer.append(firstRow, secondRow, thirdRow);
}