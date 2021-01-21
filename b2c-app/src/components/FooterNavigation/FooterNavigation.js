import React from 'react'

import components from '../../components';

function FooterNavigation(props) {

    //build array of components with actual config
    const footerLinkComponents = props.items.map( 
        item => {
            return <components.FooterLink title={item.title} link={item.link} key={item.title+item.link}/> 
        }
    );
    
    return (
        <ul className="govuk-footer__inline-list">
            {footerLinkComponents}
        </ul>
    )
}

export default FooterNavigation;