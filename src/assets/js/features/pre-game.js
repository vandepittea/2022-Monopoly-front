"use strict";

let _nickname = null;
let _amountPlayers = null;
let _gameID = null;

const allDivIds = ["login", "game-list", "create-game-screen", "character-screen", "waiting-screen"];

function showGames(e){
    e.preventDefault();

    if ((e.target.querySelector("#nickname").value !== "") || (e.target.querySelector("#amount-players").value !== ""))
    {
        _nickname = e.target.querySelector("#nickname").value;
        _amountPlayers = e.target.querySelector("#amount-players").value;

        createGameList();

        makeVisibleByID("game-list", allDivIds);
    } else{
        addErrorAndSuccessfulMessage("Fill in all the required fields.");
    }
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
       numberOfPlayers: parseInt(_amountPlayers),
       gameName: document.querySelector("#group-name").value
    };

    fetchFromServer('/games', 'POST', bodyParams)
        .then(game =>
        {
            _gameID = game.id;

            makeVisibleByID("game-list", allDivIds);
        })
        .catch(errorHandler);

}

function createGameList()
{
    if (_gameData.token === null)
    {
        const gameListContainer = document.querySelector('#game-list tbody');
        const $templateNode = gameListContainer.querySelector('template');

        fetchFromServer(`/games?started=false&numberOfPlayers=${_amountPlayers}&prefix=${_config.prefix}`,'GET')
            .then(games =>
            {
                gameListContainer.innerHTML = "";
                gameListContainer.insertAdjacentElement('beforeend', $templateNode);
                games.forEach(game => addGameToGameList(gameListContainer, $templateNode, game));
            })
            .catch(errorHandler);

        setTimeout(createGameList, 1500);
    }
}

function addGameToGameList($gameListContainer, $templateNode, game)
{
    const $template = $templateNode.content.firstElementChild.cloneNode(true);
    $template.dataset.gameid = game.id;

    game.players.forEach(player =>
    {
        $template.querySelector('ul').insertAdjacentHTML('beforeend', `<li>${player.name}</li>`);
    });

    $template.querySelector('#active-players').innerText = game.players.length;
    $template.querySelector('#max-players').innerText = game.numberOfPlayers;
    $template.querySelector('#game-name').innerText = game.gameName;

    $gameListContainer.insertAdjacentHTML('beforeend', $template.outerHTML);
}

function joinGame(e)
{
    if (e.target.nodeName.toLowerCase() === "button")
    {
        _gameID = e.target.closest('tr').dataset.gameid;

        const playerObject = {
            playerName: _nickname
        };

        fetchFromServer(`/games/${_gameID}/players`, 'POST', playerObject)
            .then(response =>
            {
                _gameData.token = response;
                placeChosenCharactersInBlack();
                makeVisibleByID("character-screen", allDivIds);
            })
            .catch(errorHandler);
    }
}

function placeChosenCharactersInBlack(){
    fetchFromServer(`/games/${_gameID}`, 'GET')
        .then(game =>
        {
            game.players.forEach(player =>
            {
                const $images = document.querySelectorAll("#character-screen img");
                $images.forEach(image =>{
                    if(player.pawn === image.dataset.name){
                        image.classList.add("pawn-taken");
                    }
                })
            });
        });
        .catch(errorHandler);
}

function joinGameWithPawn(e)
{
    assignPawn(e);

    if(!e.target.classList.contains("pawn-taken")){
        makeVisibleByID("waiting-screen", allDivIds);
        waitForPlayers();
    }
    else{
        addErrorAndSuccessfulMessage("This player is already chosen.");
    }
}

function assignPawn(e) {
    const playerObject = {
        playerName: _nickname,
        pawn: e.target.dataset.name
    };

    fetchFromServer(`/games/${_gameID}/players`, 'POST', playerObject)
        .catch(errorHandler);
}

function waitForPlayers()
{
    fetchFromServer(`/games/${_gameID}`, 'GET')
        .then(game =>
        {
            if (game.started)
            {
                goToLaunchScreen(game);
            }
            else
            {
                addPlayersToWaitingScreen(game);
                setTimeout(waitForPlayers, 1500);
            }
        })
        .catch(errorHandler);
}

function addPlayersToWaitingScreen(game)
{
    const $templateNode = document.querySelector("#waiting-screen template");
    const $waitingRoomContainer = document.querySelector("#waiting-screen div");

    $waitingRoomContainer.innerHTML = "";
    $waitingRoomContainer.insertAdjacentElement("afterbegin", $templateNode);

    game.players.forEach(player =>
    {
        addOnePlayerToWaitingRoom($templateNode, $waitingRoomContainer, player);
    });

    addImagesOfBlackMarioToShowHowManyUserWeAreStillWaitingFor($templateNode, $waitingRoomContainer, game);
}

function addOnePlayerToWaitingRoom($templateNode, $waitingRoomContainer, player){
    const $template = $templateNode.content.firstElementChild.cloneNode(true);

    const $image = $template.querySelector("img");
    $image.setAttribute("src", `images/characters/${player.pawn}.webp`);
    $image.setAttribute("title", `${player.name}`);
    $image.setAttribute("alt", `${player.pawn}`);

    $template.querySelector("figcaption").innerText = player.pawn;

    $waitingRoomContainer.insertAdjacentHTML("beforeend", $template.outerHTML);
}

function addImagesOfBlackMarioToShowHowManyUserWeAreStillWaitingFor($templateNode, $waitingRoomContainer, game){
    for (let i = 0; i < (game.numberOfPlayers - game.players.length); i++)
    {
        const $template = $templateNode.content.firstElementChild.cloneNode(true);
        $waitingRoomContainer.insertAdjacentHTML('beforeend', $template.outerHTML);
    }
}

function goToLaunchScreen(game)
{
    const $templateNode = document.querySelector('#launch-screen template');
    const $playerContainer = document.querySelector('#other-players');

    game.players.forEach(player =>
    {
        addOnePlayerToLaunchScreen($templateNode, $playerContainer, player);
    });

    makeVisibleByID("launch-screen", allDivIds);
}

function addOnePlayerToLaunchScreen($templateNode, $playerContainer, player){
    const $template = $templateNode.content.firstElementChild.cloneNode(true);

    const $image = $template.querySelector("img");
    $image.setAttribute("src", `images/characters/${player.pawn}.webp`);
    $image.setAttribute("title", `${player.title}`);
    $image.setAttribute("alt", `${player.pawn}`);

    $template.querySelector('figcaption').innerText = player.name;

    addPlayerInMiddleOrTheBottomRightCorner($playerContainer, $template, player);

}

function addPlayerInMiddleOrTheBottomRightCorner($playerContainer, $template, player){
    if (player.name === _nickname)
    {
        document.querySelector('#launch-button-and-current-player').insertAdjacentHTML('afterbegin', $template.outerHTML);
    }
    else
    {
        $playerContainer.insertAdjacentHTML('beforeend', $template.outerHTML);
    }
}

function goToGame()
{
    _gameData.playerName = _nickname;
    _gameData.gameID = _gameID;

    saveToStorage("gameData", _gameData);

    window.location.replace("pages/game.html");
}
