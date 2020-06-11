import React from 'react';
import { getB2CLink } from '../../helpers/urls';

function ButtonLink(props) {

    return (
        <a href={getB2CLink(props.action)} role="button" draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
            {props.text}
        </a>
    )
}

export default ButtonLink;