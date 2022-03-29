"use strict";
let _nickname = null;
let _amountPlayers = null;

function showGames(e){
    e.preventDefault();
    _nickname = e.target.querySelector("#nickname").value;
    console.log(_nickname);
    _amountPlayers = e.target.querySelector("#amount-players").value;
    console.log(_amountPlayers);
}
