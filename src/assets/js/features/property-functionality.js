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
    });
}

function activateProperties(player)
{
    const $properties = document.querySelector('#properties');
    if ($properties.classList.contains("hidden"))
    {
        $properties.classList.remove("hidden");
        const $propertiesContainer = document.querySelectorAll('#properties-container ul li');
        $propertiesContainer.forEach($property =>
        {
            $property.classList.remove("owned");
        });

        player.properties.forEach(property =>
        {
            const $property = document.querySelector(`#properties-container ul li[data-name='${property.property}']`);
            $property.classList.add("owned");
        });
    }
    else
    {
        $properties.classList.add("hidden");
    }
}