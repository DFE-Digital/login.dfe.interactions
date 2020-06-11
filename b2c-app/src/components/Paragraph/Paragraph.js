import React from 'react';

function Paragraph(props) {

    return (
        <p className="govuk-body">{props.children}</p>
    )
}

export default Paragraph;