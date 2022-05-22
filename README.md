# Monopoly web project group 17

## Functionality table
|PRIORITY  |ENDPOINT                                                                                                  |Client                | Client           
|--------|--------------------------------------------------------------------------------------------------------|----------------------|-----------------
|        |                                                                                                        |Visualize  ( HTML/CSS)|Consume API  (JS)
|        |**General Game and API Info**                                                                           |100%                  |YES/NO           
|        |GET /                                                                                                   |100%                  |YES                 
|MUSTHAVE|GET /tiles                                                                                              |100%                  |YES             
|MUSTHAVE|GET /tiles /{tileId}                                                                                    |100%                  |YES        
|        |GET /chance                                                                                             |100%                  |YES              
|        |GET /community-chest                                                                                    |100%                  |YES             
|        |                                                                                                        |                      |                 
|        |**Managing Games**                                                                                          |                      |             
|        |DELETE /games                                                                                           |0%                    |NO             
|MUSTHAVE|GET /games                                                                                              |100%                  |YES              
|        |Additional requirement: with filters                                                                    |100%                  |YES           
|MUSTHAVE|POST /games                                                                                             |100%                  |YES              
|MUSTHAVE|POST /games /{gameId} /players                                                                          |100%                  |YES              
|        |                                                                                                        |                      |                 
|        |Info                                                                                                    |                      |                 
|        |GET /games /dummy                                                                                       |0%                    |NO               
|MUSTHAVE|GET /games /{gameId}                                                                                    |100%                  |YES              
|        |                                                                                                        |                      |                 
|        |**Turn Management**                                                                                         |                      |             
|MUSTHAVE|POST /games /{gameId} /players /{playerName} /dice                                                      |100%                  |YES              
|        |With jail                                                                                               |100%                  |YES              
|MUSTHAVE|POST /games /{gameId} /players /{playerName} /bankruptcy                                                |100%                  |YES              
|        |Decent distribution of assets                                                                           |100%                  |YES              
|        |                                                                                                        |                      |                 
|        |**Tax Management**                                                                                          |                      |             
|        |POST /games /{gameId} /players /{playerName} /tax /estimate                                             |100%                  |YES              
|        |POST /games /{gameId} /players /{playerName} /tax /compute                                              |100%                  |YES             
|        |                                                                                                        |                      |                 
|        |**Buying property**                                                                                        |                      |              
|MUSTHAVE|POST /games /{gameId} /players /{playerName} /properties /{propertyName}                                |100%                  |YES              
|MUSTHAVE|DELETE /games /{gameId} /players /{playerName} /properties /{propertyName}                              |100%                  |YES             
|        |With 1 bank auction                                                                                     |0%                    |NO               
|        |                                                                                                        |                      |                 
|        |**Improving property**                                                                                      |                      |             
|        |POST /games /{gameId} /players /{playerName} /properties /{propertyName} /houses                        |100%                  |YES              
|        |DELETE /games /{gameId} /players /{playerName} /properties /{propertyName} /houses                      |100%                  |YES              
|        |POST /games /{gameId} /players /{playerName} /properties /{propertyName} /hotel                         |100%                  |YES              
|        |DELETE /games /{gameId} /players /{playerName} /properties /{propertyName} /hotel                       |100%                  |YES              
|        |                                                                                                        |                      |                 
|        |**Mortgage**                                                                                                |                      |             
|        |POST /games /{gameId} /players /{playerName} /properties /{propertyName} /mortgage                      |0%                    |NO               
|        |DELETE /games /{gameId} /players /{playerName} /properties /{propertyName} /mortgage                    |0%                    |NO                 
|        |                                                                                                        |                      |                 
|        |**Interaction with another player**                                                                         |                      |             
|MUSTHAVE|DELETE /games /{gameId} /players /{playerName} /properties /{propertyName} /visitors /{debtorName} /rent|100%                  |YES              
|        |With potential debt                                                                                     |100%                  |YES
|        |                                                                                                        |                      |                 
|        |**Prison**                                                                                                  |                      |             
|        |POST /games /{gameId} /prison /{playerName} /fine                                                       |100%                  |YES              
|        |POST /games /{gameId} /prison /{playerName} /free                                                       |100%                  |YES                   
|        |                                                                                                        |                      |                 
|        |**Auctions**                                                                                                |                      |             
|        |GET /games /{gameId} /bank /auctions                                                                    |0%                    |NO               
|        |POST /games /{gameId} /bank /auctions /{propertyName} /bid                                              |0%                    |NO               

## Known bugs
| Bug behaviour  | How to reproduce  | Why it hasn't been fixed    |
|---|---|---|
|A message can be removed from the container very quickly.|Not be the current player, after the current player has rolled the dice. The message stating the diceroll of the current player has to be visible. If you change for example tax behaviour, the message saying you changed appears, but can dissapear too quickly|Because of polling, we inject the turn and moves of the currentplayer into the main every poll. This makes it so we inject the diceroll, saved in this turn every poll as well. Because we don't want to delete the diceroll, we made it so it doesn't get deleted. The function that deletes messages does get fired with a timeout when inserting the turn into main. This way a message, other than a diceroll, could get deleted way too quickly. There was no easy and clean way to fix this with the time we had left.|