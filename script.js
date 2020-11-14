/**
 * The following program contains the source code for a flash card, web app.
 * @author Shane Davenport
*/


window.onload = preparePage;


/**
 * @desc Load top 1000 esperanto words.
 */
async function preparePage() {

    let vocabulary = await loadWords();
    let keys = Object.keys(vocabulary);

    questionLoop(vocabulary, keys);
}


/**
 * @desc Display flash cards.
 * @param {dictionary} vocabulary - Common English words and their Esperanto equivalents.
 * @param {list} keys - A list of common English words.
 */
async function questionLoop(vocabulary, keys) {

    while (true) {

        let questionType = 2;
        let prompt = keys[Math.floor(Math.random() * keys.length)];
        let correctAnswer = vocabulary[prompt];

        let userResponse = await askQuestion(questionType, prompt, correctAnswer);

        // Prevent the user from submitting answer between prompts by hiding input containers
        document.getElementById("gimme_container").style.display = "none";
        document.getElementById("multiple_choice_container").style.display = "none";
        document.getElementById("typed_container").style.display = "none";
        
        await checkAnswer(userResponse)
        await slideRight();

        // Reset the answer element's animation attribute
        document.getElementById("answer").style.animation = "";
    }
}


/**
 * @desc Compares two strings to see if they are the same or close enough.
 * @param {string} string1 - The first string to be compared.
 * @param {string} string2 - The second string to be compared.
 */
function compareStrings(string1, string2) {
    return string1.toLowerCase() === string2.toLowerCase();
}


/**
 * @desc Slide prompt off the screen to the right.
 */
function slideRight() {
    let promptContainer = document.getElementById("prompt_container");
    promptContainer.style.transition = "0.5s";
    promptContainer.style.left = "150%";
    return new Promise(res => {
        window.setTimeout(() => { res(); }, 400);
    });
}


/**
 * @desc Slide prompt off the screen to the left.
 */
function jumpLeft() {
    let promptContainer = document.getElementById("prompt_container");
    promptContainer.style.transition = "0s";
    promptContainer.style.left = "-50%";
    return new Promise(res => {
        window.setTimeout(res, 50)
    });
}


/**
 * @desc Slide prompt to the center of the screen.
 */
function slideCenter() {
    let promptContainer = document.getElementById("prompt_container");
    promptContainer.style.transition = "0.5s";
    promptContainer.style.left = "50%";
    return new Promise(res => {
        window.setTimeout(() => { res(); }, 400);
    });
}


/**
 * @desc Return a dictionary of random english words and their esperanto translations.
 * @param {int} testSize - How many words to include in the dictionary.
 * @param {int} multipleChoiceSize - How many words to include for multiple choice questions.
 */
async function loadWords(testSize=5) {

    // Load dictionary of top 1000 esperanto words
    let translations = await fetch("http://127.0.0.1:5500/translations.json")
    .then(res => res.json());

    // Get english words from list
    let englishVocab = Object.keys(translations);

    let vocabulary = {}                     // Words included in the teach and multiple choice sets
    let wordCount = 0;
    for (let i = 0; wordCount != testSize; i++) {

        // Get a random word from the vocab list
        let randomEnglishWord = englishVocab[Math.floor(Math.random() * englishVocab.length)];

        // Add the random word to our list
        if (!vocabulary[randomEnglishWord]) {
            vocabulary[randomEnglishWord] = translations[randomEnglishWord];
            wordCount++;
        }
    }

    return vocabulary;
}


/**
 * @desc 
 * @param {int} questionType - 
 * @param {string} prompt - 
 * @param {string} correctAnswer - 
 */
async function askQuestion(questionType, prompt, correctAnswer) {

    await jumpLeft();
    document.getElementById("prompt").innerHTML = prompt;
    document.getElementById("answer").innerHTML = correctAnswer;

    switch (questionType) {

        // Give the answer to the answer and confirm that he or she understands it
        case 0:

            // Display gimme container and reveal answer
            document.getElementById("gimme_container").style.display = "flex";
            document.getElementById("answer").style.display = "block";

            return new Promise(res => {
                document.getElementById("submit_gimme_button").onclick = () => res(correctAnswer);
                slideCenter();
            });

        // Multiple choice question
        case 1:

            // Display multiple choice input and hide answer
            document.getElementById("multiple_choice_container").style.display = "flex";
            document.getElementById("answer").style.display = "none";

            return new Promise(res => {
                let optionElements = document.getElementsByClassName("option");
                for (let i = 0; i < 3; i++) {
                    optionElements[i].innerHTML = correctAnswer;
                    optionElements[i].onclick = () => res(correctAnswer);
                }
                slideCenter();
            });

        // Text input question
        case 2:

            let typedInput = document.getElementById("typed_input_text");
            typedInput.value = "";

            // Display text input and hide answer
            document.getElementById("typed_container").style.display = "flex";
            document.getElementById("answer").style.display = "none";

            return new Promise(res => {
                typedInput.addEventListener("keyup", evt => {
                    if (evt.keyCode === 13) res(typedInput.value);
                });
                document.getElementById("typed_input_button").onclick = () => {
                    res(typedInput.value);
                };
                slideCenter();
            });
    }
}


/**
 * @desc Let the user know if his or her answer is correct.
 * @param {string} userInput - The user's answer.
 * @param {int} duration - How long the function will take before the next question appears.
 */
function checkAnswer(userInput, duration=1250) {

    // Get the element containing correct answer
    let answerElement = document.getElementById("answer");

    // If answer is correct
    let correct = compareStrings(userInput, answerElement.innerHTML);
    
    return new Promise(res => {
        
        // Display the correct answer
        answerElement.style.display = "block";

        // If user input is correct, initiate correct animation
        if (correct) {answerElement.style.animation = "correct 0.3s 1";}

        // If user input is not correct, initiate incorrect animation
        else {answerElement.style.animation = "incorrect 0.3s 1";}

        // Resolve as soon as animation is over
        window.setTimeout(() => { res(); }, duration);
    });
}