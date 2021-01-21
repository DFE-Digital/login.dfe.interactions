import React from 'react'

function NavigationLink(props) {    
    return (
        <li className="govuk-header__navigation-item">
            <a className="govuk-header__link" href={props.link}>
            {props.title}
            </a>
        </li>
    )
}

export default NavigationLink;