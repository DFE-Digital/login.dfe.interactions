import React, { useState, useEffect } from 'react';
import { getB2CLink } from '../../helpers/urls';
import { LINK_TYPES } from '../../constants/linkTypes';

function Link(props) {

    const [link, setLink] = useState(null);

    useEffect(() => {
        async function getLink() {
            try {
                setLink(await getB2CLink(props.action));
            } catch (e) { }
        }
        getLink();
    });

    let output;

    if (props.type === LINK_TYPES.BUTTON) {
        output =
            <a href={link} role="button" draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
                {props.children}
            </a>
    }
    else {
        output =
            <a href={link} className="govuk-link">
                {props.children}
            </a>
    }

    return (
        output
    )
}

export default Link;