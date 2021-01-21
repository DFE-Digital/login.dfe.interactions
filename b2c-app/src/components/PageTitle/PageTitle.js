import React from 'react'

function PageTitle(props) {

    if(props.size === 'xl'){
        return (
            <h1 className="govuk-heading-xl govuk-!-margin-top-6 govuk-!-margin-bottom-9">{props.title}</h1>
        )
    }
    else{
        return (
            <h1 className="govuk-heading-l">{props.title}</h1>
        )
    }
    
}

export default PageTitle;