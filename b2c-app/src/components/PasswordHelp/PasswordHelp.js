import React from 'react'

function PasswordHelp() {

    return (
        <div>
            <p className="govuk-body">Your password must:</p>
            <ul className="govuk-list govuk-list--bullet">
                <li>be between 8 and 16 characters</li>
                <li>include at least one uppercase letter and one lowercase letter</li>
                <li>include at least one number or one symbol</li>
            </ul>
        </div>
    )

}

export default PasswordHelp;