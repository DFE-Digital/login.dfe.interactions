import Dexie from 'dexie';

import { QUERY_PARAMS } from '../constants/queryParams';

class QueryParamsService {

    constructor() {

        this.db = new Dexie('B2C_query_params');

        //create stores for client id and redirect uri
        this.db.version(4).stores({
            [QUERY_PARAMS.CLIENT_ID]: '',
            [QUERY_PARAMS.REDIRECT_URI]: ''
        });

        this.queryParams = {}
    }

    //function that retrieves the query params we need to persist
    init() {
        Object.keys(QUERY_PARAMS).forEach((key) => {
            this.setQueryParam(QUERY_PARAMS[key]);
        });
    }

    setQueryParam(id) {
        let queryParams = (new URL(document.location)).searchParams;
        let value = queryParams.get(id);
        if (value) {
            this.queryParams[id] = value;
            this.storeParam(id, value);
        }
    }

    //function to store values in the DB, always reusing item in index 0, not storing more values
    storeParam(key, value) {
        this.db[key].put(value, 0);
    }

    //function to retrieve values from the DB, always getting index 0
    retrieveParam(key) {
        return this.db[key].get(0);
    }

    getQueryParam(id) {
        return new Promise((resolve, reject) => {
            if (!this.queryParams[id]) {
                return this.retrieveParam(id).then(
                    (value) => {
                        this.queryParams[id] = value;
                        resolve(this.queryParams[id]);
                    }
                );
            }
            resolve(this.queryParams[id]);
        });
    }

}

export default new QueryParamsService();