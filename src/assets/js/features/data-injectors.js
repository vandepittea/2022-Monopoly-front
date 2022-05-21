"use strict";

const mainIdToNotRefresh = ["properties", "other-player-overview", "history"];
const idsToShowWhenCurrentPlayer = ["map-container"];
const idsToShowWhenNotCurrentPlayer = ["current-place-on-game-board-image"];


function injectBalance(game) {
    const $balanceContainer = document.querySelector('#balance-container');
    const $debtContainer = document.querySelector('#debt-container');
    $balanceContainer.innerHTML = getPlayerObject(game, _gameData.playerName).money;
    $debtContainer.innerHTML = getPlayerObject(game, _gameData.playerName).debt;
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
    const $container = document.querySelector("#moves-container-and-history");
    const activePlayer = getPlayerObject(game, game.currentPlayer);

    const currentTileIdx = getTileIdx(activePlayer.currentTile);

    $container.innerHTML = "";

    for (let i = 0; i < 13; i++) {
        $container.insertAdjacentHTML('beforeend', _htmlElements.possibleTiles);
        const tile = _tiles[(currentTileIdx + i) % _tiles.length];

        const $lastInsertedTile = $container.lastElementChild;
        const $image = $lastInsertedTile.querySelector('img');

        $image.setAttribute('src', `../images/tiles/${tile.nameAsPathParameter}.jpg`);
        $image.setAttribute('alt', `${tile.name}`);
        $image.setAttribute('title', `${tile.name}`);

        $lastInsertedTile.querySelector('div').id = `t${currentTileIdx + i}`;
    }
}

function injectTopButtons() {
    const $container = document.querySelector("#moves-container-and-history");
    $container.innerHTML = "";
    $container.insertAdjacentHTML('beforeend', _htmlElements.topButtons);
}

function fillPlayerButtons() {
    let url;
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
    $main.querySelector("#other-player-overview-property").addEventListener("click", activatePlayerProperties);
    $main.querySelector("#close-screen").addEventListener("click", clearMain);

    const $otherPlayerWindow = $main.querySelector("#other-player-overview");
    const playerName = e.target.dataset.player;

    $otherPlayerWindow.dataset.player = playerName;
    const player = getPlayerObject(_currentGameState, playerName);
    $otherPlayerWindow.querySelector("h2").innerText = player.name;
    $otherPlayerWindow.querySelector("h3").innerText = player.money;
}

function insertJailedMain($main, game) {
    $main.insertAdjacentHTML('beforeend', "<article id='jail-choices'></article>");
    const $article = $main.firstElementChild;
    $article.insertAdjacentHTML('beforeend', "<h2>You are in jail :'-(</h2>");
    $article.insertAdjacentHTML('beforeend', _htmlElements.rollDiceButton);
    $main.querySelector("#roll-dice").addEventListener("click", rollDice);
    $article.insertAdjacentHTML('beforeend', _htmlElements.jailFineButton);
    $main.querySelector("#pay-fine").addEventListener("click", payJailFine);
    if (getPlayerObject(game, _gameData.playerName).getOutOfJailFreeCards > 0) {
        $article.insertAdjacentHTML('beforeend', _htmlElements.jailCardButton);
        $main.querySelector("#jail-card").addEventListener("click", useJailCards);
    }
}

function fillActivePlayerMain(game) {
    toggleVisibilityByID(_divsToToggle, false);
    toggleVisibilityByID(idsToShowWhenCurrentPlayer, false);
    toggleVisibilityByID(idsToShowWhenNotCurrentPlayer, true);

    const $main = document.querySelector("main");
    $main.innerHTML = "";
    if (_gameData.playerName === game.currentPlayer) {
        if (jailed(game)) {
            insertJailedMain($main, game);
        } else if (game.canRoll) {
            $main.insertAdjacentHTML('beforeend', _htmlElements.rollDiceButton);
            $main.querySelector("#roll-dice").addEventListener("click", rollDice);
        } else {
            const lastTurn = game.turns[game.turns.length - 1];
            const lastMove = lastTurn.moves[lastTurn.moves.length - 1];
            const tileIdx = getTileIdx(lastMove.tile);
            injectTileDeed($main, game, tileIdx);
        }
    }
}

