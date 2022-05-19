"use strict";
let _currentGameState = null;
let _previousCyclePlayer = null;

function manageGame() {
    // TODO: delete this if-else, this exists for testing with dummy data
    let url;
    if (_gameData.token === null) {
        url = '/games/dummy';
    } else {
        url = `/games/${_gameData.gameID}`;
    }

    fetchFromServer(url, 'GET')
        .then(game => {
            _currentGameState = game;

            //All things that needs to be shown for both go here
            injectProperties(game);
            injectBalance(game);
            syncPlayersToMinimap(game);

            if ((game.currentPlayer === _gameData.playerName) && (_previousCyclePlayer === _gameData.playerName)) {
                //All things specific for the active player goes here
                injectPossibleTiles(game);
                fillActivePlayerMain(game);
            } else {
                //All things specific for non-active players go here
                fillOtherPlayerMain(game);
                if (game.currentPlayer !== _previousCyclePlayer) {
                    setTimeout(manageGame, calculateTimeout(game));
                } else {
                    setTimeout(manageGame, 1500);
                }
                _previousCyclePlayer = game.currentPlayer;
            }
        })
        .catch(errorHandler);
}

function calculateTimeout(game) {
    return 10000 / game.numberOfPlayers;
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
                    manageGame();

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

//code needed to show ongoing auctions

function currentAuctions() {
    const $main = document.querySelector("main");
    $main.innerText = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements.auctionTable);
    fetchFromServer(url, 'GET')
        .then(game => {
            game.players.forEach(player => {
                if (player.name !== _gameData.playerName) {
                    //get all ongoing auctions by player
                    fetchFromServer(`/games/${_gameData.gameID}/players/${player.name}/auctions`, 'GET')
                        .then(response => {
                            console.log(response);
                            if (response.auctions.length > 0) {
                                //show all ongoing auctions in a table on html
                                const $auctionTableBody = $main.querySelector("#ongoingAuctions tbody");
                                $auctionTableBody.insertAdjacentHTML("beforeend",
                                    `<tr data-player="${response.playerName}" data-property="${response.property}">
                                            <td>${response.playerName}</td>
                                            <td>${response.property}</td>
                                            <td><img src="../images/coin.png" alt="Coin" title="Coin" id="coin"/>${response.price}</td>
                                            <td>
                                                <button id="join-auction" type="button">Join Auction</button>
                                            </td>
                                          </tr>`
                                );
                            }


                        })
                        .catch(errorHandler);
                }
            });
        })
        .catch(errorHandler);
}

function declareBankrupt() {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/bankruptcy`, 'POST')
        .then(response => {
            console.log(response);
            console.log(`${_gameData.playerName} is bankrupt!`);
        });
}

function payJailFine() {
    fetchFromServer(`/games/${_gameData.gameID}/prison/${_gameData.playerName}/fine`, 'POST')
        .then(response =>{
            console.log(response);
            console.log(`${_gameData.playerName} is out of jail!`);
            manageGame();
        })
        .catch(errorHandler);
}

function useJailCards() {
    fetchFromServer(`/games/${_gameData.gameID}/prison/${_gameData.playerName}/free`, 'POST')
        .then(response =>{
            console.log(response);
            console.log(`${_gameData.playerName} is out of jail!`);
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
            })
            .catch(errorHandler);
    } else {
        fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/tax/compute`, 'POST')
            .then(response => {
                console.log(response);
                console.log(`${_gameData.playerName} switched tax system to compute`);
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
