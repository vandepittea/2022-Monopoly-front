"use strict";

function generateVisualAPIErrorInConsole(){
    console.error('%c%s','background-color: red;color: white','! An error occurred while calling the API');
}

function errorHandler(error){
    addErrorAndSuccessfulMessage(error.cause);
}

function addErrorAndSuccessfulMessage(message){
    const $error = document.querySelector("#error-and-successful");
    $error.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);

    setTimeout(deleteLastError, 5000);
}

function deleteLastError() {
    const $error = document.querySelector("#error-and-successful");
    $error.lastElementChild.remove();
}
