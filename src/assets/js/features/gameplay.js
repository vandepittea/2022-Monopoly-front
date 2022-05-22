"use strict";

let _currentGameState = null;
let _previousCyclePlayer = null;
let _firstTimeCyclingManageGame = true;
const _waitingTime = 3000;

function manageGame() {
    fetchFromServer(`/games/${_gameData.gameID}`, "GET")
        .then(game => {
            _currentGameState = game;

            showActiveAndOtherPlayers(game);

            if ((game.currentPlayer === _gameData.playerName) && (_previousCyclePlayer === _gameData.playerName || _firstTimeCyclingManageGame)) {
                showActivePlayer(game);
                _firstTimeCyclingManageGame = false;
            } else {
                showAndDoActionsOtherPlayers(game);
            }
        })
        .catch(errorHandler);
}

function showActiveAndOtherPlayers(game){
    injectProperties(game);
    injectBalanceAndDebt(game);
}

function showActivePlayer(game){
    injectPossibleTiles(game);
    syncPlayersToMinimap(game);
    fillActivePlayerMain(game);
}

function showAndDoActionsOtherPlayers(game){
    injectTopLeftTile(game);
    fillOtherPlayerMain(game);

    if (game.currentPlayer !== _previousCyclePlayer) {
        setTimeout(manageGame, calculateTimeout(game));
    } else {
        setTimeout(manageGame, _waitingTime);
    }
    _previousCyclePlayer = game.currentPlayer;
}

function calculateTimeout(game) {
    return _waitingTime / game.numberOfPlayers;
}

function rollDice() {
    if (_gameData.token !== null) {
        if (_currentGameState.currentPlayer === _gameData.playerName) {
            fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/dice`, "POST")
                .then(response => {
                    syncPlayersToMinimap(response);

                    const $main = document.querySelector("main");
                    $main.innerText = "";
                    injectTurnInMain(getLastTurn(response), $main);

                    setTimeout(manageGame, _waitingTime);

                    _currentGameState = response;
                })
                .catch(errorHandler);
        } else{
            addErrorAndSuccessfulMessage("It's not your turn.");
        }
    } else{
        addErrorAndSuccessfulMessage("There isn't a game token.");
    }
}

function jailed(game) {
    const activePlayer = getPlayerObject(game, game.currentPlayer);

    if (_gameData.token !== null) {
        if (_currentGameState.currentPlayer === _gameData.playerName) {
            if (activePlayer.jailed) {
                return true;
            }
        } else{
            addErrorAndSuccessfulMessage("It's not your turn.");
        }
    } else{
        addErrorAndSuccessfulMessage("There isn't a game token.");
    }
    return false;
}

function payJailFine() {
    jailCall("fine");
}

function useJailCards() {
    jailCall("free");
}

function jailCall(parameter) {
    fetchFromServer(`/games/${_gameData.gameID}/prison/${_gameData.playerName}/${parameter}`, "POST")
        .then(response =>{
            addErrorAndSuccessfulMessage("You are out of jail.");
            manageGame();
        })
        .catch(errorHandler);
}

function switchTaxSystem(e) {
    const player = getPlayerObject(_currentGameState, _gameData.playerName);

    if (player.taxSystem === "COMPUTE") {
        switchToEstimate();
    } else {
        switchToCompute();
    }

    switchTaxButtonText(e);
}

function switchToEstimate(){
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/tax/estimate`, "POST")
        .then(response => {
            addErrorAndSuccessfulMessage("You switched tax system to estimate.");
        })
        .catch(errorHandler);
}

function switchToCompute(){
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/tax/compute`, "POST")
        .then(response => {
            addErrorAndSuccessfulMessage("You switched tax system to compute.");
        })
        .catch(errorHandler);
}

function switchTaxButtonText(e){
    if(e.target.innerText === "ESTIMATE"){
        e.target.innerText = "COMPUTE";
    }
    else{
        e.target.innerText = "ESTIMATE";
    }
}

function declareBankrupt() {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/bankruptcy`, "POST")
        .then(response => {
            window.location.replace("bankrupt-screen.html");
        });
}

function checkForWinner() {
    if (_currentGameState !== null) {
        fetchFromServer(`/games/${_gameData.gameID}`, "GET")
            .then(response => {
                if (response.ended) {
                    if (response.winner === _gameData.playerName) {
                        window.location.replace("win-screen.html");
                    }
                }
            })
            .catch(errorHandler);
    }

    setTimeout(checkForWinner, _waitingTime);
}

function refreshCurrentGameState() {
    fetchFromServer(`/games/${_gameData.gameID}`, "GET")
        .then(response => {
            _currentGameState = response;
            injectBalanceAndDebt(_currentGameState);
        })
        .catch(errorHandler);
}
