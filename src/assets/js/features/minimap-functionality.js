"use strict";

function syncPlayersToMinimap(game)
{
    // Clean all divs
    for (let i = 0; i < _tiles.length; i++)
    {
        document.querySelector(`.pawns #t${i}`).innerHTML = "";
    }

    game.players.forEach(player =>
    {
        const playerTileIdx = getTileIdx(player.currentTile);
        const $minimapTile = document.querySelectorAll(`.pawns #t${playerTileIdx}`);
        $minimapTile.forEach(tile =>{
            tile.insertAdjacentHTML('beforeend', `<img src="../images/characters/${player.pawn}.webp" alt="${player.pawn} title="${player.pawn}">`);
        })
    });
}