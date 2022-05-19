"use strict";
const _divsToToggle = ["small-property-container", "property-view button", "moves-container-and-history"];

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
    document.querySelector("main #collect-rent").addEventListener("click", () => collectRent(_currentGameState));
}

function activatePlayerProperties(e) {
    const player = getPlayerObject(_currentGameState, e.target.closest("article").dataset.player);
    activateProperties(player);
}

function activateProperties(player) {
    toggleVisibilityByID(_divsToToggle, true);

    const $main = document.querySelector("main");
    $main.innerHTML = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements.propertyView);
    $main.querySelector("#close-screen").addEventListener("click", clearMain);
    $main.querySelector("#properties h2").innerHTML = `${player.name}'s properties`;

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
            const property = ownedProperties.find(property => property.property === player.currentTile);
            if(property != null){
                fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${property.property}/visitors/${player.name}/rent`, 'DELETE')
                    .then(response => {
                        console.log(response);
                        manageGame();
                    })
                    .catch(errorHandler);
            }
            else{
                addErrorMessage("You can't get rent from a player.");
            }
        }
    });
}

function manageProperty(e) {
    const $main = document.querySelector("main");
    const $article = $main.querySelector("article");

    if (($article.id !== "properties") && (e.target.nodeName.toLowerCase() !== "img")) {
        return;
    }

    $main.innerHTML = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements.showDeedCard);
    const $deed = $main.querySelector("#deedCard");
    const tile = getTile(e.target.closest("li").dataset.name);
    const $deedImg = $deed.querySelector("img");
    $deed.querySelector("h2").innerText = tile.name;
    $deed.dataset.name = tile.name;
    $deedImg.setAttribute("src", `../images/deeds/${tile.nameAsPathParameter}.jpg`);
    $deedImg.setAttribute("alt", `${tile.name}`);
    $deedImg.setAttribute("title", `${tile.name}`);

    $deed.querySelector("#buy-house").addEventListener("click", houseManager());
}

function houseManager() {
    const $main = document.querySelector("main");
    $main.innerHTML = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements/*still in process of making*/);
}

//improveBuildings(e.target.closest("#main-tile-deed").dataset.name);
function improveBuildings(propertyName) {
    const player = getPlayerObject(_currentGame, playerName);
    const property = player.properties.find(property => property === propertyName);
    let link = ``;
    let houseCounter = property.houseCount;
    let hotelCounter = property.hotelCount;
    if (hotelCounter === 1) {return null;}
    if (houseCounter < 4) {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${property}/houses`;
    } else {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${property}/hotel`;
    }
    fetchFromServer(link, 'POST')
        .then(response => {
            console.log(response);
        });
}
//removeBuildings(e.target.closest("#main-tile-deed").dataset.name);
function removeBuildings(propertyName) {
    const player = getPlayerObject(_currentGame, playerName);
    const property = player.properties.find(property => property === propertyName);
    let link = ``;
    let message = ``;
    let houseCounter = property.houseCount;
    let hotelCounter = property.hotelCount;
    if (houseCounter === 0) {return null;}
    if (hotelCounter === 0) {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${property}/houses`;
        message = "sold a house";
    } else {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${property}/hotel`;
        message = "sold a hotel";
    }
    fetchFromServer(link, 'DELETE')
        .then(response => {
            console.log(response);
            console.log(`${_gameData.playerName} ` + message);
        });
}

