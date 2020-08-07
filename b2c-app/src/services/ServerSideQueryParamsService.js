let queryParams;

//function that retrieves the query params we get from B2C (in server side)
function init() {
    try {
        queryParams = JSON.parse(window.SERVER_SIDE_QUERY_STRING);
    } catch (e) {
        queryParams = {};
    }
}

export function getQueryParam(id) {
    if (!queryParams) {
        //query params from server side haven't been initialised (parsed) yet
        init();
    }
    return queryParams[id];
} 