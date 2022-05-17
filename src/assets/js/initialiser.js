"use strict";

document.addEventListener('DOMContentLoaded',init);

function init(){
    if (document.URL.includes("game.html"))
    {
        fetchFromServer("/tiles", "GET")
            .then(response => _tiles = response)
            .then(initMonopoly)
            .catch(errorHandler);
    }
    else
    {
        initPreGame();
    }
}

function initPreGame()
{
    document.querySelector("#login form").addEventListener("submit", showGames);
    document.querySelector("#game-list #create-game").addEventListener("click", showGameCreationScreen);
    document.querySelector("#game-list tbody").addEventListener("click", joinGame);
    document.querySelector("#create-game-screen form").addEventListener('submit', createGame);
    document.querySelectorAll("#character-screen img").forEach(image => image.addEventListener("click", joinGameWithPlayer));
    document.querySelector("#launch-button-and-current-player button").addEventListener('click', goToGame);
}

function initMonopoly()
{
    const tempData = loadFromStorage("gameData");
    if (tempData === null)
    {
        _gameData.gameID = null;
        _gameData.playerName = null;
        _gameData.token = null;
    }
    else
    {
        _gameData = tempData;
    }
    document.querySelector("#property-view button").addEventListener('click', activateCurrentPlayersProperties);
    document.querySelector("main").addEventListener("click", manageMainClick);
    document.querySelector("#show-auctions").addEventListener("click", currentAuctions);
    // This doesn't work because the #bankruptcy is not in the html anymore
    //document.querySelector("#bankruptcy").addEventListener("click", goneBankrupt);
    document.querySelector("#other-players div").addEventListener("click", showPlayerInfo);
    document.querySelector("#bankrupt").addEventListener("click", declareBankrupt);
    document.querySelector("#taxSystem").addEventListener("click", switchTaxSystem);

    fillProperties();
    fillPlayerButtons();
    manageGame();
}
