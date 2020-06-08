import React from 'react';

class PageLevelErrorContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            b2cErrors: []
        };
        this.showSummaryText = this.showSummaryText.bind(this);
        this.pageLevelErrorCallback = this.pageLevelErrorCallback.bind(this);
        this.hasErrorItems = this.hasErrorItems.bind(this);
    }

    pageLevelErrorCallback(mutationsList, observer) {
        //flag to see if we have to refresh page level errors
        let refreshErrorsRequired = false;

        //define function here temporarily to make it work
        //function to refresh the page level errors in our govuk container with the right format
        let refreshErrors = () => {

            //get all page level error elements
            let pageErrors = document.getElementsByClassName('error pageLevel');

            // find out how many of these errors are visible
            let numVisibleItems = Array.from(pageErrors).filter(function (item) {
                return item.style.display !== 'none';
            }).length;

            // add the visible errors if there are any
            if (numVisibleItems > 0) {
                let errors = Array.from(pageErrors).reduce(function (result, error) {
                    if (error.style.display !== 'none') {
                        result.push(error.innerText);
                    }
                    return result;
                }, []);

                //set them in the state
                this.setState({ b2cErrors: Array.from(errors) });
            }
        }

        //loop through mutated objects to run crazy logic and update the UI accordingly
        for (let mutation of mutationsList) {

            //Determine if we will need to refresh the page level errors after the loop
            if (!refreshErrorsRequired &&
                mutation.target.classList.contains('error') &&
                mutation.target.classList.contains('pageLevel')
            ) {
                refreshErrorsRequired = true;
            }
        }

        //refresh the page level errors if there was at least one included
        if (refreshErrorsRequired) {
            refreshErrors();
        }
    }

    componentDidMount() {
        const targetNode = document.getElementById('api');

        if (targetNode) {
            const obs = new MutationObserver(this.pageLevelErrorCallback);
            const observerConfig = { attributes: true, childList: true, subtree: true };
            obs.observe(targetNode, observerConfig);
        }
    }

    showSummaryText() {
        return this.props.errorItems.some(item => {
            return item.visible.showSummaryText;
        });
    };

    hasErrorItems() {
        const hasErrors = this.props.errorItems.some(errorItem => {
            return !!errorItem.visible.text;
        });
        return hasErrors;
    }

    render() {
        const errorItems = this.props.errorItems ?
            this.props.errorItems.map(error => {
                return error ?
                    (
                        <li key={error.id}>
                            <a href={`#${error.id}`}>{error.visible.text}</a>
                        </li>
                    ) :
                    null
            }) :
            null;

        const b2cErrorItems = this.state.b2cErrors ?
            this.state.b2cErrors.map(error => {
                return error ?
                    (
                        <li key={error}>
                            <a href="#pageLevelErrorContainer">{error}</a>
                        </li>
                    ) :
                    null
            }) :
            null;

        const errorSummary = this.props.summaryTextContent && this.showSummaryText() ?
            (
                <div id="errorSummaryText">
                    {this.props.summaryTextContent}
                </div>
            ) :
            null;

        const containerClassName = `pageLevelErrorContainer ${this.state.b2cErrors.length > 0 || this.hasErrorItems() ? "show" : "hide"}`;

        return (
            <div className={containerClassName}>
                <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1" data-module="govuk-error-summary">
                    <h2 className="govuk-error-summary__title" id="error-summary-title">
                        There is a problem
                    </h2>
                    {errorSummary}
                    <div className="govuk-error-summary__body">
                        <ul id="errorSummaryItems" className="govuk-list govuk-error-summary__list">
                            {errorItems}
                            {b2cErrorItems}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}

export default PageLevelErrorContainer;