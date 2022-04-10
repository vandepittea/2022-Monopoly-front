"use strict";

document.addEventListener('DOMContentLoaded',init);

function init(){
    testConnection();

    if (document.URL.includes("index.html"))
    {
        initPreGame();
    }
    else if (document.URL.includes("monopoly.html"))
    {
        fetchFromServer("/tiles", "GET")
            .then(response => _tiles = response)
            .then(initMonopoly)
            .catch(errorHandler);
    }
}

function initPreGame()
{
    document.querySelector("#login form").addEventListener("submit", showGames);
    document.querySelector("#game-list #create-game").addEventListener("click", showGameCreationScreen);
    document.querySelector("#game-list tbody").addEventListener("click", joinGame);
    document.querySelector("#login #amount-players").addEventListener("keyup", enableFindServer);
    document.querySelector("#login #amount-players").addEventListener("click", enableFindServer);
    document.querySelector("#nickname").addEventListener("keyup", enableFindServer);
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
    document.querySelector("#property-view button").addEventListener('click', () => activateProperties(_currentGameState.players[0]));

    fillProperties();
    manageGame();
    document.querySelector("#roll-dice").addEventListener("click", rollDice);
    //document.querySelector("#bankruptcy").addEventListener("click", goneBankrupt);
}

function testConnection(){
    fetchFromServer('/tiles','GET').then(tiles => console.log(tiles)).catch(errorHandler);
}
