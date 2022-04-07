"use strict";

function switchVisibleDivs(idOfDivToHide, idOfDivToShow)
{
    document.querySelector(`#${idOfDivToHide}`).classList.add("hidden");
    document.querySelector(`#${idOfDivToShow}`).classList.remove("hidden");
}

function activateID(idToActivate, allIDs)
{
    allIDs.forEach(id =>
    {
        document.querySelector(`#${id}`).classList.add("hidden");
    });
    document.querySelector(`#${idToActivate}`).classList.remove("hidden");
}
