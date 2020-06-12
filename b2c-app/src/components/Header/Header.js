import React from 'react'

import components from '../../components';

import headerData from '../../data/headerData.json';

function Header() {
    return (
        <header className="govuk-header " role="banner" data-module="govuk-header">
            <div className="govuk-header__container govuk-width-container">
                <components.HeaderTitle title={headerData.title} />
                TODO see how we make this button work, get JS from govuk-frontend or add that code here to add/remove classes
                <button type="button" class="govuk-header__menu-button govuk-js-header-toggle" aria-controls="navigation" aria-label="Show or hide Top Level Navigation">Menu</button>
                <components.PageNavigation>
                    {headerData.navigationItems}
                </components.PageNavigation>
            </div>
        </header>
    )
}

export default Header;