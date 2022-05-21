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
        rollDiceButton: `<article id="dice">
                                <img src="../images/dice.png" alt="dice" title="dice">
                                <button type=\"button\" id=\"roll-dice\">Roll Dice</button>
                         </article>`,
        propertyView:
            `
            <article id="properties">
                <h2>Your properties</h2>
                <button type="button" id="close-screen">&#10007;</button>
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
                </div>
            </article>
            `,
        propertyInSmallContainer:
            `
                <div class="partially-of-screen">
                        <div class="partially-of-screen-images">
                               <img src="" title="" alt="">
                        </div>
                 </div>
            `,
        rentButton: "<button type=\"button\" id=\"collect-rent\">Get rent</button>",
        playerOverview:
            `
            <article id="other-player-overview">
                <div>
                    <button type="button" id="close-screen">&#10007;</button>
                    <img src="../images/characters/waluigi.webp" alt="Waluigi" title="Waluigi"/>
                    <h2>PlayerName</h2>
                </div>
                <div>
                    <h3>1500</h3>
                    <button type="button" id="other-player-overview-property">Properties</button>
                </div>
            </article>
            `,
        tileDeed:
            `
            <article id="main-tile-deed" data-name="Atlantic">
                <img src="../images/deeds/Atlantic.jpg" alt="Atlantic" title="Atlantic">
                <div>
                    <h2>DeedName</h2>
                    <p>Price: <span>100</span> coins</p>
                </div>
            </article>
            `,
        tileDeedButtons:
            `
            <div>
                <button type="button" id="main-property-buy">Buy property</button>
                <button type="button" id="main-property-auction">Don't buy property</button>
            </div>
            `,
        playerAction:
            `
            <article id="player-action">
                <div>
                    <img src="../images/deeds/Atlantic.jpg" alt="Atlantic" title="Atlantic">
                </div>
                <div>
                    <h2>TileName</h2>
                    <p>Description</p>
                </div>                    
            </article>
            `,
        jail:
         `<article id="jail-choices">
                <h2>You are in jail :'-(</h2>
                <button type="button" id="roll-dice">Roll Dice</button>
                <button type="button" id="pay-fine">Pay Fine</button>
          </article>
         `,
        possibleTiles:
            `
            <div>
                <img src="" alt="" title="">
                <div></div>
            </div>
            `
    };
