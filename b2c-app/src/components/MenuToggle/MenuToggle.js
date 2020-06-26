import React from 'react';
import classNames from 'classnames';

function MenuToggle(props) {

    const toggleClasses = classNames({
        "govuk-header__menu-button": true,
        "govuk-js-header-toggle": true,
        "govuk-header__menu-button--open": props.expanded
    });

    return (
        <button
            type="button"
            onClick={props.toggleFunction}
            className={toggleClasses}
            aria-controls={props.ariaControls}
            aria-label={props.ariaLabel}>
            {props.children}
        </button>
    )
}

export default MenuToggle;