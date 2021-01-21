import React from 'react';

import components from '../../components';

function PasswordHelpContainer() {

    return (

        <details className="govuk-details">
            <summary className="govuk-details__summary">
                <span className="govuk-details__summary-text">
                    Help choosing a valid password
                </span>
            </summary>
            <div className="govuk-details__text">
                <components.PasswordHelp />
            </div>
        </details>

    )

}

export default PasswordHelpContainer;