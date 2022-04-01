"use strict";

function fillProperties()
{
    const $propertiesContainer = document.querySelector("#properties-container");
    const $railroadContainer = $propertiesContainer.querySelector("[data-streettype='railroad']");
    const $utilitiesContainer = $propertiesContainer.querySelector("[data-streettype='utilities']");

    _tiles.forEach(tile =>
    {
        switch (tile.type)
        {
            case "street":
                const $container = $propertiesContainer.querySelector(`[data-streettype='${tile.streetColor.toLowerCase()}']`);
                $container.insertAdjacentHTML('beforeend', `<img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/>`);
                break;
            case "railroad":
                $railroadContainer.insertAdjacentHTML('beforeend', `<img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/>`);
                break;
            case "utility":
                $utilitiesContainer.insertAdjacentHTML('beforeend', `<img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/>`);
                break;
            default:
                console.log("something else");
                break;
        }
    });
}
