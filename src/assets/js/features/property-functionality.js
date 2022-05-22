"use strict";

function fillProperties() {
    const $main = document.querySelector("main");
    $main.insertAdjacentHTML("beforeend", _htmlElements.propertyView);

    const $propertiesContainer = document.querySelector("#properties-container");
    const $railroadContainer = $propertiesContainer.querySelector(`[data-streettype="railroad"] ul`);
    const $utilitiesContainer = $propertiesContainer.querySelector(`[data-streettype="utilities"] ul`);

    _tiles.forEach(tile => {
        addTileToCorrectPropertyGroupContainer(tile, $propertiesContainer, $railroadContainer, $utilitiesContainer);
    });

    _htmlElements.propertyView = $main.innerHTML;
    $main.innerHTML = "";
}

function addTileToCorrectPropertyGroupContainer(tile, $propertiesContainer, $railroadContainer, $utilitiesContainer) {
    switch (tile.type) {
        case "STREET":
            const $propertyListContainer = $propertiesContainer.querySelector(`[data-streettype="${tile.streetColor.toLowerCase()}"] ul`);
            $propertyListContainer.insertAdjacentHTML("beforeend", _htmlElements.onePropertyInPropertyView);

            fillInPropertyDetails($propertyListContainer, tile);
            break;
        case "RAILROAD":
            $railroadContainer.insertAdjacentHTML("beforeend", _htmlElements.onePropertyInPropertyView);

            fillInPropertyDetails($railroadContainer, tile);
            break;
        case "UTILITY":
            $utilitiesContainer.insertAdjacentHTML("beforeend", _htmlElements.onePropertyInPropertyView);

            fillInPropertyDetails($utilitiesContainer, tile);
            break;
        default:
            break;
    }
}

function fillInPropertyDetails($propertyListContainer, tile){
    const $lastInsertedProperty = $propertyListContainer.lastElementChild;

    $lastInsertedProperty.dataset.name = tile.name;

    const $image = $lastInsertedProperty.querySelector("img");
    $image.setAttribute("src", `../images/deeds/${tile.nameAsPathParameter}.jpg`);
    $image.setAttribute("alt", tile.name);
    $image.setAttribute("title", tile.name);
}

function activateCurrentPlayersProperties() {
    activateProperties(getPlayerObject(_currentGameState, _gameData.playerName));

    document.querySelector("#properties-container").insertAdjacentHTML("beforeend", _htmlElements.rentButton);
    document.querySelector("main #collect-rent").addEventListener("click", () => collectRent(_currentGameState));
    document.querySelector("#properties-container").addEventListener("click", manageProperty);
}

function activateOtherPlayerProperties(e) {
    const player = getPlayerObject(_currentGameState, e.target.closest("article").dataset.player);
    activateProperties(player);
}

function activateProperties(player) {
    toggleVisibilityByID(_divsToToggle, true);

    const $main = document.querySelector("main");
    $main.innerText = "";

    $main.insertAdjacentHTML("beforeend", _htmlElements.propertyView);
    $main.querySelector("#close-screen").addEventListener("click", clearMain);
    $main.querySelector("#properties h2").innerText = `${player.name}'s properties`;

    placeOwnedPropertiesInColor(player);
    addGetOutOfJailCards(player);
}

function placeOwnedPropertiesInColor(player){
    const $propertiesContainer = document.querySelectorAll("#properties-container ul li");
    $propertiesContainer.forEach($property => {
        $property.classList.remove("owned");
    });

    player.properties.forEach(property => {
        const $property = document.querySelector(`#properties-container ul li[data-name="${property.property}"]`);
        $property.classList.add("owned");
    });
}

function addGetOutOfJailCards(player){
    const amountOfGetOutOfJailCards = player.getOutOfJailFreeCards;
    const $jailCardsContainer = document.querySelector(`#properties-container [data-streettype="jailcards"] ul`);

    $jailCardsContainer.insertAdjacentHTML("beforeend",_htmlElements.jailCardInPropertyView);
    $jailCardsContainer.querySelector("p").innerText = amountOfGetOutOfJailCards;

    whenYouHaveAJailCardColorTheCard(amountOfGetOutOfJailCards);
}

function whenYouHaveAJailCardColorTheCard(amountOfGetOutOfJailCards){
    if(amountOfGetOutOfJailCards > 0)
    {
        const $jailCard = document.querySelector(`#properties-container ul li[data-name="jailcards"]`);
        $jailCard.classList.add("owned");
    }
}

function buyProperty(propertyName) {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}`, "POST")
        .then(result => {
            addErrorAndSuccessfulMessage(`You bought the property ${result.property}.`);
            manageGame();
        })
        .catch(errorHandler);
}

function dontBuyProperty(propertyName) {
    fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}`, "DELETE")
        .then(result => {
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

            sendCollectRentRequestToTheAPI(property, player);
        }
    });
}

