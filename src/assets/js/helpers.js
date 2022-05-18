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
        let playerObject = null;
        game.players.forEach(player => {
            if (player.name === playerName) {
                playerObject = player;
            }
        });
        return playerObject;
    }
}

function getTileIdx(tileName) {
    return getTile(tileName).position;
}

function getTile(tileName) {
    let tileObject = null;
    _tiles.forEach(tile => {
        if (tile.name === tileName) {
            tileObject = tile;
        }
    });
    return tileObject;
}

function toggleVisibilityByID(idsToToggle, hidden) {
    idsToToggle.forEach(id => {
        if (hidden) {
            document.querySelector(`#${id}`).classList.add("hidden");
        } else {
            document.querySelector(`#${id}`).classList.remove("hidden");
        }
    });
}
