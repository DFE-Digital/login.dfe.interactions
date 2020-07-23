import { matchesPath, hasSearchParam, getB2CLink } from './urls';
import { POLICIES } from '../constants/policies';

import * as QueryParamsService from './../services/QueryParamsService';
jest.mock('./../services/QueryParamsService');

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
    let mockTenantId;
    beforeEach(() => {
        mockTenantId = 'tenant_id';
        delete window.location;
        window.location = {
            host: `${mockTenantId}.sth.com/whatever`,
        };

        //mock QueryParamsService getQueryParam to always resolve with return mocked value
        mockReturnValue = 'test_value';
        QueryParamsService.getQueryParam.mockResolvedValue(mockReturnValue);
    });

    it('returns URL with policy set by default to SIGNIN_INVITATION when no policy is passed in', async () => {
        expect(await getB2CLink()).toEqual(`https://${mockTenantId}.b2clogin.com/tenant_id.onmicrosoft.com/oauth2/v2.0/authorize?p=${POLICIES.SIGNIN_INVITATION}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
    });

    it('returns URL with the corresponding policy based on passed in policy', async () => {
        expect(await getB2CLink(POLICIES.ACCOUNT_SIGNUP)).toEqual(`https://${mockTenantId}.b2clogin.com/tenant_id.onmicrosoft.com/oauth2/v2.0/authorize?p=${POLICIES.ACCOUNT_SIGNUP}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(await getB2CLink(POLICIES.SIGNIN_INVITATION)).toEqual(`https://${mockTenantId}.b2clogin.com/tenant_id.onmicrosoft.com/oauth2/v2.0/authorize?p=${POLICIES.SIGNIN_INVITATION}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(await getB2CLink(POLICIES.PASSWORD_RESET)).toEqual(`https://${mockTenantId}.b2clogin.com/tenant_id.onmicrosoft.com/oauth2/v2.0/authorize?p=${POLICIES.PASSWORD_RESET}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(await getB2CLink(POLICIES.FIND_EMAIL)).toEqual(`https://${mockTenantId}.b2clogin.com/tenant_id.onmicrosoft.com/oauth2/v2.0/authorize?p=${POLICIES.FIND_EMAIL}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login`);
        expect(await getB2CLink(POLICIES.RESEND_EMAIL)).toEqual(`https://${mockTenantId}.b2clogin.com/tenant_id.onmicrosoft.com/oauth2/v2.0/authorize?p=${POLICIES.RESEND_EMAIL}&client_id=${mockReturnValue}&nonce=defaultNonce&redirect_uri=${mockReturnValue}&scope=openid&response_type=id_token&prompt=login&id_token_hint=${mockReturnValue}`);
    });

});