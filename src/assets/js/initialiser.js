"use strict";
let _token = null;

document.addEventListener('DOMContentLoaded',init);

function init(){
    testConnection();

    if (document.URL.includes("index.html"))
    {
        initPreGame();
    }
    else if (document.URL.includes("monopoly.html"))
    {
        initMonopoly();
    }
}

function initPreGame()
{
    document.querySelector("form").addEventListener("submit", showGames);
    document.querySelector("#create-game").addEventListener("click", createGame);
    document.querySelector("tbody").addEventListener("click", joinGame);
}

function initMonopoly()
{
    manageBalance();
}

function testConnection(){
    fetchFromServer('/tiles','GET').then(tiles => console.log(tiles)).catch(errorHandler);
}
