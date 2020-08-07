import Dexie from 'dexie';

import { QUERY_PARAMS } from '../constants/queryParams';


const db = new Dexie('B2C_query_params');

//create stores for client id and redirect uri
db.version(5).stores({
    [QUERY_PARAMS.CLIENT_ID]: '',
    [QUERY_PARAMS.REDIRECT_URI]: '',
    [QUERY_PARAMS.ID_TOKEN_HINT]: ''
});

const queryParams = {}

function setQueryParam(id) {
    let currentQueryParams = new URLSearchParams(window.location.search);
    let value = currentQueryParams.get(id);
    if (value) {
        queryParams[id] = value;
        storeParam(id, value);
    }
}

//function to store values in the DB, always reusing item in index 0, not storing more values
function storeParam(key, value) {
    db[key].put(value, 0);
}

//function to retrieve values from the DB, always getting index 0
async function retrieveParam(key) {
    if (db[key]) {
        return db[key].get(0);
    }
}


//function that retrieves the query params we need to persist
export function init() {
    Object.keys(QUERY_PARAMS).forEach((key) => {
        setQueryParam(QUERY_PARAMS[key]);
    });
}


export async function getQueryParam(id) {
    queryParams[id] = queryParams[id] || await retrieveParam(id);
    return queryParams[id];
}