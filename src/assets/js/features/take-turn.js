"use strict";

function getGameState(){
    fetchFromServer('/games/dummy', 'GET')
        .then (state =>
        {
            diceRoll(state)
        })
        .catch(errorHandler);
}

function diceRoll(state) {
    let dice1 = state.lastDiceRoll[0];
    let dice2 = state.lastDiceRoll[1];

    console.log("dice1 " + dice1 + " and dice2 " + dice2);
}