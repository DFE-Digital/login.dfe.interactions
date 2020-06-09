import React from 'react';
import components from '..';
import { onError } from '../../helpers/pageUpdatesHandler';

class PageContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onError = onError.bind(this);
    }

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = `${this.props.pageTitle} | National Careers Service`;
    }

    render() {

        const formContainerClass = this.props.additionalColumn ? 'govuk-grid-column-one-half' : 'govuk-grid-column-two-thirds';
        const formContainerHeaderSize = this.props.additionalColumn ? 'l' : 'xl';

        const formContent = this.props.formContent ?
            (
                <form id="customForm" onSubmit={this.props.submitHandler} noValidate>
                    {this.props.formContent}
                    <button className="govuk-button" id="preSubmit" type="submit">{this.props.submitButtonText}</button>
                </form>
            ) :
            null;

        const pageLevelContainer = this.props.errors ?
            (
                <components.PageLevelErrorContainer
                    errorItems={this.props.errors}
                    summaryTextContent={this.props.errorSummaryContent}
                    showB2CErrors={this.props.showB2CErrors}
                />
            ) :
            null;

        return (
            <div className="govuk-width-container">
                <components.Breadcrumbs />

                {pageLevelContainer}

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className={formContainerClass}>
                            <components.PageTitle size={formContainerHeaderSize} title={this.props.pageTitle} />
                            {this.props.aboveFormContent}
                            {formContent}
                            {this.props.belowFormContent}
                        </div>
                        {this.props.additionalColumn}
                    </div>
                </main>

            </div>
        )
    }
}

export default PageContainer;