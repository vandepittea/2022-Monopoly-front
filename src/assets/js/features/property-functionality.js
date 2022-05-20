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
    const $article = e.target.closest("article");
    if ($article == null ||(!$article.hasAttribute("data-streettype") && (e.target.nodeName.toLowerCase() !== "img"))) {
        return;
    }
    if ($article.id === "property-manager") {
        return;
    }
    if(e.target.closest("#properties").querySelector("h2").innerText.split("'")[0] !== _gameData.playerName) {
        return;
    }

    $article.id = "property-manager";
    $article.insertAdjacentHTML("afterbegin", `<button type="button" id="close-screen">&#10007;</button>`);
    $article.querySelectorAll("li").forEach(item => {
        const player = getPlayerObject(_currentGameState, _gameData.playerName);
        const property = getPlayerProperty(player, item.dataset.name);

        let houseCount = 0;
        let hotelCount = 0;

        if (property !== undefined) {
            houseCount = property.houseCount;
            hotelCount = property.hotelCount;
        }

        item.insertAdjacentHTML("beforeend", `<p>Houses: ${houseCount}</p>`);
        item.insertAdjacentHTML("beforeend", `<p>Hotels: ${hotelCount}</p>`);
    });
    $article.insertAdjacentHTML("beforeend", _htmlElements.manageHouseButtons);

    const $main = document.querySelector("main");
    $main.innerText = "";
    $main.insertAdjacentElement("afterbegin", $article);
    $main.querySelector("#close-screen").addEventListener("click", clearMain);
}

function selectPropertyToImprove(e) {
    const $article = e.target.closest("article");
    if ((e.target.nodeName.toLowerCase() !== "img") || ($article.id !== "property-manager")) {
        return;
    }

    $article.querySelectorAll("li").forEach($image => $image.classList.remove("selected"));
    e.target.closest("li").classList.add("selected");
}

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