function injectTopLeftTile(game) {
    const $currentPlayerTile = document.querySelector("#current-place-on-game-board-image");
    const lastTurn = getLastTurn(game);

    if(lastTurn != undefined){
        const lastMove = lastTurn.moves[lastTurn.moves.length - 1];
        const tile = getTile(lastMove.tile);

        $currentPlayerTile.setAttribute('src', `../images/tiles/${tile.nameAsPathParameter}.jpg`);
        $currentPlayerTile.setAttribute('alt', `${tile.name}`);
        $currentPlayerTile.setAttribute('title', `${tile.name}`);
    }
}

function fillOtherPlayerMain(game) {
    injectTopLeftTile(game);

    const $main = document.querySelector("main");
    const $mainContent = $main.querySelector("article");
    if ($mainContent !== null) {
        if (mainIdToNotRefresh.findIndex(id => $mainContent.id === id) !== -1) {
            return;
        }
    }
    $main.innerHTML = "";
    toggleVisibilityByID(_divsToToggle, false);
    toggleVisibilityByID(idsToShowWhenCurrentPlayer, true);
    toggleVisibilityByID(idsToShowWhenNotCurrentPlayer, false);
    injectTopButtons();
    injectPlayerRolling();

    if (game.turns.length === 0) {
        return;
    }

    const lastTurn = getLastTurn(game);
    if ((lastTurn.player === _gameData.playerName) && (lastTurn.player !== game.currentPlayer)) {
        return;
    }

    $main.innerHTML = "";
    injectTurnInMain(lastTurn, $main);
}

function injectTurnInMain(turn, $main) {
    const rolls = turn.roll;
    const player = turn.player;
    addRollDiceMessages(`${player} rolled ${rolls[0]} and ${rolls[1]}`);

    turn.moves.forEach(move => {

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

function injectHistory(e){
    e.preventDefault();

    if(e.target.nodeName.toLowerCase() === "button"){
        const $main = document.querySelector("main");
        $main.innerHTML = `<div id='history-container'>
                                <button type="button" id="close-screen">&#10007;</button>
                                <article id='history'></article>
                           </div>`;
        const $history = document.querySelector("#history");

        $main.querySelector("#close-screen").addEventListener("click", clearMain);

        _currentGameState.turns.forEach(turn =>{
            turn.moves.forEach(move =>{
                $history.insertAdjacentHTML("afterbegin", `
                    <article>
                        <h2>${move.tile}</h2>
                        <p>${move.description}</p>
                    </article>`);
            });
        });
    }
}

function injectTileDeed($main, game, tileIdx) {
    $main.insertAdjacentHTML('beforeend', _htmlElements.tileDeed);
    const $tileDeed = $main.querySelector("#main-tile-deed");
    const tile = _tiles[tileIdx];
    const $tileImg = $tileDeed.querySelector("img");

    $tileDeed.querySelector("h2").innerText = tile.name;
    $tileDeed.querySelector("span").innerText = tile.cost;
    $tileDeed.dataset.name = tile.nameAsPathParameter;
    $tileImg.setAttribute("src", `../images/deeds/${tile.nameAsPathParameter}.jpg`);
    $tileImg.setAttribute("alt", `${tile.name}`);
    $tileImg.setAttribute("title", `${tile.name}`);

    const propertyOwned = game.players.find(player => player.properties.find(property => property.property === tile.name));

    if (propertyOwned) {
        $tileDeed.insertAdjacentHTML("beforeend", `<p>Property owned by ${player.name}</p>`);
    } else {
        $tileDeed.insertAdjacentHTML("beforeend", _htmlElements.tileDeedButtons);
        $main.querySelector("#main-property-buy").addEventListener("click", () => buyProperty($tileDeed.dataset.name));
        $main.querySelector("#main-property-auction").addEventListener("click", () => dontBuyProperty($tileDeed.dataset.name));
    }
}

function makeMiniMapDivs() {
    const $miniMapAside = document.querySelector("#map-container");
    $miniMapAside.innerHTML = "";
    for (let i = 0; i < _tiles.length; i++) {
        $miniMapAside.insertAdjacentHTML('beforeend', `<div id="t${i}"> </div>`);
    }
}

function injectPlayerRolling() {
    const $main = document.querySelector("main");
    $main.innerText = "";
    $main.insertAdjacentHTML('beforeend', `<article id="dice">
                                                            <img src="../images/dice.png" alt="dice" title="dice">
                                                            <p>${_currentGameState.currentPlayer} is busy rolling.</p>
                                                       </article>`);
}
