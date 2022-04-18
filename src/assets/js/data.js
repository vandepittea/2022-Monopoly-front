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
            </div>
        </article>
        `,
        rentButton: "<button type=\"button\" id=\"collect-rent\">Get rent</button>",
        playerOverview:
            `
        <article id="other-player-overview">
            <div>
                    <button type="button">&#10007;</button>
                    <img src="../images/characters/waluigi.webp" alt="Waluigi" title="Waluigi"/>
                    <h2>PlayerName</h2>
            </div>
            <div>
                    <h3>1500</h3>
                    <button type="button" id="other-player-overview-property">Properties</button>
                    <button type="button" id="other-player-overview-trade">Trade</button>
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
            `<div>
                <button type="button" id="main-property-buy">Buy property</button>
                <button type="button" id="main-property-auction">Don't buy property</button>
        </div>`,
        auctionTable:
        `
            <table id="ongoingAuctions">
                <thead>
                <tr>
                    <th>Auction host</th>
                    <th>Auctioned Property</th>
                    <th>Current Price</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    <!-- This is test data for table layout -->
                    <tr>
                        <td>Mr. Random</td>
                        <td>Uw moeder</td>
                        <td><img src="../images/coin.png" alt="Coin" title="Coin" id="coin"/>69</td>
                        <td><button id="joinAuction1" type="button">Join Auction</button></td>
                    </tr>
                </tbody>
            </table>
            `,
        playerAction:
            `
        <article>
            <h2>TileName</h2>
            <img src="../images/deeds/Atlantic.jpg" alt="Atlantic" title="Atlantic">
            <p>Description</p>
        </article>
        `
        ,
        auctionTable:
            `
                <article id="ongoing-auctions">
                    <table>
                        <thead>
                        <tr>
                            <th>Auction host</th>
                            <th>Auctioned Property</th>
                            <th>Current Price</th>
                            <th><button type="button">&#10007;</button></th>
                        </tr>
                        </thead>
                        <tbody>
                            <!-- This is test data for table layout -->
                            <tr>
                                <td>Marika</td>
                                <td>Leyndell Capital</td>
                                <td><img src="../images/coin.png" alt="Coin" title="Coin" id="coin"/>69</td>
                                <td><button id="join-auction" type="button">Join Auction</button></td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            
            `
    };
