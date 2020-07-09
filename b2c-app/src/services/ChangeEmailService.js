class ChangeEmailService {

    callResendEmail() {
        return new Promise((resolve, reject) => {

            fetch(window.API_URLS.CHANGE_EMAIL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "api_sec_uid": window.API_SEC.uid,
                    "api_sec_expiry": window.API_SEC.expiry,
                    "api_sec_signature": window.API_SEC.signature
                },
                credentials: 'include'
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
                    console.log(error);
                    reject({ userMessage: 'The activation email could not be sent.' });
                }
            );
        });
    }
}

export default new ChangeEmailService();