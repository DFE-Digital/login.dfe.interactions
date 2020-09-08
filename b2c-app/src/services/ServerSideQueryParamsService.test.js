import { QUERY_PARAMS } from '../constants/queryParams';

describe('when window.SERVER_SIDE_QUERY_PARAMS is defined', () => {

    let policyName = 'test_policy';
    let ServerSideQueryParamsService;

    describe('when it has the right format', () => {

        beforeEach(() => {
            ServerSideQueryParamsService = require('./ServerSideQueryParamsService');
            global.window.SERVER_SIDE_QUERY_STRING = `{"policy": "${policyName}" }`;
        });

        it('returns the value of the requested query param', () => {
            expect(ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.POLICY)).toEqual(policyName);
        });
    });

    describe('when it does not have the right format', () => {

        beforeEach(() => {
            jest.resetModules();
            ServerSideQueryParamsService = require('./ServerSideQueryParamsService');
            global.window.SERVER_SIDE_QUERY_STRING = 1;
        });

        it('returns undefined for any requested query param', () => {
            expect(ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.POLICY)).toBeUndefined();
        });
    });

});

describe('when window.SERVER_SIDE_QUERY_PARAMS is not defined', () => {

    let ServerSideQueryParamsService;

    beforeEach(() => {
        jest.resetModules();
        ServerSideQueryParamsService = require('./ServerSideQueryParamsService');
        delete global.window.SERVER_SIDE_QUERY_STRING;
    });

    it('returns undefined for any requested query param', () => {
        expect(ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.POLICY)).toBeUndefined();
    });
});
