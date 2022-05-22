"use strict";

document.addEventListener('DOMContentLoaded',init);

function init(){
    if (document.URL.includes("game.html"))
    {
        fetchFromServer("/tiles", "GET")
            .then(response => _tiles = response)
            .then(initMonopoly)
            .catch(errorHandler);
    } else {
        initPreGame();
    }
}

function initPreGame(){
    document.querySelector("#login form").addEventListener("submit", showGames);
    document.querySelector("#game-list #create-game").addEventListener("click", showGameCreationScreen);
    document.querySelector("#game-list tbody").addEventListener("click", joinGame);
    document.querySelector("#create-game-screen form").addEventListener('submit', createGame);
    document.querySelector("#launch-button-and-current-player button").addEventListener('click', goToGame);

    document.querySelectorAll("#character-screen img").forEach(image => image.addEventListener("click", joinGameWithPawn));
}

function initMonopoly(){
    _gameData = loadFromStorage("gameData");
    initMonopolyEventHandlers();
    startGame();
}

function initMonopolyEventHandlers(){
    document.querySelector("#property-view button").addEventListener('click', activateCurrentPlayersProperties);
    document.querySelector("#other-players div").addEventListener("click", showPlayerInfo);
    document.querySelector("#bankrupt").addEventListener("click", declareBankrupt);
    document.querySelector("#tax-system").addEventListener("click", switchTaxSystem);
    document.querySelector("main").addEventListener("click", manageProperty);
    document.querySelector("main").addEventListener("click", selectPropertyToImprove);
    document.querySelector("#moves-container-and-history").addEventListener("click", injectHistory);
}

function startGame(){
    makeMiniMapDivs();
    fillProperties();
    fillPlayerButtons();
    manageGame();
    checkForWinner();
}
