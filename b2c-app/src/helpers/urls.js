import { POLICIES } from '../constants/policies';
import { QUERY_PARAMS } from '../constants/queryParams';
import * as ServerSideQueryParamsService from '../services/ServerSideQueryParamsService';

export function getB2CLink(policy) {

    //link to policy passed in or sign in by default
    const _policy = policy || POLICIES.SIGNIN_INVITATION;

    //get parameters required to build URL from query params (server side request)
    const tenantId = ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.TENANT_ID);
    const clientId = ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.CLIENT_ID);
    const redirectURI = ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.REDIRECT_URI);
    const token = ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.ID_TOKEN_HINT);

    let relativeUrl;

    if (tenantId && clientId && redirectURI) {

        relativeUrl = `/${tenantId}.onmicrosoft.com/oauth2/v2.0/` +
            `authorize?p=${_policy}&client_id=${clientId}&nonce=defaultNonce` +
            `&redirect_uri=${redirectURI}&scope=openid&response_type=id_token&prompt=login`;

        if (_policy === POLICIES.RESEND_EMAIL && token) {
            relativeUrl += `&id_token_hint=${token}`;
        }
    }

    return relativeUrl;

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