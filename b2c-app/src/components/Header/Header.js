import React from 'react';

import components from '../../components';

import headerData from '../../data/headerData.json';


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuExpanded: false
        }
        this.menuToggle = this.menuToggle.bind(this);
    }

    menuToggle() {
        this.setState({ menuExpanded: !this.state.menuExpanded });
    }

    render() {

        const navigationId = 'navigation';

        return (
            <header className="govuk-header " role="banner" data-module="govuk-header">
                <div className="govuk-header__container govuk-width-container">
                    <components.HeaderTitle title={headerData.title} />
                    <components.MenuToggle
                        toggleFunction={this.menuToggle}
                        expanded={this.state.menuExpanded}
                        ariaControls={navigationId}
                        ariaLabel="Show or hide Top Level Navigation" >
                        Menu
                    </components.MenuToggle>
                    <components.PageNavigation
                        navigationId={navigationId}
                        expanded={this.state.menuExpanded} >
                        {headerData.navigationItems}
                    </components.PageNavigation>
                </div>
            </header>
        )
    }
}

export default Header;