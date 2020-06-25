import React from 'react';
import components from '..';
import { ACTIONS } from '../../constants/actions';

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
                    <components.Link action={ACTIONS.RESET_PASSWORD}>reset your password now</components.Link>
                </li>
            </ul>
        </div>
    )

}

export default LockedAccountHelp;