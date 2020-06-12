import React from 'react'

import components from '../../components';

function PageNavigation(props) {

    //build array of components with actual config
    const navItemComponents = props.children.map(
        navItem => {
            return <components.NavigationLink title={navItem.title} link={navItem.link} key={navItem.title + navItem.link} />
        }
    );

    return (
        <nav>
            <ul id="navigation" className="govuk-header__navigation " aria-label="Top Level Navigation">
                {navItemComponents}
            </ul>
        </nav>
    )
}

export default PageNavigation;