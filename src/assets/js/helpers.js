"use strict";

function switchVisibleDivs(idOfDivToHide, idOfDivToShow)
{
    document.querySelector(`#${idOfDivToHide}`).classList.add("hidden");
    document.querySelector(`#${idOfDivToShow}`).classList.remove("hidden");
}