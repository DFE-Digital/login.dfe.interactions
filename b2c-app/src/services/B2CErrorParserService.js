import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';


export function parseB2CErrors(error) {

    const lockedAccountTextToMatch = 'ACCOUNT_LOCKED';
    const accountAlreadyActivatedTextToMatch = 'ACCOUNT_ACTIVATED';

    //array that contains all the B2C error transformations we will be doing in the app.
    //we will get an error and if it matches any of the error messages defined here we will
    //replace it with the output specified
    const B2CErrorTransformations = [
        {
            text: lockedAccountTextToMatch,
            output: <components.LockedAccountHelp />
        },
        {
            text: accountAlreadyActivatedTextToMatch,
            output:
                <div>
                    <components.Paragraph>
                        Account already activated.
                    </components.Paragraph>
                    <components.Link id="signInLink" policy={POLICIES.SIGNIN_INVITATION}>Return to sign in page</components.Link>
                </div>
        }
    ];

    let match = B2CErrorTransformations.find((transformation) => {
        return `${error}`.trim().replace(/(\s)+/g, ' ') === transformation.text;
    });

    if (match) {
        return match.output;
    }
    //if no matches, return standard error message with the value from B2C
    return <p>{error}</p>;
}