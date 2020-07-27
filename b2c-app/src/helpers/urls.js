import { POLICIES } from '../constants/policies';
import { QUERY_PARAMS } from '../constants/queryParams';
import * as QueryParamsService from '../services/QueryParamsService';

async function getB2CParameters() {

    const b2cParams = {
        clientId: await QueryParamsService.getQueryParam(QUERY_PARAMS.CLIENT_ID),
        redirectURI: await QueryParamsService.getQueryParam(QUERY_PARAMS.REDIRECT_URI),
        token: await QueryParamsService.getQueryParam(QUERY_PARAMS.ID_TOKEN_HINT)
    };

    return b2cParams;
}

export async function getB2CLink(policy) {

    const _policy = policy || POLICIES.SIGNIN_INVITATION;
    const { clientId, redirectURI, token } = await getB2CParameters();
    const b2cTenant = window.location.host.slice(0, window.location.host.indexOf('.'));

    let absolutePath = `https://${b2cTenant}.b2clogin.com/${b2cTenant}.onmicrosoft.com/oauth2/v2.0/` +
        `authorize?p=${_policy}&client_id=${clientId}&nonce=defaultNonce` +
        `&redirect_uri=${redirectURI}&scope=openid&response_type=id_token&prompt=login`;

    if (policy === POLICIES.RESEND_EMAIL && token) {
        absolutePath += `&id_token_hint=${token}`;
    }

    return absolutePath;

}

export function matchesPath(location, path) {
    return location.pathname.toUpperCase().search(`${path.toUpperCase()}/`) !== -1;
}

export function hasSearchParam(search, param, value) {
    if (search) {
        let paramFound = new URLSearchParams(search).get(param);
        if (paramFound && value) {
            return paramFound.toUpperCase() === value.toUpperCase();
        }
    }
}