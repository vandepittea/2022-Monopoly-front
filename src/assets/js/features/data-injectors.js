"use strict";

const _mainIdToNotRefresh = ["properties", "other-player-overview", "history"];
const _divsToToggle = ["small-property-container", "property-view button", "moves-container-and-history"];
const _idsToShowWhenCurrentPlayer = ["map-container"];
const _idsToShowWhenNotCurrentPlayer = ["current-place-on-game-board-image"];


function injectBalanceAndDebt(game) {
    const $balanceContainer = document.querySelector("#balance-container");
    const $debtContainer = document.querySelector("#debt-container");

    $balanceContainer.innerText = getPlayerObject(game, _gameData.playerName).money;
    $debtContainer.innerText = getPlayerObject(game, _gameData.playerName).debt;
}

function injectProperties(game) {
    const $smallPropertyContainer = document.querySelector("#small-property-container");

    $smallPropertyContainer.innerText = "";

    getPlayerObject(game, _gameData.playerName).properties.forEach(function (property, index) {
        if (index < 3) {
            injectOnePropertyInPropertyContainer($smallPropertyContainer, property);
        }
    });
}

function injectOnePropertyInPropertyContainer($smallPropertyContainer, property) {
    _tiles.forEach(tile => {
        if (property.property === tile.name) {
            $smallPropertyContainer.insertAdjacentHTML("afterbegin", _htmlElements.propertyInSmallContainer);

            const $image = $smallPropertyContainer.querySelector("img");

            $image.setAttribute('src', `../images/deeds/${tile.nameAsPathParameter}.jpg`);
            $image.setAttribute('alt', `${tile.name}`);
            $image.setAttribute('name', `${tile.name}`);
        }
    });
}

function injectPossibleTiles(game) {
    const $movesContainer = document.querySelector("#moves-container-and-history");
    const activePlayer = getPlayerObject(game, game.currentPlayer);
    const currentTileIdx = getTileIdx(activePlayer.currentTile);

    $movesContainer.innerHTML = "";

    for (let i = 0; i < 13; i++) {
        injectOneTileInMovesContainer($movesContainer, currentTileIdx, i);
    }
}

function injectOneTileInMovesContainer($movesContainer, currentTileIdx, indexOfForLoop){
    $movesContainer.insertAdjacentHTML("beforeend", _htmlElements.possibleTiles);

    const tile = _tiles[(currentTileIdx + indexOfForLoop) % _tiles.length];
    const $lastInsertedTile = $movesContainer.lastElementChild;
    const $image = $lastInsertedTile.querySelector("img");

    $image.setAttribute("src", `../images/tiles/${tile.nameAsPathParameter}.jpg`);
    $image.setAttribute("alt", `${tile.name}`);
    $image.setAttribute("title", `${tile.name}`);

    $lastInsertedTile.querySelector("div").id = `t${currentTileIdx + indexOfForLoop}`;
}

function fillPlayerButtons() {
    fetchFromServer(`/games/${_gameData.gameID}`, "GET")
        .then(game => {
            const $otherPlayersContainer = document.querySelector("#other-players div");

            game.players.forEach(player => {
                if (player.name !== _gameData.playerName) {
                    addOnePlayerButton($otherPlayersContainer, player.name);
                }
            });
        })
        .catch(errorHandler);
}

function addOnePlayerButton($otherPlayersContainer, playerName){
    $otherPlayersContainer.insertAdjacentHTML("beforeend", `<button type="button" data-player="${playerName}">${playerName}</button>`);
}

function showPlayerInfo(e) {
    if (e.target.nodeName.toLowerCase() === "button") {
        const $main = document.querySelector("main");
        $main.innerHTML = "";

        $main.insertAdjacentHTML("beforeend", _htmlElements.playerOverview);
        $main.querySelector("#other-player-overview-property").addEventListener("click", activatePlayerProperties);
        $main.querySelector("#close-screen").addEventListener("click", clearMain);

        fillInPlayerInfo(e, $main);
    }
}

function fillInPlayerInfo(e, $main){
    const $otherPlayerWindow = $main.querySelector("#other-player-overview");
    const playerName = e.target.dataset.player;
    $otherPlayerWindow.dataset.player = playerName;

    const player = getPlayerObject(_currentGameState, playerName);
    $otherPlayerWindow.querySelector("h2").innerText = player.name;
    $otherPlayerWindow.querySelector("h3").innerText = player.money;
}

