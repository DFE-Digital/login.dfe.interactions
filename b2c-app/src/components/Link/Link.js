import React from 'react';
import { getB2CLink } from '../../helpers/urls';
import { LINK_TYPES } from '../../constants/linkTypes';

function Link(props) {

    let output;

    if (props.type === LINK_TYPES.BUTTON) {
        output =
            <a href={props.url || getB2CLink(props.policy)} id={props.id} role="button" onClick={props.onClick ? props.onClick : null} draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
                {props.children}
            </a>
    }
    else {
        output =
            <a href={props.url || getB2CLink(props.policy)} id={props.id} onClick={props.onClick ? props.onClick : null} className="govuk-link">
                {props.children}
            </a>
    }

    return (
        output
    )
}

export default Link;