import { QUERY_PARAMS } from '../constants/queryParams';
import QueryParamsService from '../services/QueryParamsService';


class ChangeEmailService {

    getChangeEmailPayload() {
        return new Promise((resolve, reject) => {
            //get token from query params or indexedDB
            QueryParamsService.getQueryParam(QUERY_PARAMS.ID_TOKEN_HINT).then(
                (token) => {
                    if (token) {
                        resolve({
                            id_token_hint: token,
                            //TODO use helper to build URL
                            redirect_url: 'https://devauthncs.b2clogin.com/devauthncs.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_Account_Signup&client_id=488c321f-10e4-48f2-b9c2-261e2add2f8d&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fjwt.ms&scope=openid&response_type=id_token&prompt=login'
                        });
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