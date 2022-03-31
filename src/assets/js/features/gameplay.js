"use strict";

function manageGame()
{
    fetchFromServer('/games/dummy', 'GET')
        .then (game =>
        {
            injectBalance(game);
        })
        .catch(errorHandler);
}

function injectBalance(game)
{
    const $balanceContainer = document.querySelector('#balance-container');
    //Using dummy data, need to change to own's player money.
    $balanceContainer.innerHTML = game.players[0].money;
    console.log("added the balance of the dummy game");
}
