"use strict";

const _errorAndSuccessfulSelector = "#error-and-successful";

function generateVisualAPIErrorInConsole(){
    console.error('%c%s','background-color: red;color: white','! An error occurred while calling the API');
}

function errorHandler(error){
    addErrorAndSuccessfulMessage(error.cause);
}

function addErrorAndSuccessfulMessage(message){
    const $error = document.querySelector(_errorAndSuccessfulSelector);
    $error.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);

    setTimeout(deleteLastError, 5000);
}

function deleteLastError() {
    const $error = document.querySelector(_errorAndSuccessfulSelector);

    if($error.lastElementChild.id === "roll-dice"){
        $error.lastChild.previousSibling.remove();
    }
    else{
        $error.lastElementChild.remove();
    }
}

function addRollDiceMessages(message){
    const $error = document.querySelector(_errorAndSuccessfulSelector);
    $error.innerHTML = `<p id="roll-dice">${message}</p>`;
}
