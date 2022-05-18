"use strict";

function syncPlayersToMinimap(game) {
    // Clean all divs
    for (let i = 0; i < _tiles.length; i++) {
        document.querySelector(`#map-container #t${i}`).innerHTML = "";
    }

    game.players.forEach(player => {
        const playerTileIdx = getTileIdx(player.currentTile);
        const $minimapTile = document.querySelector(`#map-container #t${playerTileIdx}`);
        $minimapTile.insertAdjacentHTML('beforeend', `<p>${player.name}</p>`);
    });
}
