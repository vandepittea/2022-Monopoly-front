"use strict";
const _divsToToggle = ["small-property-container", "property-view button", "map-container", "moves-container-and-auctions-and-history"];

function fillProperties() {
    const $main = document.querySelector("main");
    $main.insertAdjacentHTML('beforeend', _htmlElements.propertyView);

    const $propertiesCont = document.querySelector("#properties-container");
    const $railroadCont = $propertiesCont.querySelector("[data-streettype='railroad'] ul");
    const $utilitiesCont = $propertiesCont.querySelector("[data-streettype='utilities'] ul");

    _tiles.forEach(tile => {
        addTile(tile, $propertiesCont, $railroadCont, $utilitiesCont);
    });

    _htmlElements.propertyView = $main.innerHTML;
    $main.innerHTML = "";
}

function addTile(tile, $propertiesCont, $railroadCont, $utilitiesCont) {
    switch (tile.type) {
        case "street":
            const $container = $propertiesCont.querySelector(`[data-streettype='${tile.streetColor.toLowerCase()}'] ul`);
            $container.insertAdjacentHTML('beforeend', `<li data-name="${tile.name}"><img src="../images/deeds/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
            break;
        case "railroad":
            $railroadCont.insertAdjacentHTML('beforeend', `<li data-name="${tile.name}"><img src="../images/deeds/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
            break;
        case "utility":
            $utilitiesCont.insertAdjacentHTML('beforeend', `<li data-name="${tile.name}"><img src="../images/deeds/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
            break;
        default:
            console.log("something else");
            break;
    }
}

function activateCurrentPlayersProperties() {
    activateProperties(getPlayerObject(_currentGameState, _gameData.playerName));
    document.querySelector("#properties-container").insertAdjacentHTML('beforeend', _htmlElements.rentButton);
}

function activatePlayerProperties(e) {
    const player = getPlayerObject(_currentGameState, e.target.closest("article").dataset.player);
    document.querySelector("#other-player-overview").classList.add("hidden");
    activateProperties(player);
}

function activateProperties(player) {
    toggleVisibilityByID(_divsToToggle, true);

    const $main = document.querySelector("main");
    $main.innerHTML = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements.propertyView);

    const $propertiesContainer = document.querySelectorAll('#properties-container ul li');
    $propertiesContainer.forEach($property => {
        $property.classList.remove("owned");
    });

    player.properties.forEach(property => {
        const $property = document.querySelector(`#properties-container ul li[data-name='${property.property}']`);
        $property.classList.add("owned");
    });
}

function buyProperty(propertyName) {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}`, 'POST')
        .then(result => {
            console.log(result);
            manageGame();
        })
        .catch(errorHandler);
}

function auctionProperty(propertyName) {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}`, 'DELETE')
        .then(result => {
            console.log(result);
            manageGame();
        })
        .catch(errorHandler);
}

function collectRent(game) {
    const ownedProperties = getPlayerObject(game, _gameData.playerName).properties;

    game.players.forEach(player => {
        if (player.name !== _gameData.playerName) {
            ownedProperties.forEach(property => {
                if (property.property === player.currentTile) {
                    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${property.property}/visitors/${player.name}/rent`, 'DELETE')
                        .then(response => {
                            console.log(response);
                        })
                        .catch(errorHandler);
                }
            });
        }
    });
}

function improveBuildings(property) {
    let link = ``;
    let message = ``;
    let houseCount = player.properties.houseCount;
    let hotelCount = player.properties.hotelCount;
    if (hotelCount === 1) {return null;}
    if (houseCount < 4) {
        link = `/games/{gameId}/players/${_gameData.playerName}/properties/${_gameData.propertyName}/houses`;
        message = "bought a house";
    } else {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${_gameData.propertyName}/hotel`;
        message = "bought a hotel";
    }
    fetchFromServer(link, 'POST')
        .then(response => {
            console.log(response);
            console.log(`${_gameData.playerName} ` + message);
        });

}

function removeBuildings(property) {
    let link = ``;
    let message = ``;
    let houseCount = player.properties.houseCount;
    let hotelCount = player.properties.hotelCount;
    if (hotelCount === 1) {return null;}
    if (houseCount < 4) {
        link = `/games/{gameId}/players/${_gameData.playerName}/properties/${_gameData.propertyName}/houses`;
        message = "sold a house";
    } else {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${_gameData.propertyName}/hotel`;
        message = "sold a hotel";
    }
    fetchFromServer(link, 'DELETE')
        .then(response => {
            console.log(response);
            console.log(`${_gameData.playerName} ` + message);
        });

}

