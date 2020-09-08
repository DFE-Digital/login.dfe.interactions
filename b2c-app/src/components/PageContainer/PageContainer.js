import React from 'react';
import components from '..';
import { onError } from '../../helpers/pageUpdatesHandler';

class PageContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onError = onError.bind(this);
    }

    componentDidMount() {
        const title = (this.props.pageConfig && this.props.pageConfig.title) || '';
        document.title = `${title} | National Careers Service`;
    }

    render() {

        if (this.props.pageConfig) {

            const config = this.props.pageConfig;

            //setup form
            let formContent;
            if (config.formContent && config.submitHandler && config.submitButtonText) {
                formContent =
                    <form id="customForm" onSubmit={config.submitHandler} noValidate>
                        {config.formContent}
                        <button className="govuk-button" id="preSubmit" type="submit">{config.submitButtonText}</button>
                    </form>
            }

            //setup error container
            let pageLevelErrorContainer;
            if (config.errors) {
                pageLevelErrorContainer =
                    <components.PageLevelErrorContainer
                        errorItems={config.errors}
                        summaryTextContent={config.errorSummaryContent}
                        showB2CErrors={config.showB2CErrors}
                    />
            }

            //setup spinner
            let showSpinner;
            let spinnerText;
            showSpinner = this.props.pageConfig.showSpinner;
            spinnerText = this.props.pageConfig.spinnerText;

            const formContainerClass = 'govuk-grid-column-two-thirds';
            const formContainerHeaderSize = 'xl';

            //build page content
            let pageContent =
                <div className={formContainerClass} key={config.header}>
                    {pageLevelErrorContainer}
                    <components.PageTitle size={formContainerHeaderSize} title={config.header} />
                    {config.aboveFormContent}
                    {formContent}
                    {config.belowFormContent}
                </div>

            return (
                <div>
                    <components.Spinner showSpinner={showSpinner} text={spinnerText} />
                    <div className="govuk-width-container">
                        <components.Breadcrumbs />
                        <main className="govuk-main-wrapper" >
                            <div className="govuk-grid-row">
                                {pageContent}
                            </div>
                        </main>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default PageContainer;