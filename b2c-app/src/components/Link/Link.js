import React from 'react';
import { getB2CLink } from '../../helpers/urls';

function Link(props) {

    return (
        <a href={getB2CLink(props.action)} className="govuk-link">
            {props.children}
        </a>
    )
}

export default Link;