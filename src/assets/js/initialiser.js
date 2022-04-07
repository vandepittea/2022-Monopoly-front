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

    /* temporary solution */
    document.querySelectorAll("#character-screen img").forEach(image => image.addEventListener("click", temporarySolution));
}

function temporarySolution(){
    switchVisibleDivs("character-screen", "waiting-screen");
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
}

function initMonopoly()
{
    document.querySelector("#property-view button").addEventListener('click', () => activateProperties(_currentGameState.players[0]));

    fillProperties();
    manageGame();
    document.querySelector("#roll-dice").addEventListener("click", getGameState);
}

function testConnection(){
    fetchFromServer('/tiles','GET').then(tiles => console.log(tiles)).catch(errorHandler);
}
