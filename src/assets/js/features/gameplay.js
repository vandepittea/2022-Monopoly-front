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
            injectProperties(game);
            injectBalance(game);
        })
        .catch(errorHandler);
}

function injectBalance(game)
{
    const $balanceContainer = document.querySelector('#balance-container');
    //Using dummy data, need to change to own's player money.
    $balanceContainer.innerHTML = getYourPlayerObject(game).money;
    console.log("added the balance of the dummy game");
}

function injectProperties(game)
{
    const $smallPropertyContainer = document.querySelector('#small-property-container');
    getYourPlayerObject(game).properties.forEach(function(property, index)
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

            $container.insertAdjacentHTML('beforeend', $template.outerHTML);
        }
    });
}

function injectPossibleTiles(game)
{
    console.log(game);
}
