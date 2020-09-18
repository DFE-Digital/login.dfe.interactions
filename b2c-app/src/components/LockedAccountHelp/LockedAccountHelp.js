import React from 'react';
import components from '..';
import { POLICIES } from '../../constants/policies';

function LockedAccountHelp(props) {

    const lockedAccountLength = '1 hour';

    return (
        <div>
            <p className="govuk-body">You have entered invalid details too many times. Your account has been locked for {lockedAccountLength}.</p>
            <p className="govuk-body">You can:</p>
            <ul className="govuk-list govuk-list--bullet">
                <li>wait {lockedAccountLength} and try again</li>
            </ul>
            or
            <ul className="govuk-list govuk-list--bullet">
                <li>
                    <components.Link id="resetPasswordLink" policy={POLICIES.PASSWORD_RESET}>reset your password now</components.Link>
                </li>
            </ul>
        </div>
    )

}

export default LockedAccountHelp;