"use strict";

function makeVisibleByID(idToActivate, allIDs)
{
    allIDs.forEach(id =>
    {
        document.querySelector(`#${id}`).classList.add("hidden");
    });
    document.querySelector(`#${idToActivate}`).classList.remove("hidden");
}

function getPlayerObject(game, playerName)
{
    if (_gameData.token === null)
    {
        return game.players[0];
    }
    else
    {
        let playerObject = null;
        game.players.forEach(player =>
        {
           if (playerName === _gameData.playerName)
           {
               playerObject = player;
           }
        });
        return playerObject;
    }
}

function getTileIdx(tileName)
{
    let tileIdx = 0;
    _tiles.forEach(tile =>
    {
        if (tile.name === tileName)
        {
            tileIdx = tile.position;
        }
    });
    return tileIdx;
}
