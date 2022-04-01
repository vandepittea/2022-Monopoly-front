"use strict";

function fillProperties()
{
    const $propertiesCont = document.querySelector("#properties-container");
    const $railroadCont = $propertiesCont.querySelector("[data-streettype='railroad'] ul");
    const $utilitiesCont = $propertiesCont.querySelector("[data-streettype='utilities'] ul");

    _tiles.forEach(tile =>
    {
        switch (tile.type)
        {
            case "street":
                const $container = $propertiesCont.querySelector(`[data-streettype='${tile.streetColor.toLowerCase()}'] ul`);
                $container.insertAdjacentHTML('beforeend', `<li data-name="${tile.name}"><img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
                break;
            case "railroad":
                $railroadCont.insertAdjacentHTML('beforeend', `<li data-name="${tile.name}"><img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
                break;
            case "utility":
                $utilitiesCont.insertAdjacentHTML('beforeend', `<li data-name="${tile.name}"><img src="../images/tiles/${tile.nameAsPathParameter}.jpg" alt="${tile.name}"/></li>`);
                break;
            default:
                console.log("something else");
                break;
        }
    });
}

function activateProperties(player)
{
    const $properties = document.querySelectorAll('#properties-container ul li');
    $properties.forEach($property =>
    {
        $property.classList.remove("owned");
    });

    player.properties.forEach(property =>
    {
        const $property = document.querySelector(`#properties-container ul li[data-name='${property.property}']`);
        $property.classList.add("owned");
    });
}
