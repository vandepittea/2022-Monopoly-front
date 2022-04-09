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
            syncPlayersToMinimap(game);
        })
        .catch(errorHandler);

    setTimeout(manageGame, 1500);
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
    const $templateNode = $smallPropertyContainer.querySelector("template");

    $smallPropertyContainer.innerHTML = "";
    $smallPropertyContainer.insertAdjacentElement('afterbegin', $templateNode);

    getPlayerObject(game, _gameData.playerName).properties.forEach(function(property, index)
    {
        if (index < 3)
        {
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
    const $container = document.querySelector("#moves-container");
    const $templateNode = $container.querySelector("template");
    const activePlayer = getPlayerObject(game, game.currentPlayer);

    const currentTileIdx = getTileIdx(activePlayer.currentTile);

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
