import { ACTIONS } from '../constants/actions';
import { POLICIES } from '../constants/policies';

export function getB2CLink(action) {

    const clientId = '488c321f-10e4-48f2-b9c2-261e2add2f8d';

    //Find out values for redirect URI and B2C tenant to be added to the resulting link URL
    let queryParams = (new URL(document.location)).searchParams;
    let redirectURI = queryParams.get("redirect_uri") || 'https://jwt.ms';
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