function sendCollectRentRequestToTheAPI(property, player){
    if(property != null){
        const propertyPathParameter = getTile(property.property).nameAsPathParameter;

        fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyPathParameter}/visitors/${player.name}/rent`, "DELETE")
            .then(response => {
                addErrorAndSuccessfulMessage("You collected your rent.");
                manageGame();
            })
            .catch(errorHandler);
    }
    else{
        addErrorAndSuccessfulMessage("You can't get rent from a player.");
    }
}

function manageProperty(e) {
    const $article = e.target.closest("article");
    const $main = document.querySelector("main");

    $main.innerHTML = `<div id="properties-container"></div>`;
    document.querySelector("#properties-container").addEventListener("click", selectPropertyToImprove);
    const $propertyContainer = $main.querySelector("div");

    if (checkIfThePropertyManagerIsAllowedToOpen(e, $article)) {
        $article.id = "property-manager";

        injectStreetWithHouseAndHotelCount($propertyContainer, $article);

        $main.querySelector("#close-screen").addEventListener("click", activateCurrentPlayersProperties);
        $main.querySelector("#selected-property-improve").addEventListener("click", improveBuildings);
        $main.querySelector("#selected-property-remove").addEventListener("click", removeBuildings);
    }
}

function checkIfThePropertyManagerIsAllowedToOpen(e, $article){
    if(($article !== null) && ($article.id !== "property-manager")){
        if(($article.hasAttribute("data-streettype")) && ($article.dataset.streettype !== "railroad") && ($article.dataset.streettype !== "jailcards")){
            if(e.target.closest("#properties").querySelector("h2").innerText.split("'")[0] === _gameData.playerName){
                return true;
            }
        }
    }
    return false;
}

function checkIfItIsAnElementInsideThePropertyManager(e, elementName, $article){
    return (e.target.nodeName.toLowerCase() === elementName) && ($article.id === "property-manager");

}

function injectStreetWithHouseAndHotelCount($propertyContainer, $article){
    $article.insertAdjacentHTML("afterbegin", `<button type="button" id="close-screen">&#10007;</button>`);

    $article.querySelectorAll("li").forEach(item => {
        injectOnePropertyInTheStreetWithHouseAndHotelCount(item);
    });

    $article.insertAdjacentHTML("beforeend", _htmlElements.manageHouseButtons);

    $propertyContainer.insertAdjacentElement("afterbegin", $article);
}

function injectOnePropertyInTheStreetWithHouseAndHotelCount(item){
    const player = getPlayerObject(_currentGameState, _gameData.playerName);
    const property = getPlayerProperty(player, item.dataset.name);

    let houseCount = 0;
    let hotelCount = 0;

    if (property !== undefined) {
        houseCount = property.houseCount;
        hotelCount = property.hotelCount;
    }

    item.insertAdjacentHTML("beforeend", `<p>Houses: <span id="house-count">${houseCount}</span></p>`);
    item.insertAdjacentHTML("beforeend", `<p>Hotels: <span id="hotel-count">${hotelCount}</span></p>`);
}

function selectPropertyToImprove(e) {
    const $article = e.target.closest("article");

    if (checkIfItIsAnElementInsideThePropertyManager(e, "img", $article)) {
        $article.querySelectorAll("li").forEach($image => $image.classList.remove("selected"));

        e.target.closest("li").classList.add("selected");
    }
}

function getHouseCountOutOfHtml($item){
    return parseInt($item.querySelector("#house-count").innerText);
}

function getHotelCountOutOfHtml($item){
    return parseInt($item.querySelector("#hotel-count").innerText);
}

function setHouseCountInHtml($item, response){
    $item.querySelector("#house-count").innerText = response.houses;
}

function setHotelCountInHtml($item, response){
    $item.querySelector("#hotel-count").innerText = response.hotels;
    if (response.hotels === 0) {
        $item.querySelector("#house-count").innerText = 4;
    }
}

function improveBuildings(e) {
    const $article = e.target.closest("article");

    if (checkIfItIsAnElementInsideThePropertyManager(e, "button", $article)) {
        $article.querySelectorAll("li").forEach($item => {
            if ($item.classList.contains("selected")) {
                const houseCounter = getHouseCountOutOfHtml($item);
                const hotelCounter = getHotelCountOutOfHtml($item);

                if (hotelCounter === 1) {
                    addErrorAndSuccessfulMessage("You can't build more than one hotel on a property.");
                }

                buyHotelOrHouse($item, houseCounter);
            }
        });
    }
}

function buyHotelOrHouse($item, houseCounter){
    const propertyName = getTile($item.dataset.name).nameAsPathParameter;

    const link = decideBuyingHotelOrHouse(propertyName, houseCounter);

    fetchFromServer(link, "POST")
        .then(response => {
            if (houseCounter < 4) {
                setHouseCountInHtml($item, response);
            } else {
                setHotelCountInHtml($item, response);
            }
        })
        .catch(errorHandler);
}

function decideBuyingHotelOrHouse(propertyName, houseCounter){
    let link = "";

    if (houseCounter < 4) {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}/houses`;
    } else {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}/hotel`;
    }

    return link;
}

function removeBuildings(e) {
    const $article = e.target.closest("article");

    if (checkIfItIsAnElementInsideThePropertyManager(e, "button", $article)) {
        $article.querySelectorAll("li").forEach($item => {
            if ($item.classList.contains("selected")) {
                const hotelCounter = getHotelCountOutOfHtml($item);

                sellHotelOrHouse($item, hotelCounter);
            }
        });
    }
}

function sellHotelOrHouse($item, hotelCounter){
    const propertyName = getTile($item.dataset.name).nameAsPathParameter;

    const link = decideSellingHotelOrHouse(propertyName, hotelCounter);

    fetchFromServer(link, 'DELETE')
        .then(response => {
            if (hotelCounter > 0) {
                setHotelCountInHtml($item, response);
            } else {
                setHouseCountInHtml($item, response);
            }
        })
        .catch(errorHandler);
}

function decideSellingHotelOrHouse(propertyName, hotelCounter){
    let link = "";

    if (hotelCounter > 0) {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}/hotel`;
    } else {
        link = `/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyName}/houses`;
    }

    return link;
}
