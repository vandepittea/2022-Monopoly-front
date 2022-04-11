"use strict";
let _currentGameState = null;

function manageGame() {
    // TODO: delete this if-else, this exists for testing with dummy data
    let url = null;
    if (_gameData.token === null) {
        url = '/games/dummy';
    } else {
        url = `/games/${_gameData.gameID}`;
    }

    fetchFromServer(url, 'GET')
        .then(game => {
            _currentGameState = game;

            //All things that needs to be shown for both go here
            injectProperties(game);
            injectBalance(game);
            syncPlayersToMinimap(game);
            fillMain(game);

            if (game.currentPlayer === _gameData.playerName) {
                //All things specific for the active player goes here
                injectPossibleTiles(game);
            } else {
                //All things specific for non-active players go here
                setTimeout(manageGame, 1500);
            }
        })
        .catch(errorHandler);
}

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

function injectPropertyInContainer($container, $templateNode, property)
{
    _tiles.forEach(tile =>
    {
        if (property.property === tile.name)
        {
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

    for (let i = 0; i < 12; i++) {
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
    }
    else {
        url = `/games/${_gameData.gameID}`;
    }

    fetchFromServer(url, 'GET')
        .then(game => {
            const $container = document.querySelector("#other-players div");
            const $templateNode = document.querySelector("#other-players template");
            game.players.forEach(player => {
                if (player.name !== _gameData.playerName)
                {
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
    if (e.target.nodeName.toLowerCase() !== "button")
    {
        return;
    }

    const $otherPlayerWindow = document.querySelector("#other-player-overview");
    const playerName = e.target.dataset.player;

    if (!$otherPlayerWindow.classList.contains("hidden") && ($otherPlayerWindow.dataset.player === playerName))
    {
        $otherPlayerWindow.classList.add("hidden");
    }
    else
    {
        $otherPlayerWindow.classList.remove("hidden");
        $otherPlayerWindow.dataset.player = playerName;
        const player = getPlayerObject(_currentGameState, playerName);
        $otherPlayerWindow.querySelector("h2").innerText = player.name;
        $otherPlayerWindow.querySelector("p").innerText = player.money;
    }
}

function rollDice()
{
    if (_gameData.token !== null)
    {
        if (_currentGameState.currentPlayer === _gameData.playerName)
        {
            fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/dice`, 'POST')
                .then(response =>
                {
                    console.log(response);

                    const $diceRoll = response.lastDiceRoll;
                    console.log(`${_gameData.playerName} rolled a ${$diceRoll[0]} and a ${$diceRoll[1]}`);
                    fillMain(response);

                    _currentGameState = response;
                })
                .catch(errorHandler);
        }
    }
}

function manageMainClick(e)
{
    e.preventDefault();

    if (e.target.id === "roll-dice")
    {
        rollDice();
    }
}

function fillMain(game)
{
    const $main = document.querySelector("main");
    $main.innerHTML = "";
    if (_gameData.playerName === game.currentPlayer)
    {
        if (game.canRoll)
        {
            $main.insertAdjacentHTML('beforeend', _htmlElements.rollDiceButton);
        }
        else
        {
            const lastTurn = game.turns[game.turns.length - 1];
            const lastMove = lastTurn.moves[lastTurn.moves.length - 1];
            const tileIdx = getTileIdx(lastMove.tile);
            injectTileDeed($main, game, tileIdx);
        }
    }
}

function injectTileDeed($main, game, tileIdx) {
    $main.insertAdjacentHTML('beforeend', _htmlElements.tileDeed);

    const $tileDeed = $main.querySelector("#main-tile-deed");
    const tile = _tiles[tileIdx];
    const $tileImg = $tileDeed.querySelector("img");

    $tileDeed.querySelector("h2").innerText = tile.name;
    $tileImg.setAttribute("src", `../images/deeds/${tile.nameAsPathParameter}.jpg`);
    $tileImg.setAttribute("alt", `${tile.name}`);
    $tileImg.setAttribute("title", `${tile.name}`);

    let propertyOwned = false;
    game.players.forEach(player => {
        player.properties.forEach(property =>
        {
            if (property.property === tile.name) {
                propertyOwned = true;
            }
        });
    });

    if (propertyOwned) {
        $tileDeed.insertAdjacentHTML("beforeend", `<p>Property owned by ${player.name}</p>`);
    }
    else {
        $tileDeed.insertAdjacentHTML("beforeend", _htmlElements.tileDeedButtons);
    }
}
