"use strict";

function fillProperties()
{
    const $propertiesContainer = document.querySelector("#properties-container");
    const $railroadContainer = $propertiesContainer.querySelector("[data-streettype='railroad'] ul");
    const $utilitiesContainer = $propertiesContainer.querySelector("[data-streettype='utilities'] ul");

    _tiles.forEach(tile =>
    {
        switch (tile.type)
        {
            case "street":
                const $container = $propertiesContainer.querySelector(`[data-streettype='${tile.streetColor.toLowerCase()}'] ul`);
                $container.insertAdjacentHTML('beforeend', `<li><img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
                break;
            case "railroad":
                $railroadContainer.insertAdjacentHTML('beforeend', `<li><img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
                break;
            case "utility":
                $utilitiesContainer.insertAdjacentHTML('beforeend', `<li><img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
                break;
            default:
                console.log("something else");
                break;
        }
    });
}
