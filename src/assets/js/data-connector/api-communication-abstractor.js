"use strict";

function fetchFromServer(path, httpVerb, requestBody){
    const options = constructOptions(httpVerb, requestBody);

    return fetch(`${_config.getAPIUrl()}${path}`, options)
        .then((response) => {
            if (!response.ok) {
                generateVisualAPIErrorInConsole();
                throw response;
            }
            return response.json();
        })
        .then((jsonresponsetoparse) => {
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

    if(_config.token !== null) {
        options.headers["Authorization"] = "Bearer " + _config.token.token;
    }
    // Don't forget to add data to the body when needed
    options.body = JSON.stringify(requestBody);
    return options;
}

