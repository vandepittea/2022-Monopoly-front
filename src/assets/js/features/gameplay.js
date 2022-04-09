"use strict";
let _currentGameState = null;

function manageGame()
{
    // TODO: delete this if-else, this exists for testing with dummy data
    let url = null;
    if (_gameData.token === null)
    {
        url = '/games/dummy';
    }
    else
    {
        url = `/games/${_gameData.gameID}`;
    }

    fetchFromServer(url, 'GET')
        .then (game =>
        {
            _currentGameState = game;
            injectPossibleTiles(game);
            injectProperties(game);
            injectBalance(game);
        })
        .catch(errorHandler);
}

function injectBalance(game)
{
    const $balanceContainer = document.querySelector('#balance-container');
    //Using dummy data, need to change to own's player money.
    $balanceContainer.innerHTML = getPlayerObject(game, _gameData.playerName).money;
    console.log("added the balance of the dummy game");
}

function injectProperties(game)
{
    const $smallPropertyContainer = document.querySelector('#small-property-container');
    getPlayerObject(game, _gameData.playerName).properties.forEach(function(property, index)
    {
        if (index < 3)
        {
            injectPropertyInContainer($smallPropertyContainer, property);
        }
    });
}

function injectPropertyInContainer($container, property)
{
    _tiles.forEach(tile =>
    {
        if (property.property === tile.name)
        {
            const $template = $container.querySelector('template').content.firstElementChild.cloneNode(true);
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
    const $container = document.querySelector("#moves-container");
    const $templateNode = $container.querySelector("template");
    const activePlayer = getPlayerObject(game, game.currentPlayer);
    const currentTile = activePlayer.currentTile;

    let currentTileIdx = 0;
    _tiles.forEach(tile =>
    {
        if (tile.name === currentTile)
        {
            currentTileIdx = tile.position;
        }
    });

    $container.innerHTML = "";
    $container.insertAdjacentElement('beforeend', $templateNode);

    for (let i = 0; i < 12; i++)
    {
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

function showPlayerInfo(e)
{
    if (e.target.nodeName.toLowerCase() !== "button")
    {
        return;
    }

    console.log(`Showing info of player ${e.target.dataset.player}`);
}
