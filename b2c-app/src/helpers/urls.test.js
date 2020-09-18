import { matchesPath, hasSearchParam, getB2CLink } from './urls';
import { POLICIES } from '../constants/policies';
import { QUERY_PARAMS } from '../constants/queryParams';

import * as ServerSideQueryParamsService from './../services/ServerSideQueryParamsService';
jest.mock('./../services/ServerSideQueryParamsService');

import { JSDOM } from "jsdom";

describe('when searching for a match in the location URL', () => {

    beforeEach(() => {
        delete window.location;
        window.location = {
            pathname: 'test_path/',
        };
    });

    it('returns false if path is not found', () => {
        expect(matchesPath(window.location, 'another_path')).toBe(false);
    });

    it('returns true if path is found', () => {
        expect(matchesPath(window.location, 'test_path')).toBe(true);
    });
});

describe('when looking for a param in the query params', () => {

    let queryString;
    beforeEach(() => {
        queryString = '?param1=value1&param2=value2';
    });

    it('returns falsy if search is not provided', () => {
        expect(hasSearchParam()).toBeFalsy();
    });

    it('returns falsy if param is not found', () => {
        expect(hasSearchParam(queryString, 'param3')).toBeFalsy();
    });

    it('returns false if search is found but value does not match', () => {
        expect(hasSearchParam(queryString, 'param1', 'value2')).toBe(false);
    });

    it('returns true if param is found and value matches', () => {
        expect(hasSearchParam(queryString, 'param1', 'value1')).toBe(true);
    });
});

describe('when building the URL for a link that points to a B2C policy', () => {

    let mockReturnValue;
    beforeEach(() => {
        //mock QueryParamsService getQueryParam to always resolve with return mocked value
        mockReturnValue = 'test_value';
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(mockReturnValue);
    });

    it('returns URL with policy set by default to SIGNIN_INVITATION when no policy is passed in', () => {
        expect(getB2CLink()).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.SIGNIN_INVITATION}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
    });

    it('returns URL with the corresponding policy based on passed in policy', () => {
        expect(getB2CLink(POLICIES.ACCOUNT_SIGNUP)).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.ACCOUNT_SIGNUP}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(getB2CLink(POLICIES.SIGNIN_INVITATION)).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.SIGNIN_INVITATION}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(getB2CLink(POLICIES.PASSWORD_RESET)).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.PASSWORD_RESET}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(getB2CLink(POLICIES.FIND_EMAIL)).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.FIND_EMAIL}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(getB2CLink(POLICIES.RESEND_EMAIL)).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.RESEND_EMAIL}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login&id_token_hint=${mockReturnValue}&idtokenhint=${mockReturnValue}`);
    });

    describe('when the token is not defined in the server side query params', () => {

        beforeEach(() => {
            ServerSideQueryParamsService.getQueryParam.mockImplementation((id) => {
                if (id === QUERY_PARAMS.ID_TOKEN_HINT) {
                    return;
                }
                return mockReturnValue
            });

            const dom = new JSDOM();
            global.document = dom.window.document;
        });

        describe('when the token is present in the DOM', () => {

            let testToken = 'test_token';

            beforeEach(() => {
                let elem = global.document.createElement('p');
                elem.id = QUERY_PARAMS.ID_TOKEN_HINT;
                elem.innerText = testToken;
                global.document.body.appendChild(elem);
            });

            it('returns URL with the token obtained from the DOM element', () => {
                expect(getB2CLink(POLICIES.RESEND_EMAIL)).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.RESEND_EMAIL}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login&id_token_hint=${testToken}&idtokenhint=${testToken}`);
            });
        });

        describe('when the token is not present in the DOM', () => {

            beforeEach(() => {
                global.document.body.innerHTML = '';
            });

            it('returns URL without the token', () => {
                expect(getB2CLink(POLICIES.RESEND_EMAIL)).toEqual(`/${mockReturnValue}/oauth2/v2.0/authorize?p=${POLICIES.RESEND_EMAIL}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
            });
        })

    })

});