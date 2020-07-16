import * as QueryParamsService from './QueryParamsService';
import { QUERY_PARAMS } from '../constants/queryParams';

describe('when calling the init method', () => {

    beforeEach(() => {
        delete window.location;
        global.window.location = {};
    });

    it('persists the values of only the configured query params found in the URL', async () => {

        let testValue = 'test_value';
        let anotherParam = 'param2';
        //set location url with query params
        global.window.location.search = `?${QUERY_PARAMS.CLIENT_ID}=${testValue}&${anotherParam}=value`;

        //call init method
        QueryParamsService.init();

        //get values and check they have been set for the one in QUERY_PARAMS
        expect(await QueryParamsService.getQueryParam(QUERY_PARAMS.CLIENT_ID)).toEqual(testValue);
        //and not for the other query param
        expect(await QueryParamsService.getQueryParam(anotherParam)).toBeUndefined();

    });

    it('does not reset the values that were not in the URL', async () => {
        //value was already set in previous test
        expect(await QueryParamsService.getQueryParam(QUERY_PARAMS.CLIENT_ID)).not.toBeUndefined();
        //call init function, should not remove any stored values
        QueryParamsService.init();
        //make sure the value stored hasn't been cleared
        expect(await QueryParamsService.getQueryParam(QUERY_PARAMS.CLIENT_ID)).not.toBeUndefined();
    });
});