"use strict";

function injectBalance(game) {
    const $balanceContainer = document.querySelector('#balance-container');
    $balanceContainer.innerHTML = getPlayerObject(game, _gameData.playerName).money;
}

function injectProperties(game) {
    const $smallPropertyContainer = document.querySelector('#small-property-container');
    const $templateNode = $smallPropertyContainer.querySelector("template");

    $smallPropertyContainer.innerHTML = "";
    $smallPropertyContainer.insertAdjacentElement('afterbegin', $templateNode);

    getPlayerObject(game, _gameData.playerName).properties.forEach(function (property, index) {
        if (index < 3) {
            injectPropertyInContainer($smallPropertyContainer, $templateNode, property);
        }
    });
}

function injectPropertyInContainer($container, $templateNode, property) {
    _tiles.forEach(tile => {
        if (property.property === tile.name) {
            const $template = $templateNode.content.firstElementChild.cloneNode(true);
            $template.setAttribute('src', `../images/deeds/${tile.nameAsPathParameter}.jpg`);
            $template.setAttribute('alt', `${tile.name}`);
            $template.setAttribute('name', `${tile.name}`);

            const image = $template.outerHTML;
            $container.insertAdjacentHTML('beforeend',
                `<div class="partially-of-screen">
                        <div class="partially-of-screen-images">${image}</div>
                 </div>`);
        }
    });
}

function injectPossibleTiles(game) {
    const $container = document.querySelector("#moves-container-and-auctions-and-history");
    const $templateNode = $container.querySelector("template");
    const activePlayer = getPlayerObject(game, game.currentPlayer);

    const currentTileIdx = getTileIdx(activePlayer.currentTile);

    $container.innerHTML = "";
    $container.insertAdjacentElement('beforeend', $templateNode);

    for (let i = 0; i < 13; i++) {
        const $template = $templateNode.content.firstElementChild.cloneNode(true);
        const tile = _tiles[(currentTileIdx + i) % _tiles.length];

        $template.setAttribute('src', `../images/tiles/${tile.nameAsPathParameter}.jpg`);
        $template.setAttribute('alt', `${tile.name}`);
        $template.setAttribute('title', `${tile.name}`);
        $container.insertAdjacentHTML('beforeend', $template.outerHTML);
    }
}

function fillPlayerButtons() {
    let url = null;
    if (_gameData.token === null) {
        url = '/games/dummy';
    } else {
        url = `/games/${_gameData.gameID}`;
    }

    fetchFromServer(url, 'GET')
        .then(game => {
            const $container = document.querySelector("#other-players div");
            const $templateNode = document.querySelector("#other-players template");
            game.players.forEach(player => {
                if (player.name !== _gameData.playerName) {
                    const $template = $templateNode.content.firstElementChild.cloneNode(true);
                    $template.dataset.player = player.name;
                    $template.innerText = player.name;
                    $container.insertAdjacentHTML('beforeend', $template.outerHTML);
                }
            });
        })
        .catch(errorHandler);
}

function showPlayerInfo(e) {
    if (e.target.nodeName.toLowerCase() !== "button") {
        return;
    }

    const $main = document.querySelector("main");
    $main.innerHTML = "";
    $main.insertAdjacentHTML('beforeend', _htmlElements.playerOverview);

    const $otherPlayerWindow = $main.querySelector("#other-player-overview");
    const playerName = e.target.dataset.player;

    if (!$otherPlayerWindow.classList.contains("hidden") && ($otherPlayerWindow.dataset.player === playerName)) {
        $otherPlayerWindow.classList.add("hidden");
    } else {
        $otherPlayerWindow.classList.remove("hidden");
        $otherPlayerWindow.dataset.player = playerName;
        const player = getPlayerObject(_currentGameState, playerName);
        $otherPlayerWindow.querySelector("h2").innerText = player.name;
        $otherPlayerWindow.querySelector("p").innerText = player.money;
    }
}

function fillActivePlayerMain(game) {
    toggleVisibilityByID(_divsToToggle, false);

    const $main = document.querySelector("main");
    $main.innerHTML = "";
    if (_gameData.playerName === game.currentPlayer) {
        if (jailed(game)) {
            $main.insertAdjacentHTML('beforeend', _htmlElements.rollDiceButton);
            $main.insertAdjacentHTML('beforeend', _htmlElements.jailFineButton);
            if (getPlayerObject(game, _gameData.playerName).getOutOfJailFreeCards > 0){
                $main.insertAdjacentHTML('beforeend', _htmlElements.jailCardButton);
            }
        } else if (game.canRoll) {
            $main.insertAdjacentHTML('beforeend', _htmlElements.rollDiceButton);
        } else {
            const lastTurn = game.turns[game.turns.length - 1];
            const lastMove = lastTurn.moves[lastTurn.moves.length - 1];
            const tileIdx = getTileIdx(lastMove.tile);
            injectTileDeed($main, game, tileIdx);
        }
    }
}

function fillOtherPlayerMain(game) {
    toggleVisibilityByID(_divsToToggle, false);

    const $main = document.querySelector("main");
    const $mainContent = $main.querySelector("article");
    if ($mainContent !== null) {
        if (($mainContent.id === "properties") || ($mainContent.id === "other-player-overview")) {
            return;
        }
    }

    $main.innerHTML = "";
    if (game.turns.length === 0){
        return;
    }

    const lastTurn = game.turns[game.turns.length - 1];
    if (lastTurn.player === _gameData.playerName) {
        return;
    }

    injectTurnInMain(lastTurn, $main);
}

function injectTurnInMain(turn, $main)
{
    turn.moves.forEach(move =>{
        $main.insertAdjacentHTML('beforeend', _htmlElements.playerAction);
        const tile = getTile(move.tile);
        const $lastMove = $main.lastElementChild;

        $lastMove.querySelector('h2').innerText = move.tile;
        $lastMove.querySelector('p').innerText = move.description;

        const $img = $lastMove.querySelector('img');
        $img.setAttribute('src', `../images/${(tile.type === "street" ? "deeds" : "tiles")}/${tile.nameAsPathParameter}.jpg`);
        $img.setAttribute('alt', `${move.tile}`);
        $img.setAttribute('title', `${move.tile}`);
    });
}

function injectTileDeed($main, game, tileIdx) {
    $main.insertAdjacentHTML('beforeend', _htmlElements.tileDeed);
    const $tileDeed = $main.querySelector("#main-tile-deed");
    const tile = _tiles[tileIdx];
    const $tileImg = $tileDeed.querySelector("img");

    $tileDeed.querySelector("h2").innerText = tile.name;
    $tileDeed.querySelector("span").innerText = tile.cost;
    $tileDeed.dataset.name = tile.name;
    $tileImg.setAttribute("src", `../images/deeds/${tile.nameAsPathParameter}.jpg`);
    $tileImg.setAttribute("alt", `${tile.name}`);
    $tileImg.setAttribute("title", `${tile.name}`);

    let propertyOwned = false;
    game.players.forEach(player => {
        player.properties.forEach(property => {
            if (property.property === tile.name) {
                propertyOwned = true;
            }
        });
    });
    if (propertyOwned) {
        $tileDeed.insertAdjacentHTML("beforeend", `<p>Property owned by ${player.name}</p>`);
    } else {
        $tileDeed.insertAdjacentHTML("beforeend", _htmlElements.tileDeedButtons);
    }
}
