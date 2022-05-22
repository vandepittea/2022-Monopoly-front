"use strict";

function fillProperties() {
    const $main = document.querySelector("main");
    $main.insertAdjacentHTML("beforeend", _htmlElements.propertyView);

    const $propertiesContainer = document.querySelector("#properties-container");
    const $railroadContainer = $propertiesContainer.querySelector("[data-streettype='railroad'] ul");
    const $utilitiesContainer = $propertiesContainer.querySelector("[data-streettype='utilities'] ul");

    _tiles.forEach(tile => {
        addTileToCorrectPropertyGroupContainer(tile, $propertiesContainer, $railroadContainer, $utilitiesContainer);
    });

    _htmlElements.propertyView = $main.innerHTML;
    $main.innerHTML = "";
}

function addTileToCorrectPropertyGroupContainer(tile, $propertiesContainer, $railroadContainer, $utilitiesContainer) {
    switch (tile.type) {
        case "STREET":
            const $propertyListContainer = $propertiesContainer.querySelector(`[data-streettype='${tile.streetColor.toLowerCase()}'] ul`);
            $propertyListContainer.insertAdjacentHTML('beforeend', _htmlElements.onePropertyInPropertyView);

            fillInPropertyDetails($propertyListContainer, tile);
            break;
        case "RAILROAD":
            $railroadContainer.insertAdjacentHTML('beforeend', _htmlElements.onePropertyInPropertyView);

            fillInPropertyDetails($railroadContainer, tile);
            break;
        case "UTILITY":
            $utilitiesContainer.insertAdjacentHTML('beforeend', _htmlElements.onePropertyInPropertyView);

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
    $main.innerText = "";
    $main.insertAdjacentHTML("beforeend", _htmlElements.propertyView);
    $main.querySelector("#close-screen").addEventListener("click", clearMain);
    $main.querySelector("#properties h2").innerText = `${player.name}'s properties`;

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
    const amountOfGetOutOfJailCards = player.getOutOfJailFreeCards;

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
                const propertyPathParam = getTile(property.property).nameAsPathParameter;
                fetchFromServer(`/games/${_gameData.gameID}/players/${_gameData.playerName}/properties/${propertyPathParam}/visitors/${player.name}/rent`, 'DELETE')
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
