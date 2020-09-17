import React from 'react';

import "./TermsAndConditions.scss";

class TermsAndConditions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tsAndCsAccepted: false,
            errors: {
                tsAndCs: {
                    text: 'You must accept our Terms and Conditions',
                    showSummaryText: false,
                    id: 'tsAndCsCustom'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidTsAndCs = this.isValidTsAndCs.bind(this);

        //initialise visible errors in parent component
        if (this.props.initialiseParentErrors) {
            this.props.initialiseParentErrors(this.state.errors);
        }
    }

    handleChange(e) {
        const { name, checked } = e.target;

        this.setState({ [name]: checked }, () => {
            //validate and update value in any case
            this.isValidTsAndCs();
            this.props.onChange({
                tsAndCsAccepted: checked
            });
        });
    }

    isValidTsAndCs() {
        let isValid = true;

        //build new error state with empty value for text
        const newErrorState = { ...this.state.errors }
        newErrorState.tsAndCs.text = '';

        //now update value for the text if invalid
        if (!this.state.tsAndCsAccepted) {
            isValid = false;
            newErrorState.tsAndCs.text = 'You must accept our Terms and Conditions';
        }

        this.setState({ errors: newErrorState }, () => {
            //call parent to update its state
            this.props.updateParentErrors(this.state.errors);
        });

        return isValid;
    }

    render() {

        let { visibleErrors, showErrors, showHeader } = this.props;

        let tsAndCsErrorElement;
        if (showErrors && visibleErrors.tsAndCs.text.length > 0) {
            tsAndCsErrorElement =
                <span id="tsAndCsError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {visibleErrors.tsAndCs.text}
                </span>
        }

        let tsAndCsHeader;
        if (showHeader) {
            tsAndCsHeader = <h1 className='govuk-heading-m'>Terms and conditions</h1>;
        }

        return (

            <div>
                {tsAndCsHeader}
                <div className={`govuk-form-group ${showErrors && visibleErrors.tsAndCs.text.length > 0 ? "govuk-form-group--error" : ""}`}>
                    {tsAndCsErrorElement}
                    <label className="block-label" htmlFor="tsAndCsCustom">
                        <input id="tsAndCsCustom" name="tsAndCsAccepted" type="checkbox" value={true} aria-invalid="true"
                            checked={this.state.tsAndCsAccepted}
                            onChange={this.handleChange}
                            noValidate />
                        I accept the&nbsp;
                        <a href="https://nationalcareers.service.gov.uk/help/terms-and-conditions" id="tsAndCsLink" target="_blank" rel="noopener noreferrer" >
                            terms and conditions
                        </a>
                        &nbsp;and I am 13 or over
                    </label>
                </div>
            </div>
        )
    }
}

export default TermsAndConditions;