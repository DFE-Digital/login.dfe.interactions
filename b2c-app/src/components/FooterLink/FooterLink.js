import React from 'react'

function FooterLink(props) {    
    return (
        <li className="govuk-footer__inline-list-item">
            <a className="govuk-footer__link" href={props.link}>
            {props.title}
            </a>
        </li>
    )
}

export default FooterLink;