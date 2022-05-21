"use strict";
let _currentGameState = null;
let _previousCyclePlayer = null;
let _firstTimeCyclingManageGame = true;
let _waitingTime = 3000;

function manageGame() {
    fetchFromServer(`/games/${_gameData.gameID}`, 'GET')
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
            fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/dice`, 'POST')
                .then(response => {
                    console.log(response);

                    const $diceRoll = response.lastDiceRoll;
                    console.log(`${_gameData.playerName} rolled a ${$diceRoll[0]} and a ${$diceRoll[1]}`);
                    syncPlayersToMinimap(response);

                    const $main = document.querySelector("main");
                    $main.innerText = "";
                    injectTurnInMain(getLastTurn(response), $main);

                    setTimeout(manageGame, _waitingTime);

                    _currentGameState = response;
                })
                .catch(errorHandler);
        }
    }
}

function jailed(game) {
    const activePlayer = getPlayerObject(game, game.currentPlayer);
    if (_gameData.token !== null) {
        if (_currentGameState.currentPlayer === _gameData.playerName) {
            const $jailed = activePlayer.jailed;
            if ($jailed) {
                console.log(`${_gameData.playerName} is in jail`);
                return true;
            } else {
                console.log(`${_gameData.playerName} is not in jail`);
            }
        }
    }
    return false;
}

function declareBankrupt() {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/bankruptcy`, 'POST')
        .then(response => {
            console.log(response);
            console.log(`${_gameData.playerName} is bankrupt!`);
        });
}

function payJailFine() {
    jailCall("fine");
}

function useJailCards() {
    jailCall("free");
}

function jailCall(parameter) {
    fetchFromServer(`/games/${_gameData.gameID}/prison/${_gameData.playerName}/${parameter}`, 'POST')
        .then(response =>{
            console.log(response);
            addErrorAndSuccessfulMessage()
            console.log("You are out of jail.");
            manageGame();
        })
        .catch(errorHandler);
}

function switchTaxSystem(e) {
    const player = getPlayerObject(_currentGameState, _gameData.playerName);
    if (player.taxSystem === 'COMPUTE') {
        fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/tax/estimate`, 'POST')
            .then(response => {
                console.log(response);
                console.log(`${_gameData.playerName} switched tax system to estimate`);
                addErrorAndSuccessfulMessage("You switched tax system to estimate.");
            })
            .catch(errorHandler);
    } else {
        fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/tax/compute`, 'POST')
            .then(response => {
                console.log(response);
                console.log(`${_gameData.playerName} switched tax system to compute`);
                addErrorAndSuccessfulMessage("You switched tax system to compute.");
            })
            .catch(errorHandler);

    }
    if(e.target.innerText === "ESTIMATE"){
        e.target.innerText = "compute";
    }
    else{
        e.target.innerText = "estimate";
    }
}