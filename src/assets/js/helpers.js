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

function toggleVisibilityByID(idsToToggle, hidden) {
    idsToToggle.forEach(id => {
        document.querySelector(`#${id}`).classList.toggle("hidden");
    });
}

function clearMain() {
    document.querySelector("main").innerHTML = "";
    manageGame();
}