function fillActivePlayerMain(game) {
    becomeActivePlayerView();

    const $main = document.querySelector("main");
    $main.innerHTML = "";

    if (_gameData.playerName === game.currentPlayer) {
        if (jailed(game)) {
            insertJailedMain($main, game);
        } else if (game.canRoll) {
            insertRollDicedMain($main);
        } else {
            insertTileDeedMain($main, game);
        }
    }
}

function becomeActivePlayerView(){
    toggleVisibilityByID(_divsToToggle, false);
    toggleVisibilityByID(_idsToShowWhenCurrentPlayer, false);
    toggleVisibilityByID(_idsToShowWhenNotCurrentPlayer, true);
}

function insertJailedMain($main, game) {
    $main.insertAdjacentHTML("beforeend", _htmlElements.jail);
    $main.querySelector("#roll-dice").addEventListener("click", rollDice);
    $main.querySelector("#pay-fine").addEventListener("click", payJailFine);

    injectUseJailCardsButtonIfNeeded($main, game);
}

function injectUseJailCardsButtonIfNeeded($main, game){
    const $article = $main.querySelector("article");
    if (getPlayerObject(game, _gameData.playerName).getOutOfJailFreeCards > 0) {
        $article.insertAdjacentHTML("beforeend", `<button type="button" id="jail-card">Use your get out of jail card!</button>`);
        $main.querySelector("#jail-card").addEventListener("click", useJailCards);
    }
}

function insertRollDicedMain($main){
    $main.insertAdjacentHTML("beforeend", _htmlElements.rollDice);
    $main.querySelector("#roll-dice").addEventListener("click", rollDice);
}

function insertTileDeedMain($main, game){
    const lastTurn = game.turns[game.turns.length - 1];
    const lastMove = lastTurn.moves[lastTurn.moves.length - 1];
    const tileIdx = getTileIdx(lastMove.tile);
    injectTileDeed($main, game, tileIdx);
}

function fillOtherPlayerMain(game) {
    const $main = document.querySelector("main");

    if(!checkIfWeHaveToStopPolling($main)){
        $main.innerHTML = "";
        becomeOtherPlayer(game);

        if (game.turns.length !== 0) {
            const lastTurn = getLastTurn(game);

            if ((lastTurn.player !== _gameData.playerName) && (lastTurn.player === game.currentPlayer)) {
                $main.innerHTML = "";
                injectTurnInMain(lastTurn, $main);
            }
        }
    }
}

function checkIfWeHaveToStopPolling($main){
    const $mainContent = $main.querySelector("article");

    if ($mainContent !== null) {
        if (_mainIdToNotRefresh.findIndex(id => $mainContent.id === id) !== -1) {
            return true;
        }
    }
    return false;
}

function becomeOtherPlayer(game){
    toggleVisibilityByID(_divsToToggle, false);
    toggleVisibilityByID(_idsToShowWhenCurrentPlayer, true);
    toggleVisibilityByID(_idsToShowWhenNotCurrentPlayer, false);

    injectHistoryButton();
    injectBusyRolling();
    injectTopLeftTile(game);
}

function injectHistoryButton() {
    const $historyContainer = document.querySelector("#moves-container-and-history");
    $historyContainer.innerHTML = "";
    $historyContainer.insertAdjacentHTML("beforeend", `<button type="button">History</button>`);
}

function injectBusyRolling() {
    const $main = document.querySelector("main");
    $main.innerText = "";

    $main.insertAdjacentHTML('beforeend', _htmlElements.busyRolling);
    $main.querySelector("p").innerText = _currentGameState.currentPlayer + " is busy rolling.";
}

function injectTopLeftTile(game) {
    const $currentPlayerTile = document.querySelector("#current-place-on-game-board-image");
    const lastTurn = getLastTurn(game);

    if(lastTurn !== undefined){
        const lastMove = lastTurn.moves[lastTurn.moves.length - 1];
        const tile = getTile(lastMove.tile);

        $currentPlayerTile.setAttribute('src', `../images/tiles/${tile.nameAsPathParameter}.jpg`);
        $currentPlayerTile.setAttribute('alt', `${tile.name}`);
        $currentPlayerTile.setAttribute('title', `${tile.name}`);
    }
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
