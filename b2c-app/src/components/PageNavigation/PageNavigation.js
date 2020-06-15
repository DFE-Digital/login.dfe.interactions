import React from 'react';
import classNames from 'classnames';

import components from '../../components';

function PageNavigation(props) {

    const navigationClasses = classNames({
        'govuk-header__navigation': true,
        'govuk-header__navigation--open': props.expanded
    });

    //build array of components with actual config
    const navItemComponents = props.children.map(
        navItem => {
            return <components.NavigationLink title={navItem.title} link={navItem.link} key={navItem.title + navItem.link} />
        }
    );

    return (
        <nav>
            <ul id={props.navigationId} className={navigationClasses} aria-label="Top Level Navigation">
                {navItemComponents}
            </ul>
        </nav>
    )
}

export default PageNavigation;