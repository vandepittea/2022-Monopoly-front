"use strict";
let _nickname = null;

function showGames(e){
    e.preventDefault();
    _nickname = e.target.querySelector("#nickname").value;
    console.log(_nickname);
}
