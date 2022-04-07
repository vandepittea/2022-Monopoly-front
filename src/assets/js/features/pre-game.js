"use strict";
let _nickname = null;
let _amountPlayers = null;

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
           joinGameWithPlayer(game.id, _nickname);
        })
        .catch(errorHandler);

}

function createGameList()
{
    if (_token === null)
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

    const gameID = e.target.closest('tr').dataset.gameid;
    joinGameWithPlayer(gameID, _nickname);
}

function joinGameWithPlayer(gameID, playerName)
{
    const playerObject = {
        playerName: playerName
    };

    fetchFromServer(`/games/${gameID}/players`, 'POST', playerObject)
        .then(response =>
        {
            _token = response;
            makeVisibleByID("character-screen", allDivIds);
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
