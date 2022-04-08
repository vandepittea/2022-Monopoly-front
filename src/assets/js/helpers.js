"use strict";

function makeVisibleByID(idToActivate, allIDs)
{
    allIDs.forEach(id =>
    {
        document.querySelector(`#${id}`).classList.add("hidden");
    });
    document.querySelector(`#${idToActivate}`).classList.remove("hidden");
}

function getYourPlayerObject(game)
{
    if (_gameData.token === null)
    {
        return game.players[0];
    }
    else
    {
        let ownPlayer = null;
        game.players.forEach(player =>
        {
           if (player.name === _gameData.playerName)
           {
               ownPlayer = player;
           }
        });
        return ownPlayer;
    }
}

