"use strict";
let _currentGameState = null;
let _previousCyclePlayer = null;

function manageGame() {
    // TODO: delete this if-else, this exists for testing with dummy data
    let url = null;
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
                _previousCyclePlayer = game.currentPlayer;
                setTimeout(manageGame, 1500);
            }
        })
        .catch(errorHandler);
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

function manageMainClick(e) {
    e.preventDefault();

    if (e.target.nodeName.toLowerCase() === "button") {
        switch (e.target.id) {
            case "roll-dice":
                rollDice();
                break;
            case "showAuctions":
                currentAuctions();
                break;
            case "main-property-buy":
                buyProperty(e.target.closest("#main-tile-deed").dataset.name);
                break;
            case "main-property-auction":
                auctionProperty(e.target.closest("#main-tile-deed").dataset.name);
                break;
            case "collect-rent":
                collectRent(_currentGameState);
                break;
            case "other-player-overview-property":
                const $closestArticle = e.target.closest("article");
                activateProperties($closestArticle.dataset.player);
                break;
            case "other-player-overview-trade":
                break;
            default:
                fillActivePlayerMain(_currentGameState);
                break;
        }
    }
}

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
                                    `<tr>
                                            <td>${response.playerName}</td>
                                            <td>${response.property}</td>
                                            <td><img src="../images/coin.png" alt="Coin" title="Coin" id="coin"/>${response.price}</td>
                                            <td>
                                                <button id="joinAuction1" type="button">Join Auction</button>
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
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/bankruptcy'`, 'POST')
        .then(response =>{
            console.log(response);
            console.log(`${_gameData.playerName} is bankrupt!`);
        })
        .catch(errorHandler);
}