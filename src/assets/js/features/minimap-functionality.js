"use strict";

function syncPlayersToMinimap(game)
{
    cleanAllDivs();

    game.players.forEach(player =>
    {
        syncOnePawn(player);
    });
}

function cleanAllDivs(){
    for (let i = 0; i < _tiles.length; i++) {
        const $minimapTile = document.querySelectorAll(`.pawns #t${i}`);

        $minimapTile.forEach( tile =>{
            tile.innerHTML = "";
        })
    }
}

function syncOnePawn(player){
    const playerTileIdx = getTileIdx(player.currentTile);

    const $minimapTile = document.querySelectorAll(`.pawns #t${playerTileIdx}`);
    $minimapTile.forEach(tile =>{
        tile.insertAdjacentHTML('beforeend', `<img src="../images/characters/${player.pawn}.webp" alt="${player.pawn} title="${player.pawn}">`);
    })
}