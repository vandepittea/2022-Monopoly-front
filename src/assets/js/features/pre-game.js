"use strict";
let _nickname = null;
let _amountPlayers = null;
let _gameID = null;

const allDivIds = ["login", "game-list", "create-game-screen", "character-screen", "waiting-screen"];

function showGames(e){
    e.preventDefault();
    _nickname = e.target.querySelector("#nickname").value;
    _amountPlayers = e.target.querySelector("#amount-players").value;

    createGameList();

    makeVisibleByID("game-list", allDivIds);
}

function showGameCreationScreen()
{
    makeVisibleByID("create-game-screen", allDivIds);
}

function createGame(e)
{
    e.preventDefault();

    const bodyParams = {
       prefix: _config.prefix,
       numberOfPlayers: parseInt(_amountPlayers)
    };

    fetchFromServer('/games', 'POST', bodyParams)
        .then(game =>
        {
            _gameID = game.id;
           makeVisibleByID("character-screen", allDivIds);
        })
        .catch(errorHandler);

}

function createGameList()
{
    if (_config.token === null)
    {
        const $container = document.querySelector('#game-list tbody');
        const $templateNode = $container.querySelector('template');

        fetchFromServer(`/games?started=false&numberOfPlayers=${_amountPlayers}&prefix=${_config.prefix}`,'GET')
            .then(games =>
            {
                $container.innerHTML = "";
                $container.insertAdjacentElement('beforeend', $templateNode);
                games.forEach(game => addGameToContainer($container, $templateNode, game));
            })
            .catch(errorHandler);

        setTimeout(createGameList, 1500);
    }
    else
    {
        console.log("Go to game");
    }
}

function addGameToContainer($container, $templateNode, game)
{
    const $template = $templateNode.content.firstElementChild.cloneNode(true);
    $template.dataset.gameid = game.id;

    game.players.forEach(player =>
    {
        $template.querySelector('ul').insertAdjacentHTML('beforeend', `<li>${player.name}</li>`);
    });
    $template.querySelector('#active-players').innerText = game.players.length;
    $template.querySelector('#max-players').innerText = game.numberOfPlayers;

    $container.insertAdjacentHTML('beforeend', $template.outerHTML);
}

function joinGame(e)
{
    if (e.target.nodeName.toLowerCase() !== "button")
    {
        return;
    }

    _gameID = e.target.closest('tr').dataset.gameid;
    makeVisibleByID("character-screen", allDivIds);
}

function joinGameWithPlayer()
{
    const playerObject = {
        playerName: _nickname
    };

    fetchFromServer(`/games/${_gameID}/players`, 'POST', playerObject)
        .then(response =>
        {
            _config.token = response;
            makeVisibleByID("waiting-screen", allDivIds);
            waitForPlayers();
        })
        .catch(errorHandler);
}

function enableFindServer (){
    const $button = document.querySelector("#login button");
    const $amountPlayers = document.querySelector("#amount-players");
    const $nickname = document.querySelector("#nickname");

    if ($amountPlayers.value !== ""){
        $button.disabled = $nickname.value === "";
    }
    else
    {
        $button.disabled = true;
    }
}

function waitForPlayers()
{
    fetchFromServer(`/games/${_gameID}`, 'GET')
        .then(game =>
        {
            if (game.started)
            {
                makeVisibleByID("launch-screen", allDivIds);
            }
            else
            {
                addPlayersToWaitingScreen(game);
                setTimeout(waitForPlayers, 1500);
            }
        });
}

function addPlayersToWaitingScreen(game)
{
    const $templateNode = document.querySelector("#waiting-screen template");
    const $container = document.querySelector("#waiting-screen div");

    $container.innerHTML = "";
    $container.insertAdjacentElement('afterbegin', $templateNode);

    game.players.forEach(player =>
    {
        const $template = $templateNode.content.firstElementChild.cloneNode(true);
        $template.querySelector("img").setAttribute('src', "images/characters/mario.webp");
        $template.querySelector("figcaption").innerText = player.name;
        $container.insertAdjacentHTML('beforeend', $template.outerHTML);
    });

    for (let i = 0; i < (game.numberOfPlayers - game.players.length); i++)
    {
        const $template = $templateNode.content.firstElementChild.cloneNode(true);
        $container.insertAdjacentHTML('beforeend', $template.outerHTML);
    }
}
