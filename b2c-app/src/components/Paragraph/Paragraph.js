import React from 'react';

function Paragraph(props) {

    return (
        <p id={props.id} className="govuk-body">{props.children}</p>
    )
}

export default Paragraph;