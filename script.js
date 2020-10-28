window.onload = () => {
    resetPrompt("this", "tiu", "dekstra", "kovrilo");

    // let translations = fetch("http://127.0.0.1:5500/translations.json")
    // translations.then(res => res.json());
    // console.log(translations);
}

function checkAnswer(userInput) {
    let answerElement = document.getElementById("answer");
    let correct = userInput == answerElement.innerHTML;
    return new Promise(res => {
        answerElement.style.display = "block";
        if (correct) {answerElement.style.animation = "correct 0.3s 1";}
        else {answerElement.style.animation = "incorrect 0.3s 1";}
        window.setTimeout(() => { res(); }, 1250);
    });
}

function slideRight() {
    let promptContainer = document.getElementById("prompt_container");
    promptContainer.style.transition = "0.5s";
    return new Promise(res => {
        promptContainer.style.left = "150%";
        window.setTimeout(() => { res(); }, 400);
    });
}

function jumpLeft() {
    let promptContainer = document.getElementById("prompt_container");
    promptContainer.style.transition = "0s";
    return new Promise(res => {
        window.setTimeout(() => {
            promptContainer.style.left = "-50%";
            res(); 
        }, 50)
    });
}

function slideCenter() {
    let promptContainer = document.getElementById("prompt_container");
    promptContainer.style.transition = "0.5s";
    return new Promise(res => {
        promptContainer.style.left = "50%";
        window.setTimeout(() => { res(); }, 400);
    });
}

function resetPrompt(prompt, correct, incorrect1, incorrect2) {
    let optionElements = document.getElementsByClassName("option");
    return new Promise(res => {
        document.getElementById("prompt").innerHTML = prompt;
        document.getElementById("answer").innerHTML = correct;
        optionElements[0].innerHTML = correct;
        optionElements[1].innerHTML = incorrect1;
        optionElements[2].innerHTML = incorrect2;
        document.getElementById("answer").style.display = "none";
        window.setTimeout(() => { res(); }, 50);
    });
}

async function submit(element) {
    await checkAnswer(element.innerHTML);
    await slideRight();
    await jumpLeft();
    await resetPrompt("this", "tiu", "dekstra", "kovrilo")
    await slideCenter();
}