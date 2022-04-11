"use strict";

let _tiles = null;
let _gameData =
    {
        playerName: null,
        gameID: null,
        token: null
    };

const _htmlElements =
    {
        rollDiceButton: "<button type=\"button\" id=\"roll-dice\">Roll Dice</button>",
        propertyView:
        `
        <article id="properties">
            <h2>Your properties</h2>
            <button type="button">&#10007;</button>
            <div id="properties-container">
                <article data-streettype="purple" class="two-cards">
                    <h3>Purple</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="darkblue" class="two-cards">
                    <h3>Darkblue</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="utilities" class="two-cards">
                    <h3>Utilities</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="lightblue">
                    <h3>Lightblue</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="violet">
                    <h3>Hotpink</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="orange">
                    <h3>Orange</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="red">
                    <h3>Red</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="yellow">
                    <h3>Yellow</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="darkgreen">
                    <h3>Darkgreen</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="railroad">
                    <h3>Railroad</h3>
                    <ul>
                    </ul>
                </article>
                <article data-streettype="jailcards">
                    <h3>Jailcards</h3>
                    <ul>
                    </ul>
                </article>
                <button type="button">Get rent</button>
            </div>
        </article>
        `,
        playerOverview:
        `
        <article id="other-player-overview">
            <h2>PlayerName</h2>
            <p>1500</p>
            <button type="button">Show Properties</button>
        </article>
        `,
        tileDeed:
        `
        <article id="main-tile-deed">
            <img src="../images/deeds/Atlantic.jpg" alt="Atlantic" title="Atlantic">
            <div>
                    <h2>DeedName</h2>
                    <p>Cost: <span id="main-deed-cost">100</span></p>
            </div>
        </article>
        `,
        tileDeedButtons:
        `<div>
                <button type="button" id="main-property-buy">Buy Property</button>
                <button type="button" id="main-property-auction">Auction property</button>
        </div>`
    };
