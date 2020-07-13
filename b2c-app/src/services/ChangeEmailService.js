import { QUERY_PARAMS } from '../constants/queryParams';
import QueryParamsService from '../services/QueryParamsService';
import { getB2CLink } from '../helpers/urls';
import { ACTIONS } from '../constants/actions';

class ChangeEmailService {

    getChangeEmailPayload() {
        return new Promise((resolve, reject) => {
            //get token from query params or indexedDB
            QueryParamsService.getQueryParam(QUERY_PARAMS.ID_TOKEN_HINT).then(
                (token) => {
                    if (token) {
                        getB2CLink(ACTIONS.CHANGE_EMAIL).then(
                            (redirect_url) => {
                                if (redirect_url) {
                                    resolve({
                                        id_token_hint: token,
                                        redirect_url: redirect_url
                                    });
                                } else {
                                    reject({ userMessage: 'Unable to get the details to resend the activation email.' });
                                }
                            }
                        );

                    } else {
                        reject({ userMessage: 'Unable to get the details to resend the activation email.' });
                    }
                }
            );
        });
    }

    callResendEmail() {
        return new Promise((resolve, reject) => {
            this.getChangeEmailPayload().then(
                (payload) => {
                    fetch(window.API_URLS.CHANGE_EMAIL, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json"
                        },
                    }).then(
                        async (response) => {
                            let parsedResponse;
                            try {
                                parsedResponse = await response.json();
                                if (response.ok) {
                                    resolve(parsedResponse);
                                } else {
                                    //reject if request failed, but still sending back response if parsed as it could contain error message from B2C
                                    reject(parsedResponse);
                                }
                            }
                            catch (e) {
                                //unable to parse response, reject with error
                                reject(e);
                            }
                        },
                        (error) => {
                            reject({ userMessage: 'The activation email could not be sent.' });
                        }
                    );
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
}

export default new ChangeEmailService();