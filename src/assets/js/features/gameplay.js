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
            case "main-property-buy":
                buyProperty(e.target.closest("#main-tile-deed").dataset.name);
                break;
            case "main-property-auction":
                auctionProperty(e.target.closest("#main-tile-deed").dataset.name);
                break;
            case "collect-rent":
                collectRent(_currentGameState);
                break;
            default:
                manageIdLessButtonClicks(e);
                break;
        }
    }
}

function manageIdLessButtonClicks(e) {
    const $closestArticle = e.target.closest("article");
    switch ($closestArticle.id) {
        case "properties":
            fillActivePlayerMain(_currentGameState);
            break;
        case "other-player-overview":
            activateProperties($closestArticle.dataset.player);
            break;
        default:
            break;
    }
}
