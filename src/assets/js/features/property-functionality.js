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

    addGetOutOfJailCards(player);
}

function addGetOutOfJailCards(player){
    let amountOfGetOutOfJailCards = player.getOutOfJailFreeCards;

    const $jailCardsCont = document.querySelector("#properties-container [data-streettype='jailcards'] ul");

    $jailCardsCont.insertAdjacentHTML("beforeend",
        `<li data-name="jailcards">
                    <img src="../images/deeds/Get_Out_Of_Jail_Card.jpg" title="Get Out Of Jail Card" alt="Get Out Of Jail Card">
              </li>
              <li data-name="jailcards">
                <p>${amountOfGetOutOfJailCards}</p>
              </li>`);

        if(amountOfGetOutOfJailCards > 0)
    {
        const $jailCard = document.querySelector('#properties-container ul li[data-name="jailcards"]');
        $jailCard.classList.add("owned");
    }
}

function buyProperty(propertyName) {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}`, 'POST')
        .then(result => {
            console.log(result);
            addErrorAndSuccessfulMessage(`You bought the property ${result.property}.`);
            manageGame();
        })
        .catch(errorHandler);
}

function dontBuyProperty(propertyName) {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}`, 'DELETE')
        .then(result => {
            console.log(result);
            addErrorAndSuccessfulMessage(`You didn't buy the property ${result.property}.`);
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
                        addErrorAndSuccessfulMessage("You collected your rent.");
                        manageGame();
                    })
                    .catch(errorHandler);
            }
            else{
                addErrorAndSuccessfulMessage("You can't get rent from a player.");
            }
        }
    });
}

function manageProperty(e) {
    const $main = document.querySelector("main");
    const $article = $main.querySelector("article");
    if ($article == null ||($article.id !== "properties" && e.target.nodeName.toLowerCase() !== "img")) {
        return;
    }

    const tile = getTile(e.target.closest("li").dataset.name);
    //const owned = getPlayerObject(_currentGameState, _gameData.playerName).properties.find(property => property.property === _gameData.playerName.tile.name);
    const owned = e.target.closest("li").classList.contains("owned");
    if (!owned) {
        return;
    }

    $main.innerHTML = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements.showDeedCard);
    const $deed = $main.querySelector("#deedCard");
    const $deedImg = $deed.querySelector("img");
    $deed.querySelector("h2").innerText = tile.name;
    $deed.dataset.name = tile.name;
    $deedImg.setAttribute("src", `../images/deeds/${tile.nameAsPathParameter}.jpg`);
    $deedImg.setAttribute("alt", `${tile.name}`);
    $deedImg.setAttribute("title", `${tile.name}`);
    const color = tile.streetColor;
    $deed.querySelector("#manageStreet").addEventListener("click", function () {
        houseManager(color, tile);
    });
}

function houseManager(color, tempTile) {
    const $main = document.querySelector("main");
    $main.innerHTML = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements.manageHouses);
    $main.querySelector("#manageHouses").insertAdjacentHTML('beforeend', `<h2>Remaining house: ${_currentGameState.availableHouses}</h2>`);
    $main.querySelector("#manageHouses").insertAdjacentHTML('beforeend', `<h2>Remaining hotels: ${_currentGameState.availableHotels}</h2>`);

    $main.querySelector("#selectedStreet").insertAdjacentHTML('beforeend',`<h2>${tempTile.name}</h2>`);
    $main.querySelector("#selectedStreet").insertAdjacentHTML('beforeend', `<img src="../images/deeds/${tempTile.nameAsPathParameter}.jpg" alt="${tempTile.name}"/>`);
    //TODO insert images of all streets in container (greyed out if not owned)
    //TODO when all are owned add buy and sell buttons.
    const $container = $main.querySelector("#fullStreet ul");
    const tiles = getTilesByColor(color);
    let selectedStreet = tempTile;
    //const owned = getPlayerObject(_currentGameState, _gameData.playerName).properties.find(property => property.property === _gameData.playerName.item.name);
    let allOwned = tiles.length;
    tiles.forEach (function (item) {
        $container.insertAdjacentHTML('beforeend', `<li data-name="${item.name}"><img src="../images/deeds/${item.nameAsPathParameter}.jpg" alt="${item.name} title="${item.name}"/></li>`);
        /*if (owned) {
            allOwned++;
        }*/
    });
    $main.querySelector("#fullStreet").addEventListener("click", changeSelection);
    if (allOwned === tiles.length) {
        document.querySelector("#selectedStreet").insertAdjacentHTML("beforeend", _htmlElements.alterHouses);
        document.querySelector("#buy-house").addEventListener("click", improveBuildings(selectedStreet));
        document.querySelector("#sell-house").addEventListener("click", removeBuildings(selectedStreet));
    }
}

function changeSelection (e) {
    const $main = document.querySelector("main");
    const tile = getTile(e.target.closest("li").dataset.name);
    $main.querySelector("#selectedStreet").innerHTML`<h2>${tile.name}</h2>`;
    $main.querySelector("#selectedStreet").setAttribute("src", `../images/deeds/${tile.nameAsPathParameter}.jpg`);
    $main.querySelector("#selectedStreet").setAttribute("alt", `${tile.name}`);
    $main.querySelector("#selectedStreet").setAttribute("title", `${tile.name}`);


}

function improveBuildings(propertyName) {
    const player = getPlayerObject(_currentGameState, _gameData.playerName);
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

