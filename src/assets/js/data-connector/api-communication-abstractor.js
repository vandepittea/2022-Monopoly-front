"use strict";

function fetchFromServer(path, httpVerb, requestBody){
    const options = constructOptions(httpVerb, requestBody);

    return fetch(`${_config.getAPIUrl()}${path}`, options)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponseToParse) => {
            if (jsonResponseToParse.failure)
            {
                generateVisualAPIErrorInConsole();
                throw jsonResponseToParse;
            }
            return jsonResponseToParse;
        });
}

function constructOptions(httpVerb, requestBody){
    const options=
        {
            method: httpVerb,
            headers: {},
        };

    options.headers["Content-Type"] = "application/json";

    if(_gameData.token !== null) {
        options.headers["Authorization"] = "Bearer " + _gameData.token.token;
    }

    options.body = JSON.stringify(requestBody);

    return options;
}

