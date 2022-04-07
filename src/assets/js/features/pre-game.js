"use strict";
let _nickname = null;
let _amountPlayers = null;

function showGames(e){
    e.preventDefault();
    _nickname = e.target.querySelector("#nickname").value;
    _amountPlayers = e.target.querySelector("#amount-players").value;

    createGameList();

    switchVisibleDivs("login", "game-list");
}

function createGame()
{
   console.log("Create game");
   const bodyParams = {
       prefix: _config.prefix,
       numberOfPlayers: parseInt(_amountPlayers)
   };

   fetchFromServer('/games', 'POST', bodyParams)
       .then(game =>
       {
           joinGameWithPlayer(game.id, _nickname, "create-game-screen");
       })
       .catch(errorHandler);
}

function createGameList()
{
    const $container = document.querySelector('#game-list tbody');
    const $templateNode = $container.querySelector('template');

    $container.innerHTML = "";
    $container.insertAdjacentElement('beforeend', $templateNode);

    fetchFromServer(`/games?started=false&numberOfPlayers=${_amountPlayers}&prefix=${_config.prefix}`,'GET')
        .then(games =>
        {
            games.forEach(game => addGameToContainer($container, $templateNode, game));
        })
        .catch(errorHandler);
}

function addGameToContainer($container, $templateNode, game)
{
    const $template = $templateNode.content.firstElementChild.cloneNode(true);
    $template.dataset.gameid = game.id;
    game.players.forEach(player =>
    {
        $template.querySelector('ul').insertAdjacentHTML('beforeend', `<li>${player.name}</li>`);
    });
    $container.insertAdjacentHTML('beforeend', $template.outerHTML);
}

function joinGame(e)
{
    if (e.target.nodeName.toLowerCase() !== "button")
    {
        return;
    }

    const gameID = e.target.closest('tr').dataset.gameid;
    joinGameWithPlayer(gameID, _nickname, "character-screen");
}

function joinGameWithPlayer(gameID, playerName, toSwitchScreen)
{
    const playerObject = {
        playerName: playerName
    };

    fetchFromServer(`/games/${gameID}/players`, 'POST', playerObject)
        .then(response =>
        {
            _token = response;
            switchVisibleDivs("game-list", toSwitchScreen);
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
