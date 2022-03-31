"use strict";

function manageBalance()
{
    fetchFromServer('/games/dummy', 'GET')
        .then (game =>
        {
            const $balanceContainer = document.querySelector('#balance-container');
            $balanceContainer.innerHTML = game.players[0].money;
        })
        .catch(errorHandler);
    console.log("added the balance of the dummy game");
}
