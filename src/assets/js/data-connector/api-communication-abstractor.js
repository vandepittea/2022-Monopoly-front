"use strict";

function fetchFromServer(path, httpVerb, requestBody){
    const options = constructOptions(httpVerb, requestBody);

    return fetch(`${_config.getAPIUrl()}${path}`, options)
        .then((response) => {
            return response.json();
        })
        .then((jsonresponsetoparse) => {
            if (jsonresponsetoparse.failure)
            {
                generateVisualAPIErrorInConsole();
                throw jsonresponsetoparse;
            }
            return jsonresponsetoparse;
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
    // Don't forget to add data to the body when needed
    options.body = JSON.stringify(requestBody);
    return options;
}

