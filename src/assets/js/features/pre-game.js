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
           const playerObject = {
               playerName: _nickname
           };
           fetchFromServer(`/games/${game.id}/players`, 'POST', playerObject)
               .then(response => _token = response.token);
       });
}

function createGameList()
{
    const $container = document.querySelector('#game-list tbody');
    fetchFromServer(`/games?started=false&numberOfPlayers=${_amountPlayers}&prefix=${_config.prefix}`,'GET')
        .then(games =>
        {
            games.forEach(game => addGameToContainer($container, game));
        })
        .catch(errorHandler);
}

function addGameToContainer($container, game)
{
    const $template = $container.querySelector('template').content.firstElementChild.cloneNode(true);
    game.players.forEach(player =>
    {
        $template.querySelector('ul').insertAdjacentHTML('beforeend', `<li>${player.name}</li>`);
    });
    $container.insertAdjacentHTML('beforeend', $template.outerHTML);
}

function switchVisibleDivs(idOfDivToHide, idOfDivToShow)
{
    document.querySelector(`#${idOfDivToHide}`).classList.add("hidden");
    document.querySelector(`#${idOfDivToShow}`).classList.remove("hidden");
}
