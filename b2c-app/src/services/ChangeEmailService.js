import decode from 'jwt-decode';

import { QUERY_PARAMS } from '../constants/queryParams';
import { API_URLS } from '../constants/ApiUrls';
import QueryParamsService from '../services/QueryParamsService';


class ChangeEmailService {

    async getChangeEmailPayloadFromToken() {

        //get token from query params or indexedDB
        const token = await QueryParamsService.getQueryParam(QUERY_PARAMS.ID_TOKEN_HINT);
        //TODO handle scenario with invalid token
        const decodedToken = decode(token);

        if (decodedToken.newEmail && decodedToken.email) {
            return {
                NewEmail: decodedToken.newEmail,
                CurrentEmail: decodedToken.email,
                isResend: true
            }
        }
    }

    async callResendEmail() {
        let payload = await this.getChangeEmailPayloadFromToken();

        if (payload) {
            try {
                //TODO ask Steve wy the calls are different and decide what we have to do
                let response = await fetch(API_URLS.CHANGE_EMAIL, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    return await response.json();
                }
                else {
                    //reject if request failed, but still sending back response as it contains error message
                    return response.json().then(Promise.reject.bind(Promise));
                }
            }
            catch (error) {
                this.showPageLevelError('Unable to send the request.');
            }
        }
        else {
            this.showPageLevelError('Unable to get the details to resend the activation email.');
        }
    }

}

export default new ChangeEmailService();