"use strict";

function makeVisibleByID(idToActivate, allIDs) {
    allIDs.forEach(id => {
        document.querySelector(`#${id}`).classList.add("hidden");
    });
    document.querySelector(`#${idToActivate}`).classList.remove("hidden");
}

function getPlayerObject(game, playerName) {
    if (playerName === null) {
        return game.players[0];
    } else {
        return game.players.find(player => player.name === playerName);
    }
}

function getTileIdx(tileName) {
    return getTile(tileName).position;
}

function getTile(tileName) {
    return _tiles.find(tile => tile.name === tileName);
}

function getTilesByColor(color) {
    return _tiles.filter(tile => tile.StreetColor === color);
}
function toggleVisibilityByID(idsToToggle, hidden) {
    idsToToggle.forEach(id => {
        document.querySelector(`#${id}`).classList.remove("hidden");
        if (hidden) {
            document.querySelector(`#${id}`).classList.add("hidden");
        }
    });
}

function clearMain() {
    document.querySelector("main").innerHTML = "";
    manageGame();
}

function getLastTurn(game) {
    return game.turns[game.turns.length - 1];
}
