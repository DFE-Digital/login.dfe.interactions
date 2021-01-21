import React from 'react'

function HeaderTitle(props) {
    return (
        <h1 className="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0">
            <a href="https://nationalcareers.service.gov.uk/" className="govuk-header__link govuk-header__link--service-name">
              {props.title}
            </a>
        </h1>
    )
}

export default HeaderTitle;