import { ACTIONS } from '../constants/actions';
import { POLICIES } from '../constants/policies';

import Dexie from 'dexie';

const CLIENT_ID = {
    queryParamsId: 'client_id',
    storedId: 'clientId'
}

const REDIRECT_URI = {
    queryParamsId: 'redirect_uri',
    storedId: 'redirectURI'
}

//initialise database
const db = new Dexie('B2C_query_params');
//create stores for client id and redirect uri
db.version(1).stores({
    [CLIENT_ID.storedId]: `,${CLIENT_ID.storedId}`,
    [REDIRECT_URI.storedId]: `,${REDIRECT_URI.storedId}`
});

//function to store values in the DB, always reusing item in index 0, not storing more values
function storeParam(key, value) {
    db[key].put({ [key]: value }, 0);
}

//function to retrieve values from the DB, always getting index 0
async function retrieveParam(key) {
    return db[key].get(0);
}

async function getB2CParameters() {

    let queryParams = (new URL(document.location)).searchParams;

    let retrievedClientId = queryParams.get(CLIENT_ID.queryParamsId);
    let retrievedRedirectURI = queryParams.get(REDIRECT_URI.queryParamsId);

    //if value is in query params, store it
    if (retrievedClientId) {
        storeParam(CLIENT_ID.storedId, retrievedClientId);
    }
    //otherwise get it from indexedDB
    else {
        retrievedClientId = await retrieveParam(CLIENT_ID.storedId,);
    }

    //if value is in query params, store it
    if (retrievedRedirectURI) {
        storeParam(REDIRECT_URI.storedId, retrievedRedirectURI);
    }
    //otherwise get it from indexedDB
    else {
        retrievedRedirectURI = await retrieveParam(REDIRECT_URI.storedId);
    }

    const b2cParams = {
        clientId: retrievedClientId,
        redirectURI: retrievedRedirectURI
    };

    return b2cParams;
}

export async function getB2CLink(action) {

    const { clientId, redirectURI } = await getB2CParameters();

    let b2cTenant = window.location.host.slice(0, window.location.host.indexOf('.'));

    let actionURL;

    switch (action) {
        case ACTIONS.SIGNUP:
            actionURL = POLICIES.ACCOUNT_SIGNUP;
            break;
        case ACTIONS.LOGIN:
            actionURL = POLICIES.SIGNIN_INVITATION;
            break;
        case ACTIONS.RESET_PASSWORD:
            actionURL = POLICIES.PASSWORD_RESET;
            break;
        case ACTIONS.FIND_EMAIL:
            actionURL = POLICIES.FIND_EMAIL;
            break;
        case ACTIONS.RESEND_ACTIVATION_EMAIL:
            //TODO this parameter will need to be updated to final value (when B2C-100 is done)
            actionURL = 'B2C_1A_resendEmail';
            break;
        default:
            //point to login page by default
            actionURL = POLICIES.SIGNIN_INVITATION;
            break;
    }

    let absolutePath = `https://${b2cTenant}.b2clogin.com/${b2cTenant}.onmicrosoft.com/oauth2/v2.0/` +
        `authorize?p=${actionURL}&client_id=${clientId}&nonce=defaultNonce` +
        `&redirect_uri=${redirectURI}&scope=openid&response_type=id_token&prompt=login`;

    return absolutePath;

}

export function matchesPath(location, path) {
    return location.pathname.search(`${path}/`) !== -1;
}

export function hasSearchParam(search, param, value) {
    return new URLSearchParams(search).get(param) === value;
}