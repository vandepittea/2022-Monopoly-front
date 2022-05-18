"use strict";

function diceRoll() {
    let dice1;
    let dice2;
    fetchFromServer('/games/dummy', 'GET')
        .then(state => {
            dice1 = state.lastDiceRoll[0];
            dice2 = state.lastDiceRoll[1];
            console.log("dice1 " + dice1 + " and dice2 " + dice2);
        })
        .catch(errorHandler);
}

function goneBankrupt() {

    fetchFromServer('/games/dummy', 'GET')
        .then(state => {
            //search for current player and if he's bankrupt.
            for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].name === state.currentPlayer && state.players[i].bankrupt) {
                    //show bankrupt screen to current player for 5 seconds.
                    //Move the code below out of the for to test.
                    document.querySelector("#overlay").style.display = "flex";
                    setTimeout(function () {
                        document.querySelector("#overlay").style.display = "none";
                    }, 5000);
                }
            }
        })
        .catch(errorHandler);
}
