import decode from 'jwt-decode';

import { QUERY_PARAMS } from '../constants/queryParams';
import QueryParamsService from '../services/QueryParamsService';


class ChangeEmailService {

    getChangeEmailPayloadFromToken() {

        return new Promise((resolve, reject) => {
            //get token from query params or indexedDB
            QueryParamsService.getQueryParam(QUERY_PARAMS.ID_TOKEN_HINT).then(
                (token) => {
                    if (token) {
                        try {
                            const decodedToken = decode(token);

                            if (decodedToken.newEmail && decodedToken.email) {
                                resolve({
                                    NewEmail: decodedToken.newEmail,
                                    CurrentEmail: decodedToken.email,
                                    isResend: true
                                });
                            } else {
                                reject({ userMessage: 'Unable to get the user details from the current token.' });
                            }
                        }
                        catch (e) {
                            reject({ userMessage: 'Unable to get the user details from the current token.' });
                        }

                    } else {
                        reject({ userMessage: 'Unable to get the details to resend the activation email.' });
                    }
                }
            );
        });
    }

    callResendEmail() {
        return new Promise((resolve, reject) => {
            this.getChangeEmailPayloadFromToken().then(
                (payload) => {
                    fetch(window.API_URLS.CHANGE_EMAIL, {
                        method: 'POST',
                        body: JSON.stringify(payload)
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